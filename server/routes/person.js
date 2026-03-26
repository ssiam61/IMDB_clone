const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all persons
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM person");
  res.json(result.rows);
});

// GET one person
router.get("/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM person WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

// CREATE person
router.post("/", async (req, res) => {
  const { name, occupation, picture, biography } = req.body;

  const result = await pool.query(
    "INSERT INTO person (name, occupation, picture, biography) VALUES ($1,$2,$3,$4) RETURNING *",
    [name, occupation, picture, biography]
  );

  res.json(result.rows[0]);
});

// UPDATE person
router.put("/:id", async (req, res) => {
  const { name, occupation, picture, biography } = req.body;

  const result = await pool.query(
    "UPDATE person SET name=$1, occupation=$2, picture=$3, biography=$4 WHERE id=$5 RETURNING *",
    [name, occupation, picture, biography, req.params.id]
  );

  res.json(result.rows[0]);
});

// DELETE person
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM person WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;