const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all awards
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM award");
  res.json(result.rows);
});

// GET one award
router.get("/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM award WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

// CREATE award
router.post("/", async (req, res) => {
  const { name, awarded_by, prize_money } = req.body;

  const result = await pool.query(
    "INSERT INTO award (name, awarded_by, prize_money) VALUES ($1,$2,$3) RETURNING *",
    [name, awarded_by, prize_money]
  );

  res.json(result.rows[0]);
});

// UPDATE award
router.put("/:id", async (req, res) => {
  const { name, awarded_by, prize_money } = req.body;

  const result = await pool.query(
    "UPDATE award SET name=$1, awarded_by=$2, prize_money=$3 WHERE id=$4 RETURNING *",
    [name, awarded_by, prize_money, req.params.id]
  );

  res.json(result.rows[0]);
});

// DELETE award
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM award WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;