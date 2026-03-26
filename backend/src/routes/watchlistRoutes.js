import express from "express";
import { addToWatchlistController, getWatchlistController, removeFromWatchlistController } from "../controllers/watchlistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add to watchlist
router.post("/", authMiddleware, addToWatchlistController);
// Get watchlist
router.get("/", authMiddleware, getWatchlistController);
// Remove from watchlist
router.delete("/:mediaId", authMiddleware, removeFromWatchlistController);

export default router;
