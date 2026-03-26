const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all reply attachments
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM reply_attachments");
  res.json(result.rows);
});

// GET specific reply attachment
router.get("/:reply_id/:attachment", async (req, res) => {
  const { reply_id, attachment } = req.params;

  const result = await pool.query(
    "SELECT * FROM reply_attachments WHERE reply_id=$1 AND attachment=$2",
    [reply_id, attachment]
  );

  res.json(result.rows[0]);
});

// CREATE attachment
router.post("/", async (req, res) => {
  const { reply_id, attachment } = req.body;

  const result = await pool.query(
    "INSERT INTO reply_attachments (reply_id, attachment) VALUES ($1,$2) RETURNING *",
    [reply_id, attachment]
  );

  res.json(result.rows[0]);
});

// UPDATE attachment
router.put("/:reply_id/:attachment", async (req, res) => {
  const { reply_id, attachment } = req.params;
  const { new_reply_id, new_attachment } = req.body;

  const result = await pool.query(
    `UPDATE reply_attachments 
     SET reply_id=$1, attachment=$2 
     WHERE reply_id=$3 AND attachment=$4 
     RETURNING *`,
    [
      new_reply_id ?? reply_id,
      new_attachment ?? attachment,
      reply_id,
      attachment
    ]
  );

  res.json(result.rows[0]);
});

// DELETE attachment
router.delete("/:reply_id/:attachment", async (req, res) => {
  const { reply_id, attachment } = req.params;

  await pool.query(
    "DELETE FROM reply_attachments WHERE reply_id=$1 AND attachment=$2",
    [reply_id, attachment]
  );

  res.sendStatus(204);
});

module.exports = router;