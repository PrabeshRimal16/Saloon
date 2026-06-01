const express = require("express");
const router = express.Router();
const passport = require("../passport");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// Start Google Login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${CLIENT_URL}/login` }),
  (req, res) => {
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