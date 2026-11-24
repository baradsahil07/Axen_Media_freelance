import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function ParallaxImage({ children, speed = 0.2, className }) {
  const targetRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced || !targetRef.current) return;

      const yOffset = speed * 120;

      const trigger = gsap.fromTo(
        targetRef.current,
        { y: -yOffset },
        {
          y: yOffset,
          ease: 'none',
          scrollTrigger: {
            trigger: targetRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );

      return () => {
        if (trigger.scrollTrigger) trigger.scrollTrigger.kill();
        trigger.kill();
      };
    },
    { dependencies: [speed, prefersReduced] }
  );

  return (
    <div ref={targetRef} className={cn('will-change-transform', className)}>
      {children}
    </div>
  );
}

export default ParallaxImage;
