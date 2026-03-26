const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all reports
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM report");
  res.json(result.rows);
});

// GET one report
router.get("/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM report WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

// CREATE report
router.post("/", async (req, res) => {
  const {
    reporter_id,
    review_id,
    reply_id,
    reason,
    status,
    actioned_by,
    actioned_at
  } = req.body;

  const result = await pool.query(
    `INSERT INTO report (reporter_id, review_id, reply_id, reason,
     status, actioned_by, actioned_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [
      reporter_id,
      review_id,
      reply_id,
      reason,
      status,
      actioned_by,
      actioned_at
    ]
  );

  res.json(result.rows[0]);
});

// UPDATE report
router.put("/:id", async (req, res) => {
  const {
    reporter_id,
    review_id,
    reply_id,
    reason,
    status,
    actioned_by,
    actioned_at
  } = req.body;

  const result = await pool.query(
    `UPDATE report SET reporter_id=$1, review_id=$2, reply_id=$3,
     reason=$4, status=$5, actioned_by=$6, actioned_at=$7
     WHERE id=$8 RETURNING *`,
    [
      reporter_id,
      review_id,
      reply_id,
      reason,
      status,
      actioned_by,
      actioned_at,
      req.params.id
    ]
  );

  res.json(result.rows[0]);
});

// DELETE report
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM report WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;