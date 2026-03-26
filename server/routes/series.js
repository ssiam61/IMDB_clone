const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all series
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM series");
  res.json(result.rows);
});

// GET one series
router.get("/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM series WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

// CREATE series
router.post("/", async (req, res) => {
  const { media_id } = req.body;

  const result = await pool.query(
    "INSERT INTO series (media_id) VALUES ($1) RETURNING *",
    [media_id]
  );

  res.json(result.rows[0]);
});

// UPDATE series
router.put("/:id", async (req, res) => {
  const { media_id } = req.body;

  const result = await pool.query(
    "UPDATE series SET media_id=$1 WHERE id=$2 RETURNING *",
    [media_id, req.params.id]
  );

  res.json(result.rows[0]);
});

// DELETE series
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM series WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;