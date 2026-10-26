import path from 'node:path';

const sanitizeUploadFolder = (folderName = 'general') => {
  const safeFolderName = String(folderName || 'general')
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '')
    .split('/')
    .filter(Boolean)
    .join('/');

  return (safeFolderName || 'general')
    .replace(/[^a-zA-Z0-9._/-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'general';
};

const normalizeUploadValues = (value) => {
  if (Array.isArray(value)) {
    return value.flatMap(normalizeUploadValues);
  }

  if (typeof value === 'string') {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return [];
    }

    try {
      const parsedValue = JSON.parse(trimmedValue);
      if (parsedValue !== trimmedValue) {
        return normalizeUploadValues(parsedValue);
      }
    } catch {
      // A plain URL or path is a single upload value.
    }

    return [trimmedValue];
  }

  if (value && typeof value === 'object') {
    const source = value.url || value.path || value.src || value.filename;
    return source ? normalizeUploadValues(source) : [];
  }

  return [];
};

export const getUploadUrl = (value = '') => {
  if (!value) {
    return '';
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const normalizedValue = value.replace(/\\/g, '/').replace(/^\/+/, '');

  if (!normalizedValue) {
    return '';
  }

  if (normalizedValue.startsWith('uploads/')) {
    return `/${normalizedValue}`;
  }

  const matchedUploadsPath = normalizedValue.match(/(?:^|\/)uploads\/(.+)$/i);
  if (matchedUploadsPath) {
    return `/uploads/${matchedUploadsPath[1]}`;
  }

  const fileName = normalizedValue.split('/').pop();
  return fileName ? `/uploads/${fileName}` : value;
};

export const buildUploadPayload = (file = {}, fieldName = 'file', modelFolder = 'general') => {
  const rawValue = file.path || file.filename || file.originalname || '';
  const normalizedValue = rawValue.replace(/\\/g, '/');
  const safeFolderName = sanitizeUploadFolder(modelFolder);
  const resolvedFileName = file.filename || path.basename(normalizedValue || 'upload');
  const matchedUploadsPath = normalizedValue.match(/(?:^|\/)uploads\/(.+)$/i);

  const relativePath = matchedUploadsPath
    ? `uploads/${matchedUploadsPath[1]}`
    : `uploads/${safeFolderName}/${resolvedFileName}`;

  return {
    fieldName,
    fileName: resolvedFileName,
    path: relativePath,
    url: getUploadUrl(relativePath),
  };
};

export const attachUploadedFile = (req, fieldName, file, modelFolder = req?.uploadModelName || 'general') => {
  if (!file) {
    return req.body[fieldName];
  }

  req.body[fieldName] = buildUploadPayload(file, fieldName, modelFolder).url;
  return req.body[fieldName];
};

export const attachUploadedFiles = (req, fieldName, files = [], modelFolder = req?.uploadModelName || 'general') => {
  const existingUrls = normalizeUploadValues(req.body[fieldName]);
  const uploadedUrls = (files || [])
    .map((file) => buildUploadPayload(file, fieldName, modelFolder).url);
  const urls = [...new Set([...existingUrls, ...uploadedUrls])];
  req.body[fieldName] = JSON.stringify(urls);
  return req.body[fieldName];
};
