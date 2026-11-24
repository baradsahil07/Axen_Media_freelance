import { useMemo, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const SERVICES = [
  'VIDEO EDITING',
  'COMMERCIALS',
  'MOTION GRAPHICS',
  'THUMBNAIL DESIGN',
  'BRAND FILMS',
];

const SECONDS_PER_ITEM = 5;
const SCROLL_BOOST = 400;
const MAX_SPEED = 4;

function buildLoop(list) {
  let out = [...list];
  while (out.length < 10) out = [...out, ...list];
  return out;
}

export function ServiceMarquee() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const prefersReduced = useReducedMotion();

  const items = useMemo(() => buildLoop(SERVICES), []);

  useGSAP(
    () => {
      if (prefersReduced || !trackRef.current) return;

      const tween = gsap.to(trackRef.current, {
        xPercent: -50,
        ease: 'none',
        duration: items.length * SECONDS_PER_ITEM,
        repeat: -1,
      });

      const trigger = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const dir = self.direction;
          const boost = Math.min(MAX_SPEED, 1 + Math.abs(self.getVelocity()) / SCROLL_BOOST);
          gsap
            .timeline({ defaults: { overwrite: 'auto' } })
            .to(tween, { timeScale: boost * dir, duration: 0.25, ease: 'power2.out' })
            .to(tween, { timeScale: dir, duration: 1.2, ease: 'power2.inOut' });
        },
      });

      return () => {
        trigger.kill();
        tween.kill();
      };
    },
    { scope: sectionRef, dependencies: [prefersReduced, items.length] }
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Our services"
      className="w-full select-none overflow-hidden bg-[#1F1F1F] py-[clamp(1.1rem,2.3vw,2.75rem)] text-white"
    >
      <div
        ref={trackRef}
        className="flex w-max items-center will-change-transform"
        style={{ '--gap': 'clamp(1.5rem,4vw,5rem)' }}
      >
        {(prefersReduced ? [0] : [0, 1]).map((group) => (
          <div
            key={group}
            aria-hidden={group === 1 || undefined}
            className="flex shrink-0 items-center gap-[var(--gap)] pr-[var(--gap)]"
          >
            {items.map((item, i) => (
              <div key={`${group}-${i}`} className="flex shrink-0 items-center gap-[var(--gap)]">
                <span className="whitespace-nowrap text-[length:clamp(0.9rem,1.55vw,1.85rem)] font-normal uppercase leading-none tracking-normal text-white">
                  {item}
                </span>
                <span
                  aria-hidden="true"
                  className="h-[clamp(0.4rem,0.85vw,0.95rem)] w-[clamp(0.4rem,0.85vw,0.95rem)] shrink-0 rounded-full bg-accent"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export default ServiceMarquee;
