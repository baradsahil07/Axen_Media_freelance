import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export function ContactHero() {
  return (
    <section className="select-none px-4 text-center sm:px-8 lg:px-[6.4vw]">
      <div className="mx-auto w-full max-w-[1680px] [container-type:inline-size]">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="pb-[max(2.5rem,5.5cqw)] pt-[clamp(8rem,15cqw,11rem)]"
        >
          <motion.p
            variants={fadeUp}
            className="text-[length:max(0.75rem,1.2cqw)] font-normal leading-[1.3] text-accent"
          >
            Work With Us
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="mx-auto mt-[max(0.75rem,1.6cqw)] max-w-[80cqw] text-[length:clamp(2rem,5.7cqw,6.25rem)] font-bold leading-[1.1] tracking-[-0.03em] text-ink"
          >
            Tell us what you&apos;re working on.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-[max(1rem,2.3cqw)] max-w-[49cqw] text-[length:clamp(0.875rem,1.5cqw,1.5rem)] font-normal leading-[1.45] text-ink/80 max-md:max-w-md"
          >
            Tell us about your project timeline, style, and goals and we&apos;ll get back to you
            within 5 hours.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

export default ContactHero;
