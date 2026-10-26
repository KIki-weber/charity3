import { TeamMember } from "../models/index.js";

const normalizePhone = (value) => String(value).trim().replace(/[\s().-]/g, "");
const internationalPhonePattern = /^\+[1-9]\d{1,14}$/;

export const validateTeamMemberPhone = (req, res, next) => {
  if (req.body.phone === undefined || req.body.phone === null) {
    return next();
  }

  const phone = normalizePhone(req.body.phone);
  if (phone === "") {
    req.body.phone = null;
    return next();
  }

  if (!internationalPhonePattern.test(phone)) {
    return res.status(400).json({
      message: "Phone must include a country calling code, for example +15551234567.",
    });
  }

  req.body.phone = phone;
  return next();
};

export const getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(teamMembers);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch team members", error: error.message });
  }
};

export const getTeamMemberById = async (req, res) => {
  try {
    const teamMember = await TeamMember.findByPk(req.params.id);

    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    return res.status(200).json(teamMember);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch team member", error: error.message });
  }
};

export const createTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.create({
      ...req.body,
      phone: req.body.phone ?? null,
    });
    return res.status(201).json(teamMember);
  } catch (error) {
    return res.status(400).json({
      message: "Failed to create team member",
      error: error.message,
    });
  }
};

export const updateTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findByPk(req.params.id);

    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    await teamMember.update(req.body);
    return res.status(200).json(teamMember);
  } catch (error) {
    return res.status(400).json({
      message: "Failed to update team member",
      error: error.message,
    });
  }
};

export const deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findByPk(req.params.id);

    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    await teamMember.destroy();
    return res.status(200).json({ message: "Team member deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete team member", error: error.message });
  }
};
