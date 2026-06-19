const express = require("express");
const router = express.Router();
const pool = require("../db");

// ─── Database migrations (safe to run on every startup) ───────────────────────
(async () => {
  try {
    // Make user_id optional so guest bookings don't need an account
    await pool.query("ALTER TABLE appointments ALTER COLUMN user_id DROP NOT NULL");
  } catch (err) {
    // Postgres throws if already nullable — ignore that specific error
    if (!err.message.includes('already')) {
      console.error('Migration: ALTER COLUMN user_id DROP NOT NULL —', err.message);
    }
  }

  const guestCols = [
    "ALTER TABLE appointments ADD COLUMN IF NOT EXISTS cancelled_by  TEXT",
    "ALTER TABLE appointments ADD COLUMN IF NOT EXISTS guest_name    TEXT",
    "ALTER TABLE appointments ADD COLUMN IF NOT EXISTS guest_email   TEXT",
    "ALTER TABLE appointments ADD COLUMN IF NOT EXISTS guest_phone   TEXT",
  ];

  for (const sql of guestCols) {
    try {
      await pool.query(sql);
    } catch (err) {
      console.error('Migration column error:', err.message);
    }
  }
})();

// ─── POST / — Guest booking (no login required) ───────────────────────────────
router.post("/", async (req, res) => {
  const {
    name, email, phone,          // guest fields
    service_id,
    appointment_date,
    appointment_time,
  } = req.body;

  if (!service_id || !appointment_date || !appointment_time) {
    return res.status(400).json({ error: "service_id, appointment_date, and appointment_time are required." });
  }

  if (!name || !email) {
    return res.status(400).json({ error: "Guest name and email are required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO appointments
         (user_id, service_id, appointment_date, appointment_time,
          guest_name, guest_email, guest_phone)
       VALUES (NULL, $1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [service_id, appointment_date, appointment_time, name, email, phone || null]
    );

    const booked = result.rows[0];

    // Notify admins of new guest booking
    try {
      const notificationsRouter = require('./notifications');
      notificationsRouter.createNotification({
        type: 'appointment',
        message: `New guest booking (ID ${booked.id}) by ${name} <${email}>`,
        userId: null,
      });
    } catch (e) {
      console.error('Notify admins error:', e.message);
    }

    res.json(booked);
  } catch (err) {
    console.error('POST /api/appointments error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /my/:user_id — Logged-in user's own appointments (kept for compat.) ──
router.get("/my/:user_id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, s.name AS service_name, s.price, s.duration AS service_duration
       FROM appointments a
       JOIN services s ON a.service_id = s.id
       WHERE a.user_id = $1`,
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
      `SELECT a.*, s.name AS service_name, s.price, s.duration AS service_duration
       FROM appointments a
       JOIN services s ON a.service_id = s.id
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

// ─── GET / — Admin: all appointments (guest + registered users) ───────────────
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         a.*,
         s.name          AS service_name,
         s.duration      AS service_duration,
         s.price         AS service_price,
         COALESCE(u.name,  a.guest_name)  AS customer_name,
         COALESCE(u.email, a.guest_email) AS email
       FROM appointments a
       JOIN  services s ON a.service_id = s.id
       LEFT JOIN users u ON a.user_id   = u.id
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

    // Notify the user if their booking was approved (only for registered users)
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