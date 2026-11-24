import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { portfolioBrands, floatingSoftwareIcons } from '@/data/portfolioBrands';
import { resolveAsset } from '@/lib/assets';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { PolaroidCard, CARD_W } from './PolaroidCard';

const EASE = [0.22, 1, 0.36, 1];

const PITCH = 20.9;
const STRING_C = 4.9;
const STRING_K = 0.00291;
const STAGE_H = 33;
const MIN_UNIT_PX = 6.4;

const SPEED = 2.4;
const INTRO = 1.1;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const introDelay = (i) => (i < 6 ? i * 0.1 : 0.6);

function buildLoop(list) {
  if (!list.length) return [];
  let out = [...list];
  while (out.length < 10) out = [...out, ...list];
  return out;
}

function SoftwareIcon({ item, reduced }) {
  const [failed, setFailed] = useState(false);
  const url = resolveAsset(item.icon);
  const rot = item.rotate ?? 0;

  return (
    <div
      className="pointer-events-none absolute z-20"
      style={{
        left: `calc(50% + var(--s) * ${item.x})`,
        top: `calc(var(--s) * ${item.y})`,
        width: `calc(var(--s) * ${item.size})`,
        height: `calc(var(--s) * ${item.size})`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <motion.div
        className="h-full w-full"
        initial={reduced ? false : { opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: EASE, delay: item.delay ?? 0.4 }}
      >
        <motion.div
          className="h-full w-full"
          style={{ rotate: rot }}
          animate={reduced ? undefined : { y: [0, -7, 0], rotate: [rot, rot + 5, rot] }}
          transition={{ duration: item.dur ?? 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {url && !failed ? (
            <img
              src={url}
              alt={item.name}
              draggable={false}
              onError={() => setFailed(true)}
              className="h-full w-full object-contain"
            />
          ) : item.round ? (
            <span
              className="block h-full w-full rounded-full p-[12%]"
              style={{
                background: 'conic-gradient(#ff5b5b,#ffd23f,#3ddc84,#3da9fc,#a855f7,#ff5b5b)',
              }}
            >
              <span className="block h-full w-full rounded-full bg-[#1b1b1b]" />
            </span>
          ) : (
            <span
              className="flex h-full w-full items-center justify-center rounded-[24%] font-bold"
              style={{
                background: item.bg,
                color: item.fg,
                fontSize: 'max(0.5rem, calc(var(--s) * 1.35))',
              }}
            >
              {item.letters}
            </span>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export function PolaroidString() {
  const rootRef = useRef(null);
  const cardRefs = useRef([]);
  const hoverTarget = useRef([]);
  const hoverAmt = useRef([]);
  const introT0 = useRef(null);
  const sim = useRef({ offset: -2 * PITCH, vel: -SPEED, unit: 10, anyHover: false });
  const drag = useRef({ active: false, lastX: 0, lastT: 0, v: 0 });

  const prefersReduced = useReducedMotion();
  const entered = useInView(rootRef, { amount: 0.25, once: true });
  const onScreen = useInView(rootRef, { margin: '200px' });

  const slides = useMemo(() => buildLoop(portfolioBrands), []);
  const [geo, setGeo] = useState({ w: 0, unit: 10 });
  const [grabbing, setGrabbing] = useState(false);

  // measure the section; 1 unit = 1% of its width
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      const unit = Math.max(w / 100, MIN_UNIT_PX);
      sim.current.unit = unit;
      setGeo({ w, unit });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (entered && introT0.current == null) introT0.current = performance.now();
  }, [entered]);

  useEffect(() => {
    if (!geo.w) return;
    const N = slides.length;
    const L = N * PITCH;

    const layout = (now, dt) => {
      const s = sim.current;
      const unit = s.unit;
      const t0 = introT0.current;

      for (let i = 0; i < N; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;

        hoverAmt.current[i] = hoverAmt.current[i] ?? 0;
        hoverAmt.current[i] +=
          ((hoverTarget.current[i] || 0) - hoverAmt.current[i]) * (1 - Math.exp(-dt * 7));

        const x = ((((i * PITCH + s.offset + L / 2) % L) + L) % L) - L / 2;
        const y = STRING_C - STRING_K * x * x;
        let angle = (Math.atan(-2 * STRING_K * x) * 180) / Math.PI;
        angle *= 1 - 0.5 * hoverAmt.current[i];

        let p = 1;
        if (!prefersReduced)
          p = t0 == null ? 0 : clamp(((now - t0) / 1000 - introDelay(i)) / INTRO, 0, 1);
        const dropY = (1 - easeOut(p)) * -14;

        el.style.transform = `translate3d(${geo.w / 2 + (x - CARD_W / 2) * unit}px, ${(y + dropY) * unit}px, 0) rotate(${angle}deg)`;
        el.style.opacity = clamp(p * 2.2, 0, 1);
        el.style.visibility = Math.abs(x) > 64 ? 'hidden' : 'visible';
      }
    };

    if (prefersReduced) {
      layout(performance.now(), 0);
      return;
    }
    if (!onScreen) return;

    let raf = 0;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = sim.current;

      if (!drag.current.active) {
        const target = s.anyHover ? 0 : -SPEED;
        s.vel += (target - s.vel) * (1 - Math.exp(-dt * (target === 0 ? 5 : 2.2)));
        s.offset += s.vel * dt;
      }
      layout(now, dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [geo, onScreen, prefersReduced, slides.length]);

  const handleHover = (i, on) => {
    hoverTarget.current[i] = on ? 1 : 0;
    sim.current.anyHover = hoverTarget.current.some(Boolean);
    const el = cardRefs.current[i];
    if (el) el.style.zIndex = on ? '30' : '';
  };

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag.current = { active: true, lastX: e.clientX, lastT: e.timeStamp, v: 0 };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setGrabbing(true);
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.lastX;
    const dt = Math.max(1, e.timeStamp - d.lastT) / 1000;
    sim.current.offset += dx / sim.current.unit;
    d.v = 0.7 * d.v + 0.3 * (dx / sim.current.unit / dt);
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
  };
  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    sim.current.vel = clamp(drag.current.v, -60, 60);
    setGrabbing(false);
  };

  const { w, unit } = geo;
  const xe = 64;
  const yEnd = STRING_C - STRING_K * xe * xe;
  const yCtrl = 2 * STRING_C - yEnd;
  const path = w
    ? `M ${w / 2 - xe * unit} ${yEnd * unit} Q ${w / 2} ${yCtrl * unit} ${w / 2 + xe * unit} ${yEnd * unit}`
    : '';

  return (
    <section
      aria-label="Brands we have worked with"
      ref={rootRef}
      className="relative w-full select-none overflow-x-clip [container-type:inline-size]"
      style={{ '--s': `max(1cqw, ${MIN_UNIT_PX}px)` }}
    >
      <div
        className={`relative w-full touch-pan-y ${grabbing ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ height: `calc(var(--s) * ${STAGE_H})` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <svg
          className="pointer-events-none absolute left-0 top-0 z-0 overflow-visible"
          width={w}
          height={STAGE_H * unit}
          fill="none"
          aria-hidden="true"
        >
          {path && (
            <motion.path
              d={path}
              stroke="#DADADA"
              strokeWidth="1"
              initial={{ pathLength: prefersReduced ? 1 : 0 }}
              animate={{ pathLength: entered ? 1 : prefersReduced ? 1 : 0 }}
              transition={{ duration: 1.6, ease: EASE }}
            />
          )}
        </svg>

        {floatingSoftwareIcons.map((item) => (
          <SoftwareIcon key={item.id} item={item} reduced={prefersReduced} />
        ))}

        {slides.map((brand, i) => (
          <PolaroidCard
            key={`${brand.id}-${i}`}
            brand={brand}
            index={i}
            registerRef={(el) => (cardRefs.current[i] = el)}
            onHoverChange={handleHover}
            entered={entered}
            introDelay={introDelay(i)}
            reduced={prefersReduced}
          />
        ))}
      </div>
    </section>
  );
}

export default PolaroidString;
