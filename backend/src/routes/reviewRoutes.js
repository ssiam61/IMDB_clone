import express from "express";
import { addReviewController, getReviewsByMediaIdController, voteReviewController } from "../controllers/reviewController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect POST /api/reviews
router.post("/", authMiddleware, addReviewController);
// Public GET
router.get("/media/:id", getReviewsByMediaIdController);


// Voting on a review (protected)
router.post("/:id/vote", authMiddleware, voteReviewController);

export default router;
