import { Program } from "../models/index.js";

export const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.findAll({ order: [["createdAt", "DESC"]] });
    return res.status(200).json(programs);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch programs", error: error.message });
  }
};

export const getProgramById = async (req, res) => {
  try {
    const program = await Program.findByPk(req.params.id);
    if (!program) return res.status(404).json({ message: "Program not found" });
    return res.status(200).json(program);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch program", error: error.message });
  }
};

export const createProgram = async (req, res) => {
  try {
    const program = await Program.create(req.body);
    return res.status(201).json(program);
  } catch (error) {
    return res.status(400).json({ message: "Failed to create program", error: error.message });
  }
};

export const updateProgram = async (req, res) => {
  try {
    const program = await Program.findByPk(req.params.id);
    if (!program) return res.status(404).json({ message: "Program not found" });
    await program.update(req.body);
    return res.status(200).json(program);
  } catch (error) {
    return res.status(400).json({ message: "Failed to update program", error: error.message });
  }
};

export const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findByPk(req.params.id);
    if (!program) return res.status(404).json({ message: "Program not found" });
    await program.destroy();
    return res.status(200).json({ message: "Program deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete program", error: error.message });
  }
};
