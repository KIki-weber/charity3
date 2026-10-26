import test from 'node:test';
import assert from 'node:assert/strict';

import { attachUploadedFiles, buildUploadPayload, getUploadUrl } from '../uploads/uploadHelpers.js';
import { getUploadFieldLimit } from '../uploads/uploadMiddleware.js';

test('buildUploadPayload returns a normalized public URL for a single file', () => {
  const result = buildUploadPayload({ originalname: 'photo.png', filename: 'photo-123.png', path: 'uploads/photo-123.png' });

  assert.equal(result.fileName, 'photo-123.png');
  assert.equal(result.url, '/uploads/photo-123.png');
  assert.equal(result.path, 'uploads/photo-123.png');
});

test('getUploadUrl works with a complete public URL input', () => {
  const result = getUploadUrl('https://example.com/uploads/project.png');
  assert.equal(result, 'https://example.com/uploads/project.png');
});

test('getUploadUrl normalizes legacy doubled slashes before uploads', () => {
  assert.equal(getUploadUrl('//uploads/team-members/photo.png'), '/uploads/team-members/photo.png');
});

test('buildUploadPayload preserves a model-specific upload folder', () => {
  const result = buildUploadPayload({
    originalname: 'team-photo.png',
    filename: 'team-photo-123.png',
    path: 'C:/tmp/team-photo-123.png',
  }, 'photo', 'team-members');

  assert.equal(result.fileName, 'team-photo-123.png');
  assert.equal(result.url, '/uploads/team-members/team-photo-123.png');
  assert.equal(result.path, 'uploads/team-members/team-photo-123.png');
});

test('attachUploadedFiles keeps existing gallery URLs when adding new uploads', () => {
  const req = {
    body: {
      photos: [
        '/uploads/team-members/existing.png',
        '["/uploads/team-members/also-existing.png"]',
      ],
    },
  };

  const result = attachUploadedFiles(req, 'photos', [{
    originalname: 'new-photo.png',
    filename: 'new-photo-123.png',
    path: 'uploads/team-members/new-photo-123.png',
  }], 'team-members');

  assert.deepEqual(JSON.parse(result), [
    '/uploads/team-members/existing.png',
    '/uploads/team-members/also-existing.png',
    '/uploads/team-members/new-photo-123.png',
  ]);
});

test('getUploadFieldLimit keeps photo files at 10MB and videos at 1000MB', () => {
  assert.equal(getUploadFieldLimit('photo'), 10 * 1024 * 1024);
  assert.equal(getUploadFieldLimit('image'), 10 * 1024 * 1024);
  assert.equal(getUploadFieldLimit('video'), 1000 * 1024 * 1024);
  assert.equal(getUploadFieldLimit('media', 'image-or-video', 'image'), 10 * 1024 * 1024);
  assert.equal(getUploadFieldLimit('media', 'image-or-video', 'video'), 1000 * 1024 * 1024);
  assert.equal(getUploadFieldLimit('file'), 10 * 1024 * 1024);
});
