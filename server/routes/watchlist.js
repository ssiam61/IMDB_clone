const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all watchlist items
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM watchlist");
  res.json(result.rows);
});

// GET specific watchlist entry
router.get("/:user_id/:media_id", async (req, res) => {
  const { user_id, media_id } = req.params;

  const result = await pool.query(
    "SELECT * FROM watchlist WHERE user_id=$1 AND media_id=$2",
    [user_id, media_id]
  );

  res.json(result.rows[0]);
});

// CREATE watchlist entry
router.post("/", async (req, res) => {
  const { user_id, media_id } = req.body;

  const result = await pool.query(
    "INSERT INTO watchlist (user_id, media_id) VALUES ($1,$2) RETURNING *",
    [user_id, media_id]
  );

  res.json(result.rows[0]);
});

// UPDATE watchlist entry
router.put("/:user_id/:media_id", async (req, res) => {
  const { user_id, media_id } = req.params;
  const { new_user_id, new_media_id } = req.body;

  const result = await pool.query(
    "UPDATE watchlist SET user_id=$1, media_id=$2 WHERE user_id=$3 AND media_id=$4 RETURNING *",
    [new_user_id ?? user_id, new_media_id ?? media_id, user_id, media_id]
  );

  res.json(result.rows[0]);
});

// DELETE watchlist entry
router.delete("/:user_id/:media_id", async (req, res) => {
  const { user_id, media_id } = req.params;

  await pool.query(
    "DELETE FROM watchlist WHERE user_id=$1 AND media_id=$2",
    [user_id, media_id]
  );

  res.sendStatus(204);
});

module.exports = router;