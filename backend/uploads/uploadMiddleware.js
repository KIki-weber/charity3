import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';

import { attachUploadedFile, attachUploadedFiles } from './uploadHelpers.js';

export const resolveUploadDirectory = () => {
  const configuredUploadDir = process.env.UPLOADS_DIR || process.env.UPLOAD_DIRECTORY;
  if (configuredUploadDir) {
    if (/^(?:[A-Za-z]:)?[\\/]/.test(configuredUploadDir) || configuredUploadDir.startsWith('~')) {
      return configuredUploadDir.replace(/\\/g, '/');
    }

    return path.resolve(configuredUploadDir);
  }

  return path.resolve(process.cwd(), 'uploads');
};

const rootUploadDirectory = resolveUploadDirectory();

fs.mkdirSync(rootUploadDirectory, { recursive: true });

export const getUploadFieldLimit = (fieldName = 'file', mediaType = '', uploadType = '') => {
  const normalizedFieldName = String(fieldName || 'file').toLowerCase();

  if (
    normalizedFieldName.includes('video')
    || mediaType === 'video'
    || (mediaType === 'image-or-video' && uploadType === 'video')
  ) {
    return 1000 * 1024 * 1024;
  }

  if (
    normalizedFieldName.includes('photo') ||
    normalizedFieldName.includes('image') ||
    normalizedFieldName.includes('logo') ||
    normalizedFieldName.includes('qr') ||
    normalizedFieldName.includes('barcode') ||
    normalizedFieldName.includes('file') ||
    normalizedFieldName.includes('pdf') ||
    normalizedFieldName.includes('document')
  ) {
    return 10 * 1024 * 1024;
  }

  return 10 * 1024 * 1024;
};

const sanitizeFolderName = (folderName = 'general') => String(folderName || 'general')
  .replace(/\\/g, '/')
  .replace(/^\/+|\/+$/g, '')
  .split('/')
  .filter(Boolean)
  .join('/')
  .replace(/[^a-zA-Z0-9._/-]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'general';

const getUploadTargetDirectory = (req = {}) => {
  const folderName = sanitizeFolderName(req.uploadModelName || 'general');
  const targetDirectory = path.join(rootUploadDirectory, folderName);
  fs.mkdirSync(targetDirectory, { recursive: true });
  return targetDirectory;
};

const storage = multer.diskStorage({
  destination: (req, _file, callback) => {
    callback(null, getUploadTargetDirectory(req));
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname || '').toLowerCase();
    const baseName = path
      .basename(file.originalname || 'upload', extension)
      .replace(/[^a-zA-Z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();

    callback(null, `${Date.now()}-${baseName || 'file'}${extension}`);
  },
});

const fileFilter = (req, file, callback) => {
  const fieldDefinition = req.uploadFieldDefinitions?.find(({ name }) => name === file.fieldname);
  const mediaType = fieldDefinition?.mediaType;
  const mimeType = String(file.mimetype || '').toLowerCase();
  const extension = path.extname(file.originalname || '').toLowerCase();
  const imageFile = mimeType.startsWith('image/') || /\.(jpe?g|jfif|pjpeg|pjp|png|gif|webp|bmp|svg|avif)$/.test(extension);
  const videoFile = mimeType.startsWith('video/') || /\.(mp4|webm|ogg|mov|m4v|avi|mkv)$/.test(extension);
  const documentFile = /\.(pdf|docx?|xlsx?|pptx?|txt|csv|rtf)$/.test(extension)
    || /^(application\/pdf|application\/msword|application\/vnd\.(openxmlformats-officedocument|ms-excel|ms-powerpoint)|text\/(plain|csv|rtf))$/.test(mimeType);
  const accepted = mediaType === 'image'
    ? imageFile
    : mediaType === 'video'
      ? videoFile
      : mediaType === 'document'
        ? documentFile
        : mediaType === 'image-or-video'
          ? imageFile || videoFile
          : true;

  if (!accepted) {
    callback(new Error(`Unsupported file type for ${file.fieldname}.`));
    return;
  }

  callback(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1000 * 1024 * 1024,
  },
});

export const createFieldUpload = (fieldDefinitions = [], modelName = 'general') => {
  const multerFields = fieldDefinitions.map(({ name, maxCount = 1 }) => ({
    name,
    maxCount,
  }));

  return [
    (req, _res, next) => {
      req.uploadModelName = modelName;
      req.uploadFieldDefinitions = fieldDefinitions;
      next();
    },
    upload.fields(multerFields),
    (req, _res, next) => {
      if (!req.files) {
        return next();
      }

      const uploadedFiles = Object.values(req.files).flat();
      const oversizedFile = uploadedFiles.find((file) => {
        const definition = fieldDefinitions.find(({ name }) => name === file.fieldname);
        const extension = path.extname(file.originalname || '').toLowerCase();
        const mediaType = file.mimetype?.startsWith('video/') || /\.(mp4|webm|ogg|mov|m4v|avi|mkv)$/.test(extension)
          ? 'video'
          : 'image';
        return file.size > getUploadFieldLimit(file.fieldname, definition?.mediaType, mediaType);
      });

      if (oversizedFile) {
        uploadedFiles.forEach((file) => fs.unlinkSync(file.path));
        const definition = fieldDefinitions.find(({ name }) => name === oversizedFile.fieldname);
        const extension = path.extname(oversizedFile.originalname || '').toLowerCase();
        const mediaType = oversizedFile.mimetype?.startsWith('video/') || /\.(mp4|webm|ogg|mov|m4v|avi|mkv)$/.test(extension)
          ? 'video'
          : 'image';
        const maximumSize = getUploadFieldLimit(oversizedFile.fieldname, definition?.mediaType, mediaType);
        return next(new Error(`File too large for ${oversizedFile.fieldname}. Maximum allowed size is ${maximumSize / (1024 * 1024)}MB.`));
      }

      fieldDefinitions.forEach((fieldDefinition) => {
        const { name } = fieldDefinition;
        const uploadedValue = req.files[name];

        if (!uploadedValue || uploadedValue.length === 0) {
          return;
        }

        const resolvedModelFolder = req.uploadModelName || modelName || 'general';

        if (uploadedValue.length === 1 && !fieldDefinition.multiple && (fieldDefinition.maxCount ?? 1) === 1) {
          req.body[name] = attachUploadedFile(req, name, uploadedValue[0], resolvedModelFolder);
        } else {
          req.body[name] = attachUploadedFiles(req, name, uploadedValue, resolvedModelFolder);
        }
      });

      next();
    },
  ];
};

export const uploadSingle = (fieldName = 'file', modelName = 'general') => [
  (req, _res, next) => {
    req.uploadModelName = modelName;
    next();
  },
  upload.single(fieldName),
  (req, _res, next) => {
    if (req.file) {
      req.body[fieldName] = attachUploadedFile(req, fieldName, req.file, req.uploadModelName || modelName);
    }
    next();
  },
];

export const uploadMultiple = (fieldName = 'files', maxCount = 10, modelName = 'general') => [
  (req, _res, next) => {
    req.uploadModelName = modelName;
    next();
  },
  upload.array(fieldName, maxCount),
  (req, _res, next) => {
    if (req.files && req.files.length > 0) {
      req.body[fieldName] = attachUploadedFiles(req, fieldName, req.files, req.uploadModelName || modelName);
    }
    next();
  },
];
