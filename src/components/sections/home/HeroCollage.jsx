// import { useRef } from 'react';
// import { useGSAP } from '@gsap/react';
// import { gsap, ScrollTrigger } from '@/lib/gsap';
// import { SmartImage } from '@/components/media/SmartImage';
// import { useReducedMotion } from '@/hooks/useReducedMotion';
// import { HERO_COLLAGE_ROWS } from '@/data/heroCollage';

// const ROW_RATIO = '5.73 / 1'; // Figma row proportions

// export function HeroCollage() {
//   const ref = useRef(null);
//   const prefersReduced = useReducedMotion();

//   useGSAP(
//     () => {
//       if (prefersReduced) return;

//       const tiles = gsap.utils.toArray('.collage-tile');

//       gsap.set(tiles, { opacity: 0, y: 40 });
//       ScrollTrigger.batch(tiles, {
//         start: 'top 92%',
//         once: true,
//         onEnter: (batch) =>
//           gsap.to(batch, {
//             opacity: 1,
//             y: 0,
//             duration: 0.9,
//             ease: 'power3.out',
//             stagger: 0.08,
//           }),
//       });

//       // Settles from a slight zoom to exactly 1, always around the centre
//       tiles.forEach((tile) => {
//         gsap.fromTo(
//           tile.querySelector('.collage-img'),
//           { scale: 1.12, transformOrigin: '50% 50%' },
//           {
//             scale: 1,
//             duration: 1.6,
//             ease: 'power3.out',
//             scrollTrigger: { trigger: tile, start: 'top 92%', once: true },
//           }
//         );
//       });
//     },
//     { scope: ref, dependencies: [prefersReduced] }
//   );

//   return (
//     <div ref={ref} className="mx-auto w-full max-w-[1680px] space-y-3 sm:space-y-5 px-8">
//       {HERO_COLLAGE_ROWS.map((row) => (
//         <div
//           key={row.id}
//           className={`grid ${row.cols} gap-3 sm:gap-4`}
//           style={{ aspectRatio: ROW_RATIO }}
//         >
//           {row.tiles.map((tile) => (
//             <div
//               key={tile.src}
//               className="collage-tile relative h-full w-full overflow-hidden rounded-lg bg-surface sm:rounded-xl"
//             >
//               <div className="collage-img absolute inset-0 will-change-transform">
//                 <SmartImage
//                   src={tile.src}
//                   alt={tile.alt}
//                   position={tile.position ?? 'center'}
//                   placeholderLabel={tile.label}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default HeroCollage;

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { SmartImage } from '@/components/media/SmartImage';
import { CursorFollower } from '@/components/animations/CursorFollower';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { HERO_VIDEO } from '@/data/heroCollage';

const FRAME_RATIO = '16 / 9';

export function HeroCollage() {
  const wrapRef = useRef(null);
  const frameRef = useRef(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useGSAP(
    () => {
      if (prefersReduced) return;

      gsap.fromTo(
        frameRef.current,
        { opacity: 0, y: 60, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: frameRef.current, start: 'top 92%', once: true },
        }
      );

      gsap.fromTo(
        '.hero-video-media',
        { scale: 1.12, transformOrigin: '50% 50%' },
        {
          scale: 1,
          duration: 1.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: frameRef.current, start: 'top 92%', once: true },
        }
      );
    },
    { scope: wrapRef, dependencies: [prefersReduced] }
  );

  useEffect(() => {
    const v = videoRef.current;
    if (prefersReduced || failed || !v) return;

    v.muted = true;
    if (v.readyState >= 2) setReady(true);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.2 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [prefersReduced, failed]);

  const handleClick = () => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) navigate('/contact');
  };

  const showVideo = Boolean(HERO_VIDEO.video) && !prefersReduced && !failed;

  return (
    <div ref={wrapRef} className="mx-auto w-full max-w-[1680px]">
      <div
        ref={frameRef}
        onClick={handleClick}
        className="hero-video-frame group relative w-full overflow-hidden rounded-xl bg-surface sm:rounded-3xl [@media(hover:hover)]:cursor-none"
        style={{ aspectRatio: FRAME_RATIO }}
      >
        <div className="hero-video-media absolute inset-0 will-change-transform">
          <div className="absolute inset-0 transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
            <SmartImage
              src={HERO_VIDEO.poster}
              alt={HERO_VIDEO.alt}
              position={HERO_VIDEO.position}
              placeholderLabel="Hero video poster"
            />

            {showVideo && (
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                controls={false}
                disablePictureInPicture
                tabIndex={-1}
                aria-hidden="true"
                onLoadedData={() => setReady(true)}
                onPlaying={() => setReady(true)}
                onError={() => setFailed(true)}
                className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                  ready ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ objectPosition: HERO_VIDEO.position }}
              >
                {HERO_VIDEO.videoWebm && <source src={HERO_VIDEO.videoWebm} type="video/webm" />}
                <source src={HERO_VIDEO.video} type="video/mp4" />
              </video>
            )}
          </div>
        </div>
      </div>

      <CursorFollower
        containerRef={wrapRef}
        targetSelector=".hero-video-frame"
        label="Contact us"
      />
    </div>
  );
}

export default HeroCollage;
