import pool from "../config/db.js";

export const getAllMedia = async () => {
  const query = `SELECT id, name, imdb_rating, user_rating FROM media`;
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    throw new Error("Failed to fetch media: " + error.message);
  }
};

export const getMediaById = async (id) => {
  const query = `SELECT * FROM media WHERE id = $1`;
  try {
    const { rows } = await pool.query(query, [id]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (error) {
    throw new Error("Failed to fetch media by id: " + error.message);
  }
};
