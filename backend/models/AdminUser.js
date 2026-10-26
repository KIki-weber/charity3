import { DataTypes, Model } from "sequelize";

class AdminUser extends Model {
  static initModel(sequelize) {
    AdminUser.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        role: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "admin",
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
      },
      {
        sequelize,
        modelName: "AdminUser",
        tableName: "admin_users",
        timestamps: true,
        underscored: false,
      }
    );

    return AdminUser;
  }
}

export default AdminUser;
