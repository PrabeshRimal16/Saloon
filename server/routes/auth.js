const express = require("express");
const router = express.Router();
const passport = require("../passport");

// Start Google Login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:3000/login" }),
  (req, res) => {
    res.redirect("http://localhost:3000");
  }
);

// Get current logged in user
router.get("/me", (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.json(null);
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("http://localhost:3000");
  });
});

module.exports = router;