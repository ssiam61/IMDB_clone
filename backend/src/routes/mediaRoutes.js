import express from "express";
import { getAllMediaController, getMediaByIdController } from "../controllers/mediaController.js";

const router = express.Router();

router.get("/", getAllMediaController);
router.get("/:id", getMediaByIdController);

export default router;
