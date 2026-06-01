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
        // Check if user already exists
        const existing = await pool.query(
          "SELECT * FROM users WHERE google_id = $1",
          [profile.id]
        );

        if (existing.rows.length > 0) {
          return done(null, existing.rows[0]);
        }

        // Create new user
        const newUser = await pool.query(
          "INSERT INTO users (google_id, name, email, avatar_url) VALUES ($1, $2, $3, $4) RETURNING *",
          [
            profile.id,
            profile.displayName,
            profile.emails[0].value,
            profile.photos[0].value,
          ]
        );

        done(null, newUser.rows[0]);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
