import { useState, useRef, useEffect } from 'react';
import { resolveAsset } from '@/lib/assets';
import { cn } from '@/lib/utils';
import { Play, Video } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function SmartVideo({
  src,
  poster,
  mode = 'inline',
  muted = true,
  loop = true,
  className,
  containerClassName,
  onClick,
  placeholderLabel,
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReduced = useReducedMotion();

  const resolvedSrc = resolveAsset(src);
  const resolvedPoster = resolveAsset(poster);
  const displayName = placeholderLabel || src?.split('/')?.pop() || 'Video Asset';

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (!entry.isIntersecting && videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        } else if (entry.isIntersecting && mode === 'inline' && !prefersReduced) {
          const promise = videoRef.current?.play();
          if (promise !== undefined) {
            promise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          }
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [mode, prefersReduced]);

  const handleMouseEnter = () => {
    if (mode === 'hover' && isVisible && videoRef.current && !prefersReduced) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (mode === 'hover' && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
      return;
    }
    if (mode === 'click' && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={cn(
        'relative overflow-hidden bg-surface flex items-center justify-center select-none group',
        containerClassName
      )}
    >
      {resolvedSrc && !hasError ? (
        <>
          <video
            ref={videoRef}
            src={resolvedSrc}
            poster={resolvedPoster || undefined}
            muted={muted}
            loop={loop}
            playsInline
            preload="none"
            onError={() => setHasError(true)}
            className={cn('w-full h-full object-cover', className)}
          />
          {mode === 'click' && !isPlaying && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity group-hover:bg-black/30">
              <div className="w-14 h-14 rounded-full bg-primary text-ink flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                <Play className="w-6 h-6 fill-ink ml-1" />
              </div>
            </div>
          )}
        </>
      ) : resolvedPoster ? (
        <div className="relative w-full h-full">
          <img
            src={resolvedPoster}
            alt="Poster"
            className={cn('w-full h-full object-cover', className)}
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary text-ink flex items-center justify-center shadow-lg">
              <Play className="w-5 h-5 fill-ink ml-0.5" />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full min-h-[160px] flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#1E1E1E] to-[#121212] text-white/80">
          <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-3">
            <Video className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium text-white/70 max-w-[220px] truncate px-2.5 py-1 bg-white/10 rounded">
            {displayName}
          </span>
        </div>
      )}
    </div>
  );
}

export default SmartVideo;
