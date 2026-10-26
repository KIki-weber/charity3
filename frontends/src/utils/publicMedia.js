import { toApiUrl } from './apiUrl';

const normalizeMediaSources = (value) => {
  if (value === null || value === undefined || value === '') {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(normalizeMediaSources);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (parsed !== trimmed) {
        return normalizeMediaSources(parsed);
      }
    } catch {
      // Plain URLs and file paths are single media sources.
    }

    return [trimmed];
  }

  if (typeof value === 'object') {
    const source = value.url ?? value.path ?? value.src ?? value.filePath ?? value.filename;
    if (!source) return [];

    const sources = normalizeMediaSources(source);
    return sources.map((entry) => ({
      source: entry,
      type: value.mimeType ?? value.contentType ?? value.type ?? '',
    }));
  }

  return [];
};

const getMediaKind = (source, typeHint = '') => {
  const value = String(source).toLowerCase();
  const mimeType = String(typeHint).toLowerCase();

  if (mimeType.startsWith('video/') || /\.(mp4|webm|ogg|mov|m4v|avi|mkv)(?:[?#].*)?$/.test(value)) {
    return 'video';
  }

  if (mimeType.startsWith('image/') || /\.(jpg|jpeg|jfif|pjpeg|pjp|png|gif|webp|bmp|svg|avif)(?:[?#].*)?$/.test(value) || value.startsWith('data:image/')) {
    return 'image';
  }

  if (mimeType === 'application/pdf' || /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|rtf)(?:[?#].*)?$/.test(value)) {
    return 'document';
  }

  return '';
};

export const getPublicMediaItems = (record) => {
  const fieldSources = [
    ['photo', record?.photo],
    ['photos', record?.photos],
    ['image', record?.image],
    ['images', record?.images],
    ['video', record?.video],
    ['file', record?.file],
    ['files', record?.files],
    ['media', record?.media],
  ];
  const seen = new Set();

  return fieldSources.flatMap(([field, value]) =>
    normalizeMediaSources(value).flatMap((entry) => {
      const source = typeof entry === 'string' ? entry : entry.source;
      const typeHint = typeof entry === 'string' ? '' : entry.type;
      const url = toApiUrl(source);
      if (!url || seen.has(url)) return [];

      seen.add(url);
      const inferredKind = getMediaKind(source, typeHint);
      return [{
        source,
        url,
        kind: inferredKind || (
          field === 'video'
            ? 'video'
            : ['photo', 'photos', 'image', 'images'].includes(field)
              ? 'image'
              : 'document'
        ),
        key: url,
      }];
    })
  );
};
