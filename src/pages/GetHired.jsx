import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const lineUp = { hidden: { y: '110%' }, show: { y: 0, transition: { duration: 1, ease: EASE } } };
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export function GetHired() {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    document.title = 'Get Hired — Join Axen Media Editorial Team';
  }, []);

  return (
    <main className="flex min-h-[75vh] select-none items-center justify-center bg-white px-4 pb-[clamp(3rem,6vw,7rem)] pt-[clamp(8rem,12vw,11rem)] sm:px-8 lg:px-[6.4vw]">
      <div className="mx-auto w-full max-w-[1680px] [container-type:inline-size]">
        <motion.div
          variants={stagger}
          initial={prefersReduced ? 'show' : 'hidden'}
          animate="show"
          className="mx-auto max-w-[56rem] text-center"
        >
          <motion.p
            variants={fadeUp}
            className="text-[length:max(0.8rem,1.25cqw)] font-normal text-[#6B6B6B]"
          >
            Careers &amp; Editorial Roster
          </motion.p>

          <h1 className="mt-[max(0.75rem,1.4cqw)] text-[length:clamp(1.8rem,3.65cqw,4.5rem)] font-medium leading-[1.15] tracking-[-0.01em] text-[#2B2B2B]">
            <span className="block overflow-hidden pb-[0.1em]">
              <motion.span variants={lineUp} className="block">
                Join the <span className="text-accent">Elite Video Editorial Team</span> at Axen
                Media.
              </motion.span>
            </span>
          </h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-[max(1rem,2cqw)] max-w-[42rem] text-[length:max(0.95rem,1.5cqw)] leading-relaxed text-[#6B6B6B]"
          >
            We are constantly scouting world-class video editors, motion graphic designers, sound
            artists, and colorists who obsess over pacing, retention, and visual polish. Show us
            your best cuts.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-[max(1.75rem,3.4cqw)] flex flex-wrap items-center justify-center gap-[max(0.75rem,1.2cqw)]"
          >
            <Button to="/contact" variant="yellow" size="lg" className="px-8 shadow-sm">
              Apply to Join Roster
            </Button>
            <Button to="/portfolio" variant="outline" size="lg" className="px-8">
              Review Our Standards
            </Button>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-[max(2rem,4.5cqw)] text-[length:max(0.75rem,1.1cqw)] text-[#6B6B6B]"
          >
            Note: Official careers dashboard coming soon. Use contact form with portfolio link.
          </motion.p>
        </motion.div>
      </div>
    </main>
  );
}

export default GetHired;
