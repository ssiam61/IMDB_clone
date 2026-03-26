const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all media_award entries
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM media_award");
  res.json(result.rows);
});

// GET specific media_award entry
router.get("/:media_id/:award_id/:year", async (req, res) => {
  const { media_id, award_id, year } = req.params;

  const result = await pool.query(
    "SELECT * FROM media_award WHERE media_id=$1 AND award_id=$2 AND year=$3",
    [media_id, award_id, year]
  );

  res.json(result.rows[0]);
});

// CREATE media_award entry
router.post("/", async (req, res) => {
  const { media_id, award_id, year } = req.body;

  const result = await pool.query(
    "INSERT INTO media_award (media_id, award_id, year) VALUES ($1,$2,$3) RETURNING *",
    [media_id, award_id, year]
  );

  res.json(result.rows[0]);
});

// UPDATE media_award
router.put("/:media_id/:award_id/:year", async (req, res) => {
  const { media_id, award_id, year } = req.params;
  const { new_media_id, new_award_id, new_year } = req.body;

  const result = await pool.query(
    `UPDATE media_award
     SET media_id=$1, award_id=$2, year=$3
     WHERE media_id=$4 AND award_id=$5 AND year=$6
     RETURNING *`,
    [
      new_media_id ?? media_id,
      new_award_id ?? award_id,
      new_year ?? year,
      media_id,
      award_id,
      year
    ]
  );

  res.json(result.rows[0]);
});

// DELETE media_award
router.delete("/:media_id/:award_id/:year", async (req, res) => {
  const { media_id, award_id, year } = req.params;

  await pool.query(
    "DELETE FROM media_award WHERE media_id=$1 AND award_id=$2 AND year=$3",
    [media_id, award_id, year]
  );

  res.sendStatus(204);
});

module.exports = router;