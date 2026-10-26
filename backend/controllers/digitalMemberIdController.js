import { DigitalMemberId, TeamMember } from "../models/index.js";

const buildAutoValues = (memberId, payload = {}) => {
  const generatedNumber = payload.digitalIdNumber || `DIG-${memberId}`;

  return {
    ...payload,
    digitalIdNumber: generatedNumber,
  };
};

export const getAllDigitalMemberIds = async (req, res) => {
  try {
    const digitalIds = await DigitalMemberId.findAll({
      include: [{ model: TeamMember, as: "member" }],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(digitalIds);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch digital member IDs", error: error.message });
  }
};

export const getDigitalMemberIdById = async (req, res) => {
  try {
    const digitalId = await DigitalMemberId.findByPk(req.params.id, {
      include: [{ model: TeamMember, as: "member" }],
    });

    if (!digitalId) {
      return res.status(404).json({ message: "Digital member ID not found" });
    }

    return res.status(200).json(digitalId);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch digital member ID", error: error.message });
  }
};

export const createDigitalMemberId = async (req, res) => {
  try {
    const { memberId } = req.body;

    if (!memberId) {
      return res.status(400).json({ message: "memberId is required" });
    }

    const member = await TeamMember.findByPk(memberId);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const payload = buildAutoValues(memberId, {
      ...req.body,
      fullName: req.body.fullName || member.name,
      country: req.body.country || member.country,
      photo: req.body.photo || member.photo,
      issueDate: req.body.issueDate || new Date().toISOString().slice(0, 10),
    });

    const existing = await DigitalMemberId.findOne({ where: { memberId } });
    if (existing) {
      return res.status(409).json({ message: "A digital member ID already exists for this member" });
    }

    const digitalId = await DigitalMemberId.create(payload);
    return res.status(201).json(digitalId);
  } catch (error) {
    return res.status(400).json({ message: "Failed to create digital member ID", error: error.message });
  }
};

export const updateDigitalMemberId = async (req, res) => {
  try {
    const digitalId = await DigitalMemberId.findByPk(req.params.id);

    if (!digitalId) {
      return res.status(404).json({ message: "Digital member ID not found" });
    }

    const payload = buildAutoValues(digitalId.memberId, {
      ...digitalId.toJSON(),
      ...req.body,
    });

    await digitalId.update(payload);
    return res.status(200).json(digitalId);
  } catch (error) {
    return res.status(400).json({ message: "Failed to update digital member ID", error: error.message });
  }
};

export const deleteDigitalMemberId = async (req, res) => {
  try {
    const digitalId = await DigitalMemberId.findByPk(req.params.id);

    if (!digitalId) {
      return res.status(404).json({ message: "Digital member ID not found" });
    }

    await digitalId.destroy();
    return res.status(200).json({ message: "Digital member ID deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete digital member ID", error: error.message });
  }
};
