const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all replies
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM reply");
  res.json(result.rows);
});

// GET specific reply
router.get("/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM reply WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

// CREATE reply
router.post("/", async (req, res) => {
  const {
    user_id,
    parent_review_id,
    parent_reply_id,
    description,
    upvote,
    downvote,
    is_removed,
    removed_by
  } = req.body;

  const result = await pool.query(
    `INSERT INTO reply
     (user_id, parent_review_id, parent_reply_id, description,
      upvote, downvote, is_removed, removed_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [
      user_id,
      parent_review_id,
      parent_reply_id,
      description,
      upvote ?? 0,
      downvote ?? 0,
      is_removed ?? false,
      removed_by
    ]
  );

  res.json(result.rows[0]);
});

// UPDATE reply
router.put("/:id", async (req, res) => {
  const {
    user_id,
    parent_review_id,
    parent_reply_id,
    description,
    upvote,
    downvote,
    is_removed,
    removed_by
  } = req.body;

  const result = await pool.query(
    `UPDATE reply
     SET user_id=$1, parent_review_id=$2, parent_reply_id=$3,
         description=$4, upvote=$5, downvote=$6,
         is_removed=$7, removed_by=$8
     WHERE id=$9
     RETURNING *`,
    [
      user_id,
      parent_review_id,
      parent_reply_id,
      description,
      upvote,
      downvote,
      is_removed,
      removed_by,
      req.params.id
    ]
  );

  res.json(result.rows[0]);
});

// DELETE reply
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM reply WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;