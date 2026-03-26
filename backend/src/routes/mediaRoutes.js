import express from "express";
import { getAllMediaController, getMediaByIdController, getFullMediaByIdController } from "../controllers/mediaController.js";

const router = express.Router();

router.get("/", getAllMediaController);
router.get("/:id", getMediaByIdController);

router.get("/:id/full", getFullMediaByIdController);

export default router;
