const express = require("express");
const router = express.Router();
const pool = require("../db");

// Get all services
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM services");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add service (admin only)
router.post("/", async (req, res) => {
  const { name, price, description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO services (name, price, description) VALUES ($1, $2, $3) RETURNING *",
      [name, price, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit service (admin only)
router.put("/:id", async (req, res) => {
  const { name, price, description } = req.body;
  try {
    const result = await pool.query(
      "UPDATE services SET name=$1, price=$2, description=$3 WHERE id=$4 RETURNING *",
      [name, price, description, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete service (admin only)
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM services WHERE id=$1", [req.params.id]);
    res.json({ message: "Service deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;