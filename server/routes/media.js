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

// GET complete media details (with genres, cast, awards, reviews)
router.get("/:id/full", async (req, res) => {
  try {
    const mediaId = req.params.id;
    
    // Get basic media info
    const mediaRes = await pool.query(
      "SELECT * FROM media WHERE id=$1",
      [mediaId]
    );
    const media = mediaRes.rows[0];
    if (!media) return res.status(404).json({ error: "Media not found" });

    // Get genres
    const genresRes = await pool.query(
      `SELECT g.id, g.name FROM genre g
       INNER JOIN media_genre mg ON g.id = mg.genre_id
       WHERE mg.media_id = $1`,
      [mediaId]
    );
    const genres = genresRes.rows;

    // Get cast and crew
    const castRes = await pool.query(
      `SELECT p.id, p.name, p.picture, p.biography, mp.role
       FROM person p
       INNER JOIN media_personality mp ON p.id = mp.person_id
       WHERE mp.media_id = $1
       ORDER BY mp.role`,
      [mediaId]
    );
    const cast = castRes.rows;

    // Organize cast by role
    const castByRole = {
      actors: cast.filter(c => c.role === 'actor'),
      directors: cast.filter(c => c.role === 'director'),
      writers: cast.filter(c => c.role === 'writer'),
      producers: cast.filter(c => c.role === 'producer')
    };

    // Get awards
    const awardsRes = await pool.query(
      `SELECT a.id, a.name, a.awarded_by, a.prize_money, ma.year
       FROM award a
       INNER JOIN media_award ma ON a.id = ma.award_id
       WHERE ma.media_id = $1
       ORDER BY ma.year DESC`,
      [mediaId]
    );
    const awards = awardsRes.rows;

    // Get review statistics
    const reviewsRes = await pool.query(
      `SELECT 
         COUNT(*) as review_count,
         AVG(star_point) as avg_rating,
         SUM(CASE WHEN star_point > 5 THEN 1 ELSE 0 END) as positive_count
       FROM review 
       WHERE media_id = $1 AND is_removed = FALSE`,
      [mediaId]
    );
    const reviewStats = reviewsRes.rows[0];

    // Combine all data
    const completeData = {
      ...media,
      genres,
      cast: castByRole,
      awards,
      reviewStats: {
        totalReviews: parseInt(reviewStats.review_count) || 0,
        avgUserRating: reviewStats.avg_rating ? parseFloat(reviewStats.avg_rating).toFixed(1) : null,
        positiveReviews: parseInt(reviewStats.positive_count) || 0
      }
    };

    res.json(completeData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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