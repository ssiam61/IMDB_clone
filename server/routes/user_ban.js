const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all bans
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM user_ban");
  res.json(result.rows);
});

// GET one ban
router.get("/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM user_ban WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

// CREATE ban
router.post("/", async (req, res) => {
  const {
    user_id,
    banned_by,
    reason,
    is_permanent,
    expires_at,
    lifted_at,
    lifted_by
  } = req.body;

  const result = await pool.query(
    `INSERT INTO user_ban (user_id, banned_by, reason, is_permanent,
     expires_at, lifted_at, lifted_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [user_id, banned_by, reason, is_permanent, expires_at, lifted_at, lifted_by]
  );

  res.json(result.rows[0]);
});

// UPDATE ban
router.put("/:id", async (req, res) => {
  const {
    user_id,
    banned_by,
    reason,
    is_permanent,
    expires_at,
    lifted_at,
    lifted_by
  } = req.body;

  const result = await pool.query(
    `UPDATE user_ban SET user_id=$1, banned_by=$2, reason=$3,
     is_permanent=$4, expires_at=$5, lifted_at=$6, lifted_by=$7
     WHERE id=$8 RETURNING *`,
    [
      user_id,
      banned_by,
      reason,
      is_permanent,
      expires_at,
      lifted_at,
      lifted_by,
      req.params.id
    ]
  );

  res.json(result.rows[0]);
});

// DELETE ban
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM user_ban WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;