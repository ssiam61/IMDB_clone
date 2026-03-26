const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all admins
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM admin");
  res.json(result.rows);
});

// GET one admin
router.get("/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM admin WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

// CREATE admin
router.post("/", async (req, res) => {
  const { user_id, role, granted_by } = req.body;
  const result = await pool.query(
    "INSERT INTO admin (user_id, role, granted_by) VALUES ($1,$2,$3) RETURNING *",
    [user_id, role, granted_by]
  );
  res.json(result.rows[0]);
});

// UPDATE admin
router.put("/:id", async (req, res) => {
  const { user_id, role, granted_by } = req.body;
  const result = await pool.query(
    "UPDATE admin SET user_id=$1, role=$2, granted_by=$3 WHERE id=$4 RETURNING *",
    [user_id, role, granted_by, req.params.id]
  );
  res.json(result.rows[0]);
});

// DELETE admin
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM admin WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;