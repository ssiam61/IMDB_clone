import { getAllMedia, getMediaById } from "../services/mediaService.js";

export const getAllMediaController = async (req, res) => {
  try {
    const media = await getAllMedia();
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMediaByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const media = await getMediaById(id);
    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
