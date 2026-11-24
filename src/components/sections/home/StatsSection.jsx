import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { stats } from '@/data/stats';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1];

const COUNT_SECONDS = 3.2;
const STAGGER = 0.2;
const headerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};
const lineUp = {
  hidden: { y: '110%' },
  show: { y: 0, transition: { duration: 1, ease: EASE } },
};

function PlusMark({ className }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true" className={className}>
      <rect x="38" y="4" width="24" height="92" />
      <rect x="4" y="38" width="92" height="24" />
    </svg>
  );
}

function readStat(stat) {
  const suffix = stat.suffix ?? '';
  const unit = stat.unit ?? suffix.replace('+', '');
  const plus = stat.plus ?? (suffix ? suffix.includes('+') : true);
  return { unit, plus };
}

// Works with 120, "120", "1,200" and "4.9"
function parseValue(raw) {
  const str = String(raw);
  return {
    target: parseFloat(str.replace(/,/g, '')) || 0,
    decimals: (str.split('.')[1] || '').length,
    grouped: str.includes(','),
  };
}

function formatNumber(n, decimals, grouped) {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: grouped,
  });
}

export function StatsSection() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced || !gridRef.current) return;

      const items = gsap.utils.toArray('.stat');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: gridRef.current, start: 'top 85%', once: true },
      });

      items.forEach((item, i) => {
        const line = item.querySelector('.stat-line');
        const label = item.querySelector('.stat-label');
        const number = item.querySelector('.stat-number');
        const countEl = item.querySelector('.stat-count');
        const plus = item.querySelector('.stat-plus');

        const target = Number(countEl.dataset.target);
        const decimals = Number(countEl.dataset.decimals);
        const grouped = countEl.dataset.grouped === 'true';
        const counter = { v: 0 };
        const at = i * STAGGER;

        // Always start the count from 0
        countEl.textContent = formatNumber(0, decimals, grouped);

        tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power3.inOut' }, at)
          .fromTo(
            label,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
            at + 0.2
          )
          .fromTo(
            number,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 1.1, ease: 'power2.out' },
            at + 0.25
          )
          .to(
            counter,
            {
              v: target,
              duration: COUNT_SECONDS,
              ease: 'power1.inOut', // eases in and out, so the count feels smooth with no sudden jumps
              onUpdate: () => {
                countEl.textContent = formatNumber(counter.v, decimals, grouped);
              },
              onComplete: () => {
                countEl.textContent = formatNumber(target, decimals, grouped);
              },
            },
            at + 0.45
          );

        if (plus) {
          tl.fromTo(
            plus,
            { scale: 0, rotation: -90, opacity: 0 },
            { scale: 1, rotation: 0, opacity: 1, duration: 0.9, ease: 'back.out(1.4)' },
            at + 0.45 + COUNT_SECONDS - 0.5
          );
        }
      });
    },
    { scope: sectionRef, dependencies: [prefersReduced] }
  );

  return (
    <section
      ref={sectionRef}
      className="select-none overflow-hidden bg-white px-4 py-[clamp(4rem,7vw,8.5rem)] sm:px-8 lg:px-[6.4vw]"
    >
      <div className="mx-auto w-full max-w-[1680px] [container-type:inline-size]">
        <motion.div
          variants={headerStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="md:grid md:grid-cols-[25.3cqw_1fr] md:items-start"
        >
          <motion.p
            variants={fadeUp}
            className="text-[length:max(0.7rem,1.15cqw)] font-medium uppercase tracking-wide text-accent md:pt-[0.9cqw]"
          >
            Our Key Stats
          </motion.p>

          <h2 className="mt-3 text-[length:clamp(1.75rem,4.8cqw,5.5rem)] font-bold leading-[1.15] tracking-[-0.03em] text-ink md:mt-0">
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span variants={lineUp} className="block">
                More than a service. A
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span variants={lineUp} className="block">
                strategic design partner.
              </motion.span>
            </span>
          </h2>
        </motion.div>

        <div
          ref={gridRef}
          className="mt-[max(2.5rem,4.5cqw)] grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-x-[8cqw]"
        >
          {stats.map((stat) => {
            const { unit, plus } = readStat(stat);
            const { target, decimals, grouped } = parseValue(stat.value);
            const finalText = formatNumber(target, decimals, grouped);
            return (
              <div key={stat.id} className="stat">
                <div className="stat-line h-px w-full origin-left bg-ink/70" />

                <p className="stat-label mt-[max(0.4rem,1cqw)] text-[length:max(0.7rem,1.15cqw)] font-normal uppercase tracking-wide text-ink">
                  {stat.label}
                </p>

                <p
                  className="stat-number mt-[max(0.3rem,0.7cqw)] flex items-baseline text-[length:clamp(2.5rem,10cqw,4.5rem)] font-extrabold leading-none tracking-[-0.03em] text-ink tabular-nums lg:text-[length:5.9cqw]"
                  aria-label={`${finalText}${unit}${plus ? '+' : ''}`}
                >
                  <span
                    className="stat-count"
                    data-target={target}
                    data-decimals={decimals}
                    data-grouped={grouped}
                    aria-hidden="true"
                  >
                    {finalText}
                  </span>
                  {unit && <span aria-hidden="true">{unit}</span>}
                  {plus && (
                    <PlusMark className="stat-plus ml-[0.05em] h-[0.6em] w-[0.6em] lg:h-[min(2.448vw,47px)] lg:w-[min(2.448vw,47px)] shrink-0 origin-bottom-left text-primary" />
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
