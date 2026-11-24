import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { resolveAsset } from '@/lib/assets';
import { clientLogos } from '@/data/clients';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1];

// Speed in pixels per second. The loop duration is measured from the real track
// width, so the speed feels the same no matter how many logos you have.
const SPEED_PX_PER_SEC = 70;
// On hover the marquee eases down to this fraction of full speed (never fully stops).
const HOVER_SPEED = 0.25;

const headerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

// Progressive blur: stacked backdrop-blur layers, each reaching less far inward
// and blurring more, so the blur ramps up smoothly toward the outer edge.
const BLUR_LAYERS = [
  { blur: 1, reach: 100 },
  { blur: 2, reach: 72 },
  { blur: 4, reach: 48 },
  { blur: 8, reach: 28 },
];

function EdgeBlur({ side }) {
  const toInside = side === 'left' ? 'to right' : 'to left';
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-y-0 z-10 w-[14%] ${
        side === 'left' ? 'left-0' : 'right-0'
      }`}
    >
      {BLUR_LAYERS.map(({ blur, reach }) => {
        const mask = `linear-gradient(${toInside}, #000 0%, transparent ${reach}%)`;
        return (
          <div
            key={blur}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
      {/* soft white fade on top so logos dissolve into the background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${toInside}, #fff 0%, rgba(255,255,255,0) 100%)`,
        }}
      />
    </div>
  );
}

function buildLoop(list) {
  if (!list.length) return [];
  let out = [...list];
  while (out.length < 8) out = [...out, ...list];
  return out;
}

function LogoSlot({ client }) {
  const [failed, setFailed] = useState(false);
  const url = resolveAsset(client.logo);

  return (
    <div className="flex w-[50cqw] shrink-0 items-center justify-center sm:w-[33.3333cqw] md:w-[25cqw]">
      <div className="flex h-[clamp(2.75rem,4vw,5.5rem)] max-w-[80%] items-center transition-transform duration-500 ease-out hover:scale-105">
        {url && !failed ? (
          <img
            src={url}
            alt={`${client.name} logo`}
            loading="lazy"
            decoding="async"
            draggable={false}
            onError={() => setFailed(true)}
            className="h-full w-auto max-w-full object-contain"
          />
        ) : (
          <span className="whitespace-nowrap text-[length:clamp(1.25rem,1.9vw,2.25rem)] font-semibold tracking-tight text-ink">
            {client.name}
          </span>
        )}
      </div>
    </div>
  );
}

export function BrandsMarquee() {
  const sectionRef = useRef(null);
  const rowRef = useRef(null);
  const trackRef = useRef(null);
  const prefersReduced = useReducedMotion();

  const items = useMemo(() => buildLoop(clientLogos), []);

  useGSAP(
    () => {
      if (prefersReduced || !trackRef.current) return;

      const track = trackRef.current;
      // The track holds two identical groups; one group's width is one full loop.
      const loopWidth = track.scrollWidth / 2;
      const duration = Math.max(loopWidth / SPEED_PX_PER_SEC, 10);

      const tween = gsap.to(track, {
        xPercent: -50, // moves toward the left, then seamlessly repeats
        ease: 'none',
        duration,
        repeat: -1,
      });

      const row = rowRef.current;
      const slowDown = () =>
        gsap.to(tween, {
          timeScale: HOVER_SPEED,
          duration: 0.9,
          ease: 'power2.out',
          overwrite: true,
        });
      const speedUp = () =>
        gsap.to(tween, { timeScale: 1, duration: 1.2, ease: 'power2.inOut', overwrite: true });

      row.addEventListener('mouseenter', slowDown);
      row.addEventListener('mouseleave', speedUp);

      return () => {
        tween.kill();
        row.removeEventListener('mouseenter', slowDown);
        row.removeEventListener('mouseleave', speedUp);
      };
    },
    { scope: sectionRef, dependencies: [prefersReduced, items.length] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative select-none overflow-hidden bg-white py-[clamp(3.5rem,6vw,7.5rem)]"
    >
      <motion.div
        variants={headerStagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
        className="mx-auto flex max-w-[1920px] flex-col items-center px-4 text-center sm:px-8"
      >
        <motion.p
          variants={fadeUp}
          className="text-[length:clamp(0.625rem,0.85vw,1rem)] font-medium uppercase tracking-wide text-accent"
        >
          Featured on &amp; working with
        </motion.p>

        <motion.h3
          variants={fadeUp}
          className="mt-[clamp(0.5rem,0.9vw,1.25rem)] text-[length:clamp(1.25rem,1.95vw,2.375rem)] font-semibold leading-tight tracking-[-0.02em] text-ink"
        >
          Used by 60+ brands who value storytelling
        </motion.h3>
      </motion.div>

      {/* Outer wrapper: positions the edge blurs and receives hover */}
      <motion.div
        ref={rowRef}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
        className="relative mx-auto mt-[clamp(1.75rem,3.2vw,4rem)] w-full max-w-[1400px]"
      >
        <EdgeBlur side="left" />
        <EdgeBlur side="right" />

        {/* Inner clip: container-type lets the slots size with cqw */}
        <div className="w-full overflow-hidden [container-type:inline-size]">
          <div ref={trackRef} className="flex w-max items-center will-change-transform">
            {(prefersReduced ? [0] : [0, 1]).map((group) => (
              <div
                key={group}
                aria-hidden={group === 1 || undefined}
                className="flex shrink-0 items-center"
              >
                {items.map((client, i) => (
                  <LogoSlot key={`${group}-${client.name}-${i}`} client={client} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default BrandsMarquee;
