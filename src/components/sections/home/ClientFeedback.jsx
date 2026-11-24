// import { useMemo, useRef, useState } from 'react';
// import { motion } from 'framer-motion';
// import { useGSAP } from '@gsap/react';
// import { gsap } from '@/lib/gsap';
// import { Button } from '@/components/ui/Button';
// import { VideoModal } from '@/components/media/VideoModal';
// import { AsteriskIcon, BlobIcon } from '@/components/ui/decor/DecorIcons';
// import { TestimonialFlipCard } from './TestimonialFlipCard';
// import { clientFeedbackTestimonials } from '@/data/clients';
// import { useReducedMotion } from '@/hooks/useReducedMotion';

// const EASE = [0.22, 1, 0.36, 1];
// const LOOP_SECONDS = 90;

// const headerStagger = {
//   hidden: {},
//   show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
// };
// const fadeUp = {
//   hidden: { opacity: 0, y: 28 },
//   show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
// };
// const lineUp = {
//   hidden: { y: '110%' },
//   show: { y: 0, transition: { duration: 1, ease: EASE } },
// };

// /* Repeats the list until the loop is long enough to fill wide screens (even count keeps colours alternating) */
// function buildLoop(list) {
//   if (!list.length) return [];
//   let out = [...list];
//   while (out.length < 6) out = [...out, ...list];
//   if (out.length % 2) out = [...out, ...out];
//   return out;
// }

// export function ClientFeedback() {
//   const sectionRef = useRef(null);
//   const rowRef = useRef(null);
//   const trackRef = useRef(null);
//   const [selected, setSelected] = useState(null);
//   const prefersReduced = useReducedMotion();

//   const loopItems = useMemo(() => buildLoop(clientFeedbackTestimonials), []);

//   useGSAP(
//     () => {
//       if (prefersReduced || !trackRef.current) return;

//       const tween = gsap.to(trackRef.current, {
//         xPercent: -50,
//         ease: 'none',
//         duration: LOOP_SECONDS,
//         repeat: -1,
//       });

//       const row = rowRef.current;
//       const slowDown = () =>
//         gsap.to(tween, { timeScale: 0, duration: 0.9, ease: 'power2.out', overwrite: true });
//       const speedUp = () =>
//         gsap.to(tween, { timeScale: 1, duration: 1.4, ease: 'power2.inOut', overwrite: true });

//       row.addEventListener('mouseenter', slowDown);
//       row.addEventListener('mouseleave', speedUp);

//       return () => {
//         tween.kill();
//         row.removeEventListener('mouseenter', slowDown);
//         row.removeEventListener('mouseleave', speedUp);
//       };
//     },
//     { scope: sectionRef, dependencies: [prefersReduced] }
//   );

//   return (
//     <section
//       ref={sectionRef}
//       className="relative overflow-x-clip bg-white pb-[clamp(4rem,7vw,8.5rem)] pt-[clamp(4rem,7vw,8.5rem)]"
//     >
//       <div className="relative mx-auto w-full max-w-[1920px] px-4 sm:px-8">
//         <div className="pointer-events-none absolute right-[7%] -top-6 w-9 sm:-top-[4.2vw] sm:right-[10.8%] sm:w-[clamp(2.75rem,5.2vw,6.25rem)]">
//           <motion.div
//             animate={prefersReduced ? undefined : { rotate: 360 }}
//             transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
//           >
//             <AsteriskIcon className="h-auto w-full text-primary" />
//           </motion.div>
//         </div>

//         <motion.div
//           variants={headerStagger}
//           initial="hidden"
//           whileInView="show"
//           viewport={{ once: true, amount: 0.4 }}
//           className="mx-auto flex flex-col items-center text-center"
//         >
//           <motion.p
//             variants={fadeUp}
//             className="text-[length:clamp(0.75rem,1vw,1.125rem)] font-medium uppercase tracking-wide text-accent"
//           >
//             Client Feedback
//           </motion.p>

//           <h2 className="mt-[clamp(0.75rem,1.2vw,1.5rem)] text-[length:clamp(2rem,4.4vw,5.25rem)] font-bold leading-[1.08] tracking-[-0.03em] text-ink">
//             <span className="block overflow-hidden pb-[0.08em]">
//               <motion.span variants={lineUp} className="block">
//                 The Confidence of Those
//               </motion.span>
//             </span>
//             <span className="block overflow-hidden pb-[0.08em]">
//               <motion.span variants={lineUp} className="block">
//                 Who Collaborate With Us.
//               </motion.span>
//             </span>
//           </h2>

//           <motion.p
//             variants={fadeUp}
//             className="mt-[clamp(1rem,1.6vw,2rem)] max-w-[50rem] text-[length:clamp(0.95rem,1.15vw,1.375rem)] leading-[1.6] text-[#21272A] [text-wrap:balance]"
//           >
//             We partner with ambitious brands and creators, delivering measurable results and
//             experiences clients are proud to talk about.
//           </motion.p>

//           <motion.div variants={fadeUp} className="mt-[clamp(1.5rem,2vw,2.5rem)]">
//             <Button to="/contact" variant="yellow" size="lg" className="px-8">
//               BOOK A CONSULT
//             </Button>
//           </motion.div>
//         </motion.div>
//       </div>

//       <div className="relative mt-[clamp(2.5rem,3.2vw,4rem)]">
//         <div className="pointer-events-none absolute left-[8.8%] top-8 z-10 w-[clamp(3.5rem,7.9vw,9.5rem)] -translate-y-full pb-[0.7vw]">
//           <motion.div
//             animate={prefersReduced ? undefined : { y: [-6, 6, -6], rotate: [-3, 3, -3] }}
//             transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
//           >
//             <BlobIcon className="h-auto w-full text-[#45A98B]" />
//           </motion.div>
//         </div>

//         <motion.div
//           ref={rowRef}
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, amount: 0.15 }}
//           transition={{ duration: 1, ease: EASE }}
//           className={`w-full py-8 ${prefersReduced ? 'overflow-x-auto' : 'overflow-hidden'}`}
//         >
//           <div
//             ref={trackRef}
//             className="flex w-max will-change-transform"
//             style={{ '--card-gap': 'clamp(1rem,2.35vw,2.8rem)' }}
//           >
//             {(prefersReduced ? [0] : [0, 1]).map((group) => (
//               <div key={group} className="flex shrink-0 gap-[var(--card-gap)] pr-[var(--card-gap)]">
//                 {loopItems.map((item, i) => (
//                   <TestimonialFlipCard
//                     key={`${group}-${i}`}
//                     item={item}
//                     index={i}
//                     isClone={group === 1}
//                     reduced={prefersReduced}
//                     onOpen={setSelected}
//                   />
//                 ))}
//               </div>
//             ))}
//           </div>
//         </motion.div>
//       </div>

//       <VideoModal
//         isOpen={Boolean(selected)}
//         onClose={() => setSelected(null)}
//         videoSrc={selected?.video}
//         poster={selected?.poster}
//         title={selected ? `${selected.name} — Testimonial` : ''}
//       />
//     </section>
//   );
// }

// export default ClientFeedback;

import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { Button } from '@/components/ui/Button';
import { VideoModal } from '@/components/media/VideoModal';
import { AsteriskIcon, BlobIcon } from '@/components/ui/decor/DecorIcons';
import { TestimonialFlipCard } from './TestimonialFlipCard';
import { clientFeedbackTestimonials } from '@/data/clients';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1];
const LOOP_SECONDS = 90;
const TOUCH_RESUME_MS = 6000;

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

function buildLoop(list) {
  if (!list.length) return [];
  let out = [...list];
  while (out.length < 6) out = [...out, ...list];
  if (out.length % 2) out = [...out, ...out];
  return out;
}

export function ClientFeedback() {
  const sectionRef = useRef(null);
  const rowRef = useRef(null);
  const trackRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const prefersReduced = useReducedMotion();

  const loopItems = useMemo(() => buildLoop(clientFeedbackTestimonials), []);

  useGSAP(
    () => {
      if (prefersReduced || !trackRef.current) return;

      const tween = gsap.to(trackRef.current, {
        xPercent: -50,
        ease: 'none',
        duration: LOOP_SECONDS,
        repeat: -1,
      });

      const row = rowRef.current;
      let resumeTimer;

      const slowDown = () =>
        gsap.to(tween, { timeScale: 0, duration: 0.9, ease: 'power2.out', overwrite: true });
      const speedUp = () => {
        clearTimeout(resumeTimer);
        gsap.to(tween, { timeScale: 1, duration: 1.4, ease: 'power2.inOut', overwrite: true });
      };

      const onEnter = (e) => {
        if (e.pointerType === 'mouse') slowDown();
      };
      const onLeave = (e) => {
        if (e.pointerType === 'mouse') speedUp();
      };
      const onDown = (e) => {
        if (e.pointerType === 'mouse') return;
        slowDown();
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(speedUp, TOUCH_RESUME_MS);
      };
      const onOutside = (e) => {
        if (e.pointerType !== 'mouse' && !row.contains(e.target)) speedUp();
      };

      row.addEventListener('pointerenter', onEnter);
      row.addEventListener('pointerleave', onLeave);
      row.addEventListener('pointerdown', onDown);
      document.addEventListener('pointerdown', onOutside);

      return () => {
        clearTimeout(resumeTimer);
        tween.kill();
        row.removeEventListener('pointerenter', onEnter);
        row.removeEventListener('pointerleave', onLeave);
        row.removeEventListener('pointerdown', onDown);
        document.removeEventListener('pointerdown', onOutside);
      };
    },
    { scope: sectionRef, dependencies: [prefersReduced] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-x-clip bg-white pb-[clamp(3rem,7vw,8.5rem)] pt-[clamp(3rem,7vw,8.5rem)]"
    >
      <div className="relative mx-auto w-full max-w-[1920px] px-4 sm:px-8">
        <div className="pointer-events-none absolute right-[7%] -top-6 w-9 sm:-top-[4.2vw] sm:right-[10.8%] sm:w-[clamp(2.75rem,5.2vw,6.25rem)]">
          <motion.div
            animate={prefersReduced ? undefined : { rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          >
            <AsteriskIcon className="h-auto w-full text-primary" />
          </motion.div>
        </div>

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
            Client Feedback
          </motion.p>

          <h2 className="mt-[clamp(0.75rem,1.2vw,1.5rem)] text-[length:clamp(1.75rem,4.4vw,5.25rem)] font-bold leading-[1.08] tracking-[-0.03em] text-ink">
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span variants={lineUp} className="block">
                The Confidence of Those
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span variants={lineUp} className="block">
                Who Collaborate With Us.
              </motion.span>
            </span>
          </h2>

          <motion.p
            variants={fadeUp}
            className="mt-[clamp(1rem,1.6vw,2rem)] max-w-[50rem] text-[length:clamp(0.9rem,1.15vw,1.375rem)] leading-[1.6] text-[#21272A] [text-wrap:balance]"
          >
            We partner with ambitious brands and creators, delivering measurable results and
            experiences clients are proud to talk about.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-[clamp(1.5rem,2vw,2.5rem)]">
            <Button to="/contact" variant="yellow" size="lg" className="px-8">
              BOOK A CONSULT
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative mt-[clamp(2rem,3.2vw,4rem)]">
        <div className="pointer-events-none absolute left-[8.8%] top-8 z-10 w-[clamp(2.75rem,7.9vw,9.5rem)] -translate-y-full pb-[0.7vw]">
          <motion.div
            animate={prefersReduced ? undefined : { y: [-6, 6, -6], rotate: [-3, 3, -3] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <BlobIcon className="h-auto w-full text-[#45A98B]" />
          </motion.div>
        </div>

        <motion.div
          ref={rowRef}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1, ease: EASE }}
          className={`w-full py-6 [touch-action:pan-y] sm:py-8 ${
            prefersReduced ? 'overflow-x-auto' : 'overflow-hidden'
          }`}
        >
          <div
            ref={trackRef}
            className="flex w-max will-change-transform"
            style={{ '--card-gap': 'clamp(0.75rem,2.35vw,2.8rem)' }}
          >
            {(prefersReduced ? [0] : [0, 1]).map((group) => (
              <div key={group} className="flex shrink-0 gap-[var(--card-gap)] pr-[var(--card-gap)]">
                {loopItems.map((item, i) => (
                  <TestimonialFlipCard
                    key={`${group}-${i}`}
                    item={item}
                    index={i}
                    isClone={group === 1}
                    reduced={prefersReduced}
                    onOpen={setSelected}
                  />
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <VideoModal
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        videoSrc={selected?.video}
        poster={selected?.poster}
        title={selected ? `${selected.name} — Testimonial` : ''}
      />
    </section>
  );
}

export default ClientFeedback;
