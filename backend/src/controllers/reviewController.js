import { addReview, getReviewsByMediaId } from "../services/reviewService.js";

export const addReviewController = async (req, res) => {
  try {
    const { user_id, media_id, star_point, description } = req.body;
    if (
      user_id === undefined ||
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
