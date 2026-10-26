import test from "node:test";
import assert from "node:assert/strict";
import { migrateTeamMemberPhone } from "../migrations/teamMemberPhone.js";

test("team member phone migration adds a nullable phone column when missing", async () => {
  let addedColumn;
  const sequelize = {
    getQueryInterface: () => ({
      describeTable: async () => ({ id: {}, name: {} }),
      addColumn: async (...args) => {
        addedColumn = args;
      },
    }),
  };

  await migrateTeamMemberPhone(sequelize);

  assert.equal(addedColumn[0], "team_members");
  assert.equal(addedColumn[1], "phone");
  assert.equal(addedColumn[2].allowNull, true);
  assert.equal(addedColumn[2].type.key, "STRING");
});

test("team member phone migration leaves an existing phone column unchanged", async () => {
  let addColumnCalled = false;
  const sequelize = {
    getQueryInterface: () => ({
      describeTable: async () => ({ id: {}, phone: {} }),
      addColumn: async () => {
        addColumnCalled = true;
      },
    }),
  };

  await migrateTeamMemberPhone(sequelize);

  assert.equal(addColumnCalled, false);
});

test("team member phone migration skips a table that does not exist yet", async () => {
  let addColumnCalled = false;
  const sequelize = {
    getQueryInterface: () => ({
      describeTable: async () => {
        const error = new Error("table not found");
        error.original = { code: "ER_NO_SUCH_TABLE" };
        throw error;
      },
      addColumn: async () => {
        addColumnCalled = true;
      },
    }),
  };

  await migrateTeamMemberPhone(sequelize);

  assert.equal(addColumnCalled, false);
});
