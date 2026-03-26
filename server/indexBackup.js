const express = require("express");
const app = express();
const pool = require("./db");

//middleware
app.use(express.json());

//ROUTES

//users
app.get("/users", async (req, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});

app.get("/users/:id", async (req, res) => {
  const result = await pool.query("SELECT * FROM users WHERE id=$1", [req.params.id]);
  res.json(result.rows[0]);
});

app.post("/users", async (req, res) => {
  const { username, name, email, password, profile_picture } = req.body;
  const result = await pool.query(
    "INSERT INTO users (username, name, email, password, profile_picture) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [username, name, email, password, profile_picture]
  );
  res.json(result.rows[0]);
});

app.put("/users/:id", async (req, res) => {
  const { username, name, email, password, profile_picture } = req.body;
  const result = await pool.query(
    "UPDATE users SET username=$1, name=$2, email=$3, password=$4, profile_picture=$5 WHERE id=$6 RETURNING *",
    [username, name, email, password, profile_picture, req.params.id]
  );
  res.json(result.rows[0]);
});

app.delete("/users/:id", async (req, res) => {
  await pool.query("DELETE FROM users WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});

//genre
app.get("/genre", async (req, res) => {
  res.json((await pool.query("SELECT * FROM genre")).rows);
});

app.get("/genre/:id", async (req, res) => {
  const result = await pool.query("SELECT * FROM genre WHERE id=$1", [req.params.id]);
  res.json(result.rows[0]);
});

app.post("/genre", async (req, res) => {
  const result = await pool.query(
    "INSERT INTO genre (name) VALUES ($1) RETURNING *",
    [req.body.name]
  );
  res.json(result.rows[0]);
});

app.put("/genre/:id", async (req, res) => {
  const result = await pool.query(
    "UPDATE genre SET name=$1 WHERE id=$2 RETURNING *",
    [req.body.name, req.params.id]
  );
  res.json(result.rows[0]);
});

app.delete("/genre/:id", async (req, res) => {
  await pool.query("DELETE FROM genre WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});


//person
app.get("/person", async (req, res) => {
  res.json((await pool.query("SELECT * FROM person")).rows);
});

app.get("/person/:id", async (req, res) => {
  const result = await pool.query("SELECT * FROM person WHERE id=$1", [req.params.id]);
  res.json(result.rows[0]);
});

app.post("/person", async (req, res) => {
  const { name, occupation, picture, biography } = req.body;
  const result = await pool.query(
    "INSERT INTO person (name, occupation, picture, biography) VALUES ($1,$2,$3,$4) RETURNING *",
    [name, occupation, picture, biography]
  );
  res.json(result.rows[0]);
});

app.put("/person/:id", async (req, res) => {
  const { name, occupation, picture, biography } = req.body;
  const result = await pool.query(
    "UPDATE person SET name=$1, occupation=$2, picture=$3, biography=$4 WHERE id=$5 RETURNING *",
    [name, occupation, picture, biography, req.params.id]
  );
  res.json(result.rows[0]);
});

app.delete("/person/:id", async (req, res) => {
  await pool.query("DELETE FROM person WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});


//media 
app.get("/media", async (req, res) => {
  res.json((await pool.query("SELECT * FROM media")).rows);
});

app.get("/media/:id", async (req, res) => {
  const result = await pool.query("SELECT * FROM media WHERE id=$1", [req.params.id]);
  res.json(result.rows[0]);
});

app.post("/media", async (req, res) => {
  const { name, teaser_link, description, imdb_rating, user_rating, duration } = req.body;
  const result = await pool.query(
    "INSERT INTO media (name, teaser_link, description, imdb_rating, user_rating, duration) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
    [name, teaser_link, description, imdb_rating, user_rating, duration]
  );
  res.json(result.rows[0]);
});

app.put("/media/:id", async (req, res) => {
  const { name, teaser_link, description, imdb_rating, user_rating, duration } = req.body;
  const result = await pool.query(
    "UPDATE media SET name=$1, teaser_link=$2, description=$3, imdb_rating=$4, user_rating=$5, duration=$6 WHERE id=$7 RETURNING *",
    [name, teaser_link, description, imdb_rating, user_rating, duration, req.params.id]
  );
  res.json(result.rows[0]);
});

app.delete("/media/:id", async (req, res) => {
  await pool.query("DELETE FROM media WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});

//movie
app.get("/movies", async (req, res) => {
  const result = await pool.query("SELECT * FROM movie");
  res.json(result.rows);
});

app.get("/movies/:id", async (req, res) => {
  const result = await pool.query("SELECT * FROM movie WHERE id=$1", [req.params.id]);
  res.json(result.rows[0]);
});

app.post("/movies", async (req, res) => {
  const { media_id } = req.body;
  const result = await pool.query(
    "INSERT INTO movie (media_id) VALUES ($1) RETURNING *",
    [media_id]
  );
  res.json(result.rows[0]);
});

app.put("/movies/:id", async (req, res) => {
  const { media_id } = req.body;
  const result = await pool.query(
    "UPDATE movie SET media_id=$1 WHERE id=$2 RETURNING *",
    [media_id, req.params.id]
  );
  res.json(result.rows[0]);
});

app.delete("/movies/:id", async (req, res) => {
  await pool.query("DELETE FROM movie WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});

//series
app.get("/series", async (req, res) => {
  const result = await pool.query("SELECT * FROM series");
  res.json(result.rows);
});

app.get("/series/:id", async (req, res) => {
  const result = await pool.query("SELECT * FROM series WHERE id=$1", [req.params.id]);
  res.json(result.rows[0]);
});

app.post("/series", async (req, res) => {
  const { media_id } = req.body;
  const result = await pool.query(
    "INSERT INTO series (media_id) VALUES ($1) RETURNING *",
    [media_id]
  );
  res.json(result.rows[0]);
});

app.put("/series/:id", async (req, res) => {
  const { media_id } = req.body;
  const result = await pool.query(
    "UPDATE series SET media_id=$1 WHERE id=$2 RETURNING *",
    [media_id, req.params.id]
  );
  res.json(result.rows[0]);
});

app.delete("/series/:id", async (req, res) => {
  await pool.query("DELETE FROM series WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});

//season
app.get("/season", async (req, res) => {
  res.json((await pool.query("SELECT * FROM season")).rows);
});

app.get("/season/:id", async (req, res) => {
  const result = await pool.query("SELECT * FROM season WHERE id=$1", [req.params.id]);
  res.json(result.rows[0]);
});

app.post("/season", async (req, res) => {
  const { series_id, number, imdb_rating, user_rating } = req.body;
  const result = await pool.query(
    "INSERT INTO season (series_id, number, imdb_rating, user_rating) VALUES ($1,$2,$3,$4) RETURNING *",
    [series_id, number, imdb_rating, user_rating]
  );
  res.json(result.rows[0]);
});

app.put("/season/:id", async (req, res) => {
  const { series_id, number, imdb_rating, user_rating } = req.body;
  const result = await pool.query(
    "UPDATE season SET series_id=$1, number=$2, imdb_rating=$3, user_rating=$4 WHERE id=$5 RETURNING *",
    [series_id, number, imdb_rating, user_rating, req.params.id]
  );
  res.json(result.rows[0]);
});

app.delete("/season/:id", async (req, res) => {
  await pool.query("DELETE FROM season WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});


// episode
app.get("/episode", async (req, res) => {
  res.json((await pool.query("SELECT * FROM episode")).rows);
});

app.get("/episode/:id", async (req, res) => {
  const result = await pool.query("SELECT * FROM episode WHERE id=$1", [req.params.id]);
  res.json(result.rows[0]);
});

app.post("/episode", async (req, res) => {
  const { season_id, number, imdb_rating, user_rating } = req.body;
  const result = await pool.query(
    "INSERT INTO episode (season_id, number, imdb_rating, user_rating) VALUES ($1,$2,$3,$4) RETURNING *",
    [season_id, number, imdb_rating, user_rating]
  );
  res.json(result.rows[0]);
});

app.put("/episode/:id", async (req, res) => {
  const { season_id, number, imdb_rating, user_rating } = req.body;
  const result = await pool.query(
    "UPDATE episode SET season_id=$1, number=$2, imdb_rating=$3, user_rating=$4 WHERE id=$5 RETURNING *",
    [season_id, number, imdb_rating, user_rating, req.params.id]
  );
  res.json(result.rows[0]);
});

app.delete("/episode/:id", async (req, res) => {
  await pool.query("DELETE FROM episode WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});


//post or review
app.get("/review", async (req, res) => {
  res.json((await pool.query("SELECT * FROM review")).rows);
});

app.get("/review/:id", async (req, res) => {
  const result = await pool.query("SELECT * FROM review WHERE id=$1", [req.params.id]);
  res.json(result.rows[0]);
});

app.post("/review", async (req, res) => {
  const { user_id, media_id, season_id, episode_id, star_point, description, upvote, downvote } = req.body;
  const result = await pool.query(
    "INSERT INTO review (user_id, media_id, season_id, episode_id, star_point, description, upvote, downvote) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
    [user_id, media_id, season_id, episode_id, star_point, description, upvote ?? 0, downvote ?? 0]
  );
  res.json(result.rows[0]);
});

app.put("/review/:id", async (req, res) => {
  const { user_id, media_id, season_id, episode_id, star_point, description, upvote, downvote } = req.body;
  const result = await pool.query(
    "UPDATE review SET user_id=$1, media_id=$2, season_id=$3, episode_id=$4, star_point=$5, description=$6, upvote=$7, downvote=$8 WHERE id=$9 RETURNING *",
    [user_id, media_id, season_id, episode_id, star_point, description, upvote, downvote, req.params.id]
  );
  res.json(result.rows[0]);
});

app.delete("/review/:id", async (req, res) => {
  await pool.query("DELETE FROM review WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});


//reply
app.get("/reply", async (req, res) => {
  res.json((await pool.query("SELECT * FROM reply")).rows);
});

app.get("/reply/:id", async (req, res) => {
  const result = await pool.query("SELECT * FROM reply WHERE id=$1", [req.params.id]);
  res.json(result.rows[0]);
});

app.post("/reply", async (req, res) => {
  const { user_id, parent_review_id, parent_reply_id, description, upvote, downvote } = req.body;
  const result = await pool.query(
    "INSERT INTO reply (user_id, parent_review_id, parent_reply_id, description, upvote, downvote) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
    [user_id, parent_review_id, parent_reply_id, description, upvote ?? 0, downvote ?? 0]
  );
  res.json(result.rows[0]);
});

app.put("/reply/:id", async (req, res) => {
  const { user_id, parent_review_id, parent_reply_id, description, upvote, downvote } = req.body;
  const result = await pool.query(
    "UPDATE reply SET user_id=$1, parent_review_id=$2, parent_reply_id=$3, description=$4, upvote=$5, downvote=$6 WHERE id=$7 RETURNING *",
    [user_id, parent_review_id, parent_reply_id, description, upvote, downvote, req.params.id]
  );
  res.json(result.rows[0]);
});

app.delete("/reply/:id", async (req, res) => {
  await pool.query("DELETE FROM reply WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});

//watchlist
app.get("/watchlist", async (req, res) => {
  res.json((await pool.query("SELECT * FROM watchlist")).rows);
});

app.get("/watchlist/:user_id/:media_id", async (req, res) => {
  const { user_id, media_id } = req.params;
  const result = await pool.query(
    "SELECT * FROM watchlist WHERE user_id=$1 AND media_id=$2",
    [user_id, media_id]
  );
  res.json(result.rows[0]);
});

app.post("/watchlist", async (req, res) => {
  const { user_id, media_id } = req.body;
  const result = await pool.query(
    "INSERT INTO watchlist (user_id, media_id) VALUES ($1,$2) RETURNING *",
    [user_id, media_id]
  );
  res.json(result.rows[0]);
});

app.put("/watchlist/:user_id/:media_id", async (req, res) => {
  const { user_id, media_id } = req.params;
  const { new_user_id, new_media_id } = req.body;
  const result = await pool.query(
    "UPDATE watchlist SET user_id=$1, media_id=$2 WHERE user_id=$3 AND media_id=$4 RETURNING *",
    [new_user_id ?? user_id, new_media_id ?? media_id, user_id, media_id]
  );
  res.json(result.rows[0]);
});

app.delete("/watchlist/:user_id/:media_id", async (req, res) => {
  const { user_id, media_id } = req.params;
  await pool.query("DELETE FROM watchlist WHERE user_id=$1 AND media_id=$2", [user_id, media_id]);
  res.sendStatus(204);
});


app.listen(5000, () => {
    console.log("server has startled on port 5000");
});

/*

const express = require("express");
const app = express();
const pool = require("./db");

// middleware
app.use(express.json());

// =============================
// USERS
// =============================

app.get("/users", async (req, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});

app.get("/users/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

app.post("/users", async (req, res) => {
  const {
    username,
    name,
    email,
    password,
    profile_picture,
    is_banned
  } = req.body;

  const result = await pool.query(
    "INSERT INTO users (username, name, email, password, profile_picture, is_banned) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
    [username, name, email, password, profile_picture, is_banned ?? false]
  );

  res.json(result.rows[0]);
});

app.put("/users/:id", async (req, res) => {
  const {
    username,
    name,
    email,
    password,
    profile_picture,
    is_banned
  } = req.body;

  const result = await pool.query(
    "UPDATE users SET username=$1, name=$2, email=$3, password=$4, profile_picture=$5, is_banned=$6 WHERE id=$7 RETURNING *",
    [username, name, email, password, profile_picture, is_banned, req.params.id]
  );

  res.json(result.rows[0]);
});

app.delete("/users/:id", async (req, res) => {
  await pool.query("DELETE FROM users WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});


// =============================
// ADMIN
// =============================
// admin fields: user_id, role, granted_by

app.get("/admin", async (req, res) => {
  const result = await pool.query("SELECT * FROM admin");
  res.json(result.rows);
});

app.get("/admin/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM admin WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

app.post("/admin", async (req, res) => {
  const { user_id, role, granted_by } = req.body;

  const result = await pool.query(
    "INSERT INTO admin (user_id, role, granted_by) VALUES ($1,$2,$3) RETURNING *",
    [user_id, role, granted_by]
  );

  res.json(result.rows[0]);
});

app.put("/admin/:id", async (req, res) => {
  const { user_id, role, granted_by } = req.body;

  const result = await pool.query(
    "UPDATE admin SET user_id=$1, role=$2, granted_by=$3 WHERE id=$4 RETURNING *",
    [user_id, role, granted_by, req.params.id]
  );

  res.json(result.rows[0]);
});

app.delete("/admin/:id", async (req, res) => {
  await pool.query("DELETE FROM admin WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});



// =============================
// ADMIN LOG
// =============================
// fields: admin_id, action, target_type, target_id, notes

app.get("/admin_log", async (req, res) => {
  const result = await pool.query("SELECT * FROM admin_log");
  res.json(result.rows);
});

app.get("/admin_log/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM admin_log WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

app.post("/admin_log", async (req, res) => {
  const { admin_id, action, target_type, target_id, notes } = req.body;

  const result = await pool.query(
    "INSERT INTO admin_log (admin_id, action, target_type, target_id, notes) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [admin_id, action, target_type, target_id, notes]
  );

  res.json(result.rows[0]);
});

app.put("/admin_log/:id", async (req, res) => {
  const { admin_id, action, target_type, target_id, notes } = req.body;

  const result = await pool.query(
    "UPDATE admin_log SET admin_id=$1, action=$2, target_type=$3, target_id=$4, notes=$5 WHERE id=$6 RETURNING *",
    [admin_id, action, target_type, target_id, notes, req.params.id]
  );

  res.json(result.rows[0]);
});

app.delete("/admin_log/:id", async (req, res) => {
  await pool.query("DELETE FROM admin_log WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});

// =============================
// USER BAN
// =============================
// fields: user_id, banned_by, reason, is_permanent, expires_at, lifted_at, lifted_by

app.get("/user_ban", async (req, res) => {
  const result = await pool.query("SELECT * FROM user_ban");
  res.json(result.rows);
});

app.get("/user_ban/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM user_ban WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

app.post("/user_ban", async (req, res) => {
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
    "INSERT INTO user_ban (user_id, banned_by, reason, is_permanent, expires_at, lifted_at, lifted_by) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
    [user_id, banned_by, reason, is_permanent, expires_at, lifted_at, lifted_by]
  );

  res.json(result.rows[0]);
});

app.put("/user_ban/:id", async (req, res) => {
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
    "UPDATE user_ban SET user_id=$1, banned_by=$2, reason=$3, is_permanent=$4, expires_at=$5, lifted_at=$6, lifted_by=$7 WHERE id=$8 RETURNING *",
    [user_id, banned_by, reason, is_permanent, expires_at, lifted_at, lifted_by, req.params.id]
  );

  res.json(result.rows[0]);
});

app.delete("/user_ban/:id", async (req, res) => {
  await pool.query("DELETE FROM user_ban WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});


// =============================
// REPORT
// =============================
// fields: reporter_id, review_id, reply_id, reason, status, actioned_by, actioned_at

app.get("/report", async (req, res) => {
  const result = await pool.query("SELECT * FROM report");
  res.json(result.rows);
});

app.get("/report/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM report WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

app.post("/report", async (req, res) => {
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
    "INSERT INTO report (reporter_id, review_id, reply_id, reason, status, actioned_by, actioned_at) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
    [reporter_id, review_id, reply_id, reason, status, actioned_by, actioned_at]
  );

  res.json(result.rows[0]);
});

app.put("/report/:id", async (req, res) => {
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
    "UPDATE report SET reporter_id=$1, review_id=$2, reply_id=$3, reason=$4, status=$5, actioned_by=$6, actioned_at=$7 WHERE id=$8 RETURNING *",
    [reporter_id, review_id, reply_id, reason, status, actioned_by, actioned_at, req.params.id]
  );

  res.json(result.rows[0]);
});

app.delete("/report/:id", async (req, res) => {
  await pool.query("DELETE FROM report WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});


// =============================
// GENRE
// =============================

app.get("/genre", async (req, res) => {
  const result = await pool.query("SELECT * FROM genre");
  res.json(result.rows);
});

app.get("/genre/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM genre WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

app.post("/genre", async (req, res) => {
  const { name } = req.body;

  const result = await pool.query(
    "INSERT INTO genre (name) VALUES ($1) RETURNING *",
    [name]
  );

  res.json(result.rows[0]);
});

app.put("/genre/:id", async (req, res) => {
  const { name } = req.body;

  const result = await pool.query(
    "UPDATE genre SET name=$1 WHERE id=$2 RETURNING *",
    [name, req.params.id]
  );

  res.json(result.rows[0]);
});

app.delete("/genre/:id", async (req, res) => {
  await pool.query("DELETE FROM genre WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});


// =============================
// PREFERENCE  (composite key)
// =============================

app.get("/preference", async (req, res) => {
  const result = await pool.query("SELECT * FROM preference");
  res.json(result.rows);
});

app.get("/preference/:user_id/:genre_id", async (req, res) => {
  const { user_id, genre_id } = req.params;
  const result = await pool.query(
    "SELECT * FROM preference WHERE user_id=$1 AND genre_id=$2",
    [user_id, genre_id]
  );
  res.json(result.rows[0]);
});

app.post("/preference", async (req, res) => {
  const { user_id, genre_id } = req.body;

  const result = await pool.query(
    "INSERT INTO preference (user_id, genre_id) VALUES ($1,$2) RETURNING *",
    [user_id, genre_id]
  );

  res.json(result.rows[0]);
});

app.put("/preference/:user_id/:genre_id", async (req, res) => {
  const { user_id, genre_id } = req.params;
  const { new_user_id, new_genre_id } = req.body;

  const result = await pool.query(
    "UPDATE preference SET user_id=$1, genre_id=$2 WHERE user_id=$3 AND genre_id=$4 RETURNING *",
    [new_user_id ?? user_id, new_genre_id ?? genre_id, user_id, genre_id]
  );

  res.json(result.rows[0]);
});

app.delete("/preference/:user_id/:genre_id", async (req, res) => {
  const { user_id, genre_id } = req.params;

  await pool.query(
    "DELETE FROM preference WHERE user_id=$1 AND genre_id=$2",
    [user_id, genre_id]
  );

  res.sendStatus(204);
});

// =============================
// PERSON
// =============================
// fields: name, occupation, picture, biography

app.get("/person", async (req, res) => {
  const result = await pool.query("SELECT * FROM person");
  res.json(result.rows);
});

app.get("/person/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM person WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

app.post("/person", async (req, res) => {
  const { name, occupation, picture, biography } = req.body;

  const result = await pool.query(
    "INSERT INTO person (name, occupation, picture, biography) VALUES ($1,$2,$3,$4) RETURNING *",
    [name, occupation, picture, biography]
  );

  res.json(result.rows[0]);
});

app.put("/person/:id", async (req, res) => {
  const { name, occupation, picture, biography } = req.body;

  const result = await pool.query(
    "UPDATE person SET name=$1, occupation=$2, picture=$3, biography=$4 WHERE id=$5 RETURNING *",
    [name, occupation, picture, biography, req.params.id]
  );

  res.json(result.rows[0]);
});

app.delete("/person/:id", async (req, res) => {
  await pool.query("DELETE FROM person WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});


// =============================
// FAN (composite PK: user_id, person_id)
// =============================

app.get("/fan", async (req, res) => {
  const result = await pool.query("SELECT * FROM fan");
  res.json(result.rows);
});

app.get("/fan/:user_id/:person_id", async (req, res) => {
  const { user_id, person_id } = req.params;

  const result = await pool.query(
    "SELECT * FROM fan WHERE user_id=$1 AND person_id=$2",
    [user_id, person_id]
  );

  res.json(result.rows[0]);
});

app.post("/fan", async (req, res) => {
  const { user_id, person_id } = req.body;

  const result = await pool.query(
    "INSERT INTO fan (user_id, person_id) VALUES ($1,$2) RETURNING *",
    [user_id, person_id]
  );

  res.json(result.rows[0]);
});

app.put("/fan/:user_id/:person_id", async (req, res) => {
  const { user_id, person_id } = req.params;
  const { new_user_id, new_person_id } = req.body;

  const result = await pool.query(
    "UPDATE fan SET user_id=$1, person_id=$2 WHERE user_id=$3 AND person_id=$4 RETURNING *",
    [new_user_id ?? user_id, new_person_id ?? person_id, user_id, person_id]
  );

  res.json(result.rows[0]);
});

app.delete("/fan/:user_id/:person_id", async (req, res) => {
  const { user_id, person_id } = req.params;

  await pool.query(
    "DELETE FROM fan WHERE user_id=$1 AND person_id=$2",
    [user_id, person_id]
  );

  res.sendStatus(204);
});


// =============================
// AWARD
// =============================

app.get("/award", async (req, res) => {
  const result = await pool.query("SELECT * FROM award");
  res.json(result.rows);
});

app.get("/award/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM award WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

app.post("/award", async (req, res) => {
  const { name, awarded_by, prize_money } = req.body;

  const result = await pool.query(
    "INSERT INTO award (name, awarded_by, prize_money) VALUES ($1,$2,$3) RETURNING *",
    [name, awarded_by, prize_money]
  );

  res.json(result.rows[0]);
});

app.put("/award/:id", async (req, res) => {
  const { name, awarded_by, prize_money } = req.body;

  const result = await pool.query(
    "UPDATE award SET name=$1, awarded_by=$2, prize_money=$3 WHERE id=$4 RETURNING *",
    [name, awarded_by, prize_money, req.params.id]
  );

  res.json(result.rows[0]);
});

app.delete("/award/:id", async (req, res) => {
  await pool.query("DELETE FROM award WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});


// =============================
// PERSON_AWARD (composite PK: person_id, award_id, year)
// =============================

app.get("/person_award", async (req, res) => {
  const result = await pool.query("SELECT * FROM person_award");
  res.json(result.rows);
});

app.get("/person_award/:person_id/:award_id/:year", async (req, res) => {
  const { person_id, award_id, year } = req.params;

  const result = await pool.query(
    "SELECT * FROM person_award WHERE person_id=$1 AND award_id=$2 AND year=$3",
    [person_id, award_id, year]
  );

  res.json(result.rows[0]);
});

app.post("/person_award", async (req, res) => {
  const { person_id, award_id, year } = req.body;

  const result = await pool.query(
    "INSERT INTO person_award (person_id, award_id, year) VALUES ($1,$2,$3) RETURNING *",
    [person_id, award_id, year]
  );

  res.json(result.rows[0]);
});

app.put("/person_award/:person_id/:award_id/:year", async (req, res) => {
  const { person_id, award_id, year } = req.params;
  const { new_person_id, new_award_id, new_year } = req.body;

  const result = await pool.query(
    "UPDATE person_award SET person_id=$1, award_id=$2, year=$3 WHERE person_id=$4 AND award_id=$5 AND year=$6 RETURNING *",
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

app.delete("/person_award/:person_id/:award_id/:year", async (req, res) => {
  const { person_id, award_id, year } = req.params;

  await pool.query(
    "DELETE FROM person_award WHERE person_id=$1 AND award_id=$2 AND year=$3",
    [person_id, award_id, year]
  );

  res.sendStatus(204);
});

// =============================
// MEDIA
// =============================
// fields: name, teaser_link, description, imdb_rating, user_rating,
// duration, added_by, last_updated_by
// (timestamps auto-set by database)

app.get("/media", async (req, res) => {
  const result = await pool.query("SELECT * FROM media");
  res.json(result.rows);
});

app.get("/media/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM media WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

app.post("/media", async (req, res) => {
  const {
    name,
    teaser_link,
    description,
    imdb_rating,
    user_rating,
    duration,
    added_by,
    last_updated_by
  } = req.body;

  const result = await pool.query(
    `INSERT INTO media 
    (name, teaser_link, description, imdb_rating, user_rating, duration, added_by, last_updated_by)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [
      name,
      teaser_link,
      description,
      imdb_rating,
      user_rating,
      duration,
      added_by,
      last_updated_by
    ]
  );

  res.json(result.rows[0]);
});

app.put("/media/:id", async (req, res) => {
  const {
    name,
    teaser_link,
    description,
    imdb_rating,
    user_rating,
    duration,
    added_by,
    last_updated_by
  } = req.body;

  const result = await pool.query(
    `UPDATE media 
     SET name=$1, teaser_link=$2, description=$3, imdb_rating=$4, user_rating=$5, 
         duration=$6, added_by=$7, last_updated_by=$8, updated_at=NOW()
     WHERE id=$9 RETURNING *`,
    [
      name,
      teaser_link,
      description,
      imdb_rating,
      user_rating,
      duration,
      added_by,
      last_updated_by,
      req.params.id
    ]
  );

  res.json(result.rows[0]);
});

app.delete("/media/:id", async (req, res) => {
  await pool.query("DELETE FROM media WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});


// =============================
// MOVIE
// =============================
// fields: media_id

app.get("/movie", async (req, res) => {
  const result = await pool.query("SELECT * FROM movie");
  res.json(result.rows);
});

app.get("/movie/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM movie WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

app.post("/movie", async (req, res) => {
  const { media_id } = req.body;

  const result = await pool.query(
    "INSERT INTO movie (media_id) VALUES ($1) RETURNING *",
    [media_id]
  );

  res.json(result.rows[0]);
});

app.put("/movie/:id", async (req, res) => {
  const { media_id } = req.body;

  const result = await pool.query(
    "UPDATE movie SET media_id=$1 WHERE id=$2 RETURNING *",
    [media_id, req.params.id]
  );

  res.json(result.rows[0]);
});

app.delete("/movie/:id", async (req, res) => {
  await pool.query("DELETE FROM movie WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});


// =============================
// SERIES
// =============================
// fields: media_id

app.get("/series", async (req, res) => {
  const result = await pool.query("SELECT * FROM series");
  res.json(result.rows);
});

app.get("/series/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM series WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

app.post("/series", async (req, res) => {
  const { media_id } = req.body;

  const result = await pool.query(
    "INSERT INTO series (media_id) VALUES ($1) RETURNING *",
    [media_id]
  );

  res.json(result.rows[0]);
});

app.put("/series/:id", async (req, res) => {
  const { media_id } = req.body;

  const result = await pool.query(
    "UPDATE series SET media_id=$1 WHERE id=$2 RETURNING *",
    [media_id, req.params.id]
  );

  res.json(result.rows[0]);
});

app.delete("/series/:id", async (req, res) => {
  await pool.query("DELETE FROM series WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});


// =============================
// SEASON
// =============================
// fields: series_id, number, imdb_rating, user_rating

app.get("/season", async (req, res) => {
  const result = await pool.query("SELECT * FROM season");
  res.json(result.rows);
});

app.get("/season/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM season WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

app.post("/season", async (req, res) => {
  const { series_id, number, imdb_rating, user_rating } = req.body;

  const result = await pool.query(
    "INSERT INTO season (series_id, number, imdb_rating, user_rating) VALUES ($1,$2,$3,$4) RETURNING *",
    [series_id, number, imdb_rating, user_rating]
  );

  res.json(result.rows[0]);
});

app.put("/season/:id", async (req, res) => {
  const { series_id, number, imdb_rating, user_rating } = req.body;

  const result = await pool.query(
    "UPDATE season SET series_id=$1, number=$2, imdb_rating=$3, user_rating=$4 WHERE id=$5 RETURNING *",
    [series_id, number, imdb_rating, user_rating, req.params.id]
  );

  res.json(result.rows[0]);
});

app.delete("/season/:id", async (req, res) => {
  await pool.query("DELETE FROM season WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});


// =============================
// EPISODE
// =============================
// fields: season_id, number, imdb_rating, user_rating

app.get("/episode", async (req, res) => {
  const result = await pool.query("SELECT * FROM episode");
  res.json(result.rows);
});

app.get("/episode/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM episode WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

app.post("/episode", async (req, res) => {
  const { season_id, number, imdb_rating, user_rating } = req.body;

  const result = await pool.query(
    "INSERT INTO episode (season_id, number, imdb_rating, user_rating) VALUES ($1,$2,$3,$4) RETURNING *",
    [season_id, number, imdb_rating, user_rating]
  );

  res.json(result.rows[0]);
});

app.put("/episode/:id", async (req, res) => {
  const { season_id, number, imdb_rating, user_rating } = req.body;

  const result = await pool.query(
    "UPDATE episode SET season_id=$1, number=$2, imdb_rating=$3, user_rating=$4 WHERE id=$5 RETURNING *",
    [season_id, number, imdb_rating, user_rating, req.params.id]
  );

  res.json(result.rows[0]);
});

app.delete("/episode/:id", async (req, res) => {
  await pool.query("DELETE FROM episode WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});

// =============================
// MEDIA_GENRE (composite PK: media_id, genre_id)
// =============================

app.get("/media_genre", async (req, res) => {
  const result = await pool.query("SELECT * FROM media_genre");
  res.json(result.rows);
});

app.get("/media_genre/:media_id/:genre_id", async (req, res) => {
  const { media_id, genre_id } = req.params;

  const result = await pool.query(
    "SELECT * FROM media_genre WHERE media_id=$1 AND genre_id=$2",
    [media_id, genre_id]
  );

  res.json(result.rows[0]);
});

app.post("/media_genre", async (req, res) => {
  const { media_id, genre_id } = req.body;

  const result = await pool.query(
    "INSERT INTO media_genre (media_id, genre_id) VALUES ($1,$2) RETURNING *",
    [media_id, genre_id]
  );

  res.json(result.rows[0]);
});

app.put("/media_genre/:media_id/:genre_id", async (req, res) => {
  const { media_id, genre_id } = req.params;
  const { new_media_id, new_genre_id } = req.body;

  const result = await pool.query(
    "UPDATE media_genre SET media_id=$1, genre_id=$2 WHERE media_id=$3 AND genre_id=$4 RETURNING *",
    [new_media_id ?? media_id, new_genre_id ?? genre_id, media_id, genre_id]
  );

  res.json(result.rows[0]);
});

app.delete("/media_genre/:media_id/:genre_id", async (req, res) => {
  const { media_id, genre_id } = req.params;

  await pool.query(
    "DELETE FROM media_genre WHERE media_id=$1 AND genre_id=$2",
    [media_id, genre_id]
  );

  res.sendStatus(204);
});


// =============================
// MEDIA_PERSONALITY
// =============================
// composite PK: media_id, person_id, role
// role restricted to: actor, director, writer, producer

app.get("/media_personality", async (req, res) => {
  const result = await pool.query("SELECT * FROM media_personality");
  res.json(result.rows);
});

app.get("/media_personality/:media_id/:person_id/:role", async (req, res) => {
  const { media_id, person_id, role } = req.params;

  const result = await pool.query(
    "SELECT * FROM media_personality WHERE media_id=$1 AND person_id=$2 AND role=$3",
    [media_id, person_id, role]
  );

  res.json(result.rows[0]);
});

app.post("/media_personality", async (req, res) => {
  const { media_id, person_id, role } = req.body;

  const result = await pool.query(
    "INSERT INTO media_personality (media_id, person_id, role) VALUES ($1,$2,$3) RETURNING *",
    [media_id, person_id, role]
  );

  res.json(result.rows[0]);
});

app.put("/media_personality/:media_id/:person_id/:role", async (req, res) => {
  const { media_id, person_id, role } = req.params;
  const { new_media_id, new_person_id, new_role } = req.body;

  const result = await pool.query(
    `UPDATE media_personality 
     SET media_id=$1, person_id=$2, role=$3 
     WHERE media_id=$4 AND person_id=$5 AND role=$6 RETURNING *`,
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

app.delete("/media_personality/:media_id/:person_id/:role", async (req, res) => {
  const { media_id, person_id, role } = req.params;

  await pool.query(
    "DELETE FROM media_personality WHERE media_id=$1 AND person_id=$2 AND role=$3",
    [media_id, person_id, role]
  );

  res.sendStatus(204);
});


// =============================
// MEDIA_AWARD (composite: media_id, award_id, year)
// =============================

app.get("/media_award", async (req, res) => {
  const result = await pool.query("SELECT * FROM media_award");
  res.json(result.rows);
});

app.get("/media_award/:media_id/:award_id/:year", async (req, res) => {
  const { media_id, award_id, year } = req.params;

  const result = await pool.query(
    "SELECT * FROM media_award WHERE media_id=$1 AND award_id=$2 AND year=$3",
    [media_id, award_id, year]
  );

  res.json(result.rows[0]);
});

app.post("/media_award", async (req, res) => {
  const { media_id, award_id, year } = req.body;

  const result = await pool.query(
    "INSERT INTO media_award (media_id, award_id, year) VALUES ($1,$2,$3) RETURNING *",
    [media_id, award_id, year]
  );

  res.json(result.rows[0]);
});

app.put("/media_award/:media_id/:award_id/:year", async (req, res) => {
  const { media_id, award_id, year } = req.params;
  const { new_media_id, new_award_id, new_year } = req.body;

  const result = await pool.query(
    `UPDATE media_award 
     SET media_id=$1, award_id=$2, year=$3
     WHERE media_id=$4 AND award_id=$5 AND year=$6
     RETURNING *`,
    [
      new_media_id ?? media_id,
      new_award_id ?? award_id,
      new_year ?? year,
      media_id,
      award_id,
      year
    ]
  );

  res.json(result.rows[0]);
});

app.delete("/media_award/:media_id/:award_id/:year", async (req, res) => {
  const { media_id, award_id, year } = req.params;

  await pool.query(
    "DELETE FROM media_award WHERE media_id=$1 AND award_id=$2 AND year=$3",
    [media_id, award_id, year]
  );

  res.sendStatus(204);
});

// =============================
// REVIEW
// =============================
// fields:
// user_id, media_id, season_id, episode_id,
// star_point, description, upvote, downvote,
// is_removed, removed_by
//
// NOTE: Your DB constraint:
// CHECK (num_nonnulls(media_id, season_id, episode_id) <= 1)
// => Frontend must ensure only ONE of these is non-null.

app.get("/review", async (req, res) => {
  const result = await pool.query("SELECT * FROM review");
  res.json(result.rows);
});

app.get("/review/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM review WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

app.post("/review", async (req, res) => {
  const {
    user_id,
    media_id,
    season_id,
    episode_id,
    star_point,
    description,
    upvote,
    downvote,
    is_removed,
    removed_by
  } = req.body;

  const result = await pool.query(
    `INSERT INTO review 
    (user_id, media_id, season_id, episode_id, star_point, description, upvote, downvote, is_removed, removed_by)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *`,
    [
      user_id,
      media_id,
      season_id,
      episode_id,
      star_point,
      description,
      upvote ?? 0,
      downvote ?? 0,
      is_removed ?? false,
      removed_by
    ]
  );

  res.json(result.rows[0]);
});

app.put("/review/:id", async (req, res) => {
  const {
    user_id,
    media_id,
    season_id,
    episode_id,
    star_point,
    description,
    upvote,
    downvote,
    is_removed,
    removed_by
  } = req.body;

  const result = await pool.query(
    `UPDATE review
     SET user_id=$1, media_id=$2, season_id=$3, episode_id=$4,
         star_point=$5, description=$6, upvote=$7, downvote=$8,
         is_removed=$9, removed_by=$10
     WHERE id=$11
     RETURNING *`,
    [
      user_id,
      media_id,
      season_id,
      episode_id,
      star_point,
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

app.delete("/review/:id", async (req, res) => {
  await pool.query("DELETE FROM review WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});


// =============================
// REPLY
// =============================
// fields:
// user_id, parent_review_id, parent_reply_id,
// description, upvote, downvote,
// is_removed, removed_by
//
// NOTE: Your DB constraint:
// Only ONE of (parent_review_id, parent_reply_id) can be non-null.

app.get("/reply", async (req, res) => {
  const result = await pool.query("SELECT * FROM reply");
  res.json(result.rows);
});

app.get("/reply/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM reply WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

app.post("/reply", async (req, res) => {
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
    (user_id, parent_review_id, parent_reply_id, description, upvote, downvote, is_removed, removed_by)
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

app.put("/reply/:id", async (req, res) => {
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

app.delete("/reply/:id", async (req, res) => {
  await pool.query("DELETE FROM reply WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});

// =============================
// WATCHLIST (composite PK: user_id, media_id)
// =============================

app.get("/watchlist", async (req, res) => {
  const result = await pool.query("SELECT * FROM watchlist");
  res.json(result.rows);
});

app.get("/watchlist/:user_id/:media_id", async (req, res) => {
  const { user_id, media_id } = req.params;

  const result = await pool.query(
    "SELECT * FROM watchlist WHERE user_id=$1 AND media_id=$2",
    [user_id, media_id]
  );

  res.json(result.rows[0]);
});

app.post("/watchlist", async (req, res) => {
  const { user_id, media_id } = req.body;

  const result = await pool.query(
    "INSERT INTO watchlist (user_id, media_id) VALUES ($1,$2) RETURNING *",
    [user_id, media_id]
  );

  res.json(result.rows[0]);
});

app.put("/watchlist/:user_id/:media_id", async (req, res) => {
  const { user_id, media_id } = req.params;
  const { new_user_id, new_media_id } = req.body;

  const result = await pool.query(
    "UPDATE watchlist SET user_id=$1, media_id=$2 WHERE user_id=$3 AND media_id=$4 RETURNING *",
    [new_user_id ?? user_id, new_media_id ?? media_id, user_id, media_id]
  );

  res.json(result.rows[0]);
});

app.delete("/watchlist/:user_id/:media_id", async (req, res) => {
  const { user_id, media_id } = req.params;

  await pool.query(
    "DELETE FROM watchlist WHERE user_id=$1 AND media_id=$2",
    [user_id, media_id]
  );

  res.sendStatus(204);
});


// =============================
// POST ATTACHMENTS (PK: post_id + attachment)
// =============================
// post_id references review(id)

app.get("/post_attachments", async (req, res) => {
  const result = await pool.query("SELECT * FROM post_attachments");
  res.json(result.rows);
});

app.get("/post_attachments/:post_id/:attachment", async (req, res) => {
  const { post_id, attachment } = req.params;

  const result = await pool.query(
    "SELECT * FROM post_attachments WHERE post_id=$1 AND attachment=$2",
    [post_id, attachment]
  );

  res.json(result.rows[0]);
});

app.post("/post_attachments", async (req, res) => {
  const { post_id, attachment } = req.body;

  const result = await pool.query(
    "INSERT INTO post_attachments (post_id, attachment) VALUES ($1,$2) RETURNING *",
    [post_id, attachment]
  );

  res.json(result.rows[0]);
});

app.put("/post_attachments/:post_id/:attachment", async (req, res) => {
  const { post_id, attachment } = req.params;
  const { new_post_id, new_attachment } = req.body;

  const result = await pool.query(
    "UPDATE post_attachments SET post_id=$1, attachment=$2 WHERE post_id=$3 AND attachment=$4 RETURNING *",
    [
      new_post_id ?? post_id,
      new_attachment ?? attachment,
      post_id,
      attachment
    ]
  );

  res.json(result.rows[0]);
});

app.delete("/post_attachments/:post_id/:attachment", async (req, res) => {
  const { post_id, attachment } = req.params;

  await pool.query(
    "DELETE FROM post_attachments WHERE post_id=$1 AND attachment=$2",
    [post_id, attachment]
  );

  res.sendStatus(204);
});


// =============================
// REPLY ATTACHMENTS (PK: reply_id + attachment)
// =============================
// reply_id references reply(id)

app.get("/reply_attachments", async (req, res) => {
  const result = await pool.query("SELECT * FROM reply_attachments");
  res.json(result.rows);
});

app.get("/reply_attachments/:reply_id/:attachment", async (req, res) => {
  const { reply_id, attachment } = req.params;

  const result = await pool.query(
    "SELECT * FROM reply_attachments WHERE reply_id=$1 AND attachment=$2",
    [reply_id, attachment]
  );

  res.json(result.rows[0]);
});

app.post("/reply_attachments", async (req, res) => {
  const { reply_id, attachment } = req.body;

  const result = await pool.query(
    "INSERT INTO reply_attachments (reply_id, attachment) VALUES ($1,$2) RETURNING *",
    [reply_id, attachment]
  );

  res.json(result.rows[0]);
});

app.put("/reply_attachments/:reply_id/:attachment", async (req, res) => {
  const { reply_id, attachment } = req.params;
  const { new_reply_id, new_attachment } = req.body;

  const result = await pool.query(
    "UPDATE reply_attachments SET reply_id=$1, attachment=$2 WHERE reply_id=$3 AND attachment=$4 RETURNING *",
    [
      new_reply_id ?? reply_id,
      new_attachment ?? attachment,
      reply_id,
      attachment
    ]
  );

  res.json(result.rows[0]);
});

app.delete("/reply_attachments/:reply_id/:attachment", async (req, res) => {
  const { reply_id, attachment } = req.params;

  await pool.query(
    "DELETE FROM reply_attachments WHERE reply_id=$1 AND attachment=$2",
    [reply_id, attachment]
  );

  res.sendStatus(204);
});

// =============================
// SERVER START
// =============================

app.listen(5000, () => {
  console.log("server has started on port 5000");
});

*/