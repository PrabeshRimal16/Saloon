const express = require("express");
const router = express.Router();
const pool = require("../db");

// Create user
router.post("/", async (req, res) => {
  const { name, email, role, phone } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (name, email, role, phone) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, role || "customer", phone]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//register
const bcrypt = require("bcrypt");

// Register
router.post("/register", async (req, res) => {
  const { name, email, google_id, avatar_url, password, phone } = req.body;
  try {
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, google_id, avatar_url, password, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, email, google_id, avatar_url, hashedPassword, phone]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Complete profile for new Google users
router.post("/complete-profile", async (req, res) => {
  const { name, email, google_id, avatar_url, password, phone } = req.body;
  try {
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, google_id, avatar_url, password, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, email, google_id, avatar_url, hashedPassword, phone]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Establish passport session for the logged-in user
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(user);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;