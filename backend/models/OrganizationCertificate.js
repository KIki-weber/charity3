import { DataTypes, Model } from "sequelize";
import { parseJsonValue } from "./jsonValue.js";

class OrganizationCertificate extends Model {
  static initModel(sequelize) {
    OrganizationCertificate.init(
      {
        organizationName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        registrationNumber: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        issuingGovernmentAuthority: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        registrationDate: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
        legalStatus: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        certificateLicenseNumber: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        certificateIssueDate: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        certificateExpiryDate: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
        officialAddress: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        photos: {
          type: DataTypes.JSON,
          allowNull: true,
          set(value) {
            this.setDataValue("photos", parseJsonValue(value));
          },
        },
        files: {
          type: DataTypes.JSON,
          allowNull: true,
          set(value) {
            this.setDataValue("files", parseJsonValue(value));
          },
        },
        lastVerifiedDate: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "OrganizationCertificate",
        tableName: "organization_certificates",
        timestamps: true,
        underscored: false,
      }
    );

    return OrganizationCertificate;
  }
}

export default OrganizationCertificate;
