import { motion } from 'framer-motion';
import { faqs } from '@/data/faq';
import { Accordion } from '@/components/ui/Accordion';

const EASE = [0.22, 1, 0.36, 1];

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

export function FaqSection() {
  return (
    <section className="select-none overflow-hidden bg-white px-4 py-[clamp(4rem,7vw,8.5rem)] sm:px-8 lg:px-[6.4vw]">
      <div className="mx-auto w-full max-w-[1680px] [container-type:inline-size]">
        <motion.div
          variants={headerStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between"
        >
          <h2 className="text-[length:clamp(1.6rem,4.4cqw,5rem)] font-bold leading-[1.2] tracking-[-0.03em] text-ink">
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span variants={lineUp} className="block">
                Everything You
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span variants={lineUp} className="block">
                Need to Know
              </motion.span>
            </span>
          </h2>

          <motion.p
            variants={fadeUp}
            className="max-w-[27cqw] text-[length:max(0.72rem,1.2cqw)] font-normal leading-[1.3] text-ink max-md:max-w-none md:pt-[1.7cqw] md:text-right"
          >
            Find quick answers to common questions about our video editing process, tools, and
            services. From the software we use to editing time, costs, and quality, this section
            covers everything you need to know.
          </motion.p>
        </motion.div>

        <div className="mt-[max(2rem,6cqw)]">
          <Accordion items={faqs} defaultOpenIndex={0} />
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
