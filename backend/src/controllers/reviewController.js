import { addReview, getReviewsByMediaId, voteReview } from "../services/reviewService.js";
// Vote on a review
export const voteReviewController = async (req, res) => {
  try {
    const user_id = req.user && req.user.id;
    const review_id = req.params.id;
    const { vote_type } = req.body;
    if (!user_id || !review_id || !vote_type || !["upvote", "downvote"].includes(vote_type)) {
      return res.status(400).json({ message: "Invalid input" });
    }
    const result = await voteReview({ user_id, review_id, vote_type });
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addReviewController = async (req, res) => {
  try {
    // Only get media_id, star_point, description from body
    const { media_id, star_point, description } = req.body;
    // user_id comes from authMiddleware
    const user_id = req.user && req.user.id;
    if (
      !user_id ||
      media_id === undefined ||
      star_point === undefined ||
      description === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const review = await addReview({ user_id, media_id, star_point, description });
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getReviewsByMediaIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await getReviewsByMediaId(id);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
