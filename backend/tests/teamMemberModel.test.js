import test from 'node:test';
import assert from 'node:assert/strict';
import { Sequelize } from 'sequelize';

import TeamMember from '../models/TeamMember.js';

test('TeamMember stores one photo URL as a JSON string value', async () => {
  const sequelize = new Sequelize('charity', 'root', '', {
    dialect: 'mysql',
    logging: false,
  });

  try {
    TeamMember.initModel(sequelize);

    const photo = '/uploads/team-members/one.png';
    const member = TeamMember.build({ photo });

    assert.equal(member.getDataValue('photo'), photo);
    assert.equal(TeamMember.rawAttributes.photo.type.key, 'JSON');
    assert.equal(TeamMember.rawAttributes.photos, undefined);
  } finally {
    await sequelize.close();
  }
});

test('TeamMember stores phone numbers in international format', async () => {
  const sequelize = new Sequelize('charity', 'root', '', {
    dialect: 'mysql',
    logging: false,
  });

  try {
    TeamMember.initModel(sequelize);

    const member = TeamMember.build({
      name: 'Amina',
      country: 'United States',
      city: 'New York',
      field: 'Community',
      phone: '+1 (555) 123-4567',
    });

    assert.equal(member.phone, '+15551234567');
    assert.equal(TeamMember.rawAttributes.phone.type.key, 'STRING');
    await assert.rejects(
      TeamMember.build({
        name: 'Amina',
        country: 'United States',
        city: 'New York',
        field: 'Community',
        phone: '555-123-4567',
      }).validate(),
      /phone/
    );
  } finally {
    await sequelize.close();
  }
});
