const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const pgSession = require('connect-pg-simple')(session);
const passport = require("./passport");
const initializeDatabase = require("./db-init");
dotenv.config();

const app = express();
app.set('trust proxy', 1);
let compressionMiddleware = null;
try {
  // compression is optional at runtime; if not installed, warn and continue
  const compression = require('compression');
  compressionMiddleware = compression();
} catch (err) {
  console.warn('Optional dependency `compression` not installed. Skipping response compression.');
}
const path = require('path');
const fs = require('fs');

const CLIENT_URL = process.env.CLIENT_URL || "https://www.thesalonatreston.com";
const VERCEL_URL = process.env.VERCEL_URL || "https://www.thesalonatreston.com";
const allowedOrigins = Array.from(
  new Set([
    CLIENT_URL,
    "http://localhost:3000",
    "http://localhost:5173",
    VERCEL_URL,
    "https://thesalonatreston.com",
    "https://www.thesalonatreston.com",
    "https://saloon-lake-sigma.vercel.app"
  ])
);

const sessionSecret =
  process.env.SESSION_SECRET ||
  (process.env.NODE_ENV === "production" ? null : "dev_session_secret_change_me");

if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set when NODE_ENV=production");
}

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// compress responses to reduce payload sizes (if available)
if (compressionMiddleware) app.use(compressionMiddleware);

app.use(session({
  store: new pgSession({
    pool: require('./db'),
    tableName: 'session'
  }),
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    // For cross-site cookies (frontend on a different host) we require:
    // - secure: true (HTTPS only)
    // - sameSite: 'none'
    // - httpOnly: true (not readable from JS)
    secure: true,
    sameSite: 'none',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Ensure uploads folder exists and serve it statically
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/api/services", require("./routes/services"));
app.use("/api/appointments", require("./routes/appointments"));
app.use("/api/offers", require("./routes/offers"));
app.use("/api/users", require("./routes/users"));
app.use("/api/notifications", require("./routes/notifications"));

// Health endpoint to keep the service awake for uptime monitors
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
