const express = require("express");
const router = express.Router();
const pool = require("../db");

// Get all offers
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM offers");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin - Add offer
router.post("/", async (req, res) => {
  const { title, description, discount_percent, valid_until, image_url } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO offers (title, description, discount_percent, valid_until, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, description, discount_percent, valid_until, image_url || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin - Edit offer
router.put("/:id", async (req, res) => {
  const { title, description, discount_percent, valid_until, image_url } = req.body;
  try {
    const result = await pool.query(
      "UPDATE offers SET title=$1, description=$2, discount_percent=$3, valid_until=$4, image_url=$5 WHERE id=$6 RETURNING *",
      [title, description, discount_percent, valid_until, image_url || null, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin - Delete offer
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM offers WHERE id=$1", [req.params.id]);
    res.json({ message: "Offer deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;