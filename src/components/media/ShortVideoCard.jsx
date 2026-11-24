import { useEffect, useState } from 'react';
import { Play, Maximize2, X } from 'lucide-react';
import { resolveAsset } from '@/lib/assets';
import { cn } from '@/lib/utils';

/* ---------- Vimeo helpers ---------- */

const VIMEO_RE = /vimeo\.com\/(?:video\/)?(\d+)(?:\/([a-zA-Z0-9]+))?/;

function parseVimeo(url) {
  const m = typeof url === 'string' ? url.match(VIMEO_RE) : null;
  return m ? { id: m[1], hash: m[2] } : null;
}

const metaCache = new Map();

// Fetches thumbnail + duration from Vimeo's public oEmbed endpoint (cached per URL).
function fetchVimeoMeta(url) {
  if (!metaCache.has(url)) {
    metaCache.set(
      url,
      fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}&width=640`)
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error('oembed failed'))))
        .then((d) => ({ thumb: d.thumbnail_url, duration: d.duration }))
        .catch(() => null)
    );
  }
  return metaCache.get(url);
}

function useVimeoMeta(url, enabled) {
  const [meta, setMeta] = useState(null);
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    fetchVimeoMeta(url).then((m) => {
      if (!cancelled) setMeta(m);
    });
    return () => {
      cancelled = true;
    };
  }, [url, enabled]);
  return meta;
}

const fmt = (s) => {
  if (!Number.isFinite(s)) return '';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

/* ---------- Card ---------- */

export function ShortVideoCard({ item, isPlaying, onPlay, onStop, onExpand, className }) {
  const vimeo = parseVimeo(item.video);
  const meta = useVimeoMeta(item.video, Boolean(vimeo));
  const fileSrc = vimeo ? null : resolveAsset(item.video);

  const embedSrc = vimeo
    ? `https://player.vimeo.com/video/${vimeo.id}?autoplay=1&playsinline=1&title=0&byline=0&portrait=0${
        vimeo.hash ? `&h=${vimeo.hash}` : ''
      }`
    : null;

  const title = item.title ?? item.name ?? 'Short video';

  return (
    <div
      className={cn(
        'group relative aspect-[193/309] w-full select-none overflow-hidden rounded-[max(0.6rem,0.85cqw)] bg-ink',
        className
      )}
    >
      {isPlaying ? (
        <>
          {embedSrc ? (
            <iframe
              src={embedSrc}
              title={title}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <video
              src={fileSrc}
              controls
              autoPlay
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {/* Close + expand (YouTube-style) controls */}
          <div className="absolute right-2 top-2 z-20 flex gap-1.5">
            <button
              type="button"
              onClick={() => onExpand?.(item)}
              aria-label="Open in large player"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white outline-none transition-colors hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onStop?.()}
              aria-label="Close video"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white outline-none transition-colors hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => onPlay?.(item.id)}
          aria-label={`Play ${title}`}
          className="absolute inset-0 block h-full w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
        >
          {/* Thumbnail taken from the video itself */}
          {meta?.thumb ? (
            <img
              src={meta.thumb}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
            />
          ) : fileSrc ? (
            <video
              src={`${fileSrc}#t=0.1`}
              preload="metadata"
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full animate-pulse bg-[#1c1c1c]" />
          )}

          {meta?.duration ? (
            <span className="pointer-events-none absolute left-[8%] top-[6%] rounded bg-black/60 px-1.5 py-0.5 text-[length:max(0.55rem,0.7cqw)] font-medium leading-none text-white">
              {fmt(meta.duration)}
            </span>
          ) : null}

          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="flex h-[max(2rem,3.2cqw)] w-[max(2.6rem,4.2cqw)] items-center justify-center rounded-[max(0.4rem,0.7cqw)] bg-[#1c1c1c]/85 text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110">
              <Play className="h-[42%] w-[42%] fill-white" strokeWidth={0} aria-hidden="true" />
            </span>
          </span>

          <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent px-[8%] pb-[6%] pt-[18%] text-left">
            <span className="block truncate text-[length:max(0.7rem,0.95cqw)] font-bold leading-tight tracking-tight text-white">
              {title}
            </span>
            {item.platform ? (
              <span className="mt-[0.15rem] block text-[length:max(0.55rem,0.7cqw)] font-medium leading-tight text-white/90">
                {item.platform}
              </span>
            ) : null}
          </span>
        </button>
      )}
    </div>
  );
}

export default ShortVideoCard;
