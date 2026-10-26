import express from "express";

import { getAdminProfile, loginAdmin, registerAdmin } from "../controllers/adminController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/me", adminAuth, getAdminProfile);

export default router;
