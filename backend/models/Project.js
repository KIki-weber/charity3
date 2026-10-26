import { DataTypes, Model } from "sequelize";
import { parseJsonValue } from "./jsonValue.js";

class Project extends Model {
  static initModel(sequelize) {
    Project.init(
      {
        projectName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        programId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        locationCommunity: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        startDate: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
        endDate: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "active",
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
      },
      {
        sequelize,
        modelName: "Project",
        tableName: "projects",
        timestamps: true,
        underscored: false,
      }
    );

    return Project;
  }
}

export default Project;
