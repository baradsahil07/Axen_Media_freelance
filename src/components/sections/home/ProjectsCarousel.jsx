import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { projects } from '@/data/projects';
import { SmartImage } from '@/components/media/SmartImage';
import { VideoModal } from '@/components/media/VideoModal';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1];
const MOVE_SECONDS = 1.1;
const AUTOPLAY_MS = 4500;
const SWIPE_DISTANCE = 60;
const PLAY_RANGE = 2;
const OPEN_MODAL_ON_CLICK = true;

const SIDE_ASPECTS = [1, 0.6, 0.85, 0.7, 0.95];

const headerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};
const lineUp = {
  hidden: { y: '110%' },
  show: { y: 0, transition: { duration: 1, ease: EASE } },
};

const isEmbedUrl = (url) => /(youtube\.com|youtu\.be|vimeo\.com)/i.test(url || '');

function buildSlides(list) {
  if (!list.length) return [];
  const reps = Math.ceil(12 / list.length);
  const out = [];
  for (let r = 0; r < reps; r++) {
    list.forEach((p, i) => {
      const index = out.length;
      out.push({
        ...p,
        key: `${p.id}-${r}-${i}`,
        aspect: p.sideAspect ?? SIDE_ASPECTS[index % SIDE_ASPECTS.length],
      });
    });
  }
  return out;
}

const blurFor = (o) => `blur(${[0, 1.5, 4, 6, 7][Math.min(Math.abs(o), 4)]}px)`;
const opacityFor = (o) => [1, 1, 0.85, 0.65, 0.45, 0][Math.min(Math.abs(o), 5)];

function SlideMedia({ slide, mount, playing, reduced }) {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const canUseVideo = Boolean(slide.video) && !isEmbedUrl(slide.video) && !reduced && !failed;
  const showVideo = canUseVideo && mount;

  useEffect(() => {
    if (!showVideo) setReady(false);
  }, [showVideo]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    if (v.readyState >= 2) setReady(true);
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing, showVideo]);

  return (
    <>
      <SmartImage
        src={slide.poster}
        alt={slide.title}
        position={slide.position ?? 'center'}
        placeholderLabel={slide.title}
      />

      {showVideo && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          tabIndex={-1}
          aria-hidden="true"
          poster=""
          onLoadedData={() => setReady(true)}
          onPlaying={() => setReady(true)}
          onError={() => setFailed(true)}
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ objectPosition: slide.position ?? 'center' }}
        >
          <source src={slide.video} type="video/mp4" />
        </video>
      )}
    </>
  );
}

export function ProjectsCarousel() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const prevOffsets = useRef(null);
  const justPanned = useRef(false);

  const prefersReduced = useReducedMotion();
  const inView = useInView(sectionRef, { amount: 0.3 });

  const slides = useMemo(() => buildSlides(projects), []);
  const n = slides.length;

  const [active, setActive] = useState(0);
  const [stageW, setStageW] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [selected, setSelected] = useState(null);

  const next = useCallback(() => setActive((a) => (a + 1) % n), [n]);
  const prev = useCallback(() => setActive((a) => (a - 1 + n) % n), [n]);

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => setStageW(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReduced || !inView || hovering || selected || n < 2) return;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [prefersReduced, inView, hovering, selected, next, n, active]);

  useEffect(() => {
    if (!inView) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [inView, next, prev]);

  const layout = useMemo(() => {
    if (!stageW || !n) return null;

    const small = stageW < 640;
    const mid = stageW < 1024;

    const Wa = stageW * (small ? 0.74 : mid ? 0.6 : 0.45);
    const Ha = Wa / (small ? 1.6 : 2.06);
    const Hi = Ha * 0.91;
    const G = stageW * (small ? 0.03 : 0.025);
    const Hs = Ha * 1.16;

    const half = Math.floor(n / 2);
    const offsets = slides.map((_, i) => ((i - active + n + half) % n) - half);
    const widthOf = (i, o) => (o === 0 ? Wa : Hi * slides[i].aspect);

    const byOffset = new Map(offsets.map((o, i) => [o, i]));
    const centers = new Map([[0, 0]]);

    let edge = Wa / 2;
    for (let o = 1; o <= half; o++) {
      const i = byOffset.get(o);
      if (i === undefined) break;
      const w = widthOf(i, o);
      centers.set(o, edge + G + w / 2);
      edge += G + w;
    }
    edge = Wa / 2;
    for (let o = -1; o >= -half; o--) {
      const i = byOffset.get(o);
      if (i === undefined) break;
      const w = widthOf(i, o);
      centers.set(o, -(edge + G + w / 2));
      edge += G + w;
    }

    return { Wa, Ha, Hi, Hs, offsets, centers, widthOf };
  }, [stageW, n, active, slides]);

  useEffect(() => {
    prevOffsets.current = layout?.offsets ?? null;
  }, [layout]);

  const handleCardClick = (slide, offset) => {
    if (justPanned.current) return;
    if (offset === 0) {
      if (OPEN_MODAL_ON_CLICK && slide.video) setSelected(slide);
    } else if (Math.abs(offset) <= 4) {
      setActive((a) => (a + offset + n) % n);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative select-none overflow-hidden bg-white py-[clamp(4rem,7vw,8.5rem)]"
    >
      <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-8">
        <motion.div
          variants={headerStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto flex flex-col items-center text-center"
        >
          <motion.p
            variants={fadeUp}
            className="text-[length:clamp(0.75rem,1vw,1.125rem)] font-medium uppercase tracking-wide text-accent"
          >
            Our Projects
          </motion.p>

          <h2 className="mt-[clamp(0.75rem,1.2vw,1.5rem)] text-[length:clamp(2rem,4.4vw,5.25rem)] font-bold leading-[1.08] tracking-[-0.03em] text-ink">
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span variants={lineUp} className="block">
                Watch the Work
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span variants={lineUp} className="block">
                That Built Our Reputation
              </motion.span>
            </span>
          </h2>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1, ease: EASE }}
        className="mt-[clamp(2rem,3.6vw,4.5rem)]"
      >
        <motion.div
          ref={stageRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Our projects"
          onPointerEnter={(e) => e.pointerType === 'mouse' && setHovering(true)}
          onPointerLeave={() => setHovering(false)}
          onPanEnd={(_, info) => {
            if (Math.abs(info.offset.x) > 8) {
              justPanned.current = true;
              setTimeout(() => (justPanned.current = false), 60);
            }
            if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -450) next();
            else if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > 450) prev();
          }}
          className="relative w-full touch-pan-y overflow-hidden"
          style={{ height: layout ? layout.Hs : 'clamp(14rem,24vw,30rem)' }}
        >
          {layout &&
            slides.map((slide, i) => {
              const o = layout.offsets[i];
              const isCenter = o === 0;
              const hidden = Math.abs(o) > 4;
              const clickable = isCenter ? OPEN_MODAL_ON_CLICK && Boolean(slide.video) : !hidden;

              const w = layout.widthOf(i, o);
              const h = isCenter ? layout.Ha : layout.Hi;
              const x = layout.centers.get(o) - w / 2;
              const top = (layout.Hs - h) / 2;

              const wrapped = prevOffsets.current && Math.abs(o - prevOffsets.current[i]) > 1;

              const mount = Math.abs(o) <= PLAY_RANGE;
              const playing = mount && inView && !selected;

              return (
                <motion.div
                  key={slide.key}
                  role="button"
                  tabIndex={isCenter ? 0 : -1}
                  aria-hidden={hidden || undefined}
                  aria-label={isCenter ? slide.title : `Show ${slide.title}`}
                  onClick={() => handleCardClick(slide, o)}
                  onKeyDown={(e) => {
                    if (
                      isCenter &&
                      OPEN_MODAL_ON_CLICK &&
                      slide.video &&
                      (e.key === 'Enter' || e.key === ' ')
                    ) {
                      e.preventDefault();
                      setSelected(slide);
                    }
                  }}
                  initial={false}
                  animate={{
                    x,
                    top,
                    width: w,
                    height: h,
                    opacity: opacityFor(o),
                    filter: blurFor(o),
                  }}
                  transition={
                    prefersReduced || wrapped
                      ? { duration: 0 }
                      : { duration: MOVE_SECONDS, ease: EASE }
                  }
                  className={`group absolute left-1/2 overflow-hidden rounded-[clamp(0.6rem,1.15vw,1.4rem)] bg-surface shadow-[0_14px_34px_rgba(0,0,0,0.14)] outline-none will-change-transform focus-visible:ring-4 focus-visible:ring-primary/70 ${
                    hidden ? 'pointer-events-none' : clickable ? 'cursor-pointer' : 'cursor-default'
                  }`}
                  style={{ zIndex: 20 - Math.abs(o) }}
                >
                  <SlideMedia
                    slide={slide}
                    mount={mount}
                    playing={playing}
                    reduced={prefersReduced}
                  />
                </motion.div>
              );
            })}
        </motion.div>
      </motion.div>

      <VideoModal
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        videoSrc={selected?.video}
        poster={selected?.poster}
        title={selected?.title ?? ''}
      />
    </section>
  );
}

export default ProjectsCarousel;
