 const API_BASE = 'https://localhost:7219';
// const API_BASE = 'https://26.185.217.20:7219';

export function resolveAssetUrl(maybePath) {
  if (!maybePath || typeof maybePath !== 'string') return '';

  const s = maybePath.trim();
  if (!s) return '';

  // already absolute
  if (/^https?:\/\//i.test(s)) return s;
  if (/^data:/i.test(s)) return s;

  // normalize slashes
  const withLeadingSlash = s.startsWith('/') ? s : `/${s}`;
  return `${API_BASE}${withLeadingSlash}`;
}

