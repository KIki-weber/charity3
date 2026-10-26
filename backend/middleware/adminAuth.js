import jwt from "jsonwebtoken";
import { AdminUser } from "../models/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "peaceandlove";

export const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access token required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await AdminUser.findByPk(decoded.id);

    if (!admin || admin.role !== "admin" || !admin.isActive) {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token", error: error.message });
  }
};
