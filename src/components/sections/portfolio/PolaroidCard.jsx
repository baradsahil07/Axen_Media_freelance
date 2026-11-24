import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { SmartImage } from '@/components/media/SmartImage';

export const CARD_W = 17.7;

const MAX_SWING = 9;
const SWING_SPRING = { stiffness: 90, damping: 14, mass: 1 };
const SHIFT_SPRING = { stiffness: 90, damping: 16, mass: 1 };

const u = (n) => `calc(var(--s) * ${n})`;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export function PolaroidCard({
  brand,
  index,
  registerRef,
  onHoverChange,
  entered,
  introDelay,
  reduced,
}) {
  const bodyRef = useRef(null);

  const swingTarget = useMotionValue(0);
  const shiftTarget = useMotionValue(0);
  const swing = useSpring(swingTarget, SWING_SPRING);
  const shift = useSpring(shiftTarget, SHIFT_SPRING);

  useEffect(() => {
    if (!entered || reduced) return;
    const dir = index % 2 ? 1 : -1;
    const t1 = setTimeout(() => swingTarget.set(16 * dir), introDelay * 1000 + 300);
    const t2 = setTimeout(() => swingTarget.set(0), introDelay * 1000 + 420);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [entered]);

  const onEnter = (e) => e.pointerType === 'mouse' && onHoverChange(index, true);

  const onMove = (e) => {
    if (e.pointerType !== 'mouse' || reduced) return;
    const r = bodyRef.current.getBoundingClientRect();
    const n = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2), -1, 1);
    swingTarget.set(-n * MAX_SWING);
    shiftTarget.set(n * r.width * 0.05);
  };

  const onLeave = (e) => {
    if (e.pointerType !== 'mouse') return;
    onHoverChange(index, false);
    swingTarget.set(0);
    shiftTarget.set(0);
  };

  return (
    <div
      ref={registerRef}
      className="pointer-events-auto absolute left-0 top-0 origin-top opacity-0 will-change-transform"
      style={{ width: u(CARD_W) }}
    >
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-0 z-10 -translate-x-1/2 border border-ink bg-primary"
        style={{ width: u(2.2), height: u(3.1), borderRadius: u(0.55) }}
      >
        <span
          className="absolute left-1/2 top-[24%] -translate-x-1/2 rounded-full border border-ink bg-white"
          style={{ width: u(0.9), height: u(0.9) }}
        />
      </span>

      <motion.div
        ref={bodyRef}
        onPointerEnter={onEnter}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        whileHover={reduced ? undefined : { scale: 1.045 }}
        transition={{ scale: { type: 'spring', stiffness: 170, damping: 18 } }}
        style={{
          rotate: swing,
          x: shift,
          transformOrigin: '50% 0%',
          marginTop: u(2.8),
          padding: u(0.55),
          borderRadius: u(1.5),
        }}
        className="bg-white ring-1 ring-black/5 shadow-[0_calc(var(--s)*1.1)_calc(var(--s)*2.4)_rgba(0,0,0,0.10)] transition-shadow duration-500 hover:shadow-[0_calc(var(--s)*1.8)_calc(var(--s)*3.4)_rgba(0,0,0,0.16)]"
      >
        <div
          className="relative aspect-[137/100] overflow-hidden border border-[#E7E7E7] bg-white"
          style={{ borderRadius: u(1.2) }}
        >
          <div className="absolute inset-0" style={{ padding: '17%' }}>
            <SmartImage
              src={brand.logo}
              alt={`${brand.name} logo`}
              fit="contain"
              placeholderLabel={brand.name}
            />
          </div>
        </div>

        <div style={{ padding: `${u(0.8)} ${u(0.5)} ${u(0.6)}` }}>
          <p
            className="truncate font-bold leading-tight text-ink"
            style={{ fontSize: 'max(0.55rem, calc(var(--s) * 1.05))' }}
          >
            {brand.name}
          </p>
          <p
            className="mt-[0.15em] truncate leading-tight text-[#9A9A9A]"
            style={{ fontSize: 'max(0.45rem, calc(var(--s) * 0.8))' }}
          >
            {brand.caption}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default PolaroidCard;
