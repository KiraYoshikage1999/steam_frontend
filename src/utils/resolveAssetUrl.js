const API_BASE = 'https://localhost:7219';
// const API_BASE = 'https://26.185.217.20:7219';

export function resolveAssetUrl(maybePath) {
  if (!maybePath || typeof maybePath !== 'string') return '';

  let s = maybePath.trim();
  if (!s) return '';

  // already absolute
  if (/^https?:\/\//i.test(s)) return s;
  if (/^data:/i.test(s)) return s;

  // normalize windows-style separators to URL separators
  s = s.replace(/\\/g, '/');

  // if the path contains a web-accessible uploads route, use that portion
  const uploadsMatch = s.match(/.*?(\/uploads\/products\/.*)$/i);
  if (uploadsMatch && uploadsMatch[1]) {
    s = uploadsMatch[1];
  }

  // make sure path is web-relative
  if (!s.startsWith('/')) {
    s = `/${s}`;
  }

  return `${API_BASE}${s}`;
}

export function resolveGameAssetPath(game) {
  if (!game || typeof game !== 'object') return '';

  const poster = game.poster ?? game.Poster;
  const images = game.images ?? game.Images;

  if (typeof poster === 'string' && poster.trim()) {
    return poster.trim();
  }

  if (poster && typeof poster === 'object') {
    return (poster.url || poster.Url || poster.path || poster.Path || '').trim();
  }

  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];
    if (typeof first === 'string' && first.trim()) {
      return first.trim();
    }
    if (first && typeof first === 'object') {
      return (first.url || first.Url || first.path || first.Path || '').trim();
    }
  }

  return '';
}

