import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SmartImage } from '@/components/media/SmartImage';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { isEmbed, isVimeo, fetchVimeoThumb } from '@/lib/video';

const EASE = [0.22, 1, 0.36, 1];

function Corner({ pos }) {
  const base =
    'absolute z-20 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]';
  const size = 'h-[max(0.55rem,1.25cqw)] w-[max(0.55rem,1.25cqw)] border-white';
  const map = {
    tl: 'left-[var(--b)] top-[var(--b)] border-l-[1.5px] border-t-[1.5px]',
    tr: 'right-[var(--b)] top-[var(--b)] border-r-[1.5px] border-t-[1.5px]',
    bl: 'bottom-[var(--b)] left-[var(--b)] border-b-[1.5px] border-l-[1.5px]',
    br: 'bottom-[var(--b)] right-[var(--b)] border-b-[1.5px] border-r-[1.5px]',
  };
  return <span aria-hidden="true" className={`${base} ${size} ${map[pos]}`} />;
}

export function VideoCard({ item, onPlay, index = 0 }) {
  const reduced = useReducedMotion();
  const videoRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [everHovered, setEverHovered] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [autoPoster, setAutoPoster] = useState(null);

  // Vimeo links without a poster get their thumbnail fetched automatically
  useEffect(() => {
    if (item.poster || !isVimeo(item.video)) return;
    let alive = true;
    fetchVimeoThumb(item.video).then((t) => alive && setAutoPoster(t));
    return () => {
      alive = false;
    };
  }, [item.poster, item.video]);

  const poster = item.poster || autoPoster;
  const canPreview = Boolean(item.video) && !isEmbed(item.video) && !reduced && !failed;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    if (hovered) v.play().catch(() => {});
    else v.pause();
  }, [hovered, everHovered]);

  const open = () => onPlay?.(item);

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE, delay: reduced ? 0 : index * 0.1 }}
      className="group"
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={`Play ${item.title ?? 'video'}`}
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            open();
          }
        }}
        onPointerEnter={(e) => {
          if (e.pointerType !== 'mouse') return;
          setHovered(true);
          setEverHovered(true);
        }}
        onPointerLeave={() => setHovered(false)}
        className="cursor-pointer rounded-[max(0.9rem,1.9cqw)] bg-white p-[max(0.2rem,0.4cqw)] shadow-[0_0_0_1px_#F1F1F1,0_0.3cqw_1.2cqw_rgba(0,0,0,0.05)] outline-none transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[0.4cqw] hover:shadow-[0_0_0_1px_#EAEAEA,0_1cqw_2.6cqw_rgba(0,0,0,0.13)] focus-visible:ring-2 focus-visible:ring-ink/50"
      >
        <div className="relative aspect-[1.49] overflow-hidden rounded-[max(0.75rem,1.6cqw)] bg-[#1B1B1B] [--b:max(0.7rem,2.1cqw)] group-hover:[--b:max(0.9rem,2.7cqw)]">
          <div className="absolute inset-0 transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]">
            <SmartImage
              src={poster}
              alt={item.title ?? ''}
              position={item.position ?? 'center'}
              placeholderLabel={item.title}
            />
            {canPreview && everHovered && (
              <video
                ref={videoRef}
                muted
                loop
                playsInline
                preload="metadata"
                controls={false}
                disablePictureInPicture
                tabIndex={-1}
                aria-hidden="true"
                onLoadedData={() => setReady(true)}
                onError={() => setFailed(true)}
                className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                  ready && hovered ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <source src={item.video} type="video/mp4" />
              </video>
            )}
          </div>

          <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-700 group-hover:bg-black/15" />

          <Corner pos="tl" />
          <Corner pos="tr" />
          <Corner pos="bl" />
          <Corner pos="br" />

          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <span className="flex h-[max(1.7rem,3.2cqw)] w-[max(2.5rem,4.6cqw)] items-center justify-center rounded-[max(0.4rem,0.95cqw)] bg-[#2A2A2A]/90 backdrop-blur-sm transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:bg-primary">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="ml-[6%] h-[44%] w-auto fill-white transition-colors duration-500 group-hover:fill-ink"
              >
                <path d="M6 3.5v17a1 1 0 0 0 1.5.86l14-8.5a1 1 0 0 0 0-1.72l-14-8.5A1 1 0 0 0 6 3.5Z" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default VideoCard;
