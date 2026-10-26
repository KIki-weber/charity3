import { DataTypes, Model } from "sequelize";
import { parseJsonValue } from "./jsonValue.js";

class TeamMember extends Model {
  static initModel(sequelize) {
    TeamMember.init(
      {
        photo: {
          type: DataTypes.JSON,
          allowNull: true,
          set(value) {
            this.setDataValue("photo", parseJsonValue(value));
          },
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        country: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        city: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING(16),
          allowNull: true,
          set(value) {
            if (value === null || value === undefined || value === "") {
              this.setDataValue("phone", null);
              return;
            }

            this.setDataValue(
              "phone",
              String(value).trim().replace(/[\s().-]/g, "")
            );
          },
          validate: {
            is: /^\+[1-9]\d{1,14}$/,
          },
        },
        field: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        years: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: "TeamMember",
        tableName: "team_members",
        timestamps: true,
        underscored: false,
      }
    );

    return TeamMember;
  }
}

export default TeamMember;
