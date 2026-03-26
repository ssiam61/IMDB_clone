// Vote on a review
export const voteReview = async ({ user_id, review_id, vote_type }) => {
  if (!user_id || !review_id || !["upvote", "downvote"].includes(vote_type)) {
    throw new Error("Invalid input");
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Insert or update vote
    await client.query(
      `INSERT INTO review_vote (user_id, review_id, vote_type)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, review_id)
       DO UPDATE SET vote_type = EXCLUDED.vote_type`,
      [user_id, review_id, vote_type]
    );

    // Count upvote and downvote
    const countRes = await client.query(
      `SELECT
         COUNT(*) FILTER (WHERE vote_type = 'upvote') AS upvote,
         COUNT(*) FILTER (WHERE vote_type = 'downvote') AS downvote
       FROM review_vote
       WHERE review_id = $1`,
      [review_id]
    );
    const { upvote, downvote } = countRes.rows[0];

    // Update review table
    await client.query(
      `UPDATE review SET upvote = $1, downvote = $2 WHERE id = $3`,
      [upvote, downvote, review_id]
    );

    await client.query('COMMIT');
    return { upvote: Number(upvote), downvote: Number(downvote) };
  } catch (error) {
    await client.query('ROLLBACK');
    throw new Error('Failed to vote: ' + error.message);
  } finally {
    client.release();
  }
};
import pool from "../config/db.js";

export const addReview = async ({ user_id, media_id, star_point, description }) => {
  if (!user_id) {
    throw new Error("User not authenticated");
  }
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
