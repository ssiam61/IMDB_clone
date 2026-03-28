import pool from '../config/db.js';

/**
 * Get user profile by ID (excludes password)
 * @param {number} userId
 * @returns {Promise<Object>} User profile with id, username, email
 */
export async function getUserProfile(userId) {
  const query = `
    SELECT id, username, email FROM users WHERE id = $1
  `;
  try {
    const { rows } = await pool.query(query, [userId]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (error) {
    throw new Error('Failed to fetch user profile: ' + error.message);
  }
}

/**
 * Get all reviews by a specific user with media information
 * @param {number} userId
 * @returns {Promise<Array>} Array of reviews with media name
 */
export async function getUserReviews(userId) {
  const query = `
    SELECT 
      r.id,
      r.media_id,
      m.name AS media_name,
      r.star_point,
      r.description
    FROM review r
    JOIN media m ON r.media_id = m.id
    WHERE r.user_id = $1 AND r.is_removed = FALSE
    ORDER BY r.created_at DESC
  `;
  try {
    const { rows } = await pool.query(query, [userId]);
    return rows;
  } catch (error) {
    throw new Error('Failed to fetch user reviews: ' + error.message);
  }
}
