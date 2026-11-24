import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { workflowSteps } from '@/data/workflow';
import { resolveAsset } from '@/lib/assets';
import { SmartImage } from '@/components/media/SmartImage';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1];

const SLIDE_SECONDS = 0.9;
const CARD_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const DIM_OTHERS = 1;
const ACTIVE_BG = '#FFE11A';
const SHOW_IDLE_STAGE = false;

const APPS = {
  premiere: {
    name: 'Premiere',
    letters: 'Pr',
    color: '#4B4DA3',
    icon: 'images/icons/software/premiere.svg',
  },
  ae: {
    name: 'After Effect',
    letters: 'Au',
    color: '#5A4CA0',
    icon: 'images/icons/software/after-effects.svg',
  },
  ps: {
    name: 'Photoshop',
    letters: 'Ps',
    color: '#2D6FAE',
    icon: 'images/icons/software/photoshop.svg',
  },
  dv: {
    name: 'Da Vinci',
    letters: 'Dv',
    color: '#7A8794',
    round: true,
    icon: 'images/icons/software/davinci-resolve.svg',
  },
  ai: {
    name: 'Illustrator',
    letters: 'Ai',
    color: '#B5642F',
    icon: 'images/icons/software/illustrator.svg',
  },
};

const STAGE_CHIPS = [
  { app: 'premiere', left: 40.8, top: 47.6, delay: 0.5, amp: 6, dur: 4.2 },
  { app: 'ae', left: 63, top: 47.6, delay: 0.62, amp: 7, dur: 4.8 },
  { app: 'ps', left: 88.9, top: 47.6, delay: 0.74, amp: 6, dur: 4.0 },
  { app: 'dv', left: 56, top: 54.4, delay: 0.86, amp: 5, dur: 5.0 },
  { app: 'ai', left: 78, top: 54.4, delay: 0.98, amp: 7, dur: 4.5 },
];

function SceneImage({ item, reduced }) {
  const url = resolveAsset(item.src) || `${import.meta.env.BASE_URL}${item.src}`;
  return (
    <div
      className="absolute"
      style={{
        left: `${item.l}cqw`,
        top: `${item.t}cqw`,
        width: `${item.w}cqw`,
        transform: `rotate(${item.r ?? 0}deg)`,
      }}
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 36, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.3, ease: 'easeOut' } }}
        transition={{ duration: SLIDE_SECONDS, ease: EASE, delay: reduced ? 0 : (item.d ?? 0) }}
      >
        <motion.img
          src={url}
          alt=""
          draggable={false}
          onError={(e) => {
            e.currentTarget.style.visibility = 'hidden';
          }}
          className="block h-auto w-full"
          animate={reduced ? undefined : { y: [0, -(item.amp ?? 6), 0] }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: item.d ?? 0,
          }}
        />
      </motion.div>
    </div>
  );
}

const headerV = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};
const listV = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } };
const rowV = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

function AppIcon({ app, className }) {
  const [failed, setFailed] = useState(false);
  const url = resolveAsset(app.icon);
  if (url && !failed) {
    return (
      <img
        src={url}
        alt=""
        draggable={false}
        onError={() => setFailed(true)}
        className={`shrink-0 object-contain ${className}`}
      />
    );
  }
  return (
    <span
      className={`flex shrink-0 items-center justify-center font-bold text-white ${app.round ? 'rounded-full' : 'rounded-[26%]'} ${className}`}
      style={{ backgroundColor: app.color, fontSize: 'max(0.42rem, 1.5cqw)' }}
    >
      {app.letters}
    </span>
  );
}

function FloatItem({
  style,
  rotate = 0,
  delay = 0,
  amp = 6,
  dur = 4.5,
  reduced,
  className = '',
  children,
}) {
  return (
    <div
      className={`absolute ${className}`}
      style={{ ...style, transform: `rotate(${rotate}deg)` }}
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.7, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: EASE, delay }}
      >
        <motion.div
          animate={reduced ? undefined : { y: [0, -amp, 0] }}
          transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay: delay * 0.5 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

function InfoCard({ title, subtitle, color, icon, menu }) {
  return (
    <div
      className="flex items-center gap-[2.2cqw] rounded-[2.4cqw] border bg-white p-[1.8cqw] pr-[2.8cqw] shadow-[0_1.2cqw_3cqw_rgba(0,0,0,0.12)]"
      style={{ borderColor: color }}
    >
      {icon}
      <div className="min-w-0 flex-1">
        <p
          className="truncate font-bold leading-tight text-ink"
          style={{ fontSize: 'max(0.6rem, 2cqw)' }}
        >
          {title}
        </p>
        <p
          className="truncate leading-tight text-[#777]"
          style={{ fontSize: 'max(0.5rem, 1.55cqw)' }}
        >
          {subtitle}
        </p>
      </div>
      {menu && (
        <span
          className="font-bold leading-none text-ink"
          style={{ fontSize: 'max(0.7rem, 2.6cqw)' }}
        >
          ···
        </span>
      )}
    </div>
  );
}

function Stage({ activeStep, reduced }) {
  const scene = activeStep?.scene ?? null;
  const idleVisible = SHOW_IDLE_STAGE && !activeStep;

  return (
    <div className="relative aspect-[414/555] w-full [container-type:inline-size] lg:aspect-auto lg:block hidden">
      <motion.div
        hidden={!SHOW_IDLE_STAGE}
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: idleVisible ? 1 : 0, y: idleVisible ? 0 : '3%' }}
        transition={reduced ? { duration: 0 } : { duration: 0.7, ease: EASE }}
      >
        {STAGE_CHIPS.map(({ app, left, top, delay, amp, dur }) => {
          const a = APPS[app];
          return (
            <FloatItem
              key={app}
              reduced={reduced}
              delay={delay}
              amp={amp}
              dur={dur}
              className="z-10"
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              <div className="flex h-[6.5cqw] items-center gap-[1.6cqw] whitespace-nowrap rounded-full bg-[#F2F2F2] px-[2.4cqw] pr-[3cqw]">
                <AppIcon app={a} className="h-[3.5cqw] w-[3.5cqw]" />
                <span
                  className="font-medium leading-none text-ink"
                  style={{ fontSize: 'max(0.6rem, 2.3cqw)' }}
                >
                  {a.name}
                </span>
              </div>
            </FloatItem>
          );
        })}

        <div className="absolute left-0 top-[50.5%] z-20 w-full lg:-left-[10.9%] lg:w-[110%]">
          <motion.div
            initial={
              reduced
                ? false
                : { opacity: 0, y: 110, rotateZ: 8, rotateY: -4, transformPerspective: 1600 }
            }
            whileInView={{ opacity: 1, y: 0, rotateZ: 3, rotateY: -13, transformPerspective: 1600 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
          >
            <motion.div
              animate={reduced ? undefined : { y: [0, -7, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative aspect-[16/10.2] overflow-hidden rounded-[2.4cqw] border border-white/10 bg-[#181818] shadow-[0_5cqw_9cqw_rgba(0,0,0,0.35)]"
            >
              <SmartImage
                src="images/home/workflow/editor-timeline.webp"
                alt="Video editing timeline"
                placeholderLabel="Editor timeline screenshot"
              />
            </motion.div>
          </motion.div>
        </div>

        <FloatItem
          reduced={reduced}
          delay={1.1}
          amp={6}
          dur={4.4}
          rotate={17}
          className="z-30"
          style={{ left: '62.8%', top: '59.5%', width: '31.4%' }}
        >
          <InfoCard
            title="Premiere Pro"
            subtitle="Video Editing"
            color="#F5C400"
            icon={
              <span className="flex h-[5.6cqw] w-[5.6cqw] shrink-0 items-center justify-center rounded-[22%] bg-primary">
                <span className="h-[55%] w-[40%] rounded-[12%] bg-ink" />
              </span>
            }
          />
        </FloatItem>
        <FloatItem
          reduced={reduced}
          delay={1.25}
          amp={5}
          dur={5}
          rotate={11}
          className="z-30"
          style={{ left: '65.7%', top: '67.6%', width: '35%' }}
        >
          <InfoCard
            title="Adobe suite"
            subtitle="Post-Production"
            color="#EE86B4"
            menu
            icon={
              <span className="flex h-[5.6cqw] w-[5.6cqw] shrink-0 items-center justify-center rounded-full bg-[#FFE4F0]">
                <span className="h-[55%] w-[55%] rounded-full border-[0.5cqw] border-[#E8468B]" />
              </span>
            }
          />
        </FloatItem>
      </motion.div>

      <AnimatePresence>
        {scene && (
          <motion.div
            key={activeStep.id}
            className="pointer-events-none absolute inset-0 z-40"
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.35 }}
          >
            {scene.map((item) => (
              <SceneImage key={item.src} item={item} reduced={reduced} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function WorkflowSection() {
  const prefersReduced = useReducedMotion();
  const [activeId, setActiveId] = useState(null);
  const activeStep = workflowSteps.find((s) => s.id === activeId) ?? null;

  useEffect(() => {
    workflowSteps.forEach((step) =>
      step.scene?.forEach((item) => {
        const url = resolveAsset(item.src);
        if (url) new Image().src = url;
      })
    );
  }, []);

  return (
    <section className="select-none overflow-x-clip bg-white px-4 py-[clamp(4rem,7vw,8.5rem)] sm:px-8 lg:px-[6.4vw]">
      <div className="mx-auto w-full max-w-[1680px] [container-type:inline-size]">
        <div style={{ '--u': 'max(0.66rem, 1cqw)' }}>
          <motion.div
            variants={headerV}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            className="grid gap-x-[calc(var(--u)*2.1)] gap-y-[calc(var(--u)*1.2)] lg:grid-cols-2"
          >
            <motion.p
              variants={fadeUp}
              className="w-min text-[length:calc(var(--u)*1.15)] font-medium uppercase leading-[1.5] tracking-wide text-accent"
            >
              Our Workflow
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="max-w-[calc(var(--u)*50)] text-[length:calc(var(--u)*1.4)] leading-[1.5] text-[#21272A]"
            >
              Welcome to our platform! Explore a world of possibilities and discover tools that can
              enhance your productivity.
            </motion.p>
          </motion.div>

          <div className="mt-[calc(var(--u)*2)] grid gap-[calc(var(--u)*2.1)] lg:grid-cols-2">
            <motion.ul
              variants={listV}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.08 }}
              onPointerLeave={(e) => e.pointerType === 'mouse' && setActiveId(null)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setActiveId(null);
              }}
              className="flex flex-col gap-[calc(var(--u)*1.3)]"
            >
              {workflowSteps.map((step) => {
                const isActive = activeId === step.id;
                const isDimmed = activeId !== null && !isActive;
                return (
                  <motion.li
                    key={step.id}
                    variants={rowV}
                    tabIndex={0}
                    onPointerEnter={(e) => e.pointerType === 'mouse' && setActiveId(step.id)}
                    onFocus={(e) =>
                      e.currentTarget.matches(':focus-visible') && setActiveId(step.id)
                    }
                    onClick={(e) => {
                      if (e.nativeEvent.pointerType && e.nativeEvent.pointerType !== 'mouse') {
                        setActiveId((cur) => (cur === step.id ? null : step.id));
                      }
                    }}
                    className="outline-none focus-visible:[&>div]:ring-4 focus-visible:[&>div]:ring-primary/70"
                  >
                    <div
                      className="flex items-center gap-[calc(var(--u)*1.2)] rounded-[calc(var(--u)*1.65)] border border-ink p-[calc(var(--u)*1.5)] transition-[opacity,background-color,box-shadow] duration-500"
                      style={{
                        transitionTimingFunction: CARD_EASE,
                        backgroundColor: isActive ? ACTIVE_BG : '#FFFFFF',
                        opacity: isDimmed ? DIM_OTHERS : 1,
                        boxShadow: isActive ? '0 calc(var(--u) * 0.3) 0 #111' : '0 0 0 #111',
                      }}
                    >
                      <span className="block h-[calc(var(--u)*6.6)] w-[calc(var(--u)*6.6)] shrink-0 overflow-hidden rounded-[calc(var(--u)*1.4)] bg-primary">
                        <span
                          className="block h-full w-full p-[calc(var(--u)*0.5)] transition-transform duration-700"
                          style={{
                            transitionTimingFunction: CARD_EASE,
                            transform: isActive ? 'scale(1.08)' : 'scale(1)',
                          }}
                        >
                          <SmartImage
                            src={step.icon}
                            alt=""
                            fit="contain"
                            placeholderLabel={step.step}
                          />
                        </span>
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-[length:calc(var(--u)*1.55)] font-semibold leading-tight tracking-tight text-ink">
                          {step.title}
                        </h3>
                        <p className="mt-[calc(var(--u)*0.45)] text-[length:calc(var(--u)*1)] leading-[1.5] text-[#2B2B2B]">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>

            <Stage activeStep={activeStep} reduced={prefersReduced} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default WorkflowSection;
