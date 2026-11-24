import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

const EASE = [0.22, 1, 0.36, 1];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};
const lineUp = { hidden: { y: '110%' }, show: { y: 0, transition: { duration: 1, ease: EASE } } };

const BTN =
  'inline-flex h-[max(2.6rem,4.9cqw)] items-center justify-center whitespace-nowrap rounded-[max(0.5rem,0.95cqw)] border border-ink px-[max(1.2rem,2.7cqw)] text-[length:max(0.82rem,1.4cqw)] font-medium text-ink transition-[transform,box-shadow,background-color,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_0.25cqw_0_0_#111] active:translate-y-0';

export function PortfolioHero() {
  return (
    <header className="select-none px-4 pb-0 pt-32 text-center sm:px-8 sm:pt-40">
      <div className="mx-auto w-full max-w-[1680px] [container-type:inline-size]">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          <motion.p
            variants={fadeUp}
            className="text-[length:max(0.72rem,1.15cqw)] font-medium text-accent"
          >
            Project Showcase
          </motion.p>

          <h1 className="mt-[max(0.6rem,1.3cqw)] text-[length:clamp(1.9rem,4.3cqw,5.5rem)] font-bold leading-[1.15] tracking-[-0.03em] text-ink">
            <span className="block overflow-hidden pb-[0.1em]">
              <motion.span variants={lineUp} className="block">
                A look at what we&apos;ve been up to
              </motion.span>
            </span>
          </h1>

          <motion.p
            variants={fadeUp}
            className="mt-[max(0.7rem,1.6cqw)] max-w-[44cqw] text-[length:max(0.85rem,1.3cqw)] leading-[1.55] text-[#21272A] [text-wrap:balance] max-md:max-w-[34rem]"
          >
            Every project here, we gave a damn about because mediocre work with your name on it just
            isn&apos;t an option.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-[max(1.3rem,2.6cqw)] flex flex-wrap items-center justify-center gap-[max(0.4rem,0.65cqw)]"
          >
            <Button to="/contact" variant="yellow" size="lg" className="px-8 shadow-sm">
              Get a Free Trial
            </Button>
            <Button to="/contact" variant="outline" size="lg" className="px-8">
              Book a Free Call
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
}

export default PortfolioHero;
