const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all person_award records
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM person_award");
  res.json(result.rows);
});

// GET specific record
router.get("/:person_id/:award_id/:year", async (req, res) => {
  const { person_id, award_id, year } = req.params;

  const result = await pool.query(
    "SELECT * FROM person_award WHERE person_id=$1 AND award_id=$2 AND year=$3",
    [person_id, award_id, year]
  );

  res.json(result.rows[0]);
});

// CREATE person_award
router.post("/", async (req, res) => {
  const { person_id, award_id, year } = req.body;

  const result = await pool.query(
    "INSERT INTO person_award (person_id, award_id, year) VALUES ($1,$2,$3) RETURNING *",
    [person_id, award_id, year]
  );

  res.json(result.rows[0]);
});

// UPDATE person_award
router.put("/:person_id/:award_id/:year", async (req, res) => {
  const { person_id, award_id, year } = req.params;
  const { new_person_id, new_award_id, new_year } = req.body;

  const result = await pool.query(
    `UPDATE person_award 
     SET person_id=$1, award_id=$2, year=$3
     WHERE person_id=$4 AND award_id=$5 AND year=$6
     RETURNING *`,
    [
      new_person_id ?? person_id,
      new_award_id ?? award_id,
      new_year ?? year,
      person_id,
      award_id,
      year
    ]
  );

  res.json(result.rows[0]);
});

// DELETE person_award
router.delete("/:person_id/:award_id/:year", async (req, res) => {
  const { person_id, award_id, year } = req.params;

  await pool.query(
    "DELETE FROM person_award WHERE person_id=$1 AND award_id=$2 AND year=$3",
    [person_id, award_id, year]
  );

  res.sendStatus(204);
});

module.exports = router;