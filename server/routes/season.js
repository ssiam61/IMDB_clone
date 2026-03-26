const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all seasons
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM season");
  res.json(result.rows);
});

// GET a season
router.get("/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM season WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

// CREATE season
router.post("/", async (req, res) => {
  const { series_id, number, imdb_rating, user_rating } = req.body;

  const result = await pool.query(
    `INSERT INTO season (series_id, number, imdb_rating, user_rating)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [series_id, number, imdb_rating, user_rating]
  );

  res.json(result.rows[0]);
});

// UPDATE season
router.put("/:id", async (req, res) => {
  const { series_id, number, imdb_rating, user_rating } = req.body;

  const result = await pool.query(
    `UPDATE season
     SET series_id=$1, number=$2, imdb_rating=$3, user_rating=$4
     WHERE id=$5 RETURNING *`,
    [series_id, number, imdb_rating, user_rating, req.params.id]
  );

  res.json(result.rows[0]);
});

// DELETE season
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM season WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;