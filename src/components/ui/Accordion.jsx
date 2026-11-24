import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TRANSITION_EASE } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function Accordion({ items = [], defaultOpenIndex = 0, className }) {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);
  const prefersReduced = useReducedMotion();

  const toggle = (index) => setOpenIndex(openIndex === index ? -1 : index);
  const dur = (s) => (prefersReduced ? 0 : s);

  return (
    <div className={cn('space-y-[max(0.6rem,1.5cqw)]', className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const number = item.id ?? String(index + 1).padStart(2, '0');

        return (
          <motion.div
            key={item.id ?? index}
            initial={prefersReduced ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: dur(0.8), ease: TRANSITION_EASE, delay: dur(index * 0.08) }}
            className={cn(
              'rounded-[max(1rem,3.4cqw)] border border-ink shadow-[0_max(2px,0.4cqw)_0_0_#111111]',
              'transition-colors duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
              isOpen ? 'bg-primary' : 'bg-[#F3F3F3] hover:bg-[#ECECEC]'
            )}
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${index}`}
              className="group flex w-full cursor-pointer select-none items-center gap-[max(0.65rem,1.5cqw)] rounded-[inherit] px-[max(0.95rem,3cqw)] py-[max(0.7rem,1.9cqw)] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              <span className="text-[length:clamp(1.15rem,3cqw,3.5rem)] font-extrabold leading-none tracking-[-0.03em] text-ink">
                {number}
              </span>

              <span className="flex-1 text-[length:max(0.82rem,1.45cqw)] font-medium leading-[1.3] tracking-[-0.01em] text-ink">
                {item.question}
              </span>

              <span
                aria-hidden="true"
                className="relative grid size-[max(1.5rem,2.9cqw)] shrink-0 place-items-center rounded-full border border-ink bg-white transition-transform duration-300 group-hover:scale-105"
              >
                <span className="absolute h-[1.5px] w-[42%] bg-ink" />
                <motion.span
                  initial={false}
                  animate={{ rotate: isOpen ? 90 : 0, opacity: isOpen ? 0 : 1 }}
                  transition={{ duration: dur(0.35), ease: TRANSITION_EASE }}
                  className="absolute h-[42%] w-[1.5px] bg-ink"
                />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`accordion-content-${index}`}
                  role="region"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: 'auto',
                    opacity: 1,
                    transition: {
                      height: { duration: dur(0.45), ease: TRANSITION_EASE },
                      opacity: { duration: dur(0.35), delay: dur(0.1) },
                    },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: {
                      height: { duration: dur(0.4), ease: TRANSITION_EASE },
                      opacity: { duration: dur(0.15) },
                    },
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-[max(0.95rem,3cqw)] pb-[max(0.85rem,1.9cqw)]">
                    <div className="mb-[max(0.5rem,1.45cqw)] h-px w-full bg-ink" />
                    <p className="text-[length:max(0.72rem,0.95cqw)] font-normal leading-[1.3] text-ink">
                      {item.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

export default Accordion;
