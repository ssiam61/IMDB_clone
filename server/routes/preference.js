const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all preferences
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM preference");
  res.json(result.rows);
});

// GET a specific preference
router.get("/:user_id/:genre_id", async (req, res) => {
  const { user_id, genre_id } = req.params;

  const result = await pool.query(
    "SELECT * FROM preference WHERE user_id=$1 AND genre_id=$2",
    [user_id, genre_id]
  );

  res.json(result.rows[0]);
});

// CREATE preference
router.post("/", async (req, res) => {
  const { user_id, genre_id } = req.body;

  const result = await pool.query(
    "INSERT INTO preference (user_id, genre_id) VALUES ($1,$2) RETURNING *",
    [user_id, genre_id]
  );

  res.json(result.rows[0]);
});

// UPDATE preference
router.put("/:user_id/:genre_id", async (req, res) => {
  const { user_id, genre_id } = req.params;
  const { new_user_id, new_genre_id } = req.body;

  const result = await pool.query(
    "UPDATE preference SET user_id=$1, genre_id=$2 WHERE user_id=$3 AND genre_id=$4 RETURNING *",
    [
      new_user_id ?? user_id,
      new_genre_id ?? genre_id,
      user_id,
      genre_id
    ]
  );

  res.json(result.rows[0]);
});

// DELETE preference
router.delete("/:user_id/:genre_id", async (req, res) => {
  const { user_id, genre_id } = req.params;

  await pool.query(
    "DELETE FROM preference WHERE user_id=$1 AND genre_id=$2",
    [user_id, genre_id]
  );

  res.sendStatus(204);
});

module.exports = router;