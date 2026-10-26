import { toApiUrl } from './apiUrl';
import { getPublicMediaItems } from './publicMedia';

export const normalizeMediaValues = (value) => {
  if (value === null || value === undefined || value === '') return [];

  if (Array.isArray(value)) {
    return value.flatMap((entry) => normalizeMediaValues(entry));
  }

  if (typeof File !== 'undefined' && value instanceof File) return [value];

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (parsed !== trimmed) return normalizeMediaValues(parsed);
    } catch {
      // Plain URLs and paths are individual media values.
    }

    return [trimmed];
  }

  if (typeof value === 'object') {
    const source = value.url ?? value.path ?? value.src ?? value.filePath ?? value.filename;
    return source ? normalizeMediaValues(source) : [];
  }

  return [];
};

export const getAdminMediaPreview = (value) => {
  const [entry] = normalizeMediaValues(value);
  if (!entry) return null;

  if (typeof File !== 'undefined' && entry instanceof File) {
    return {
      url: URL.createObjectURL(entry),
      kind: entry.type.startsWith('video/') ? 'video' : entry.type.startsWith('image/') ? 'image' : 'document',
    };
  }

  return getPublicMediaItems({ media: entry })[0] || {
    url: toApiUrl(entry),
    kind: 'document',
  };
};
