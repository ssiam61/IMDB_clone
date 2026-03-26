const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all media_personality entries
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM media_personality");
  res.json(result.rows);
});

// GET specific entry
router.get("/:media_id/:person_id/:role", async (req, res) => {
  const { media_id, person_id, role } = req.params;

  const result = await pool.query(
    "SELECT * FROM media_personality WHERE media_id=$1 AND person_id=$2 AND role=$3",
    [media_id, person_id, role]
  );

  res.json(result.rows[0]);
});

// CREATE media_personality entry
router.post("/", async (req, res) => {
  const { media_id, person_id, role } = req.body;

  const result = await pool.query(
    "INSERT INTO media_personality (media_id, person_id, role) VALUES ($1,$2,$3) RETURNING *",
    [media_id, person_id, role]
  );

  res.json(result.rows[0]);
});

// UPDATE media_personality
router.put("/:media_id/:person_id/:role", async (req, res) => {
  const { media_id, person_id, role } = req.params;
  const { new_media_id, new_person_id, new_role } = req.body;

  const result = await pool.query(
    `UPDATE media_personality
     SET media_id=$1, person_id=$2, role=$3
     WHERE media_id=$4 AND person_id=$5 AND role=$6
     RETURNING *`,
    [
      new_media_id ?? media_id,
      new_person_id ?? person_id,
      new_role ?? role,
      media_id,
      person_id,
      role
    ]
  );

  res.json(result.rows[0]);
});

// DELETE
router.delete("/:media_id/:person_id/:role", async (req, res) => {
  const { media_id, person_id, role } = req.params;

  await pool.query(
    "DELETE FROM media_personality WHERE media_id=$1 AND person_id=$2 AND role=$3",
    [media_id, person_id, role]
  );

  res.sendStatus(204);
});

module.exports = router;