const express = require("express");
const cors = require("cors");
const pool = require("./database");
 // <- from step above

const app = express();
app.use(cors());
app.use(express.json());

// simple root so you don't see "Cannot GET /"
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// DB health check
app.get("/db/health", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT 1 as ok");
    res.json({ ok: rows[0].ok === 1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// example: create a table if it doesn't exist
async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log("✅ Ensured tables exist");
}
init().catch(console.error);

const PORT = process.env.PORT || 8080; // Render provides PORT
app.listen(PORT, () => console.log(`🚀 Server listening on ${PORT}`));
