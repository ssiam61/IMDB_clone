import { addToWatchlist, getWatchlist, removeFromWatchlist } from "../services/watchlistService.js";

export const addToWatchlistController = async (req, res) => {
  try {
    const user_id = req.user && req.user.id;
    const { media_id } = req.body;
    if (!user_id || !media_id) {
      return res.status(400).json({ message: "Missing media_id" });
    }
    const result = await addToWatchlist({ user_id, media_id });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getWatchlistController = async (req, res) => {
  try {
    const user_id = req.user && req.user.id;
    const result = await getWatchlist(user_id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const removeFromWatchlistController = async (req, res) => {
  try {
    const user_id = req.user && req.user.id;
    const media_id = req.params.mediaId;
    if (!user_id || !media_id) {
      return res.status(400).json({ message: "Missing media_id" });
    }
    const result = await removeFromWatchlist({ user_id, media_id });
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
