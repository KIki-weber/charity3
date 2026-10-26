import express from 'express';

import { createFieldUpload, uploadSingle, uploadMultiple } from '../uploads/uploadMiddleware.js';

const router = express.Router();

router.post('/single', ...uploadSingle('file', 'general-files'), (req, res) => {
  res.status(200).json({
    message: 'File uploaded successfully',
    file: req.body.file || null,
  });
});

router.post('/multiple', ...uploadMultiple('files', 10, 'general-files'), (req, res) => {
  let files = [];

  if (req.body.files) {
    try {
      files = JSON.parse(req.body.files);
    } catch (_error) {
      files = Array.isArray(req.body.files) ? req.body.files : [req.body.files];
    }
  }

  res.status(200).json({
    message: 'Files uploaded successfully',
    files,
  });
});

router.post('/media', ...createFieldUpload([
  { name: 'photo', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'file', maxCount: 1 },
], 'media-library'), (req, res) => {
  res.status(200).json({
    message: 'Media uploaded successfully',
    photo: req.body.photo || null,
    video: req.body.video || null,
    file: req.body.file || null,
  });
});

export default router;
