import dotenv from "dotenv";
import { Sequelize } from "sequelize";

import TeamMember from "./TeamMember.js";
import OrganizationCertificate from "./OrganizationCertificate.js";
import Program from "./Program.js";
import Project from "./Project.js";
import Impact from "./Impact.js";
import DigitalMemberId from "./DigitalMemberId.js";
import AdminUser from "./AdminUser.js";

dotenv.config();

export const modelUploadFolders = {
  TeamMember: "team-members",
  OrganizationCertificate: "certificates",
  Program: "programs",
  Project: "projects",
  Impact: "impacts",
  DigitalMemberId: "digital-member-ids",
  AdminUser: "admin-users",
};

const dbHost = process.env.DB_HOST || "localhost";
const dbUser = process.env.DB_USER || process.env["DB-USER"] || "root";
const dbPassword = process.env.DB_PASSWORD || "";
const dbName = process.env.DB_NAME || process.env.DB_NNAME || "charity";
const dbPort = Number(process.env.DB_PORT || 3306);

const adminSequelize = new Sequelize("mysql", dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: "mysql",
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: "mysql",
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const ensureDatabaseExists = async () => {
  try {
    await adminSequelize.authenticate();
    await adminSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Database "${dbName}" is ready.`);
  } catch (error) {
    console.error("Unable to initialize the database:", error);
    throw error;
  }
};

TeamMember.initModel(sequelize);
OrganizationCertificate.initModel(sequelize);
Program.initModel(sequelize);
Project.initModel(sequelize);
Impact.initModel(sequelize);
DigitalMemberId.initModel(sequelize);
AdminUser.initModel(sequelize);

TeamMember.hasOne(DigitalMemberId, {
  foreignKey: "memberId",
  as: "digitalId",
});

DigitalMemberId.belongsTo(TeamMember, {
  foreignKey: "memberId",
  as: "member",
});

export { TeamMember, OrganizationCertificate, Program, Project, Impact, DigitalMemberId, AdminUser };
export default { sequelize, TeamMember, OrganizationCertificate, Program, Project, Impact, DigitalMemberId, AdminUser };
