const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const pool = require("./db");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find user by google_id OR email
        const email = profile.emails?.[0]?.value || null;
        const existing = await pool.query(
          "SELECT * FROM users WHERE google_id = $1 OR email = $2",
          [profile.id, email]
        );

        if (existing.rows.length > 0) {
          return done(null, existing.rows[0]);
        }

        // No matching user — reject authentication (do not create auto-user)
        return done(null, false, { message: "No account found. Please register to continue." });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  // Store the full user object in session (handles both DB users and transient google profiles)
  done(null, user);
});

passport.deserializeUser(async (userOrId, done) => {
  try {
    // If session already contains the full user object, return it directly
    if (userOrId && typeof userOrId === "object") {
      return done(null, userOrId);
    }

    // Otherwise treat as DB id and fetch
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [userOrId]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
