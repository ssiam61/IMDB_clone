import express from "express";
import { addReviewController, getReviewsByMediaIdController } from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", addReviewController);
router.get("/media/:id", getReviewsByMediaIdController);

export default router;
