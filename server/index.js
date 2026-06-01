const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("./passport");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/api/services", require("./routes/services"));
app.use("/api/appointments", require("./routes/appointments"));
app.use("/api/offers", require("./routes/offers"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));