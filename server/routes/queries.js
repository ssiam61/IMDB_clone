const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/auth/login", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const userQuery = "SELECT * FROM users WHERE username = $1";
    const result = await pool.query(userQuery, [username]);

    if (result.rows.length === 0)
      return res.json({ success: false, error: "Invalid username or password" });

    const user = result.rows[0];

    if (user.password !== password)
      return res.json({ success: false, error: "Invalid username or password" });

    let isAdmin = false;

    if (role === "admin") {
      const adminCheck = await pool.query(
        "SELECT * FROM admin WHERE user_id = $1",
        [user.id]
      );

      if (adminCheck.rows.length === 0)
        return res.json({ success: false, error: "This user is not an admin" });

      isAdmin = true;
    }

    delete user.password;

    res.json({ success: true, user, isAdmin });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: "Server error" });
  }
});

router.post("/auth/signup", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const existsCheck = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (existsCheck.rows.length > 0)
      return res.json({ success: false, error: "Username already taken" });

    const insertUser =
      "INSERT INTO users (username, name, email, password, profile_picture, bio) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *";

    const newUserRes = await pool.query(insertUser, [
      username,
      username,
      `${username}@example.com`,
      password,
      "",
      "",
    ]);

    const newUser = newUserRes.rows[0];
    let isAdmin = false;

    if (role === "admin") {
      await pool.query(
        "INSERT INTO admin (user_id, role) VALUES ($1,'moderator')",
        [newUser.id]
      );
      isAdmin = true;
    }

    delete newUser.password;

    res.json({ success: true, user: newUser, isAdmin });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: "Server error" });
  }
});

router.get("/home/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {

    const media = (await pool.query("SELECT * FROM media")).rows;

    const highlyRated = [...media].sort((a,b)=>b.user_rating - a.user_rating);

    const criticallyAcclaimed = [...media].sort((a,b)=>b.imdb_rating - a.imdb_rating);

    const watchlistMedia = (
      await pool.query(
        `SELECT media.*
         FROM watchlist 
         JOIN media ON media.id = watchlist.media_id
         WHERE watchlist.user_id = $1`,
        [userId]
      )
    ).rows;

    const awardWinners = (
      await pool.query(
        `SELECT DISTINCT media.*
         FROM media_award
         JOIN media ON media.id = media_award.media_id`
      )
    ).rows;

    const trending = (
      await pool.query(
        `SELECT media.*, COUNT(review.id) AS review_count
         FROM media 
         LEFT JOIN review ON review.media_id = media.id
         GROUP BY media.id
         ORDER BY review_count DESC`
      )
    ).rows;

    const recommended = (
      await pool.query(
        `SELECT DISTINCT media.*
         FROM preference
         JOIN media_genre ON media_genre.genre_id = preference.genre_id
         JOIN media ON media.id = media_genre.media_id
         WHERE preference.user_id = $1`,
        [userId]
      )
    ).rows;

    const starStudded = (
      await pool.query(
        `SELECT DISTINCT media.*
         FROM fan
         JOIN media_personality ON media_personality.person_id = fan.person_id
         JOIN media ON media.id = media_personality.media_id
         WHERE fan.user_id = $1`,
        [userId]
      )
    ).rows;

    res.json({
      success: true,
      allMedia: media,
      highlyRated,
      criticallyAcclaimed,
      watchlistMedia,
      awardWinners,
      trending,
      recommended,
      starStudded
    });

  } catch (err) {
    console.error(err);
    res.json({ success: false, error: "Server error" });
  }
});

router.get("/profile/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const userQuery =
      "SELECT id, username, name, email, profile_picture, bio, created_at FROM users WHERE id = $1";
    const userResult = await pool.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.json({ success: false, error: "User not found" });
    }

    const user = userResult.rows[0];

    const watchlistQuery = `
      SELECT media.id, media.name, media.thumbnail
      FROM watchlist
      JOIN media ON media.id = watchlist.media_id
      WHERE watchlist.user_id = $1
    `;
    const watchlistResult = await pool.query(watchlistQuery, [userId]);

    res.json({
      success: true,
      user,
      watchlist: watchlistResult.rows
    });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: "Server error" });
  }
});

router.get("/media/full/:id", async (req, res) => {
  const mediaId = req.params.id;

  try {
    const mediaResult = await pool.query(
      `SELECT * FROM media WHERE id = $1`,
      [mediaId]
    );

    if (mediaResult.rows.length === 0)
      return res.json({ success: false, error: "Media not found" });

    const media = mediaResult.rows[0];

    const directors = (
      await pool.query(
        `SELECT person.id, person.name, person.profile_image
         FROM media_personality
         JOIN person ON person.id = media_personality.person_id
         WHERE media_personality.media_id = $1 AND role = 'director'`,
        [mediaId]
      )
    ).rows;

    const cast = (
      await pool.query(
        `SELECT person.id, person.name, person.profile_image
         FROM media_personality
         JOIN person ON person.id = media_personality.person_id
         WHERE media_personality.media_id = $1 AND role = 'actor'`,
        [mediaId]
      )
    ).rows;

    const awards = (
      await pool.query(
        `SELECT award.name, award.awarded_by, media_award.year, media_award.result
         FROM media_award
         JOIN award ON award.id = media_award.award_id
         WHERE media_award.media_id = $1`,
        [mediaId]
      )
    ).rows;

    const seriesResult = await pool.query(
      `SELECT id FROM series WHERE media_id = $1`,
      [mediaId]
    );

    let seasons = [];
    if (seriesResult.rows.length > 0) {
      const seriesId = seriesResult.rows[0].id;

      seasons = (
        await pool.query(
          `SELECT id, number, title, thumbnail, imdb_rating, user_rating
           FROM season
           WHERE series_id = $1
           ORDER BY number ASC`,
          [seriesId]
        )
      ).rows;
    }

    res.json({
      success: true,
      media,
      directors,
      cast,
      awards,
      seasons
    });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: "Server error" });
  }
});

router.get("/season/full/:id", async (req, res) => {
  const seasonId = req.params.id;

  try {
    const seasonResult = await pool.query(
      `SELECT * FROM season WHERE id = $1`,
      [seasonId]
    );

    if (seasonResult.rows.length === 0)
      return res.json({ success: false, error: "Season not found" });

    const season = seasonResult.rows[0];

    const episodes = (
      await pool.query(
        `SELECT id, number, title, thumbnail, imdb_rating, user_rating
         FROM episode
         WHERE season_id = $1
         ORDER BY number ASC`,
        [seasonId]
      )
    ).rows;

    const allSeasons = (
      await pool.query(
        `SELECT id, number, title, thumbnail
         FROM season
         WHERE series_id = $1
         ORDER BY number ASC`,
        [season.series_id]
      )
    ).rows;

    const currentIndex = allSeasons.findIndex((s) => s.id == seasonId);

    res.json({
      success: true,
      season,
      episodes,
      allSeasons,
      currentIndex
    });

  } catch (err) {
    console.error(err);
    res.json({ success: false, error: "Server error" });
  }
});

router.get("/episode/full/:id", async (req, res) => {
  const episodeId = req.params.id;

  try {
    const epRes = await pool.query(
      `SELECT * FROM episode WHERE id = $1`,
      [episodeId]
    );

    if (epRes.rows.length === 0)
      return res.json({ success: false, error: "Episode not found" });

    const episode = epRes.rows[0];

    const allEpisodes = (
      await pool.query(
        `SELECT id, number, title, thumbnail, imdb_rating, user_rating
         FROM episode
         WHERE season_id = $1
         ORDER BY number ASC`,
        [episode.season_id]
      )
    ).rows;

    const currentIndex = allEpisodes.findIndex(ep => ep.id == episodeId);

    res.json({
      success: true,
      episode,
      allEpisodes,
      currentIndex
    });

  } catch (err) {
    console.error(err);
    res.json({ success: false, error: "Server error" });
  }
});

router.get("/person/full/:id", async (req, res) => {
  const personId = req.params.id;

  try {
    const personResult = await pool.query(
      `SELECT id, name, occupation, profile_image, biography 
       FROM person 
       WHERE id = $1`,
      [personId]
    );

    if (personResult.rows.length === 0)
      return res.json({ success: false, error: "Person not found" });

    const person = personResult.rows[0];

    const mediaRows = (
      await pool.query(
        `SELECT media.id, media.name, media.thumbnail
         FROM media_personality
         JOIN media ON media.id = media_personality.media_id
         WHERE media_personality.person_id = $1`,
        [personId]
      )
    ).rows;

    res.json({
      success: true,
      person,
      mediaList: mediaRows
    });

  } catch (err) {
    console.error(err);
    res.json({ success: false, error: "Server error" });
  }
});

router.get("/fan/user/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await pool.query(
      `
      SELECT 
        person.id,
        person.name,
        person.profile_image,
        person.occupation
      FROM fan
      JOIN person ON person.id = fan.person_id
      WHERE fan.user_id = $1
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching favorite actors:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/profile/update/:userId", async (req, res) => {
  const { userId } = req.params;
  const { name, email, bio } = req.body;

  try {
    if (!name || !email) {
      return res.json({
        success: false,
        error: "Name and email are required",
      });
    }

    const result = await pool.query(
      `UPDATE users 
       SET name = $1, email = $2, bio = $3
       WHERE id = $4
       RETURNING id, username, name, email, profile_picture, bio, created_at`,
      [name, email, bio || "", userId]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: false,
        error: "User not found",
      });
    }

    const updatedUser = result.rows[0];

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.json({
      success: false,
      error: "Server error while updating profile",
    });
  }
});


module.exports = router;
