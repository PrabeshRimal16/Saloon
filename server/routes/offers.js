const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});


const upload = multer({ storage });

// Simple in-memory cache for offers
const offersCache = { ts: 0, data: null };
const OFFERS_TTL = 30 * 1000; // 30 seconds

// Get all offers
router.get("/", async (req, res) => {
  try {
    const now = Date.now();
    if (offersCache.data && (now - offersCache.ts) < OFFERS_TTL) {
      return res.json(offersCache.data);
    }
    const result = await pool.query("SELECT * FROM offers");
    offersCache.ts = now;
    offersCache.data = result.rows;
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin - Add offer
router.post("/", upload.single('image'), async (req, res) => {
  const { title, description, discount_percent, valid_until } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const result = await pool.query(
      "INSERT INTO offers (title, description, discount_percent, valid_until, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, description, discount_percent, valid_until, imageUrl]
    );
    // Notify users about new offer
    try {
      const notificationsRouter = require('./notifications');
      notificationsRouter.createNotification({ type: 'offer', message: `New offer: ${title}`, userId: null });
    } catch (e) { console.error('Notify users error', e.message); }
    // invalidate cache
    try { offersCache.ts = 0; offersCache.data = null; } catch (e) {}
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin - Edit offer
router.put("/:id", upload.single('image'), async (req, res) => {
  const { title, description, discount_percent, valid_until } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    if (imageUrl) {
      const result = await pool.query(
        "UPDATE offers SET title=$1, description=$2, discount_percent=$3, valid_until=$4, image_url=$5 WHERE id=$6 RETURNING *",
        [title, description, discount_percent, valid_until, imageUrl, req.params.id]
      );
      try { offersCache.ts = 0; offersCache.data = null; } catch (e) {}
      res.json(result.rows[0]);
    } else {
      const result = await pool.query(
        "UPDATE offers SET title=$1, description=$2, discount_percent=$3, valid_until=$4 WHERE id=$5 RETURNING *",
        [title, description, discount_percent, valid_until, req.params.id]
      );
      try { offersCache.ts = 0; offersCache.data = null; } catch (e) {}
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin - Delete offer
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM offers WHERE id=$1", [req.params.id]);
    try { offersCache.ts = 0; offersCache.data = null; } catch (e) {}
    res.json({ message: "Offer deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;