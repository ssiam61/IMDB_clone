const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all reviews
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM review");
  res.json(result.rows);
});

// GET specific review
router.get("/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM review WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

// CREATE review
router.post("/", async (req, res) => {
  const {
    user_id,
    media_id,
    season_id,
    episode_id,
    star_point,
    description,
    upvote,
    downvote,
    is_removed,
    removed_by
  } = req.body;

  const result = await pool.query(
    `INSERT INTO review 
     (user_id, media_id, season_id, episode_id, star_point, description, 
      upvote, downvote, is_removed, removed_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
    [
      user_id,
      media_id,
      season_id,
      episode_id,
      star_point,
      description,
      upvote ?? 0,
      downvote ?? 0,
      is_removed ?? false,
      removed_by
    ]
  );

  res.json(result.rows[0]);
});

// UPDATE review
router.put("/:id", async (req, res) => {
  const {
    user_id,
    media_id,
    season_id,
    episode_id,
    star_point,
    description,
    upvote,
    downvote,
    is_removed,
    removed_by
  } = req.body;

  const result = await pool.query(
    `UPDATE review
     SET user_id=$1, media_id=$2, season_id=$3, episode_id=$4, 
         star_point=$5, description=$6, upvote=$7, downvote=$8,
         is_removed=$9, removed_by=$10
     WHERE id=$11
     RETURNING *`,
    [
      user_id,
      media_id,
      season_id,
      episode_id,
      star_point,
      description,
      upvote,
      downvote,
      is_removed,
      removed_by,
      req.params.id
    ]
  );

  res.json(result.rows[0]);
});

// DELETE review
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM review WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;