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