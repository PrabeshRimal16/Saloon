const pool = require("./db");
const fs = require("fs");
const path = require("path");

async function initializeDatabase() {
  try {
    const offersPath = path.join(__dirname, "db", "init_offers.sql");
    if (fs.existsSync(offersPath)) {
      const offersSQL = fs.readFileSync(offersPath, "utf8");
      const statements = offersSQL
        .split(";")
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt.length > 0);

      for (const statement of statements) {
        await pool.query(statement);
        console.log("✓ Executed database initialization statement");
      }
      console.log("✓ Database initialized successfully");
    } else {
      console.log("No init_offers.sql found, skipping database initialization");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

module.exports = initializeDatabase;
