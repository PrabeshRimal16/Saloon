const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require('multer');
const path = require('path');

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);
  }
});

const upload = multer({ storage });

// Get all services
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM services ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/services error', err);
    res.status(500).json({ error: err.message });
  }
});

// Add service (admin only)
router.post("/", upload.single('image'), async (req, res) => {
  const { name, price, description, category, duration } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const result = await pool.query(
      "INSERT INTO services (name, description, image_url, category, duration, price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, description, imageUrl, category, duration, price]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('POST /api/services error', err);
    res.status(500).json({ error: err.message });
  }
});

// Edit service (admin only)
router.put("/:id", upload.single('image'), async (req, res) => {
  const { name, price, description, category, duration } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    // Build dynamic query depending on whether image supplied
    const fields = [name, description, category, duration, price];
    if (imageUrl) {
      const result = await pool.query(
        "UPDATE services SET name=$1, description=$2, image_url=$3, category=$4, duration=$5, price=$6 WHERE id=$7 RETURNING *",
        [name, description, imageUrl, category, duration, price, req.params.id]
      );
      return res.json(result.rows[0]);
    } else {
      const result = await pool.query(
        "UPDATE services SET name=$1, description=$2, category=$3, duration=$4, price=$5 WHERE id=$6 RETURNING *",
        [name, description, category, duration, price, req.params.id]
      );
      return res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(`PUT /api/services/${req.params.id} error`, err);
    res.status(500).json({ error: err.message });
  }
});

// Delete service (admin only)
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM services WHERE id=$1", [req.params.id]);
    res.json({ message: "Service deleted" });
  } catch (err) {
    console.error(`DELETE /api/services/${req.params.id} error`, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;