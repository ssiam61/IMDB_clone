const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all users
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});

// GET one user
router.get("/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

// CREATE user
router.post("/", async (req, res) => {
  const { username, name, email, password, profile_picture, is_banned } = req.body;
  const result = await pool.query(
    `INSERT INTO users (username, name, email, password, profile_picture, is_banned)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [username, name, email, password, profile_picture, is_banned ?? false]
  );
  res.json(result.rows[0]);
});

// UPDATE user
router.put("/:id", async (req, res) => {
  const { username, name, email, password, profile_picture, is_banned } = req.body;
  const result = await pool.query(
    `UPDATE users SET username=$1, name=$2, email=$3, password=$4,
     profile_picture=$5, is_banned=$6 WHERE id=$7 RETURNING *`,
    [username, name, email, password, profile_picture, is_banned, req.params.id]
  );
  res.json(result.rows[0]);
});

// DELETE user
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM users WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;
