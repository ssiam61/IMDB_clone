import { searchMedia as searchMediaService } from '../services/searchService.js';

/**
 * GET /api/search?query=...
 */
export async function searchMedia(req, res) {
  const { query } = req.query;
  try {
    if (!query || query.trim() === '') {
      return res.json([]);
    }
    const results = await searchMediaService(query);
    return res.json(results);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
