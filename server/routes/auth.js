const express = require("express");
const router = express.Router();
const passport = require("../passport");
const pool = require("../db");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// Start Google Login
router.get("/google", (req, res, next) => {
  const { action, name, password, phone } = req.query;
  if (action === "register") {
    req.session.registerData = { name, password, phone };
  }
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

// Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${CLIENT_URL}/login` }),
  async (req, res) => {
    // If registration data was saved in session, create the user now
    if (req.session && req.session.registerData) {
      const { name, password, phone } = req.session.registerData;
      const { google_id, email, avatar_url } = req.user || {};

      try {
        const bcrypt = require("bcrypt");
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
          "INSERT INTO users (name, email, google_id, avatar_url, password, phone) VALUES ($1, $2, $3, $4, $5, $6)",
          [name, email, google_id, avatar_url, hashedPassword, phone]
        );
        req.session.registerData = null;
        return res.redirect(`${CLIENT_URL}/login`);
      } catch (err) {
        req.session.registerData = null;
        return res.redirect(`${CLIENT_URL}/register?error=Email%20already%20exists`);
      }
    }

    // If user was returned as a transient Google profile (isNewUser), redirect to complete-profile
    if (req.user && req.user.isNewUser) {
      const { google_id, email, avatar_url, name } = req.user;
      const params = new URLSearchParams({
        google_id: google_id || "",
        email: email || "",
        avatar_url: avatar_url || "",
        name: name || "",
      }).toString();

      return res.redirect(`${CLIENT_URL}/complete-profile?${params}`);
    }

    const redirectPath = req.user?.role === "admin" ? "/admin" : "/customer";
    res.redirect(`${CLIENT_URL}${redirectPath}`);
  }
);

// Get current logged in user
router.get("/me", (req, res) => {
  if (req.user) {
    res.json({ ...req.user, role: req.user.role || "customer" });
  } else {
    res.json(null);
  }
});

// Logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect(`${CLIENT_URL}/login`);
  });
});

module.exports = router;