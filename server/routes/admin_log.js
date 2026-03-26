const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all logs
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM admin_log");
  res.json(result.rows);
});

// GET one log
router.get("/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM admin_log WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

// CREATE log
router.post("/", async (req, res) => {
  const { admin_id, action, target_type, target_id, notes } = req.body;
  const result = await pool.query(
    `INSERT INTO admin_log (admin_id, action, target_type, target_id, notes)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [admin_id, action, target_type, target_id, notes]
  );
  res.json(result.rows[0]);
});

// UPDATE log
router.put("/:id", async (req, res) => {
  const { admin_id, action, target_type, target_id, notes } = req.body;
  const result = await pool.query(
    `UPDATE admin_log SET admin_id=$1, action=$2, target_type=$3,
     target_id=$4, notes=$5 WHERE id=$6 RETURNING *`,
    [admin_id, action, target_type, target_id, notes, req.params.id]
  );
  res.json(result.rows[0]);
});

// DELETE log
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM admin_log WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;