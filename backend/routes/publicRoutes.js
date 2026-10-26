import express from "express";
import { getAllCertificates, getCertificateById } from "../controllers/certificateController.js";
import {
  getAllDigitalMemberIds,
  getDigitalMemberIdById,
} from "../controllers/digitalMemberIdController.js";
import { getAllImpacts, getImpactById } from "../controllers/impactController.js";
import { getAllPrograms, getProgramById } from "../controllers/programController.js";
import { getAllProjects, getProjectById } from "../controllers/projectController.js";
import {
  getAllTeamMembers,
  getTeamMemberById,
} from "../controllers/teamMemberController.js";

const router = express.Router();

router.get("/team-members", getAllTeamMembers);
router.get("/team-members/:id", getTeamMemberById);
router.get("/certificates", getAllCertificates);
router.get("/certificates/:id", getCertificateById);
router.get("/programs", getAllPrograms);
router.get("/programs/:id", getProgramById);
router.get("/projects", getAllProjects);
router.get("/projects/:id", getProjectById);
router.get("/impacts", getAllImpacts);
router.get("/impacts/:id", getImpactById);
router.get("/digital-member-ids", getAllDigitalMemberIds);
router.get("/digital-member-ids/:id", getDigitalMemberIdById);

export default router;
