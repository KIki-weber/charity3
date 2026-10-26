import { DataTypes } from "sequelize";

export const migrateTeamMemberPhone = async (sequelize) => {
  const queryInterface = sequelize.getQueryInterface();
  let columns;

  try {
    columns = await queryInterface.describeTable("team_members");
  } catch (error) {
    if (error.original?.code === "ER_NO_SUCH_TABLE" || error.original?.code === "42S02") {
      return;
    }

    throw error;
  }

  if (columns.phone) {
    return;
  }

  await queryInterface.addColumn("team_members", "phone", {
    type: DataTypes.STRING(16),
    allowNull: true,
  });
};
