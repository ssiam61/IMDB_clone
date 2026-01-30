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

app.post("/genre", async (req, res) => {
  const result = await pool.query("INSERT INTO genre (name) VALUES ($1) RETURNING *", [req.body.name]);
  res.json(result.rows[0]);
});

//person
app.get("/person", async (req, res) => {
  res.json((await pool.query("SELECT * FROM person")).rows);
});

app.post("/person", async (req, res) => {
  const { name, occupation, picture, biography } = req.body;
  res.json(
    (
      await pool.query(
        "INSERT INTO person (name, occupation, picture, biography) VALUES ($1,$2,$3,$4) RETURNING *",
        [name, occupation, picture, biography]
      )
    ).rows[0]
  );
});

//media 
app.get("/media", async (req, res) => {
  res.json((await pool.query("SELECT * FROM media")).rows);
});

app.post("/media", async (req, res) => {
  const { name, teaser_link, description, imdb_rating, user_rating, duration } = req.body;
  res.json(
    (
      await pool.query(
        "INSERT INTO media (name, teaser_link, description, imdb_rating, user_rating, duration) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
        [name, teaser_link, description, imdb_rating, user_rating, duration]
      )
    ).rows[0]
  );
});

//movie
app.get("/movie", async (req, res) => {
  res.json((await pool.query("SELECT * FROM movie")).rows);
});

app.post("/movie", async (req, res) => {
  res.json(
    (
      await pool.query("INSERT INTO movie (media_id) VALUES ($1) RETURNING *", [
        req.body.media_id
      ])
    ).rows[0]
  );
});

//series
app.get("/series", async (req, res) => {
  res.json((await pool.query("SELECT * FROM series")).rows);
});

app.post("/series", async (req, res) => {
  res.json(
    (
      await pool.query("INSERT INTO series (media_id) VALUES ($1) RETURNING *", [
        req.body.media_id
      ])
    ).rows[0]
  );
});

//season
app.get("/season", async (req, res) => {
  res.json((await pool.query("SELECT * FROM season")).rows);
});

app.post("/season", async (req, res) => {
  const { series_id, number, imdb_rating, user_rating } = req.body;
  res.json(
    (
      await pool.query(
        "INSERT INTO season (series_id, number, imdb_rating, user_rating) VALUES ($1,$2,$3,$4) RETURNING *",
        [series_id, number, imdb_rating, user_rating]
      )
    ).rows[0]
  );
});

// episode
app.get("/episode", async (req, res) => {
  res.json((await pool.query("SELECT * FROM episode")).rows);
});

app.post("/episode", async (req, res) => {
  const { season_id, number, imdb_rating, user_rating } = req.body;
  res.json(
    (
      await pool.query(
        "INSERT INTO episode (season_id, number, imdb_rating, user_rating) VALUES ($1,$2,$3,$4) RETURNING *",
        [season_id, number, imdb_rating, user_rating]
      )
    ).rows[0]
  );
});

//post or review
app.get("/review", async (req, res) => {
  res.json((await pool.query("SELECT * FROM review")).rows);
});

app.post("/review", async (req, res) => {
  const { user_id, media_id, season_id, episode_id, star_point, description } = req.body;
  res.json(
    (
      await pool.query(
        "INSERT INTO review (user_id, media_id, season_id, episode_id, star_point, description) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
        [user_id, media_id, season_id, episode_id, star_point, description]
      )
    ).rows[0]
  );
});

//reply
app.get("/reply", async (req, res) => {
  res.json((await pool.query("SELECT * FROM reply")).rows);
});

app.post("/reply", async (req, res) => {
  const { user_id, parent_review_id, parent_reply_id, description } = req.body;
  res.json(
    (
      await pool.query(
        "INSERT INTO reply (user_id, parent_review_id, parent_reply_id, description) VALUES ($1,$2,$3,$4) RETURNING *",
        [user_id, parent_review_id, parent_reply_id, description]
      )
    ).rows[0]
  );
});

//watchlist
app.get("/watchlist", async (req, res) => {
  res.json((await pool.query("SELECT * FROM watchlist")).rows);
});

app.post("/watchlist", async (req, res) => {
  const { user_id, media_id } = req.body;
  res.json(
    (
      await pool.query(
        "INSERT INTO watchlist (user_id, media_id) VALUES ($1,$2) RETURNING *",
        [user_id, media_id]
      )
    ).rows[0]
  );
});



app.listen(5000, () => {
    console.log("server has startled on port 5000");
});