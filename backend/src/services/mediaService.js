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


export const getFullMediaById = async (id) => {
  try {
    // 1. Get media basic info
    const mediaQuery = `SELECT * FROM media WHERE id = $1`;
    const mediaResult = await pool.query(mediaQuery, [id]);
    if (mediaResult.rows.length === 0) {
      return null;
    }
    const media = mediaResult.rows[0];

    // 2. Get genres
    const genresQuery = `
      SELECT g.name
      FROM genre g
      JOIN media_genre mg ON mg.genre_id = g.id
      WHERE mg.media_id = $1
    `;
    const genresResult = await pool.query(genresQuery, [id]);
    const genres = genresResult.rows.map(row => row.name);

    // 3. Get cast (people and their roles)
    const castQuery = `
      SELECT p.name, mp.role
      FROM person p
      JOIN media_personality mp ON mp.person_id = p.id
      WHERE mp.media_id = $1
    `;
    const castResult = await pool.query(castQuery, [id]);
    const cast = castResult.rows;

    // 4. Determine type (movie or series)
    const typeQuery = `
      SELECT 'movie' AS type FROM movie WHERE media_id = $1
      UNION ALL
      SELECT 'series' AS type FROM series WHERE media_id = $1
    `;
    const typeResult = await pool.query(typeQuery, [id]);
    let type = null;
    if (typeResult.rows.length > 0) {
      type = typeResult.rows[0].type;
    }

    return {
      media,
      genres,
      cast,
      type,
    };
  } catch (error) {
    throw new Error("Failed to fetch full media details: " + error.message);
  }
};
