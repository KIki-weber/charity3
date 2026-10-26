import express from "express";
import {
  createCertificate,
  deleteCertificate,
  getAllCertificates,
  getCertificateById,
  updateCertificate,
} from "../controllers/certificateController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { createFieldUpload } from "../uploads/uploadMiddleware.js";

const router = express.Router();
const certificateUpload = createFieldUpload([
  { name: "photos", maxCount: 10, multiple: true, mediaType: "image" },
  { name: "files", maxCount: 10, multiple: true, mediaType: "document" },
], "certificates");

router.get("/", getAllCertificates);
router.get("/:id", getCertificateById);
router.post("/", adminAuth, ...certificateUpload, createCertificate);
router.put("/:id", adminAuth, ...certificateUpload, updateCertificate);
router.delete("/:id", adminAuth, deleteCertificate);

export default router;
