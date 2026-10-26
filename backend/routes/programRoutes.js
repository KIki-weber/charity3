import express from "express";
import {
  createProgram,
  deleteProgram,
  getAllPrograms,
  getProgramById,
  updateProgram,
} from "../controllers/programController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { createFieldUpload } from "../uploads/uploadMiddleware.js";

const router = express.Router();
const programUpload = createFieldUpload([
  { name: "photos", maxCount: 7, multiple: true, mediaType: "image" },
  { name: "video", maxCount: 1, mediaType: "video" },
  { name: "file", maxCount: 1, mediaType: "document" },
], "programs");

router.get("/", getAllPrograms);
router.get("/:id", getProgramById);
router.post("/", adminAuth, ...programUpload, createProgram);
router.put("/:id", adminAuth, ...programUpload, updateProgram);
router.delete("/:id", adminAuth, deleteProgram);

export default router;
