const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all genres
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM genre");
  res.json(result.rows);
});

// GET one genre
router.get("/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM genre WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

// CREATE genre
router.post("/", async (req, res) => {
  const { name } = req.body;

  const result = await pool.query(
    "INSERT INTO genre (name) VALUES ($1) RETURNING *",
    [name]
  );

  res.json(result.rows[0]);
});

// UPDATE genre
router.put("/:id", async (req, res) => {
  const { name } = req.body;

  const result = await pool.query(
    "UPDATE genre SET name=$1 WHERE id=$2 RETURNING *",
    [name, req.params.id]
  );

  res.json(result.rows[0]);
});

// DELETE genre
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM genre WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;