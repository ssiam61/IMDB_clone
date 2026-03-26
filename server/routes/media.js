const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all media
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM media");
  res.json(result.rows);
});

// GET one media entry
router.get("/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM media WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

// CREATE media
router.post("/", async (req, res) => {
  const {
    name,
    teaser_link,
    description,
    imdb_rating,
    user_rating,
    duration,
    added_by,
    last_updated_by
  } = req.body;

  const result = await pool.query(
    `INSERT INTO media
     (name, teaser_link, description, imdb_rating, user_rating, duration, added_by, last_updated_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [
      name,
      teaser_link,
      description,
      imdb_rating,
      user_rating,
      duration,
      added_by,
      last_updated_by
    ]
  );

  res.json(result.rows[0]);
});

// UPDATE media
router.put("/:id", async (req, res) => {
  const {
    name,
    teaser_link,
    description,
    imdb_rating,
    user_rating,
    duration,
    added_by,
    last_updated_by
  } = req.body;

  const result = await pool.query(
    `UPDATE media 
     SET name=$1, teaser_link=$2, description=$3,
         imdb_rating=$4, user_rating=$5, duration=$6,
         added_by=$7, last_updated_by=$8, updated_at=NOW()
     WHERE id=$9
     RETURNING *`,
    [
      name,
      teaser_link,
      description,
      imdb_rating,
      user_rating,
      duration,
      added_by,
      last_updated_by,
      req.params.id
    ]
  );

  res.json(result.rows[0]);
});

// DELETE media
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM media WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;