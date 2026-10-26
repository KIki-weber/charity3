import express from "express";
import {
  createDigitalMemberId,
  deleteDigitalMemberId,
  getAllDigitalMemberIds,
  getDigitalMemberIdById,
  updateDigitalMemberId,
} from "../controllers/digitalMemberIdController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { createFieldUpload } from "../uploads/uploadMiddleware.js";

const router = express.Router();
const digitalMemberUpload = createFieldUpload([
  { name: "photo", maxCount: 1 },
  { name: "photos", maxCount: 7 },
  { name: "video", maxCount: 1 },
  { name: "file", maxCount: 1 },
], "digital-member-ids");

router.get("/", getAllDigitalMemberIds);
router.get("/:id", getDigitalMemberIdById);
router.post("/", adminAuth, ...digitalMemberUpload, createDigitalMemberId);
router.put("/:id", adminAuth, ...digitalMemberUpload, updateDigitalMemberId);
router.delete("/:id", adminAuth, deleteDigitalMemberId);

export default router;
