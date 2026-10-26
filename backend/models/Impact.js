import { DataTypes, Model } from "sequelize";
import { parseJsonValue } from "./jsonValue.js";

class Impact extends Model {
  static initModel(sequelize) {
    Impact.init(
      {
        storyTitle: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        beneficiaryOrCommunity: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        relatedProgramOrProject: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        media: {
          type: DataTypes.JSON,
          allowNull: true,
          set(value) {
            this.setDataValue("media", parseJsonValue(value));
          },
        },
        resultsAchievements: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        date: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "Impact",
        tableName: "impacts",
        timestamps: true,
        underscored: false,
      }
    );

    return Impact;
  }
}

export default Impact;
