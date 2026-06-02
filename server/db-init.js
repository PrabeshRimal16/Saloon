const pool = require("./db");
const fs = require("fs");
const path = require("path");

async function initializeDatabase() {
  try {
    // Read and execute the offers SQL file
    const offersSQL = fs.readFileSync(
      path.join(__dirname, "db", "init_offers.sql"),
      "utf8"
    );

    // Split SQL statements by semicolon and execute
    const statements = offersSQL
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    for (const statement of statements) {
      await pool.query(statement);
      console.log("✓ Executed database initialization statement");
    }

    console.log("✓ Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    // Don't throw - the app can still run with existing schema
  }
}

module.exports = initializeDatabase;
