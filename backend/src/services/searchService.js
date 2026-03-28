import pool from '../config/db.js';

/**
 * Search media by name (case-insensitive, partial match)
 * @param {string} query
 * @param {number} limit
 * @returns {Promise<Array>} Media results
 */
export async function searchMedia(query, limit = 20) {
  if (!query || query.trim() === '') return [];
  try {
    const sql = `SELECT id, name, description, imdb_rating FROM media WHERE name ILIKE $1 LIMIT $2`;
    const values = [`%${query}%`, limit];
    const { rows } = await pool.query(sql, values);
    return rows;
  } catch (err) {
    throw new Error('Database error');
  }
}
