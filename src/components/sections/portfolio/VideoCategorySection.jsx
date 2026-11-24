import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { longFormCategories, longFormData } from '@/data/longForm';
import { VideoCard } from '@/components/media/VideoCard';
import { VideoModal } from '@/components/media/VideoModal';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1];
const INITIAL_COUNT = 3; // ← default number of cards shown

const headerV = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const lineUp = { hidden: { y: '110%' }, show: { y: 0, transition: { duration: 1, ease: EASE } } };
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

function HandClickIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M22 14a8 8 0 0 1-8 8" />
      <path d="M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
      <path d="M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1" />
      <path d="M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10" />
      <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}

function CategoryTabs({ tabs, active, onChange }) {
  const onKeyDown = (e, i) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    onChange(tabs[next].id);
    e.currentTarget.parentElement.children[next]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Long-form video categories"
      className="no-scrollbar mx-auto flex w-full max-w-full items-center justify-start gap-[max(1.1rem,3.2cqw)] overflow-x-auto px-1 md:justify-center"
    >
      {tabs.map((tab, i) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className="relative shrink-0 cursor-pointer whitespace-nowrap py-1 text-[length:max(0.78rem,1.5cqw)] leading-none outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
          >
            <span aria-hidden="true" className="invisible block font-semibold">
              {tab.label}
            </span>
            <span
              className={`absolute inset-0 flex items-center justify-center transition-[color,font-weight] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isActive ? 'font-semibold text-ink' : 'font-normal text-[#6B6B6B] hover:text-ink'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function VideoCategorySection() {
  const prefersReduced = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState(longFormCategories[0]?.id ?? 'talking-head');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const items = longFormData[activeCategory] || [];
  const displayItems = showAll ? items : items.slice(0, INITIAL_COUNT);
  const hasMore = items.length > INITIAL_COUNT;

  return (
    <section className="select-none bg-white px-4 pb-[clamp(3rem,6vw,7rem)] pt-[clamp(3rem,6vw,7rem)] sm:px-8 lg:px-[6.4vw]">
      <div className="mx-auto w-full max-w-[1680px] [container-type:inline-size]">
        <motion.div
          variants={headerV}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          className="text-center"
        >
          <h2 className="text-[length:clamp(1.6rem,3.65cqw,4.5rem)] font-medium leading-[1.15] tracking-[-0.01em]">
            <span className="block overflow-hidden pb-[0.1em]">
              <motion.span variants={lineUp} className="block">
                <span className="text-accent">LONG-FORM</span>{' '}
                <span className="text-[#2B2B2B]">VIDEOS</span>
              </motion.span>
            </span>
          </h2>

          <motion.div variants={fadeUp} className="mt-[max(1rem,2.6cqw)]">
            <CategoryTabs
              tabs={longFormCategories}
              active={activeCategory}
              onChange={(id) => {
                setActiveCategory(id);
                setShowAll(false); // reset to the default 3 on tab change
              }}
            />
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.4 }}
            className="mt-[max(1.25rem,3cqw)] grid grid-cols-1 gap-[max(0.75rem,1.2cqw)] md:grid-cols-3"
          >
            {displayItems.map((item, i) => (
              <VideoCard key={item.id ?? i} item={item} index={i % 3} onPlay={setSelectedVideo} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Button only appears when the category has more than INITIAL_COUNT videos */}
        {hasMore && (
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mt-[max(1.5rem,4cqw)] flex justify-center"
          >
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              aria-expanded={showAll}
              className="group inline-flex h-[max(2.5rem,5.5cqw)] items-center justify-center gap-[max(0.4rem,0.65cqw)] whitespace-nowrap rounded-[max(0.6rem,1.35cqw)] border border-ink bg-white px-[max(1.2rem,3.2cqw)] text-[length:max(0.78rem,1.4cqw)] font-normal text-ink outline-none transition-[background-color,color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-ink hover:text-white focus-visible:ring-2 focus-visible:ring-ink/40 active:scale-[0.97]"
            >
              <span>{showAll ? 'Show Less' : 'Click Here'}</span>
              <HandClickIcon className="h-[1.15em] w-[1.15em] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[0.2em] group-hover:-rotate-12" />
            </button>
          </motion.div>
        )}
      </div>

      <VideoModal
        isOpen={Boolean(selectedVideo)}
        onClose={() => setSelectedVideo(null)}
        videoSrc={selectedVideo?.video}
        poster={selectedVideo?.poster}
        title={selectedVideo?.title}
      />
    </section>
  );
}

export default VideoCategorySection;
