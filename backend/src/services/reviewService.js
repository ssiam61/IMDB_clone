import pool from "../config/db.js";

// ─────────────────────────────────────────────
// REVIEWS
// ─────────────────────────────────────────────

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

// Recursive function to build nested reply tree
const buildReplyTree = (replies, parentId = null) => {
  return replies
    .filter(reply => reply.parent_reply_id === parentId)
    .map(reply => ({
      id: reply.id,
      user_id: reply.user_id,
      username: reply.username,
      description: reply.description,
      created_at: reply.created_at,
      upvote: reply.upvote,
      downvote: reply.downvote,
      parent_reply_id: reply.parent_reply_id,
      replies: buildReplyTree(replies, reply.id)
    }));
};

export const getReviewsByMediaId = async (media_id) => {
  try {
    // Get all reviews with user info
    const reviewsQuery = `
      SELECT 
        r.id, 
        r.star_point, 
        r.description, 
        r.user_id, 
        r.created_at,
        r.upvote,
        r.downvote,
        u.username
      FROM review r
      JOIN users u ON r.user_id = u.id
      WHERE r.media_id = $1 AND r.is_removed = FALSE
      ORDER BY r.created_at DESC
    `;
    
    const reviewsRes = await pool.query(reviewsQuery, [media_id]);
    const reviews = reviewsRes.rows;

    // Get all replies for these reviews
    const reviewIds = reviews.map(r => r.id);
    if (reviewIds.length === 0) {
      return [];
    }

    const repliesQuery = `
      SELECT 
        r.id,
        r.user_id,
        r.parent_review_id,
        r.parent_reply_id,
        r.description,
        r.created_at,
        r.upvote,
        r.downvote,
        u.username
      FROM reply r
      JOIN users u ON r.user_id = u.id
      WHERE r.parent_review_id = ANY($1::int[]) AND r.is_removed = FALSE
      ORDER BY r.created_at ASC
    `;

    const repliesRes = await pool.query(repliesQuery, [reviewIds]);
    const replies = repliesRes.rows;

    // Map reviews and attach nested replies
    return reviews.map(review => {
      const reviewReplies = replies.filter(r => r.parent_review_id === review.id);
      return {
        id: review.id,
        user_id: review.user_id,
        username: review.username,
        star_point: review.star_point,
        description: review.description,
        created_at: review.created_at,
        upvote: review.upvote || 0,
        downvote: review.downvote || 0,
        replies: buildReplyTree(reviewReplies)
      };
    });
  } catch (error) {
    throw new Error("Failed to fetch reviews: " + error.message);
  }
};

// ─────────────────────────────────────────────
// REPLIES
// ─────────────────────────────────────────────

export const addReply = async ({ user_id, parent_review_id, parent_reply_id, description }) => {
  if (!user_id) {
    throw new Error("User not authenticated");
  }
  if (!description || description.trim().length === 0) {
    throw new Error("Reply description is required");
  }
  if (!parent_review_id && !parent_reply_id) {
    throw new Error("Either parent_review_id or parent_reply_id is required");
  }

  const query = `
    INSERT INTO reply (user_id, parent_review_id, parent_reply_id, description, created_at)
    VALUES ($1, $2, $3, $4, NOW())
    RETURNING *
  `;
  const values = [user_id, parent_review_id || null, parent_reply_id || null, description];
  try {
    const { rows } = await pool.query(query, values);
    const reply = rows[0];

    // Get username for response
    const userRes = await pool.query(`SELECT username FROM users WHERE id = $1`, [user_id]);
    const username = userRes.rows[0]?.username;

    return {
      id: reply.id,
      user_id: reply.user_id,
      username: username,
      parent_review_id: reply.parent_review_id,
      parent_reply_id: reply.parent_reply_id,
      description: reply.description,
      created_at: reply.created_at,
      upvote: reply.upvote || 0,
      downvote: reply.downvote || 0,
      replies: []
    };
  } catch (error) {
    throw new Error("Failed to add reply: " + error.message);
  }
};

// ─────────────────────────────────────────────
// VOTING
// ─────────────────────────────────────────────

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
