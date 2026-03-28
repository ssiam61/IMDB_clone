import express from 'express';
import { searchMedia } from '../controllers/searchController.js';

const router = express.Router();

// GET /api/search?query=...
router.get('/', searchMedia);

export default router;
