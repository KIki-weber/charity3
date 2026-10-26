import express from "express";
import {
  createImpact,
  deleteImpact,
  getAllImpacts,
  getImpactById,
  updateImpact,
} from "../controllers/impactController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { createFieldUpload } from "../uploads/uploadMiddleware.js";

const router = express.Router();
const impactUpload = createFieldUpload([
  { name: "media", maxCount: 1, mediaType: "image-or-video" },
], "impacts");

router.get("/", getAllImpacts);
router.get("/:id", getImpactById);
router.post("/", adminAuth, ...impactUpload, createImpact);
router.put("/:id", adminAuth, ...impactUpload, updateImpact);
router.delete("/:id", adminAuth, deleteImpact);

export default router;
