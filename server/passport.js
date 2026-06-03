const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const pool = require("./db");

// Register GoogleStrategy only when credentials are present. Use full callback URL.
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${SERVER_URL}/auth/google/callback`,
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

          // New user - do not auto-save. Return profile info and mark as new.
          return done(null, {
            google_id: profile.id,
            email: profile.emails?.[0]?.value,
            avatar_url: profile.photos?.[0]?.value,
            name: profile.displayName,
            isNewUser: true,
          });
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
} else {
  console.warn('Google OAuth not configured: set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable /auth/google.');
}

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
