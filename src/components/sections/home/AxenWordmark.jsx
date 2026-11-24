import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const TEXT = 'AXEN MEDIA';

const FIGMA_SIZE_PX = 633;
const FRAME_VW = 43.96; 

export function AxenWordmark() {
  const rowRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced) return;

      const row = rowRef.current;
      const chars = row.querySelectorAll('.wm-char');

      row.classList.add('overflow-hidden');

      gsap.fromTo(
        chars,
        { yPercent: 105 },
        {
          yPercent: 0,
          duration: 1.3,
          ease: 'power4.out',
          stagger: { each: 0.07, from: 'start' },
          scrollTrigger: { trigger: row, start: 'top 95%', once: true },
          onComplete: () => row.classList.remove('overflow-hidden'),
        }
      );

      gsap.to(chars, {
        y: -40,
        ease: 'none',
        stagger: 0.02,
        scrollTrigger: {
          trigger: row,
          start: 'top 85%',
          end: 'bottom top',
          scrub: 1,
        },
      });

      return () => row.classList.remove('overflow-hidden');
    },
    { scope: rowRef, dependencies: [prefersReduced] }
  );

  return (
    <div className="w-full select-none mb-8 sm:mb-12" aria-hidden="true">
      <div
        ref={rowRef}
        className="flex items-start justify-center font-display uppercase tracking-normal"
        style={{
          fontSize: `min(${FRAME_VW}vw, ${FIGMA_SIZE_PX}px)`,
          fontWeight: 850,
          lineHeight: 1,
        }}
      >
        {TEXT.split('').map((char, i) =>
          char === ' ' ? (
            <span key={i} className="inline-block whitespace-pre">
              {'\u00A0'}
            </span>
          ) : (
            <span key={i} className="wm-char group relative inline-block cursor-default hover:z-10">
              <span
                className="
                  block will-change-transform
                  text-[#ECEAE3]                    
                  group-hover:text-[#151515]      
                  group-hover:scale-[1.08]
                  transition-[transform,color] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                  group-hover:duration-[900ms]
                "
              >
                {char}
              </span>
            </span>
          )
        )}
      </div>
    </div>
  );
}

export default AxenWordmark;
