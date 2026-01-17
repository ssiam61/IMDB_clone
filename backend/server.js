const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "demoapp",
  password: "Hamilton44",
  port: 5432,
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Insert message
app.post("/messages", async (req, res) => {
  const { text } = req.body;
  const result = await pool.query(
    "INSERT INTO messages (text) VALUES ($1) RETURNING *",
    [text]
  );
  res.json(result.rows[0]);
});

// Get all messages
app.get("/messages", async (req, res) => {
  const result = await pool.query("SELECT * FROM messages");
  res.json(result.rows);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
