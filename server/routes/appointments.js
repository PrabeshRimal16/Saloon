const express = require("express");
const router = express.Router();
const pool = require("../db");

// ─── Database migrations (safe to run on every startup) ───────────────────────
(async () => {
  // 1. Make user_id optional for guest bookings
  try {
    await pool.query("ALTER TABLE appointments ALTER COLUMN user_id DROP NOT NULL");
  } catch (err) {
    if (!err.message.includes('already')) {
      console.error('Migration: ALTER COLUMN user_id DROP NOT NULL —', err.message);
    }
  }

  // 2. Guest + status columns
  const guestCols = [
    "ALTER TABLE appointments ADD COLUMN IF NOT EXISTS cancelled_by  TEXT",
    "ALTER TABLE appointments ADD COLUMN IF NOT EXISTS guest_name    TEXT",
    "ALTER TABLE appointments ADD COLUMN IF NOT EXISTS guest_email   TEXT",
    "ALTER TABLE appointments ADD COLUMN IF NOT EXISTS guest_phone   TEXT",
    "ALTER TABLE appointments ADD COLUMN IF NOT EXISTS total_price   NUMERIC(10,2)",
  ];
  for (const sql of guestCols) {
    try { await pool.query(sql); } catch (err) {
      console.error('Migration column error:', err.message);
    }
  }

  // 3. Junction table for many-to-many appointment ↔ services
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointment_services (
        id             SERIAL PRIMARY KEY,
        appointment_id INTEGER NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
        service_id     INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
        UNIQUE(appointment_id, service_id)
      )
    `);
  } catch (err) {
    console.error('Migration: create appointment_services —', err.message);
  }
})();

// ─── Helper: services JSON aggregation subquery ───────────────────────────────
const SERVICES_AGG = `(
  SELECT COALESCE(json_agg(json_build_object(
    'id',       s.id,
    'name',     s.name,
    'price',    s.price,
    'duration', s.duration
  ) ORDER BY s.name), '[]'::json)
  FROM appointment_services aps
  JOIN services s ON aps.service_id = s.id
  WHERE aps.appointment_id = a.id
) AS services`;

// ─── POST / — Book appointment (guest or logged-in, single or multi-service) ──
router.post("/", async (req, res) => {
  const {
    name, email, phone,
    service_id,          // legacy single-id (still accepted)
    service_ids,         // new: array of ids
    appointment_date,
    appointment_time,
    user_id,             // optional: logged-in user
  } = req.body;

  // Normalise to an array
  let ids = [];
  if (Array.isArray(service_ids) && service_ids.length) {
    ids = service_ids.map(Number).filter(Boolean);
  } else if (service_id) {
    ids = [Number(service_id)];
  }

  if (!ids.length)          return res.status(400).json({ error: "At least one service_id is required." });
  if (!appointment_date)    return res.status(400).json({ error: "appointment_date is required." });
  if (!appointment_time)    return res.status(400).json({ error: "appointment_time is required." });

  // Guest bookings require name + email; logged-in users do not
  const effectiveUserId = user_id || null;
  if (!effectiveUserId && (!name || !email)) {
    return res.status(400).json({ error: "Guest name and email are required." });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Fetch prices for the selected services
    const svcResult = await client.query(
      `SELECT id, price FROM services WHERE id = ANY($1::int[])`,
      [ids]
    );
    if (!svcResult.rows.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: "No valid services found for the provided IDs." });
    }
    const totalPrice = svcResult.rows.reduce((sum, s) => sum + Number(s.price || 0), 0);

    // Insert the appointment (service_id = first id for backward compat)
    const apptResult = await client.query(
      `INSERT INTO appointments
         (user_id, service_id, appointment_date, appointment_time,
          guest_name, guest_email, guest_phone, total_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        effectiveUserId,
        ids[0],
        appointment_date,
        appointment_time,
        name  || null,
        email || null,
        phone || null,
        totalPrice,
      ]
    );
    const booked = apptResult.rows[0];

    // Insert into junction table
    for (const sid of ids) {
      await client.query(
        `INSERT INTO appointment_services (appointment_id, service_id) VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [booked.id, sid]
      );
    }

    await client.query('COMMIT');

    // Fetch the full enriched row (with services array)
    const enriched = await pool.query(
      `SELECT a.*, ${SERVICES_AGG},
              s.name AS service_name, s.price, s.duration AS service_duration
       FROM appointments a
       LEFT JOIN services s ON a.service_id = s.id
       WHERE a.id = $1`,
      [booked.id]
    );
    const finalRow = enriched.rows[0];

    // Notify admins
    try {
      const notificationsRouter = require('./notifications');
      const serviceNames = (finalRow.services || []).map(s => s.name).join(', ');
      notificationsRouter.createNotification({
        type: 'appointment',
        message: `New booking (ID ${booked.id}) by ${name || 'guest'} — ${serviceNames}`,
        userId: null,
      });
    } catch (e) {
      console.error('Notify admins error:', e.message);
    }

    res.json(finalRow);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('POST /api/appointments error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// ─── GET /my/:user_id — Logged-in user's own appointments ─────────────────────
router.get("/my/:user_id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*,
              ${SERVICES_AGG},
              s.name AS service_name, s.price, s.duration AS service_duration
       FROM appointments a
       LEFT JOIN services s ON a.service_id = s.id
       WHERE a.user_id = $1
       ORDER BY a.appointment_date DESC`,
      [req.params.user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(`GET /api/appointments/my/${req.params.user_id} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /by-email/:email — Guest lookup by email ─────────────────────────────
router.get("/by-email/:email", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*,
              ${SERVICES_AGG},
              s.name AS service_name, s.price, s.duration AS service_duration
       FROM appointments a
       LEFT JOIN services s ON a.service_id = s.id
       WHERE LOWER(a.guest_email) = LOWER($1)
       ORDER BY a.appointment_date DESC`,
      [req.params.email]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(`GET /api/appointments/by-email error:`, err);
    res.status(500).json({ error: err.message });
  }
});

// ─── GET / — Admin: all appointments ──────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         a.*,
         ${SERVICES_AGG},
         s.name          AS service_name,
         s.duration      AS service_duration,
         s.price         AS service_price,
         COALESCE(u.name,  a.guest_name)  AS customer_name,
         COALESCE(u.email, a.guest_email) AS email
       FROM appointments a
       LEFT JOIN services s ON a.service_id = s.id
       LEFT JOIN users    u ON a.user_id    = u.id
       WHERE COALESCE(a.cancelled_by, '') <> 'user'
       ORDER BY a.appointment_date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/appointments error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── PUT /:id — Update appointment (approve / cancel) ────────────────────────
router.put("/:id", async (req, res) => {
  const { status, cancelled_by } = req.body;
  try {
    let result;
    if (typeof cancelled_by !== 'undefined') {
      result = await pool.query(
        "UPDATE appointments SET status=$1, cancelled_by=$2 WHERE id=$3 RETURNING *",
        [status, cancelled_by, req.params.id]
      );
    } else {
      result = await pool.query(
        "UPDATE appointments SET status=$1 WHERE id=$2 RETURNING *",
        [status, req.params.id]
      );
    }

    const updated = result.rows[0];

    // Notify the user if approved (registered users only)
    try {
      if (updated && String(updated.status).toLowerCase() === 'approved' && updated.user_id) {
        const notificationsRouter = require('./notifications');
        notificationsRouter.createNotification({
          type: 'appointment_update',
          message: `Your booking (ID ${updated.id}) has been approved.`,
          userId: String(updated.user_id),
        });
      }
    } catch (e) {
      console.error('Notify user error:', e.message);
    }

    res.json(updated);
  } catch (err) {
    console.error(`PUT /api/appointments/${req.params.id} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;