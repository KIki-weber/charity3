import { DataTypes, Model } from "sequelize";
import { parseJsonValue } from "./jsonValue.js";

class Program extends Model {
  static initModel(sequelize) {
    Program.init(
      {
        programName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        communityLocation: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        startDate: {
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
        modelName: "Program",
        tableName: "programs",
        timestamps: true,
        underscored: false,
      }
    );

    return Program;
  }
}

export default Program;
