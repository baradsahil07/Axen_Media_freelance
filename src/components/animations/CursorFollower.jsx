import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from '@/lib/gsap';

const FOLLOW_LAG = 0.8;
const SHOW_TIME = 0.7;
const HIDE_TIME = 0.5;
const RING_A_SECONDS = 11;
const RING_B_SECONDS = 17;

export function CursorFollower({
  containerRef,
  targetSelector = '.collage-tile',
  label = 'Contact us',
}) {
  const posRef = useRef(null);
  const bubbleRef = useRef(null);
  const ringARef = useRef(null);
  const ringBRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!container || !finePointer) return;

    let visible = false;
    let raf = 0;
    const last = { x: 0, y: 0 };

    const ctx = gsap.context(() => {
      gsap.set(posRef.current, { xPercent: -50, yPercent: -50, x: -300, y: -300 });
      gsap.set(bubbleRef.current, { scale: 0, opacity: 0 });

      const xTo = gsap.quickTo(posRef.current, 'x', { duration: FOLLOW_LAG, ease: 'power3' });
      const yTo = gsap.quickTo(posRef.current, 'y', { duration: FOLLOW_LAG, ease: 'power3' });

      gsap.to(ringARef.current, {
        rotation: 360,
        duration: RING_A_SECONDS,
        ease: 'none',
        repeat: -1,
      });
      gsap.to(ringBRef.current, {
        rotation: -360,
        duration: RING_B_SECONDS,
        ease: 'none',
        repeat: -1,
      });

      const show = () => {
        if (visible) return;
        visible = true;
        gsap.to(bubbleRef.current, {
          scale: 1,
          opacity: 1,
          duration: SHOW_TIME,
          ease: 'power3.out',
          overwrite: true,
        });
      };

      const hide = () => {
        if (!visible) return;
        visible = false;
        gsap.to(bubbleRef.current, {
          scale: 0,
          opacity: 0,
          duration: HIDE_TIME,
          ease: 'power3.inOut',
          overwrite: true,
        });
      };

      const onMove = (e) => {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        last.x = e.clientX;
        last.y = e.clientY;

        if (e.target.closest(targetSelector)) {
          if (!visible) gsap.set(posRef.current, { x: e.clientX, y: e.clientY });
          show();
          xTo(e.clientX);
          yTo(e.clientY);
        } else {
          hide();
        }
      };

      const onDown = () => {
        if (visible)
          gsap.to(bubbleRef.current, {
            scale: 0.92,
            duration: 0.25,
            ease: 'power2.out',
            overwrite: true,
          });
      };
      const onUp = () => {
        if (visible)
          gsap.to(bubbleRef.current, {
            scale: 1,
            duration: 0.5,
            ease: 'power3.out',
            overwrite: true,
          });
      };

      const onScroll = () => {
        if (!visible || raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const el = document.elementFromPoint(last.x, last.y);
          if (!el || !el.closest(targetSelector)) hide();
        });
      };

      container.addEventListener('pointermove', onMove);
      container.addEventListener('pointerleave', hide);
      container.addEventListener('pointerdown', onDown);
      container.addEventListener('pointerup', onUp);
      window.addEventListener('scroll', onScroll, { passive: true });

      return () => {
        container.removeEventListener('pointermove', onMove);
        container.removeEventListener('pointerleave', hide);
        container.removeEventListener('pointerdown', onDown);
        container.removeEventListener('pointerup', onUp);
        window.removeEventListener('scroll', onScroll);
        cancelAnimationFrame(raf);
      };
    });

    return () => ctx.revert();
  }, [containerRef, targetSelector]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      ref={posRef}
      aria-hidden="true"
      className="pointer-events-none fixed lg:block hidden left-0 top-0 z-[60]"
    >
      <div
        ref={bubbleRef}
        className="relative flex aspect-square w-[clamp(6rem,7.4vw,9rem)] items-center justify-center rounded-full bg-primary text-ink shadow-lift"
      >
        <svg
          ref={ringARef}
          viewBox="0 0 100 100"
          fill="none"
          className="absolute left-1/2 top-1/2 h-[138%] w-[138%] -translate-x-1/2 -translate-y-1/2 overflow-visible will-change-transform"
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            stroke="currentColor"
            strokeOpacity="0.9"
            strokeWidth="0.7"
            strokeLinecap="round"
            strokeDasharray="95 207"
          />
        </svg>
        <svg
          ref={ringBRef}
          viewBox="0 0 100 100"
          fill="none"
          className="absolute left-1/2 top-1/2 h-[122%] w-[122%] -translate-x-1/2 -translate-y-1/2 overflow-visible will-change-transform"
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            stroke="currentColor"
            strokeOpacity="0.4"
            strokeWidth="0.6"
            strokeLinecap="round"
            strokeDasharray="60 242"
          />
        </svg>

        <div className="flex flex-col items-center gap-[0.25em] text-[length:clamp(0.85rem,1.05vw,1.25rem)]">
          <span className="text-center font-semibold leading-[1.05] tracking-tight">{label}</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-[1.15em] w-[1.15em]"
          >
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default CursorFollower;
