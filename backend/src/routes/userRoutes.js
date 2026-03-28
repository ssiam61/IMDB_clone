import express from 'express';
import { getProfile, getUserReviewsController } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected route - get current user profile
router.get('/profile', authMiddleware, getProfile);

// Public route - get user reviews by user ID
router.get('/:id/reviews', getUserReviewsController);

export default router;
