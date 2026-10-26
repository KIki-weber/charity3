export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
export const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || '';

export const toApiUrl = (value = '') => {
  if (typeof value !== 'string' || !value.trim()) return '';

  const trimmedValue = value.trim();
  if (/^(https?:|data:|blob:)/i.test(trimmedValue)) return trimmedValue;
  if (trimmedValue.startsWith('//') && !/^\/\/uploads\//i.test(trimmedValue)) {
    return trimmedValue;
  }

  const normalizedValue = trimmedValue.replace(/\\/g, '/');
  const uploadsPath = normalizedValue.match(/(?:^|\/)uploads\/(.+)$/i);
  const publicPath = uploadsPath
    ? `/uploads/${uploadsPath[1]}`
    : normalizedValue.startsWith('/')
      ? normalizedValue
      : `/${normalizedValue}`;

  const baseUrl = BACKEND_BASE_URL ? BACKEND_BASE_URL.replace(/\/+$/, '') : '';
  return baseUrl ? `${baseUrl}${publicPath}` : publicPath;
};
