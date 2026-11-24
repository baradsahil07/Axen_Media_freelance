import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function Marquee({
  children,
  speed = 40,
  direction = 'left',
  pauseOnHover = true,
  reactToVelocity = false,
  className,
  edgeFade = false,
}) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const tweenRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced || !trackRef.current) return;

      const track = trackRef.current;
      const distance = direction === 'left' ? -50 : 50;

      const tween = gsap.to(track, {
        xPercent: distance,
        ease: 'none',
        duration: speed,
        repeat: -1,
      });
      tweenRef.current = tween;

      let trigger;
      if (reactToVelocity) {
        let velocityClamp = gsap.utils.clamp(-3, 3);
        trigger = ScrollTrigger.create({
          onUpdate: (self) => {
            const v = self.getVelocity() / 350;
            const targetScale = velocityClamp(1 + v);
            gsap.to(tween, {
              timeScale: targetScale,
              duration: 0.3,
              overwrite: 'auto',
              onComplete: () => {
                gsap.to(tween, { timeScale: 1, duration: 0.8 });
              },
            });
          },
        });
      }

      return () => {
        tween.kill();
        if (trigger) trigger.kill();
      };
    },
    { scope: containerRef, dependencies: [speed, direction, prefersReduced, reactToVelocity] }
  );

  const handleMouseEnter = () => {
    if (pauseOnHover && tweenRef.current) {
      tweenRef.current.pause();
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover && tweenRef.current) {
      tweenRef.current.play();
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn('relative w-full overflow-hidden select-none', className)}
    >
      {edgeFade && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        </>
      )}

      <div ref={trackRef} className="flex w-max items-center flex-nowrap will-change-transform">
        <div className="flex items-center shrink-0">{children}</div>
        <div className="flex items-center shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Marquee;
