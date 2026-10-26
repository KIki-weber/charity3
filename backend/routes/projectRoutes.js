import express from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  updateProject,
} from "../controllers/projectController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { createFieldUpload } from "../uploads/uploadMiddleware.js";

const router = express.Router();
const projectUpload = createFieldUpload([
  { name: "photos", maxCount: 7, multiple: true, mediaType: "image" },
  { name: "video", maxCount: 1, mediaType: "video" },
  { name: "file", maxCount: 1, mediaType: "document" },
], "projects");

router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.post("/", adminAuth, ...projectUpload, createProject);
router.put("/:id", adminAuth, ...projectUpload, updateProject);
router.delete("/:id", adminAuth, deleteProject);

export default router;
