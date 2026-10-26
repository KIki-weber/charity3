import test from 'node:test';
import assert from 'node:assert/strict';

import { migrateMediaSchema } from '../migrations/mediaSchema.js';

test('media migration preserves existing media and clears empty values before JSON conversion', async () => {
  const tables = {
    team_members: {
      columns: {
        id: { type: 'INTEGER' },
        photo: { type: 'TEXT' },
      },
      rows: [
        { id: 3, photo: '' },
        { id: 4, photo: '   ' },
        { id: 5, photo: '/uploads/team-members/member.jpg' },
      ],
    },
    organization_certificates: {
      columns: {
        id: { type: 'INTEGER' },
        photo: { type: 'TEXT' },
        file: { type: 'TEXT' },
      },
      rows: [{
        id: 2,
        photo: '/uploads/certificates/certificate.jpg',
        file: '/uploads/certificates/license.pdf',
      }],
    },
    impacts: {
      columns: {
        id: { type: 'INTEGER' },
        photo: { type: 'TEXT' },
        video: { type: 'TEXT' },
      },
      rows: [{
        id: 1,
        photo: '/uploads/impacts/story.jpg',
        video: '/uploads/impacts/story.mp4',
      }],
    },
  };

  const sequelize = {
    getQueryInterface() {
      return {
        async describeTable(table) {
          if (!tables[table]) {
            const error = new Error(`Table '${table}' doesn't exist`);
            error.original = { code: 'ER_NO_SUCH_TABLE' };
            throw error;
          }
          return tables[table].columns;
        },
        async addColumn(table, column, definition) {
          tables[table].columns[column] = definition;
        },
        async changeColumn(table, column, definition) {
          tables[table].columns[column] = definition;
        },
        async removeColumn(table, column) {
          delete tables[table].columns[column];
          tables[table].rows.forEach((row) => delete row[column]);
        },
      };
    },
    async query(sql, { replacements } = {}) {
      if (sql.startsWith('SELECT')) {
        const table = sql.match(/FROM `([^`]+)`/)[1];
        return [tables[table].rows.map((row) => ({ ...row }))];
      }

      if (sql.startsWith('UPDATE')) {
        const [, table, column] = sql.match(/UPDATE `([^`]+)` SET `([^`]+)`/);
        const row = tables[table].rows.find((entry) => entry.id === replacements.id);
        row[column] = sql.includes('= NULL')
          ? null
          : JSON.parse(replacements.jsonValue);
        return [[], {}];
      }

      throw new Error(`Unexpected migration query: ${sql}`);
    },
  };

  await migrateMediaSchema(sequelize);
  assert.equal(tables.team_members.rows[0].photo, null);
  assert.equal(tables.team_members.rows[1].photo, null);
  assert.equal(tables.team_members.rows[2].photo, '/uploads/team-members/member.jpg');
  assert.equal(tables.team_members.columns.photo.type, 'JSON');
  assert.equal(tables.impacts.rows[0].media, '/uploads/impacts/story.jpg');
  assert.equal(tables.impacts.columns.media.type, 'JSON');
  assert.equal(tables.impacts.columns.photo, undefined);
  assert.equal(tables.impacts.columns.video, undefined);

  await migrateMediaSchema(sequelize);
  assert.equal(tables.impacts.rows[0].media, '/uploads/impacts/story.jpg');
  assert.deepEqual(tables.organization_certificates.rows[0].photos, ['/uploads/certificates/certificate.jpg']);
  assert.deepEqual(tables.organization_certificates.rows[0].files, ['/uploads/certificates/license.pdf']);
});
