const express = require("express");
const router = express.Router();

// In-memory notification storage (replace with DB in production)
let notifications = [];

// Get notifications for admin
router.get("/admin", (req, res) => {
  try {
    // Return last 10 notifications
    res.json(notifications.slice(0, 10));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get notifications for customer
router.get("/customer/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const userNotifications = notifications.filter(
      (n) => n.userId === userId || n.type === "offer"
    );
    res.json(userNotifications.slice(0, 10));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create notification
router.post("/", (req, res) => {
  try {
    const { type, message, userId } = req.body;
    const notification = {
      id: Date.now(),
      type,
      message,
      userId,
      timestamp: new Date(),
    };
    notifications.unshift(notification);
    // Keep only last 100 notifications
    if (notifications.length > 100) {
      notifications.pop();
    }
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper to create a notification programmatically from other server modules
router.createNotification = ({ type, message, userId }) => {
  try {
    const notification = {
      id: Date.now(),
      type,
      message,
      userId: userId || null,
      timestamp: new Date(),
    };
    notifications.unshift(notification);
    if (notifications.length > 100) notifications.pop();
    return notification;
  } catch (err) {
    console.error('Failed to create notification', err);
    return null;
  }
};

module.exports = router;
