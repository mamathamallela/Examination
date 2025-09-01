// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const connection = require('./database');
// const dotenv = require('dotenv');



// dotenv.config();

// const app = express();

// app.use(bodyParser.json());
// app.use(cors());

// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//   } else {
//     console.log('Connected to MySQL database');
//   }
// });

// const userRoutes = require('./routes/userRoutes');

// app.use('/api/users', userRoutes);



// const port = process.env.PORT
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


const express = require("express");
const cors = require("cors");
const pool = require("./db"); // <- from step above

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
