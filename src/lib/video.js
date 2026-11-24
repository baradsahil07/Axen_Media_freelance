export const isVimeo = (url) => /vimeo\.com/i.test(url || '');
export const isYouTube = (url) => /(youtube\.com|youtu\.be)/i.test(url || '');
export const isEmbed = (url) => isVimeo(url) || isYouTube(url);

// Supports https://vimeo.com/123 and unlisted https://vimeo.com/123/abcdef
export function getVimeoEmbedUrl(url) {
  const m = (url || '').match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([a-zA-Z0-9]+))?/);
  if (!m) return url;
  const [, id, hash] = m;
  return `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0${
    hash ? `&h=${hash}` : ''
  }`;
}

export function getYouTubeEmbedUrl(url) {
  const m = (url || '').match(/(?:youtu\.be\/|v=)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=1` : url;
}

export function getEmbedUrl(url) {
  if (isVimeo(url)) return getVimeoEmbedUrl(url);
  if (isYouTube(url)) return getYouTubeEmbedUrl(url);
  return url;
}

// Auto thumbnail for Vimeo links, so no poster image is needed
const thumbCache = new Map();
export async function fetchVimeoThumb(url) {
  if (thumbCache.has(url)) return thumbCache.get(url);
  try {
    const res = await fetch(
      `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}&width=960`
    );
    if (!res.ok) throw new Error('oembed failed');
    const data = await res.json();
    thumbCache.set(url, data.thumbnail_url);
    return data.thumbnail_url;
  } catch {
    return null;
  }
}
