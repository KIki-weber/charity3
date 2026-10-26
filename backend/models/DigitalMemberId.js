import { DataTypes, Model } from "sequelize";
import { parseJsonValue } from "./jsonValue.js";

class DigitalMemberId extends Model {
  static initModel(sequelize) {
    DigitalMemberId.init(
      {
        memberId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: true,
          references: {
            model: "team_members",
            key: "id",
          },
        },
        digitalIdNumber: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        fullName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        photo: {
          type: DataTypes.JSON,
          allowNull: true,
          set(value) {
            this.setDataValue("photo", parseJsonValue(value));
          },
        },
        photos: {
          type: DataTypes.JSON,
          allowNull: true,
          set(value) {
            this.setDataValue("photos", parseJsonValue(value));
          },
        },
        video: {
          type: DataTypes.JSON,
          allowNull: true,
          set(value) {
            this.setDataValue("video", parseJsonValue(value));
          },
        },
        file: {
          type: DataTypes.JSON,
          allowNull: true,
          set(value) {
            this.setDataValue("file", parseJsonValue(value));
          },
        },
        country: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        issueDate: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        expiryDate: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
        membershipType: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        department: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        organizationName: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        address: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "active",
        },
      },
      {
        sequelize,
        modelName: "DigitalMemberId",
        tableName: "digital_member_ids",
        timestamps: true,
        underscored: false,
      }
    );

    return DigitalMemberId;
  }
}

export default DigitalMemberId;
