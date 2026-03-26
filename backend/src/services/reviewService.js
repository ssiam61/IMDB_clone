import pool from "../config/db.js";

export const addReview = async ({ user_id, media_id, star_point, description }) => {
  if (star_point < 1 || star_point > 10) {
    throw new Error("star_point must be between 1 and 10");
  }
  const query = `
    INSERT INTO review (user_id, media_id, star_point, description, created_at)
    VALUES ($1, $2, $3, $4, NOW())
    RETURNING *
  `;
  const values = [user_id, media_id, star_point, description];
  try {
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    throw new Error("Failed to add review: " + error.message);
  }
};

export const getReviewsByMediaId = async (media_id) => {
  const query = `
    SELECT r.id, r.star_point, r.description, r.user_id, u.name, u.username
    FROM review r
    JOIN users u ON r.user_id = u.id
    WHERE r.media_id = $1
    ORDER BY r.created_at DESC
  `;
  try {
    const { rows } = await pool.query(query, [media_id]);
    return rows.map(row => ({
      id: row.id,
      star_point: row.star_point,
      description: row.description,
      user: {
        id: row.user_id,
        name: row.name,
        username: row.username
      }
    }));
  } catch (error) {
    throw new Error("Failed to fetch reviews: " + error.message);
  }
};
