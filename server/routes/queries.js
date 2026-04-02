const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userQuery = "SELECT * FROM users WHERE username = $1";
    const result = await pool.query(userQuery, [username]);

    if (result.rows.length === 0)
      return res.json({ success: false, error: "Invalid username or password" });

    const user = result.rows[0];

    if (user.password !== password)
      return res.json({ success: false, error: "Invalid username or password" });

    // Check if user is an admin
    const adminCheck = await pool.query(
      "SELECT * FROM admin WHERE user_id = $1",
      [user.id]
    );

    const isAdmin = adminCheck.rows.length > 0;

    delete user.password;

    res.json({ success: true, user, isAdmin });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: "Server error" });
  }
});

router.post("/auth/signup", async (req, res) => {
  const { username, name, email, password } = req.body;

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
      name,
      email,
      password,
      "",
      "",
    ]);

    const newUser = newUserRes.rows[0];

    delete newUser.password;

    res.json({ success: true, user: newUser, isAdmin: false });
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
         WHERE fan.user_id = $1 AND media_personality.role = 'actor'`,
        [userId]
      )
    ).rows;

    const directedByFavorites = (
      await pool.query(
        `SELECT DISTINCT media.*
         FROM fan
         JOIN media_personality ON media_personality.person_id = fan.person_id
         JOIN media ON media.id = media_personality.media_id
         WHERE fan.user_id = $1 AND media_personality.role = 'director'`,
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
      starStudded,
      directedByFavorites
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
    const actorsResult = await pool.query(
      `SELECT person.id, person.name, person.profile_image, person.occupation
       FROM fan
       JOIN person ON person.id = fan.person_id
       JOIN media_personality ON media_personality.person_id = person.id
       WHERE fan.user_id = $1 AND media_personality.role = 'actor'
       GROUP BY person.id, person.name, person.profile_image, person.occupation`,
      [userId]
    );

    const directorsResult = await pool.query(
      `SELECT person.id, person.name, person.profile_image, person.occupation
       FROM fan
       JOIN person ON person.id = fan.person_id
       JOIN media_personality ON media_personality.person_id = person.id
       WHERE fan.user_id = $1 AND media_personality.role = 'director'
       GROUP BY person.id, person.name, person.profile_image, person.occupation`,
      [userId]
    );

    res.json({
      success: true,
      actors: actorsResult.rows,
      directors: directorsResult.rows
    });
  } catch (err) {
    console.error("Error fetching favorite people:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add to watchlist
router.post("/watchlist/add/:userId/:mediaId", async (req, res) => {
  const { userId, mediaId } = req.params;

  try {
    const checkResult = await pool.query(
      "SELECT * FROM watchlist WHERE user_id = $1 AND media_id = $2",
      [userId, mediaId]
    );

    if (checkResult.rows.length > 0) {
      return res.json({ success: false, message: "Already in watchlist" });
    }

    await pool.query(
      "INSERT INTO watchlist (user_id, media_id) VALUES ($1, $2)",
      [userId, mediaId]
    );

    res.json({ success: true, message: "Added to watchlist" });
  } catch (err) {
    console.error("Error adding to watchlist:", err);
    res.json({ success: false, error: "Server error" });
  }
});

// Remove from watchlist
router.post("/watchlist/remove/:userId/:mediaId", async (req, res) => {
  const { userId, mediaId } = req.params;

  try {
    await pool.query(
      "DELETE FROM watchlist WHERE user_id = $1 AND media_id = $2",
      [userId, mediaId]
    );

    res.json({ success: true, message: "Removed from watchlist" });
  } catch (err) {
    console.error("Error removing from watchlist:", err);
    res.json({ success: false, error: "Server error" });
  }
});

// Check if in watchlist
router.get("/watchlist/check/:userId/:mediaId", async (req, res) => {
  const { userId, mediaId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM watchlist WHERE user_id = $1 AND media_id = $2",
      [userId, mediaId]
    );

    res.json({ inWatchlist: result.rows.length > 0 });
  } catch (err) {
    console.error("Error checking watchlist:", err);
    res.json({ inWatchlist: false });
  }
});

// Become a fan
router.post("/fan/add/:userId/:personId", async (req, res) => {
  const { userId, personId } = req.params;

  try {
    const checkResult = await pool.query(
      "SELECT * FROM fan WHERE user_id = $1 AND person_id = $2",
      [userId, personId]
    );

    if (checkResult.rows.length > 0) {
      return res.json({ success: false, message: "Already a fan" });
    }

    await pool.query(
      "INSERT INTO fan (user_id, person_id) VALUES ($1, $2)",
      [userId, personId]
    );

    res.json({ success: true, message: "Became a fan" });
  } catch (err) {
    console.error("Error becoming a fan:", err);
    res.json({ success: false, error: "Server error" });
  }
});

// Remove from fans
router.post("/fan/remove/:userId/:personId", async (req, res) => {
  const { userId, personId } = req.params;

  try {
    await pool.query(
      "DELETE FROM fan WHERE user_id = $1 AND person_id = $2",
      [userId, personId]
    );

    res.json({ success: true, message: "Removed from fans" });
  } catch (err) {
    console.error("Error removing fan:", err);
    res.json({ success: false, error: "Server error" });
  }
});

// Check if fan
router.get("/fan/check/:userId/:personId", async (req, res) => {
  const { userId, personId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM fan WHERE user_id = $1 AND person_id = $2",
      [userId, personId]
    );

    res.json({ isFan: result.rows.length > 0 });
  } catch (err) {
    console.error("Error checking fan status:", err);
    res.json({ isFan: false });
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

// Admin endpoints for creating new content

// Add new award
router.post("/admin/award/add", async (req, res) => {
  const { name, awarded_by, prize_money } = req.body;

  try {
    if (!name || !awarded_by) {
      return res.json({ success: false, error: "Name and awarded_by are required" });
    }

    const result = await pool.query(
      "INSERT INTO award (name, awarded_by, prize_money) VALUES ($1, $2, $3) RETURNING *",
      [name, awarded_by, prize_money || null]
    );

    res.json({ success: true, award: result.rows[0] });
  } catch (err) {
    console.error("Error adding award:", err);
    res.json({ success: false, error: "Server error" });
  }
});

// Add new person (actor/director)
router.post("/admin/person/add", async (req, res) => {
  const { name, occupation, profile_image, biography } = req.body;

  try {
    if (!name || !occupation) {
      return res.json({ success: false, error: "Name and occupation are required" });
    }

    const result = await pool.query(
      "INSERT INTO person (name, occupation, profile_image, biography) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, occupation, profile_image || null, biography || null]
    );

    res.json({ success: true, person: result.rows[0] });
  } catch (err) {
    console.error("Error adding person:", err);
    res.json({ success: false, error: "Server error" });
  }
});

// Add new media (movie or series)
router.post("/admin/media/add", async (req, res) => {
  const { name, media_type, teaser_link, thumbnail, description, imdb_rating, duration, release_date } = req.body;

  try {
    if (!name || !media_type || !release_date) {
      return res.json({ success: false, error: "Name, media_type, and release_date are required" });
    }

    const mediaResult = await pool.query(
      "INSERT INTO media (name, media_type, teaser_link, thumbnail, description, imdb_rating, duration, release_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [name, media_type, teaser_link || null, thumbnail || null, description || null, imdb_rating || null, duration || null, release_date]
    );

    const media = mediaResult.rows[0];

    // Create movie or series entry
    if (media_type === "movie") {
      await pool.query("INSERT INTO movie (media_id) VALUES ($1)", [media.id]);
    } else if (media_type === "series") {
      await pool.query("INSERT INTO series (media_id) VALUES ($1)", [media.id]);
    }

    res.json({ success: true, media });
  } catch (err) {
    console.error("Error adding media:", err);
    res.json({ success: false, error: "Server error" });
  }
});

// Add person award event
router.post("/admin/award-event/add-person", async (req, res) => {
  const { person_id, award_id, year } = req.body;

  try {
    if (!person_id || !award_id || !year) {
      return res.json({ success: false, error: "Person ID, award ID, and year are required" });
    }

    const result = await pool.query(
      "INSERT INTO person_award (person_id, award_id, year) VALUES ($1, $2, $3) RETURNING *",
      [person_id, award_id, year]
    );

    res.json({ success: true, personAward: result.rows[0] });
  } catch (err) {
    console.error("Error adding person award:", err);
    if (err.code === "23505") {
      res.json({ success: false, error: "This award entry already exists for this person and year" });
    } else {
      res.json({ success: false, error: "Server error" });
    }
  }
});

// Add media award event
router.post("/admin/award-event/add-media", async (req, res) => {
  const { media_id, award_id, year, result } = req.body;

  try {
    if (!media_id || !award_id || !year || !result) {
      return res.json({ success: false, error: "Media ID, award ID, year, and result are required" });
    }

    const queryResult = await pool.query(
      "INSERT INTO media_award (media_id, award_id, year, result) VALUES ($1, $2, $3, $4) RETURNING *",
      [media_id, award_id, year, result]
    );

    res.json({ success: true, mediaAward: queryResult.rows[0] });
  } catch (err) {
    console.error("Error adding media award:", err);
    if (err.code === "23505") {
      res.json({ success: false, error: "This award entry already exists for this media and year" });
    } else {
      res.json({ success: false, error: "Server error" });
    }
  }
});

// Add season to media (series)
router.post("/admin/season/add", async (req, res) => {
  const { media_id, number, title, description, thumbnail, release_date } = req.body;

  try {
    if (!media_id || !number) {
      return res.json({ success: false, error: "Media ID and season number are required" });
    }

    // Check if series exists
    const seriesCheck = await pool.query(
      "SELECT * FROM series WHERE media_id = $1",
      [media_id]
    );

    if (seriesCheck.rows.length === 0) {
      return res.json({ success: false, error: "This media is not a series" });
    }

    const series = seriesCheck.rows[0];

    const result = await pool.query(
      "INSERT INTO season (series_id, number, title, description, thumbnail, release_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [series.id, number, title || null, description || null, thumbnail || null, release_date || null]
    );

    res.json({ success: true, season: result.rows[0] });
  } catch (err) {
    console.error("Error adding season:", err);
    if (err.code === "23505") {
      res.json({ success: false, error: "This season number already exists for this series" });
    } else {
      res.json({ success: false, error: "Server error" });
    }
  }
});

// Add cast member or director to media
router.post("/admin/media-personality/add", async (req, res) => {
  const { media_id, person_id, role } = req.body;

  try {
    if (!media_id || !person_id || !role) {
      return res.json({ success: false, error: "Media ID, person ID, and role are required" });
    }

    if (!["actor", "director"].includes(role)) {
      return res.json({ success: false, error: "Role must be 'actor' or 'director'" });
    }

    const result = await pool.query(
      "INSERT INTO media_personality (media_id, person_id, role) VALUES ($1, $2, $3) RETURNING *",
      [media_id, person_id, role]
    );

    res.json({ success: true, mediaPersonality: result.rows[0] });
  } catch (err) {
    console.error("Error adding media personality:", err);
    if (err.code === "23505") {
      res.json({ success: false, error: "This person is already assigned this role in this media" });
    } else {
      res.json({ success: false, error: "Server error" });
    }
  }
});

// Add episode to season
router.post("/admin/episode/add", async (req, res) => {
  const { season_id, number, title, description, thumbnail, release_date, duration } = req.body;

  try {
    if (!season_id || !number) {
      return res.json({ success: false, error: "Season ID and episode number are required" });
    }

    const result = await pool.query(
      "INSERT INTO episode (season_id, number, title, description, thumbnail, release_date, duration) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [season_id, number, title || null, description || null, thumbnail || null, release_date || null, duration || null]
    );

    res.json({ success: true, episode: result.rows[0] });
  } catch (err) {
    console.error("Error adding episode:", err);
    if (err.code === "23505") {
      res.json({ success: false, error: "This episode number already exists for this season" });
    } else {
      res.json({ success: false, error: "Server error" });
    }
  }
});

module.exports = router;
