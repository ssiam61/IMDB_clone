import { getUserProfile, getUserReviews } from '../services/userService.js';

/**
 * GET /api/users/profile
 * Protected route - get current logged-in user profile
 */
export async function getProfile(req, res) {
  try {
    const userId = req.user.id;
    const profile = await getUserProfile(userId);
    
    if (!profile) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/users/:id/reviews
 * Public route - get all reviews by a specific user
 */
export async function getUserReviewsController(req, res) {
  try {
    const { id } = req.params;
    
    // Validate that id is a number
    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const reviews = await getUserReviews(id);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
