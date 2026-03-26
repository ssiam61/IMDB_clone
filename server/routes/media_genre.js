const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all media_genre links
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM media_genre");
  res.json(result.rows);
});

// GET a specific media_genre entry
router.get("/:media_id/:genre_id", async (req, res) => {
  const { media_id, genre_id } = req.params;

  const result = await pool.query(
    "SELECT * FROM media_genre WHERE media_id=$1 AND genre_id=$2",
    [media_id, genre_id]
  );

  res.json(result.rows[0]);
});

// CREATE new media_genre link
router.post("/", async (req, res) => {
  const { media_id, genre_id } = req.body;

  const result = await pool.query(
    "INSERT INTO media_genre (media_id, genre_id) VALUES ($1,$2) RETURNING *",
    [media_id, genre_id]
  );

  res.json(result.rows[0]);
});

// UPDATE media_genre
router.put("/:media_id/:genre_id", async (req, res) => {
  const { media_id, genre_id } = req.params;
  const { new_media_id, new_genre_id } = req.body;

  const result = await pool.query(
    `UPDATE media_genre
     SET media_id=$1, genre_id=$2
     WHERE media_id=$3 AND genre_id=$4
     RETURNING *`,
    [
      new_media_id ?? media_id,
      new_genre_id ?? genre_id,
      media_id,
      genre_id
    ]
  );

  res.json(result.rows[0]);
});

// DELETE media_genre
router.delete("/:media_id/:genre_id", async (req, res) => {
  const { media_id, genre_id } = req.params;

  await pool.query(
    "DELETE FROM media_genre WHERE media_id=$1 AND genre_id=$2",
    [media_id, genre_id]
  );

  res.sendStatus(204);
});

module.exports = router;