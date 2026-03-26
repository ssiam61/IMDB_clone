const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all post attachments
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM post_attachments");
  res.json(result.rows);
});

// GET specific post attachment
router.get("/:post_id/:attachment", async (req, res) => {
  const { post_id, attachment } = req.params;

  const result = await pool.query(
    "SELECT * FROM post_attachments WHERE post_id=$1 AND attachment=$2",
    [post_id, attachment]
  );

  res.json(result.rows[0]);
});

// CREATE attachment
router.post("/", async (req, res) => {
  const { post_id, attachment } = req.body;

  const result = await pool.query(
    "INSERT INTO post_attachments (post_id, attachment) VALUES ($1,$2) RETURNING *",
    [post_id, attachment]
  );

  res.json(result.rows[0]);
});

// UPDATE attachment
router.put("/:post_id/:attachment", async (req, res) => {
  const { post_id, attachment } = req.params;
  const { new_post_id, new_attachment } = req.body;

  const result = await pool.query(
    `UPDATE post_attachments 
     SET post_id=$1, attachment=$2 
     WHERE post_id=$3 AND attachment=$4 
     RETURNING *`,
    [new_post_id ?? post_id, new_attachment ?? attachment, post_id, attachment]
  );

  res.json(result.rows[0]);
});

// DELETE attachment
router.delete("/:post_id/:attachment", async (req, res) => {
  const { post_id, attachment } = req.params;

  await pool.query(
    "DELETE FROM post_attachments WHERE post_id=$1 AND attachment=$2",
    [post_id, attachment]
  );

  res.sendStatus(204);
});

module.exports = router;