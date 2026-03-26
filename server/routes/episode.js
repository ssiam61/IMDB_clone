const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all episodes
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM episode");
  res.json(result.rows);
});

// GET an episode
router.get("/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM episode WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

// CREATE episode
router.post("/", async (req, res) => {
  const { season_id, number, imdb_rating, user_rating } = req.body;

  const result = await pool.query(
    `INSERT INTO episode (season_id, number, imdb_rating, user_rating)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [season_id, number, imdb_rating, user_rating]
  );

  res.json(result.rows[0]);
});

// UPDATE episode
router.put("/:id", async (req, res) => {
  const { season_id, number, imdb_rating, user_rating } = req.body;

  const result = await pool.query(
    `UPDATE episode
     SET season_id=$1, number=$2, imdb_rating=$3, user_rating=$4
     WHERE id=$5 RETURNING *`,
    [season_id, number, imdb_rating, user_rating, req.params.id]
  );

  res.json(result.rows[0]);
});

// DELETE episode
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM episode WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;