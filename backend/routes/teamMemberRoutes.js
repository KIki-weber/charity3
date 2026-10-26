import express from "express";
import {
  createTeamMember,
  deleteTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  validateTeamMemberPhone,
} from "../controllers/teamMemberController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { createFieldUpload } from "../uploads/uploadMiddleware.js";

const router = express.Router();
const teamMemberUpload = createFieldUpload([
  { name: "photo", maxCount: 1, mediaType: "image" },
], "team-members");

router.get("/", getAllTeamMembers);
router.get("/:id", getTeamMemberById);
router.post("/", adminAuth, ...teamMemberUpload, validateTeamMemberPhone, createTeamMember);
router.put("/:id", adminAuth, ...teamMemberUpload, validateTeamMemberPhone, updateTeamMember);
router.delete("/:id", adminAuth, deleteTeamMember);

export default router;
