import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { AdminUser } from "../models/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "peaceandlove";

export const generateAdminToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const seedDefaultAdmin = async () => {
  const email = process.env.ADMIN_EMAIL || "pledevelopmentorg@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "334433";

  const existingAdmin = await AdminUser.findOne({ where: { email } });
  if (existingAdmin) {
    return existingAdmin;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return AdminUser.create({
    name: process.env.ADMIN_NAME || "Charity Admin",
    email,
    password: hashedPassword,
    role: "admin",
    isActive: true,
  });
};

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingAdmin = await AdminUser.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin account already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await AdminUser.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    const token = generateAdminToken(admin);

    return res.status(201).json({
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: "Failed to create admin account", error: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await AdminUser.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateAdminToken(admin);

    return res.status(200).json({
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};

export const getAdminProfile = async (req, res) => {
  return res.status(200).json({
    id: req.admin.id,
    name: req.admin.name,
    email: req.admin.email,
    role: req.admin.role,
  });
};
