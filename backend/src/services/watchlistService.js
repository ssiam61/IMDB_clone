import pool from "../config/db.js";

export const addToWatchlist = async ({ user_id, media_id }) => {
  if (!user_id || !media_id) throw new Error("Missing user or media id");
  try {
    await pool.query(
      `INSERT INTO watchlist (user_id, media_id, created_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id, media_id) DO NOTHING`,
      [user_id, media_id]
    );
    return { message: "Added to watchlist" };
  } catch (error) {
    throw new Error("Failed to add to watchlist: " + error.message);
  }
};

export const getWatchlist = async (user_id) => {
  if (!user_id) throw new Error("Missing user id");
  try {
    const { rows } = await pool.query(
      `SELECT w.media_id, m.name, m.imdb_rating
       FROM watchlist w
       JOIN media m ON w.media_id = m.id
       WHERE w.user_id = $1
       ORDER BY w.created_at DESC`,
      [user_id]
    );
    return rows;
  } catch (error) {
    throw new Error("Failed to fetch watchlist: " + error.message);
  }
};

export const removeFromWatchlist = async ({ user_id, media_id }) => {
  if (!user_id || !media_id) throw new Error("Missing user or media id");
  try {
    await pool.query(
      `DELETE FROM watchlist WHERE user_id = $1 AND media_id = $2`,
      [user_id, media_id]
    );
    return { message: "Removed from watchlist" };
  } catch (error) {
    throw new Error("Failed to remove from watchlist: " + error.message);
  }
};
