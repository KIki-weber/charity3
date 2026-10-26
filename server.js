import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { sequelize, ensureDatabaseExists } from "./models/index.js";
import teamMemberRoutes from "./routes/teamMemberRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import programRoutes from "./routes/programRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import impactRoutes from "./routes/impactRoutes.js";
import digitalMemberIdRoutes from "./routes/digitalMemberIdRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import { seedDefaultAdmin } from "./controllers/adminController.js";
import { migrateMediaSchema } from "./migrations/mediaSchema.js";
import { migrateTeamMemberPhone } from "./migrations/teamMemberPhone.js";
import { resolveUploadDirectory } from "./uploads/uploadMiddleware.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3010);

const repairLegacyDatabaseSchema = async () => {
  const queryInterface = sequelize.getQueryInterface();

  const runColumnRepair = async (table, oldName, newName, sqlType, nullable = true, defaultValue = null) => {
    const columns = await queryInterface.describeTable(table).catch(() => ({}));
    if (!columns || !(oldName in columns)) {
      return;
    }

    if (newName in columns) {
      await sequelize.query(`ALTER TABLE \`${table}\` DROP COLUMN \`${oldName}\`;`);
      return;
    }

    if (nullable) {
      await sequelize.query(`ALTER TABLE \`${table}\` MODIFY \`${oldName}\` ${sqlType} NULL;`);
    } else {
      await sequelize.query(`ALTER TABLE \`${table}\` MODIFY \`${oldName}\` ${sqlType} NOT NULL DEFAULT ${defaultValue};`);
    }

    await sequelize.query(
      `ALTER TABLE \`${table}\` CHANGE COLUMN \`${oldName}\` \`${newName}\` ${sqlType} ${nullable ? "NULL" : "NOT NULL"}${defaultValue !== null ? ` DEFAULT ${defaultValue}` : ""};`
    );
  };

  const dropLegacyColumnIfExists = async (table, columnName) => {
    const columns = await queryInterface.describeTable(table).catch(() => ({}));
    if (!columns || !(columnName in columns)) {
      return;
    }

    await sequelize.query(`ALTER TABLE \`${table}\` DROP COLUMN \`${columnName}\`;`);
  };

  const renameLegacyColumns = async (table, mappings = []) => {
    for (const [oldName, newName, sqlType, nullable, defaultValue] of mappings) {
      await runColumnRepair(table, oldName, newName, sqlType, nullable, defaultValue);
    }
  };

  await renameLegacyColumns("admin_users", [
    ["created_at", "createdAt", "DATETIME", true],
    ["updated_at", "updatedAt", "DATETIME", true],
    ["is_active", "isActive", "TINYINT(1)", false, 1],
  ]);

  await renameLegacyColumns("programs", [
    ["created_at", "createdAt", "DATETIME", true],
    ["updated_at", "updatedAt", "DATETIME", true],
    ["community_location", "communityLocation", "VARCHAR(255)", true],
    ["start_date", "startDate", "DATE", true],
  ]);

  await renameLegacyColumns("projects", [
    ["created_at", "createdAt", "DATETIME", true],
    ["updated_at", "updatedAt", "DATETIME", true],
    ["program_id", "programId", "INT", true],
    ["location_community", "locationCommunity", "VARCHAR(255)", true],
    ["start_date", "startDate", "DATE", true],
    ["end_date", "endDate", "DATE", true],
  ]);

  await renameLegacyColumns("impacts", [
    ["created_at", "createdAt", "DATETIME", true],
    ["updated_at", "updatedAt", "DATETIME", true],
    ["story_title", "storyTitle", "VARCHAR(255)", true],
    ["beneficiary_or_community", "beneficiaryOrCommunity", "VARCHAR(255)", true],
    ["related_program_or_project", "relatedProgramOrProject", "VARCHAR(255)", true],
    ["results_achievements", "resultsAchievements", "TEXT", true],
  ]);

  await renameLegacyColumns("team_members", [
    ["created_at", "createdAt", "DATETIME", true],
    ["updated_at", "updatedAt", "DATETIME", true],
  ]);

  await renameLegacyColumns("organization_certificates", [
    ["created_at", "createdAt", "DATETIME", true],
    ["updated_at", "updatedAt", "DATETIME", true],
    ["organization_name", "organizationName", "VARCHAR(255)", true],
    ["registration_number", "registrationNumber", "VARCHAR(255)", true],
    ["issuing_government_authority", "issuingGovernmentAuthority", "VARCHAR(255)", true],
    ["registration_date", "registrationDate", "DATE", true],
    ["legal_status", "legalStatus", "VARCHAR(255)", true],
    ["certificate_license_number", "certificateLicenseNumber", "VARCHAR(255)", true],
    ["certificate_issue_date", "certificateIssueDate", "DATE", true],
    ["certificate_expiry_date", "certificateExpiryDate", "DATE", true],
    ["official_address", "officialAddress", "TEXT", true],
    ["last_verified_date", "lastVerifiedDate", "DATE", true],
  ]);

  await renameLegacyColumns("digital_member_ids", [
    ["created_at", "createdAt", "DATETIME", true],
    ["updated_at", "updatedAt", "DATETIME", true],
    ["member_id", "memberId", "INT", true],
    ["digital_id_number", "digitalIdNumber", "VARCHAR(255)", true],
    ["full_name", "fullName", "VARCHAR(255)", true],
    ["issue_date", "issueDate", "DATE", true],
    ["expiry_date", "expiryDate", "DATE", true],
    ["membership_type", "membershipType", "VARCHAR(255)", true],
    ["organization_name", "organizationName", "VARCHAR(255)", true],
  ]);

  await dropLegacyColumnIfExists("organization_certificates", "verificationLink");
  await dropLegacyColumnIfExists("organization_certificates", "qrCode");
  await dropLegacyColumnIfExists("digital_member_ids", "navigationLink");
  await dropLegacyColumnIfExists("digital_member_ids", "companyLogo");
  await dropLegacyColumnIfExists("digital_member_ids", "qrCode");
  await dropLegacyColumnIfExists("digital_member_ids", "barcode");
};

const uploadDirectory = resolveUploadDirectory();

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use("/uploads", express.static(uploadDirectory));

app.get("/", (req, res) => {
  res.json({ message: "Charity backend API is running" });
});

app.use("/api/uploads", uploadRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/team-members", teamMemberRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/impacts", impactRoutes);
app.use("/api/digital-member-ids", digitalMemberIdRoutes);

const startServer = async () => {
  try {
    await ensureDatabaseExists();
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    await repairLegacyDatabaseSchema();
    await migrateMediaSchema(sequelize);
    await migrateTeamMemberPhone(sequelize);
    await sequelize.sync({ force: false, alter: true });
    await seedDefaultAdmin();
    console.log("Database models synchronized successfully.");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

startServer();
