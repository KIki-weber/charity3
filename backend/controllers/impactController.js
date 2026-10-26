import { Impact } from "../models/index.js";

export const getAllImpacts = async (req, res) => {
  try {
    const impacts = await Impact.findAll({ order: [["createdAt", "DESC"]] });
    return res.status(200).json(impacts);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch impacts", error: error.message });
  }
};

export const getImpactById = async (req, res) => {
  try {
    const impact = await Impact.findByPk(req.params.id);
    if (!impact) return res.status(404).json({ message: "Impact not found" });
    return res.status(200).json(impact);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch impact", error: error.message });
  }
};

export const createImpact = async (req, res) => {
  try {
    const impact = await Impact.create(req.body);
    return res.status(201).json(impact);
  } catch (error) {
    return res.status(400).json({ message: "Failed to create impact", error: error.message });
  }
};

export const updateImpact = async (req, res) => {
  try {
    const impact = await Impact.findByPk(req.params.id);
    if (!impact) return res.status(404).json({ message: "Impact not found" });
    await impact.update(req.body);
    return res.status(200).json(impact);
  } catch (error) {
    return res.status(400).json({ message: "Failed to update impact", error: error.message });
  }
};

export const deleteImpact = async (req, res) => {
  try {
    const impact = await Impact.findByPk(req.params.id);
    if (!impact) return res.status(404).json({ message: "Impact not found" });
    await impact.destroy();
    return res.status(200).json({ message: "Impact deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete impact", error: error.message });
  }
};
