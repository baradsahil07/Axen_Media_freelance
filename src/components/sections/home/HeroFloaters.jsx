'use client';

import { useEffect, useRef, useState } from 'react';

/*
  Decorative pop-in elements around the hero headline.
  - Outer wrapper  -> data-pop (HomeHero animates the pop-in)
  - Inner wrapper  -> CSS float loop (starts after the pop-in, runs forever)

  Put your avatar files in public/images/home/creators/
  or change the src values below.
*/

const AVATARS = [
  {
    src: '/images/home/creators/creator-01.jpg',
    alt: 'Creator one',
    pos: 'left-[3%] top-28',
    size: 'w-[clamp(90px,11vw,190px)]',
    blob: 'bg-yellow-400',
    float: 'hf-float-a',
    delay: '0s',
  },
  {
    src: '/images/home/creators/creator-02.jpg',
    alt: 'Creator two',
    pos: 'left-[16%] top-[19rem]',
    size: 'w-[clamp(52px,5.5vw,96px)]',
    blob: 'bg-yellow-400',
    float: 'hf-float-b',
    delay: '0.6s',
  },
  {
    src: '/images/home/creators/creator-03.jpg',
    alt: 'Creator three',
    pos: 'right-[3%] top-28',
    size: 'w-[clamp(90px,11vw,190px)]',
    blob: 'bg-yellow-400',
    float: 'hf-float-b',
    delay: '0.3s',
  },
  {
    src: '/images/home/creators/creator-04.jpg',
    alt: 'Creator four',
    pos: 'right-[16%] top-[19rem]',
    size: 'w-[clamp(52px,5.5vw,96px)]',
    blob: 'bg-yellow-400',
    float: 'hf-float-a',
    delay: '0.9s',
  },
];

const FLOATERS = [
  {
    pos: 'left-[9%] top-24',
    cls: 'w-2.5 h-2.5 bg-red-400 rounded-full',
    float: 'hf-float-a',
    delay: '0.2s',
  },
  {
    pos: 'left-[22%] top-52',
    cls: 'w-2 h-2 bg-yellow-400 rounded-full',
    float: 'hf-float-b',
    delay: '0.7s',
  },
  {
    pos: 'right-[8%] top-24',
    cls: 'w-2.5 h-2.5 bg-red-400 rounded-full',
    float: 'hf-float-b',
    delay: '0.4s',
  },
  {
    pos: 'right-[24%] top-60',
    cls: 'w-2 h-2 bg-yellow-400 rounded-full',
    float: 'hf-float-a',
    delay: '1s',
  },
  {
    pos: 'right-[4%] top-[17rem]',
    cls: 'w-1.5 h-1.5 bg-neutral-300 rounded-full',
    float: 'hf-float-a',
    delay: '0.5s',
  },
];

const pad = (n, l = 2) => String(n).padStart(l, '0');

/* ---------- Left card: timeline that keeps "playing" ---------- */
function TimelineCard() {
  const LOOP_MS = 8000; // one full pass of the timeline
  const FPS = 25;
  const [elapsed, setElapsed] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const start = performance.now();
    let last = 0;
    const tick = (now) => {
      // update ~25 times per second (matches the frame counter)
      if (now - last >= 1000 / FPS) {
        last = now;
        setElapsed((now - start) % LOOP_MS);
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const totalSec = Math.floor(elapsed / 1000);
  const frames = Math.floor((elapsed % 1000) / (1000 / FPS));
  const timecode = `00:00:${pad(totalSec)}:${pad(frames)}`;
  const progress = (elapsed / LOOP_MS) * 100;

  return (
    <div className="rounded-lg bg-white p-2.5 text-left shadow-md">
      <div className="mb-1.5 flex items-center justify-between text-[10px] font-medium text-neutral-600">
        <span className="flex items-center gap-1">
          <span className="hf-blink h-1.5 w-1.5 rounded-full bg-red-500" />
          EDITING
        </span>
        <span className="tabular-nums">{timecode}</span>
      </div>
      <div className="relative h-2 rounded-full bg-yellow-300">
        <div className="h-full rounded-full bg-neutral-900" style={{ width: `${progress}%` }} />
        {/* playhead */}
        <span
          className="absolute top-1/2 h-3.5 w-1 -translate-y-1/2 rounded-full bg-red-500"
          style={{ left: `calc(${progress}% - 2px)` }}
        />
      </div>
    </div>
  );
}

/* ---------- Right card: export that loops ---------- */
function ExportCard() {
  const EXPORT_MS = 4500; // 0 -> 100%
  const HOLD_MS = 1200; // stay on "Done" before restarting
  const [pct, setPct] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    let start = performance.now();
    const tick = (now) => {
      const t = now - start;
      if (t < EXPORT_MS) {
        setPct(Math.min(100, Math.floor((t / EXPORT_MS) * 100)));
      } else if (t < EXPORT_MS + HOLD_MS) {
        setPct(100);
      } else {
        start = now; // restart loop
        setPct(0);
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const done = pct >= 100;

  return (
    <div className="rounded-lg bg-white p-2.5 text-left shadow-md">
      <div className="flex items-center gap-2">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-md text-[10px] text-white transition-colors ${
            done ? 'bg-green-500' : 'bg-neutral-900'
          }`}
        >
          {done ? '✓' : '▶'}
        </span>
        <div className="leading-tight">
          <p className="text-[11px] font-semibold text-neutral-900">final_cut_v2.mp4</p>
          <p className="text-[10px] tabular-nums text-neutral-500">
            {done ? 'Export complete' : `Exporting… ${pct}%`}
          </p>
        </div>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-neutral-200">
        <div
          className={`h-full rounded-full transition-colors ${
            done ? 'bg-green-500' : 'bg-yellow-400'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function HeroFloaters() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 hidden md:block">
      {/* float keyframes */}
      <style>{`
        @keyframes hf-float-a {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
          50%      { transform: translate3d(0, -14px, 0) rotate(1.5deg); }
        }
        @keyframes hf-float-b {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
          50%      { transform: translate3d(0, 12px, 0) rotate(-1.5deg); }
        }
        @keyframes hf-blink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.25; }
        }
        .hf-float-a { animation: hf-float-a 5s ease-in-out infinite; }
        .hf-float-b { animation: hf-float-b 6s ease-in-out infinite; }
        .hf-blink   { animation: hf-blink 1s steps(2, jump-none) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .hf-float-a, .hf-float-b, .hf-blink { animation: none; }
        }
      `}</style>

      <div className="relative mx-auto h-full w-full max-w-[1680px]">
        {/* Avatars */}
        {AVATARS.map((a) => (
          <div
            key={a.src}
            data-pop="avatar"
            className={`absolute ${a.pos} ${a.size} aspect-square`}
          >
            <div
              className={`relative h-full w-full ${a.float}`}
              style={{ animationDelay: a.delay }}
            >
              <span
                className={`absolute inset-0 -translate-x-1 translate-y-1 rounded-full ${a.blob}`}
              />
              <img
                src={a.src}
                alt={a.alt}
                loading="eager"
                className="relative h-full w-full rounded-full border-4 border-white object-cover shadow-md"
              />
            </div>
          </div>
        ))}

        {/* Left card: timeline */}
        <div
          data-pop="card-left"
          className="absolute left-[2%] top-[24rem] w-[clamp(120px,12vw,210px)]"
        >
          <div className="hf-float-b" style={{ animationDelay: '0.4s' }}>
            <TimelineCard />
          </div>
        </div>

        {/* Right card: export */}
        <div
          data-pop="card-right"
          className="absolute right-[2%] top-[24rem] w-[clamp(130px,13vw,230px)]"
        >
          <div className="hf-float-a" style={{ animationDelay: '0.8s' }}>
            <ExportCard />
          </div>
        </div>

        {/* Floaters */}
        {FLOATERS.map((f, i) => (
          <span key={i} data-pop="floater" className={`absolute ${f.pos}`}>
            <span className={`block ${f.cls} ${f.float}`} style={{ animationDelay: f.delay }} />
          </span>
        ))}
      </div>
    </div>
  );
}

export default HeroFloaters;
