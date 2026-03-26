const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all fan links
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM fan");
  res.json(result.rows);
});

// GET a specific fan record
router.get("/:user_id/:person_id", async (req, res) => {
  const { user_id, person_id } = req.params;

  const result = await pool.query(
    "SELECT * FROM fan WHERE user_id=$1 AND person_id=$2",
    [user_id, person_id]
  );

  res.json(result.rows[0]);
});

// CREATE fan link
router.post("/", async (req, res) => {
  const { user_id, person_id } = req.body;

  const result = await pool.query(
    "INSERT INTO fan (user_id, person_id) VALUES ($1,$2) RETURNING *",
    [user_id, person_id]
  );

  res.json(result.rows[0]);
});

// UPDATE fan
router.put("/:user_id/:person_id", async (req, res) => {
  const { user_id, person_id } = req.params;
  const { new_user_id, new_person_id } = req.body;

  const result = await pool.query(
    "UPDATE fan SET user_id=$1, person_id=$2 WHERE user_id=$3 AND person_id=$4 RETURNING *",
    [
      new_user_id ?? user_id,
      new_person_id ?? person_id,
      user_id,
      person_id
    ]
  );

  res.json(result.rows[0]);
});

// DELETE fan link
router.delete("/:user_id/:person_id", async (req, res) => {
  const { user_id, person_id } = req.params;

  await pool.query(
    "DELETE FROM fan WHERE user_id=$1 AND person_id=$2",
    [user_id, person_id]
  );

  res.sendStatus(204);
});

module.exports = router;