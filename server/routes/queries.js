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

    await pool.query('BEGIN');
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

    await pool.query('COMMIT');
    res.json({ success: true, user: newUser, isAdmin: false });
  } catch (err) {
    await pool.query('ROLLBACK');
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

    await pool.query('BEGIN');
    await pool.query(
      "INSERT INTO watchlist (user_id, media_id) VALUES ($1, $2)",
      [userId, mediaId]
    );

    await pool.query('COMMIT');
    res.json({ success: true, message: "Added to watchlist" });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error adding to watchlist:", err);
    res.json({ success: false, error: "Server error" });
  }
});

router.post("/watchlist/remove/:userId/:mediaId", async (req, res) => {
  const { userId, mediaId } = req.params;

  try {
    await pool.query('BEGIN');
    await pool.query(
      "DELETE FROM watchlist WHERE user_id = $1 AND media_id = $2",
      [userId, mediaId]
    );

    await pool.query('COMMIT');
    res.json({ success: true, message: "Removed from watchlist" });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error removing from watchlist:", err);
    res.json({ success: false, error: "Server error" });
  }
});

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

    await pool.query('BEGIN');
    await pool.query(
      "INSERT INTO fan (user_id, person_id) VALUES ($1, $2)",
      [userId, personId]
    );

    await pool.query('COMMIT');
    res.json({ success: true, message: "Became a fan" });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error becoming a fan:", err);
    res.json({ success: false, error: "Server error" });
  }
});

router.post("/fan/remove/:userId/:personId", async (req, res) => {
  const { userId, personId } = req.params;

  try {
    await pool.query('BEGIN');
    await pool.query(
      "DELETE FROM fan WHERE user_id = $1 AND person_id = $2",
      [userId, personId]
    );

    await pool.query('COMMIT');
    res.json({ success: true, message: "Removed from fans" });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error removing fan:", err);
    res.json({ success: false, error: "Server error" });
  }
});

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

    await pool.query('BEGIN');
    const result = await pool.query(
      `UPDATE users 
       SET name = $1, email = $2, bio = $3
       WHERE id = $4
       RETURNING id, username, name, email, profile_picture, bio, created_at`,
      [name, email, bio || "", userId]
    );

    if (result.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.json({
        success: false,
        error: "User not found",
      });
    }

    const updatedUser = result.rows[0];

    await pool.query('COMMIT');
    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error updating profile:", err);
    res.json({
      success: false,
      error: "Server error while updating profile",
    });
  }
});


router.post("/admin/award/add", async (req, res) => {
  const { name, awarded_by, prize_money } = req.body;

  try {
    if (!name || !awarded_by) {
      return res.json({ success: false, error: "Name and awarded_by are required" });
    }

    await pool.query('BEGIN');
    const result = await pool.query(
      "INSERT INTO award (name, awarded_by, prize_money) VALUES ($1, $2, $3) RETURNING *",
      [name, awarded_by, prize_money || null]
    );

    await pool.query('COMMIT');
    res.json({ success: true, award: result.rows[0] });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error adding award:", err);
    res.json({ success: false, error: "Server error" });
  }
});

router.post("/admin/person/add", async (req, res) => {
  const { name, occupation, profile_image, biography } = req.body;

  try {
    if (!name || !occupation) {
      return res.json({ success: false, error: "Name and occupation are required" });
    }

    await pool.query('BEGIN');
    const result = await pool.query(
      "INSERT INTO person (name, occupation, profile_image, biography) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, occupation, profile_image || null, biography || null]
    );

    await pool.query('COMMIT');
    res.json({ success: true, person: result.rows[0] });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error adding person:", err);
    res.json({ success: false, error: "Server error" });
  }
});

router.post("/admin/media/add", async (req, res) => {
  const { name, media_type, teaser_link, thumbnail, description, imdb_rating, duration, release_date } = req.body;

  try {
    if (!name || !media_type || !release_date) {
      return res.json({ success: false, error: "Name, media_type, and release_date are required" });
    }

    await pool.query('BEGIN');
    const mediaResult = await pool.query(
      "INSERT INTO media (name, media_type, teaser_link, thumbnail, description, imdb_rating, duration, release_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [name, media_type, teaser_link || null, thumbnail || null, description || null, imdb_rating || null, duration || null, release_date]
    );

    const media = mediaResult.rows[0];

    if (media_type === "movie") {
      await pool.query("INSERT INTO movie (media_id) VALUES ($1)", [media.id]);
    } else if (media_type === "series") {
      await pool.query("INSERT INTO series (media_id) VALUES ($1)", [media.id]);
    }

    await pool.query('COMMIT');
    res.json({ success: true, media });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error adding media:", err);
    res.json({ success: false, error: "Server error" });
  }
});

router.post("/admin/award-event/add-person", async (req, res) => {
  const { person_id, award_id, year } = req.body;

  try {
    if (!person_id || !award_id || !year) {
      return res.json({ success: false, error: "Person ID, award ID, and year are required" });
    }

    await pool.query('BEGIN');
    const result = await pool.query(
      "INSERT INTO person_award (person_id, award_id, year) VALUES ($1, $2, $3) RETURNING *",
      [person_id, award_id, year]
    );

    await pool.query('COMMIT');
    res.json({ success: true, personAward: result.rows[0] });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error adding person award:", err);
    if (err.code === "23505") {
      res.json({ success: false, error: "This award entry already exists for this person and year" });
    } else {
      res.json({ success: false, error: "Server error" });
    }
  }
});

router.post("/admin/award-event/add-media", async (req, res) => {
  const { media_id, award_id, year, result } = req.body;

  try {
    if (!media_id || !award_id || !year || !result) {
      return res.json({ success: false, error: "Media ID, award ID, year, and result are required" });
    }

    await pool.query('BEGIN');
    const queryResult = await pool.query(
      "INSERT INTO media_award (media_id, award_id, year, result) VALUES ($1, $2, $3, $4) RETURNING *",
      [media_id, award_id, year, result]
    );

    await pool.query('COMMIT');
    res.json({ success: true, mediaAward: queryResult.rows[0] });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error adding media award:", err);
    if (err.code === "23505") {
      res.json({ success: false, error: "This award entry already exists for this media and year" });
    } else {
      res.json({ success: false, error: "Server error" });
    }
  }
});

router.post("/admin/season/add", async (req, res) => {
  const { media_id, number, title, description, thumbnail, release_date } = req.body;

  try {
    if (!media_id || !number) {
      return res.json({ success: false, error: "Media ID and season number are required" });
    }

    const seriesCheck = await pool.query(
      "SELECT * FROM series WHERE media_id = $1",
      [media_id]
    );

    if (seriesCheck.rows.length === 0) {
      return res.json({ success: false, error: "This media is not a series" });
    }

    const series = seriesCheck.rows[0];

    await pool.query('BEGIN');
    const result = await pool.query(
      "INSERT INTO season (series_id, number, title, description, thumbnail, release_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [series.id, number, title || null, description || null, thumbnail || null, release_date || null]
    );

    await pool.query('COMMIT');
    res.json({ success: true, season: result.rows[0] });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error adding season:", err);
    if (err.code === "23505") {
      res.json({ success: false, error: "This season number already exists for this series" });
    } else {
      res.json({ success: false, error: "Server error" });
    }
  }
});

router.post("/admin/media-personality/add", async (req, res) => {
  const { media_id, person_id, role } = req.body;

  try {
    if (!media_id || !person_id || !role) {
      return res.json({ success: false, error: "Media ID, person ID, and role are required" });
    }

    if (!["actor", "director"].includes(role)) {
      return res.json({ success: false, error: "Role must be 'actor' or 'director'" });
    }

    await pool.query('BEGIN');
    const result = await pool.query(
      "INSERT INTO media_personality (media_id, person_id, role) VALUES ($1, $2, $3) RETURNING *",
      [media_id, person_id, role]
    );

    await pool.query('COMMIT');
    res.json({ success: true, mediaPersonality: result.rows[0] });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error adding media personality:", err);
    if (err.code === "23505") {
      res.json({ success: false, error: "This person is already assigned this role in this media" });
    } else {
      res.json({ success: false, error: "Server error" });
    }
  }
});

router.post("/admin/episode/add", async (req, res) => {
  const { season_id, number, title, description, thumbnail, release_date, duration } = req.body;

  try {
    if (!season_id || !number) {
      return res.json({ success: false, error: "Season ID and episode number are required" });
    }

    await pool.query('BEGIN');
    const result = await pool.query(
      "INSERT INTO episode (season_id, number, title, description, thumbnail, release_date, duration) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [season_id, number, title || null, description || null, thumbnail || null, release_date || null, duration || null]
    );

    await pool.query('COMMIT');
    res.json({ success: true, episode: result.rows[0] });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error adding episode:", err);
    if (err.code === "23505") {
      res.json({ success: false, error: "This episode number already exists for this season" });
    } else {
      res.json({ success: false, error: "Server error" });
    }
  }
});

router.put("/admin/media/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, imdb_rating, duration, release_date, teaser_link, thumbnail } = req.body;

  try {
    if (!name) {
      return res.json({ success: false, error: "Media name is required" });
    }

    await pool.query('BEGIN');
    const result = await pool.query(
      "UPDATE media SET name=$1, description=$2, imdb_rating=$3, duration=$4, release_date=$5, teaser_link=$6, thumbnail=$7 WHERE id=$8 RETURNING *",
      [name, description || null, imdb_rating || null, duration || null, release_date || null, teaser_link || null, thumbnail || null, id]
    );

    if (result.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.json({ success: false, error: "Media not found" });
    }

    await pool.query('COMMIT');
    res.json({ success: true, media: result.rows[0] });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error editing media:", err);
    res.json({ success: false, error: "Server error" });
  }
});

router.put("/admin/season/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { number, title, release_date } = req.body;

  try {
    if (!number || !release_date) {
      return res.json({ success: false, error: "Season number and release date are required" });
    }

    await pool.query('BEGIN');
    const result = await pool.query(
      "UPDATE season SET number=$1, title=$2, release_date=$3 WHERE id=$4 RETURNING *",
      [number, title || null, release_date, id]
    );

    if (result.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.json({ success: false, error: "Season not found" });
    }

    await pool.query('COMMIT');
    res.json({ success: true, season: result.rows[0] });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error editing season:", err);
    res.json({ success: false, error: "Server error" });
  }
});

router.put("/admin/person/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { name, biography, profile_image } = req.body;

  try {
    if (!name) {
      return res.json({ success: false, error: "Person name is required" });
    }

    await pool.query('BEGIN');
    const result = await pool.query(
      "UPDATE person SET name=$1, biography=$2, profile_image=$3 WHERE id=$4 RETURNING *",
      [name, biography || null, profile_image || null, id]
    );

    if (result.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.json({ success: false, error: "Person not found" });
    }

    await pool.query('COMMIT');
    res.json({ success: true, person: result.rows[0] });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error editing person:", err);
    res.json({ success: false, error: "Server error" });
  }
});


router.delete("/watchlist/remove/:userId/:mediaId", async (req, res) => {
  const { userId, mediaId } = req.params;

  try {
    await pool.query('BEGIN');
    const result = await pool.query(
      "DELETE FROM watchlist WHERE user_id=$1 AND media_id=$2 RETURNING *",
      [userId, mediaId]
    );

    if (result.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.json({ success: false, error: "Not in watchlist" });
    }

    await pool.query('COMMIT');
    res.json({ success: true, message: "Removed from watchlist" });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error removing from watchlist:", err);
    res.json({ success: false, error: "Server error" });
  }
});

router.delete("/fan/remove/:userId/:personId", async (req, res) => {
  const { userId, personId } = req.params;

  try {
    await pool.query('BEGIN');
    const result = await pool.query(
      "DELETE FROM fan WHERE user_id=$1 AND person_id=$2 RETURNING *",
      [userId, personId]
    );

    if (result.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.json({ success: false, error: "Not a fan" });
    }

    await pool.query('COMMIT');
    res.json({ success: true, message: "Unfollowed" });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error removing fan:", err);
    res.json({ success: false, error: "Server error" });
  }
});

router.delete("/admin/media-personality/remove/:mediaId/:personId", async (req, res) => {
  const { mediaId, personId } = req.params;

  try {
    await pool.query('BEGIN');
    const result = await pool.query(
      "DELETE FROM media_personality WHERE media_id=$1 AND person_id=$2 RETURNING *",
      [mediaId, personId]
    );

    if (result.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.json({ success: false, error: "Not found in media" });
    }

    await pool.query('COMMIT');
    res.json({ success: true, message: "Removed from media" });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error removing from media:", err);
    res.json({ success: false, error: "Server error" });
  }
});

router.delete("/admin/season/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('BEGIN');
    const result = await pool.query(
      "DELETE FROM season WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.json({ success: false, error: "Season not found" });
    }

    await pool.query('COMMIT');
    res.json({ success: true, message: "Season deleted" });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error deleting season:", err);
    res.json({ success: false, error: "Server error" });
  }
});

router.delete("/admin/episode/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('BEGIN');
    const result = await pool.query(
      "DELETE FROM episode WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.json({ success: false, error: "Episode not found" });
    }

    await pool.query('COMMIT');
    res.json({ success: true, message: "Episode deleted" });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error deleting episode:", err);
    res.json({ success: false, error: "Server error" });
  }
});

router.delete("/admin/media/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('BEGIN');
    const result = await pool.query(
      "DELETE FROM media WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.json({ success: false, error: "Media not found" });
    }

    await pool.query('COMMIT');
    res.json({ success: true, message: "Media deleted" });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error deleting media:", err);
    res.json({ success: false, error: "Server error" });
  }
});

router.delete("/admin/award/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('BEGIN');
    const result = await pool.query(
      "DELETE FROM award WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.json({ success: false, error: "Award not found" });
    }

    await pool.query('COMMIT');
    res.json({ success: true, message: "Award deleted" });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error deleting award:", err);
    res.json({ success: false, error: "Server error" });
  }
});

router.delete("/admin/person/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('BEGIN');
    const result = await pool.query(
      "DELETE FROM person WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.json({ success: false, error: "Person not found" });
    }

    await pool.query('COMMIT');
    res.json({ success: true, message: "Person deleted" });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error deleting person:", err);
    res.json({ success: false, error: "Server error" });
  }
});


const fetchRepliesForReview = async (reviewOrReplyId, isParentReply = false, userId = null) => {
  try {
    const repliesQuery = isParentReply
      ? `SELECT r.*, u.username, u.profile_picture
         FROM reply r
         JOIN users u ON u.id = r.user_id
         WHERE r.parent_reply_id = $1 AND r.is_removed = false
         ORDER BY r.created_at ASC`
      : `SELECT r.*, u.username, u.profile_picture
         FROM reply r
         JOIN users u ON u.id = r.user_id
         WHERE r.parent_review_id = $1 AND r.parent_reply_id IS NULL AND r.is_removed = false
         ORDER BY r.created_at ASC`;

    const repliesResult = await pool.query(repliesQuery, [reviewOrReplyId]);
    const replies = repliesResult.rows;

    for (let reply of replies) {
      reply.type = 'reply'; 
      const attachmentsQuery = "SELECT attachment FROM reply_attachments WHERE reply_id = $1";
      const attachmentsResult = await pool.query(attachmentsQuery, [reply.id]);
      reply.attachments = attachmentsResult.rows.map(row => row.attachment);

      if (userId) {
        const userVoteResult = await pool.query(
          "SELECT vote_type FROM reply_votes WHERE user_id = $1 AND reply_id = $2",
          [userId, reply.id]
        );
        reply.userVote = userVoteResult.rows.length > 0 ? userVoteResult.rows[0].vote_type : null;
      }

      reply.replies = await fetchRepliesForReview(reply.id, true, userId);
    }

    return replies;
  } catch (err) {
    console.error("Error fetching replies:", err);
    return [];
  }
};

router.get("/review/media/:mediaId", async (req, res) => {
  const { mediaId } = req.params;
  const userId = req.query.userId; 

  try {
    const reviewsQuery = `
      SELECT r.*, u.username, u.profile_picture
      FROM review r
      JOIN users u ON u.id = r.user_id
      WHERE r.media_id = $1 AND r.is_removed = false
      ORDER BY r.created_at DESC
    `;
    
    const reviewsResult = await pool.query(reviewsQuery, [mediaId]);
    const reviews = reviewsResult.rows;

    for (let review of reviews) {
      review.type = 'review'; 
      const attachmentsQuery = "SELECT attachment FROM post_attachments WHERE post_id = $1";
      const attachmentsResult = await pool.query(attachmentsQuery, [review.id]);
      review.attachments = attachmentsResult.rows.map(row => row.attachment);

      if (userId) {
        const userVoteResult = await pool.query(
          "SELECT vote_type FROM review_votes WHERE user_id = $1 AND review_id = $2",
          [userId, review.id]
        );
        review.userVote = userVoteResult.rows.length > 0 ? userVoteResult.rows[0].vote_type : null;
      }

      review.replies = await fetchRepliesForReview(review.id, false, userId);
    }

    res.json({ success: true, reviews });
  } catch (err) {
    console.error("MEDIA REVIEW ROUTE ERROR:", err.message);
    console.error("FULL ERROR:", err.stack);
    res.json({ success: false, error: err.message });
  }
});

router.get("/review/season/:seasonId", async (req, res) => {
  const { seasonId } = req.params;
  const userId = req.query.userId;

  try {
    const reviewsQuery = `
      SELECT r.*, u.username, u.profile_picture
      FROM review r
      JOIN users u ON u.id = r.user_id
      WHERE r.season_id = $1 AND r.is_removed = false
      ORDER BY r.created_at DESC
    `;
    
    const reviewsResult = await pool.query(reviewsQuery, [seasonId]);
    const reviews = reviewsResult.rows;

    for (let review of reviews) {
      review.type = 'review'; 
      const attachmentsQuery = "SELECT attachment FROM post_attachments WHERE post_id = $1";
      const attachmentsResult = await pool.query(attachmentsQuery, [review.id]);
      review.attachments = attachmentsResult.rows.map(row => row.attachment);

      if (userId) {
        const userVoteResult = await pool.query(
          "SELECT vote_type FROM review_votes WHERE user_id = $1 AND review_id = $2",
          [userId, review.id]
        );
        review.userVote = userVoteResult.rows.length > 0 ? userVoteResult.rows[0].vote_type : null;
      }

      review.replies = await fetchRepliesForReview(review.id, false, userId);
    }

    res.json({ success: true, reviews });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.json({ success: false, error: "Server error" });
  }
});

router.get("/review/episode/:episodeId", async (req, res) => {
  const { episodeId } = req.params;
  const userId = req.query.userId; 
  try {
    const reviewsQuery = `
      SELECT r.*, u.username, u.profile_picture
      FROM review r
      JOIN users u ON u.id = r.user_id
      WHERE r.episode_id = $1 AND r.is_removed = false
      ORDER BY r.created_at DESC
    `;
    
    const reviewsResult = await pool.query(reviewsQuery, [episodeId]);
    const reviews = reviewsResult.rows;

    for (let review of reviews) {
      review.type = 'review'; 
      const attachmentsQuery = "SELECT attachment FROM post_attachments WHERE post_id = $1";
      const attachmentsResult = await pool.query(attachmentsQuery, [review.id]);
      review.attachments = attachmentsResult.rows.map(row => row.attachment);

      if (userId) {
        const userVoteResult = await pool.query(
          "SELECT vote_type FROM review_votes WHERE user_id = $1 AND review_id = $2",
          [userId, review.id]
        );
        review.userVote = userVoteResult.rows.length > 0 ? userVoteResult.rows[0].vote_type : null;
      }

      review.replies = await fetchRepliesForReview(review.id, false, userId);
    }

    res.json({ success: true, reviews });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.json({ success: false, error: "Server error" });
  }
});

router.post("/review/create", async (req, res) => {
  const { userId, mediaId, seasonId, episodeId, starPoint, description, attachments } = req.body;

  try {
    if (!userId || !description) {
      return res.json({ success: false, error: "User ID and description are required" });
    }

    const providedCount = [mediaId, seasonId, episodeId].filter(v => v != null).length;
    if (providedCount !== 1) {
      return res.json({ success: false, error: "Exactly one of media_id, season_id, or episode_id is required" });
    }

    await pool.query('BEGIN');
    const reviewResult = await pool.query(
      `INSERT INTO review (user_id, media_id, season_id, episode_id, star_point, description)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, mediaId || null, seasonId || null, episodeId || null, starPoint || null, description]
    );

    const review = reviewResult.rows[0];

    if (attachments && attachments.length > 0) {
      for (let attachment of attachments) {
        await pool.query(
          "INSERT INTO post_attachments (post_id, attachment) VALUES ($1, $2)",
          [review.id, attachment]
        );
      }
    }

    const userResult = await pool.query("SELECT username, profile_picture FROM users WHERE id = $1", [userId]);
    if (userResult.rows.length > 0) {
      review.username = userResult.rows[0].username;
      review.profile_picture = userResult.rows[0].profile_picture;
    }
    review.type = 'review'; 
    review.attachments = attachments || [];
    review.replies = [];
    review.userVote = null; 
    await pool.query('COMMIT');
    res.json({ success: true, review });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error creating review:", err);
    res.json({ success: false, error: "Server error" });
  }
});

router.post("/reply/create", async (req, res) => {
  const { userId, parentReviewId, parentReplyId, description, attachments } = req.body;

  try {
    if (!userId || !description) {
      return res.json({ success: false, error: "User ID and description are required" });
    }

    if (!parentReviewId && !parentReplyId) {
      return res.json({ success: false, error: "Either parent_review_id or parent_reply_id is required" });
    }

    if (parentReviewId && parentReplyId) {
      return res.json({ success: false, error: "Cannot provide both parent_review_id and parent_reply_id" });
    }

    await pool.query('BEGIN');
    const replyResult = await pool.query(
      `INSERT INTO reply (user_id, parent_review_id, parent_reply_id, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, parentReviewId || null, parentReplyId || null, description]
    );

    const reply = replyResult.rows[0];

    if (attachments && attachments.length > 0) {
      for (let attachment of attachments) {
        await pool.query(
          "INSERT INTO reply_attachments (reply_id, attachment) VALUES ($1, $2)",
          [reply.id, attachment]
        );
      }
    }

    const userResult = await pool.query("SELECT username, profile_picture FROM users WHERE id = $1", [userId]);
    if (userResult.rows.length > 0) {
      reply.username = userResult.rows[0].username;
      reply.profile_picture = userResult.rows[0].profile_picture;
    }
    reply.type = 'reply'; 
    reply.attachments = attachments || [];
    reply.replies = [];
    reply.userVote = null;
    await pool.query('COMMIT');
    res.json({ success: true, reply });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error creating reply:", err);
    res.json({ success: false, error: "Server error" });
  }
});

router.put("/review/vote/:reviewId", async (req, res) => {
  const { reviewId } = req.params;
  const { userId, voteType } = req.body;

  try {
    if (!userId) {
      return res.json({ success: false, error: "User ID is required" });
    }

    if (!["upvote", "downvote", "remove"].includes(voteType)) {
      return res.json({ success: false, error: "Vote type must be 'upvote', 'downvote', or 'remove'" });
    }

    await pool.query('BEGIN');

    const reviewCheck = await pool.query("SELECT * FROM review WHERE id = $1", [reviewId]);
    if (reviewCheck.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.json({ success: false, error: "Review not found" });
    }
    const review = reviewCheck.rows[0];

    const existingVote = await pool.query(
      "SELECT vote_type FROM review_votes WHERE user_id = $1 AND review_id = $2",
      [userId, reviewId]
    );

    let upvoteChange = 0;
    let downvoteChange = 0;

    if (existingVote.rows.length > 0) {
      const previousVote = existingVote.rows[0].vote_type;

      if (voteType === "remove") {

        if (previousVote === "upvote") upvoteChange = -1;
        if (previousVote === "downvote") downvoteChange = -1;
        await pool.query("DELETE FROM review_votes WHERE user_id = $1 AND review_id = $2", [userId, reviewId]);
      } else if (voteType === previousVote) {

        if (voteType === "upvote") upvoteChange = -1;
        if (voteType === "downvote") downvoteChange = -1;
        await pool.query("DELETE FROM review_votes WHERE user_id = $1 AND review_id = $2", [userId, reviewId]);
      } else {

        if (previousVote === "upvote") upvoteChange = -1;
        if (previousVote === "downvote") downvoteChange = -1;
        if (voteType === "upvote") upvoteChange = 1;
        if (voteType === "downvote") downvoteChange = 1;
        await pool.query(
          "UPDATE review_votes SET vote_type = $1 WHERE user_id = $2 AND review_id = $3",
          [voteType, userId, reviewId]
        );
      }
    } else {
      if (voteType !== "remove") {
        if (voteType === "upvote") upvoteChange = 1;
        if (voteType === "downvote") downvoteChange = 1;
        await pool.query(
          "INSERT INTO review_votes (user_id, review_id, vote_type) VALUES ($1, $2, $3)",
          [userId, reviewId, voteType]
        );
      }
    }

    const updatedReview = await pool.query(
      "UPDATE review SET upvote = upvote + $1, downvote = downvote + $2 WHERE id = $3 RETURNING *",
      [upvoteChange, downvoteChange, reviewId]
    );

    const userVote = await pool.query(
      "SELECT vote_type FROM review_votes WHERE user_id = $1 AND review_id = $2",
      [userId, reviewId]
    );

    await pool.query('COMMIT');
    res.json({
      success: true,
      review: updatedReview.rows[0],
      userVote: userVote.rows.length > 0 ? userVote.rows[0].vote_type : null
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error updating review vote:", err);
    res.json({ success: false, error: "Server error" });
  }
});

router.put("/reply/vote/:replyId", async (req, res) => {
  const { replyId } = req.params;
  const { userId, voteType } = req.body;

  try {
    if (!userId) {
      return res.json({ success: false, error: "User ID is required" });
    }

    if (!["upvote", "downvote", "remove"].includes(voteType)) {
      return res.json({ success: false, error: "Vote type must be 'upvote', 'downvote', or 'remove'" });
    }

    await pool.query('BEGIN');
    const replyCheck = await pool.query("SELECT * FROM reply WHERE id = $1", [replyId]);
    if (replyCheck.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.json({ success: false, error: "Reply not found" });
    }
    const reply = replyCheck.rows[0];

    const existingVote = await pool.query(
      "SELECT vote_type FROM reply_votes WHERE user_id = $1 AND reply_id = $2",
      [userId, replyId]
    );

    let upvoteChange = 0;
    let downvoteChange = 0;

    if (existingVote.rows.length > 0) {
      const previousVote = existingVote.rows[0].vote_type;

      if (voteType === "remove") {
        if (previousVote === "upvote") upvoteChange = -1;
        if (previousVote === "downvote") downvoteChange = -1;
        await pool.query("DELETE FROM reply_votes WHERE user_id = $1 AND reply_id = $2", [userId, replyId]);
      } else if (voteType === previousVote) {
        if (voteType === "upvote") upvoteChange = -1;
        if (voteType === "downvote") downvoteChange = -1;
        await pool.query("DELETE FROM reply_votes WHERE user_id = $1 AND reply_id = $2", [userId, replyId]);
      } else {
        if (previousVote === "upvote") upvoteChange = -1;
        if (previousVote === "downvote") downvoteChange = -1;
        if (voteType === "upvote") upvoteChange = 1;
        if (voteType === "downvote") downvoteChange = 1;
        await pool.query(
          "UPDATE reply_votes SET vote_type = $1 WHERE user_id = $2 AND reply_id = $3",
          [voteType, userId, replyId]
        );
      }
    } else {
      if (voteType !== "remove") {
        if (voteType === "upvote") upvoteChange = 1;
        if (voteType === "downvote") downvoteChange = 1;
        await pool.query(
          "INSERT INTO reply_votes (user_id, reply_id, vote_type) VALUES ($1, $2, $3)",
          [userId, replyId, voteType]
        );
      }
    }

    const updatedReply = await pool.query(
      "UPDATE reply SET upvote = upvote + $1, downvote = downvote + $2 WHERE id = $3 RETURNING *",
      [upvoteChange, downvoteChange, replyId]
    );

    const userVote = await pool.query(
      "SELECT vote_type FROM reply_votes WHERE user_id = $1 AND reply_id = $2",
      [userId, replyId]
    );

    await pool.query('COMMIT');
    res.json({
      success: true,
      reply: updatedReply.rows[0],
      userVote: userVote.rows.length > 0 ? userVote.rows[0].vote_type : null
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error updating reply vote:", err);
    res.json({ success: false, error: "Server error" });
  }
});

router.delete("/review/:reviewId", async (req, res) => {
  const { reviewId } = req.params;
  const { userId, isAdmin } = req.body;

  try {
    await pool.query('BEGIN');
    const reviewResult = await pool.query("SELECT * FROM review WHERE id = $1", [reviewId]);

    if (reviewResult.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.json({ success: false, error: "Review not found" });
    }

    const review = reviewResult.rows[0];

    if (review.user_id !== parseInt(userId) && !isAdmin) {
      await pool.query('ROLLBACK');
      return res.json({ success: false, error: "Unauthorized" });
    }

    const deleteResult = await pool.query(
      "DELETE FROM review WHERE id = $1 RETURNING *",
      [reviewId]
    );

    await pool.query('COMMIT');
    res.json({ success: true, message: "Review deleted" });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error deleting review:", err);
    res.json({ success: false, error: "Server error" });
  }
});

router.delete("/reply/:replyId", async (req, res) => {
  const { replyId } = req.params;
  const { userId, isAdmin } = req.body;

  try {
    await pool.query('BEGIN');
    const replyResult = await pool.query("SELECT * FROM reply WHERE id = $1", [replyId]);

    if (replyResult.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.json({ success: false, error: "Reply not found" });
    }

    const reply = replyResult.rows[0];

    if (reply.user_id !== parseInt(userId) && !isAdmin) {
      await pool.query('ROLLBACK');
      return res.json({ success: false, error: "Unauthorized" });
    }

    const deleteResult = await pool.query(
      "DELETE FROM reply WHERE id = $1 RETURNING *",
      [replyId]
    );

    await pool.query('COMMIT');
    res.json({ success: true, message: "Reply deleted" });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error deleting reply:", err);
    res.json({ success: false, error: "Server error" });
  }
});

router.get("/search", async (req, res) => {
  const query = req.query.q;

  if (!query || query.trim().length === 0) {
    return res.json({ success: true, results: [] });
  }

  try {
    const searchPattern = `%${query}%`;

    const results = await pool.query(
      `
      (
        SELECT id, name, thumbnail, media_type as type, description
        FROM media
        WHERE name ILIKE $1 OR description ILIKE $1
      )
      UNION ALL
      (
        SELECT id, name, profile_image as thumbnail, 'person'::text as type, biography as description
        FROM person
        WHERE name ILIKE $1 OR biography ILIKE $1
      )
      LIMIT 10
      `,
      [searchPattern]
    );

    res.json({ success: true, results: results.rows });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: "Server error" });
  }
});


router.get("/profile/activity/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const reviewsResult = await pool.query(
      `
      SELECT
        r.id,
        r.description,
        r.star_point,
        r.created_at,
        r.media_id,
        r.season_id,
        r.episode_id,
        m.name AS media_name
      FROM review r
      LEFT JOIN media m ON m.id = r.media_id
      WHERE r.user_id = $1
        AND r.is_removed = false
      ORDER BY r.created_at DESC
      `,
      [userId]
    );

    const reviews = reviewsResult.rows.map(r => ({
      ...r,
      type: "review"
    }));

    const repliesResult = await pool.query(
      `
      SELECT
        rp.id,
        rp.description,
        rp.created_at,

        COALESCE(rv.id, rv_parent.id) AS parent_review_id,

        COALESCE(rv.media_id, rv_parent.media_id)   AS media_id,
        COALESCE(rv.season_id, rv_parent.season_id) AS season_id,
        COALESCE(rv.episode_id, rv_parent.episode_id) AS episode_id,

        m.name AS media_name
      FROM reply rp

      LEFT JOIN review rv
        ON rv.id = rp.parent_review_id

      LEFT JOIN reply parent_rp
        ON parent_rp.id = rp.parent_reply_id

      LEFT JOIN review rv_parent
        ON rv_parent.id = parent_rp.parent_review_id

      LEFT JOIN media m
        ON m.id = COALESCE(rv.media_id, rv_parent.media_id)

      WHERE rp.user_id = $1
        AND rp.is_removed = false

      ORDER BY rp.created_at DESC
      `,
      [userId]
    );

    const replies = repliesResult.rows.map(rp => ({
      ...rp,
      type: "reply"
    }));

    res.json({
      success: true,
      reviews,
      replies
    });
  } catch (err) {
    console.error("Error fetching profile activity:", err);
    res.json({ success: false, error: "Server error" });
  }
});

module.exports = router;
