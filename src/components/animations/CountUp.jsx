import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function CountUp({ end, duration = 2, suffix = '', className }) {
  const [count, setCount] = useState(0);
  const triggerRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced) {
        setCount(end);
        return;
      }

      const obj = { val: 0 };
      const trigger = ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: end,
            duration,
            ease: 'power2.out',
            onUpdate: () => {
              setCount(Math.round(obj.val));
            },
          });
        },
      });

      return () => {
        if (trigger) trigger.kill();
      };
    },
    { dependencies: [end, duration, prefersReduced] }
  );

  return (
    <span ref={triggerRef} className={className}>
      {count}
      {suffix && <span className="text-primary ml-0.5">{suffix}</span>}
    </span>
  );
}

export default CountUp;
