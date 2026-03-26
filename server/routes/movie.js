const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all movies
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM movie");
  res.json(result.rows);
});

// GET single movie
router.get("/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM movie WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

// CREATE movie
router.post("/", async (req, res) => {
  const { media_id } = req.body;

  const result = await pool.query(
    "INSERT INTO movie (media_id) VALUES ($1) RETURNING *",
    [media_id]
  );

  res.json(result.rows[0]);
});

// UPDATE movie
router.put("/:id", async (req, res) => {
  const { media_id } = req.body;

  const result = await pool.query(
    "UPDATE movie SET media_id=$1 WHERE id=$2 RETURNING *",
    [media_id, req.params.id]
  );

  res.json(result.rows[0]);
});

// DELETE movie
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM movie WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;