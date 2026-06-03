const express = require("express");
const router = express.Router();
const pool = require("../db");

// Ensure cancelled_by column exists (safe to run on startup)
(async () => {
  try {
    await pool.query("ALTER TABLE appointments ADD COLUMN IF NOT EXISTS cancelled_by TEXT");
  } catch (err) {
    console.error('Failed to ensure cancelled_by column exists:', err.message);
  }
})();

// Customer - Book an appointment
router.post("/", async (req, res) => {
  // Debug: log session and user to ensure passport session is restored
  try {
    console.log('POST /api/appointments - req.user:', req.user);
    console.log('POST /api/appointments - req.sessionID:', req.sessionID);
  } catch (e) { console.error('Error logging session/user', e && e.message); }

  const { user_id: bodyUserId, service_id, appointment_date, appointment_time, phone } = req.body;
  // Prefer authenticated user from session when available
  const userId = (req.user && (req.user.id || req.user.user_id || req.user.google_id)) ? (req.user.id || req.user.user_id) : bodyUserId;

  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const result = await pool.query(
      "INSERT INTO appointments (user_id, service_id, appointment_date, appointment_time, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [userId, service_id, appointment_date, appointment_time, phone]
    );
    // Notify admins of new booking
    try {
      const notificationsRouter = require('./notifications');
      notificationsRouter.createNotification({ type: 'appointment', message: `New booking (ID ${result.rows[0].id}) by user ${user_id}`, userId: null });
    } catch (e) { console.error('Notify admins error', e.message); }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Customer - View their own appointments
router.get("/my/:user_id", async (req, res) => {
  try {
    console.log(`GET /api/appointments/my/${req.params.user_id} - req.user:`, req.user ? (req.user.id || req.user.email) : null);
    console.log(`GET /api/appointments/my/${req.params.user_id} - sessionID:`, req.sessionID);
  } catch (e) { /* ignore logging errors */ }
  try {
    const result = await pool.query(
      "SELECT a.*, s.name as service_name, s.price, s.duration as service_duration FROM appointments a JOIN services s ON a.service_id = s.id WHERE a.user_id = $1",
      [req.params.user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(`/api/appointments/my/${req.params.user_id} error`, err);
    res.status(500).json({ error: err.message });
  }
});

// Admin - View all appointments (exclude appointments cancelled by the customer)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT a.*, s.name as service_name, s.duration as service_duration, s.price as service_price, u.name as customer_name, u.email FROM appointments a JOIN services s ON a.service_id = s.id JOIN users u ON a.user_id = u.id WHERE COALESCE(a.cancelled_by, '') <> 'user' ORDER BY a.appointment_date DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/appointments error', err);
    res.status(500).json({ error: err.message });
  }
});

// Admin/User - Update appointment (approve/cancel). If a customer cancels, client should send { cancelled_by: 'user' }
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

    // If approved, notify the user
    try {
      if (updated && String(updated.status).toLowerCase() === 'approved') {
        const notificationsRouter = require('./notifications');
        notificationsRouter.createNotification({ type: 'appointment_update', message: `Your booking (ID ${updated.id}) has been approved.`, userId: String(updated.user_id) });
      }
    } catch (e) { console.error('Notify user error', e.message); }

    res.json(updated);
  } catch (err) {
    console.error(`PUT /api/appointments/${req.params.id} error`, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;