const express = require("express");
const router = express.Router();
const pool = require("../db");

// Get all users (for admin)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, avatar_url, google_id, phone, created_at FROM users ORDER BY id DESC`
    );
    console.log(`[users] GET /api/users -> ${result.rows.length} rows`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      console.log(`[users] DELETE ${id} -> not found`);
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(`[users] DELETE ${id} -> deleted`);
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Restrict user (set role to 'restricted')
router.post('/:id/restrict', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("UPDATE users SET role = 'restricted' WHERE id = $1 RETURNING id, name, email, role", [id]);
    if (result.rows.length === 0) {
      console.log(`[users] POST ${id}/restrict -> not found`);
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(`[users] POST ${id}/restrict -> ok`);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Unrestrict user (set role to 'customer')
router.post('/:id/unrestrict', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("UPDATE users SET role = 'customer' WHERE id = $1 RETURNING id, name, email, role", [id]);
    if (result.rows.length === 0) {
      console.log(`[users] POST ${id}/unrestrict -> not found`);
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(`[users] POST ${id}/unrestrict -> ok`);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
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