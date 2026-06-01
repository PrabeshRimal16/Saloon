const express = require("express");
const router = express.Router();
const pool = require("../db");

// Customer - Book an appointment
router.post("/", async (req, res) => {
  const { user_id, service_id, appointment_date, phone } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO appointments (user_id, service_id, appointment_date, phone) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, service_id, appointment_date, phone]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Customer - View their own appointments
router.get("/my/:user_id", async (req, res) => {
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

// Admin - View all appointments
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT a.*, s.name as service_name, s.duration as service_duration, s.price as service_price, u.name as customer_name, u.email FROM appointments a JOIN services s ON a.service_id = s.id JOIN users u ON a.user_id = u.id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/appointments error', err);
    res.status(500).json({ error: err.message });
  }
});

// Admin - Approve/Cancel appointment
router.put("/:id", async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query(
      "UPDATE appointments SET status=$1 WHERE id=$2 RETURNING *",
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`PUT /api/appointments/${req.params.id} error`, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;