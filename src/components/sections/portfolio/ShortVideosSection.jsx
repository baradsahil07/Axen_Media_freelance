import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { shortFormCategories, shortFormData } from '@/data/shortForm';
import { ShortVideoCard } from '@/components/media/ShortVideoCard';
import { VideoModal } from '@/components/media/VideoModal';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1];
const PAGE_SIZE = 5; // one row of 5 on desktop; each "Click Here" loads 5 more

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
      aria-label="Short video categories"
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

export function ShortVideosSection() {
  const prefersReduced = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState(
    shortFormCategories[0]?.id ?? 'talking-head'
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [playingId, setPlayingId] = useState(null); // card playing inline
  const [expandedVideo, setExpandedVideo] = useState(null); // large player (optional)

  const all = shortFormData[activeCategory] || [];
  const items = all.slice(0, visibleCount);
  const hasMore = all.length > visibleCount;

  const handleCategoryChange = (id) => {
    setActiveCategory(id);
    setVisibleCount(PAGE_SIZE);
    setPlayingId(null);
  };

  const handleExpand = (item) => {
    setPlayingId(null); // stop the inline player so audio doesn't double up
    setExpandedVideo(item);
  };

  return (
    <section className="select-none bg-white px-4 pb-[clamp(3rem,6vw,7rem)] pt-[clamp(3rem,6vw,7rem)] sm:px-8 lg:px-[6.4vw]">
      <div className="mx-auto w-full max-w-[1680px] [container-type:inline-size]">
        {/* ---------- Heading ---------- */}
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
                <span className="text-accent">SHORT</span>{' '}
                <span className="text-[#2B2B2B]">VIDEOS</span>
              </motion.span>
            </span>
          </h2>

          <motion.div variants={fadeUp} className="mt-[max(1rem,2.6cqw)]">
            <CategoryTabs
              tabs={shortFormCategories}
              active={activeCategory}
              onChange={handleCategoryChange}
            />
          </motion.div>
        </motion.div>

        {/* ---------- Grid: 5 per row, incomplete rows are centered ---------- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.4 }}
            style={{ '--g': 'max(0.75rem,1.2cqw)' }}
            className="mt-[max(1.25rem,3cqw)] flex flex-wrap justify-center gap-[var(--g)]"
          >
            {items.map((item, i) => (
              <motion.div
                key={item.id ?? i}
                initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: (i % PAGE_SIZE) * 0.05 }}
                className="w-[calc((100%_-_var(--g))/2)] sm:w-[calc((100%_-_2*var(--g))/3)] lg:w-[calc((100%_-_4*var(--g))/5)]"
              >
                <ShortVideoCard
                  item={item}
                  isPlaying={playingId === item.id}
                  onPlay={setPlayingId}
                  onStop={() => setPlayingId(null)}
                  onExpand={handleExpand}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ---------- Load more (only when there are more than shown) ---------- */}
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
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="group inline-flex h-[max(2.5rem,5.5cqw)] cursor-pointer items-center justify-center gap-[max(0.4rem,0.65cqw)] whitespace-nowrap rounded-[max(0.6rem,1.35cqw)] border border-ink bg-white px-[max(1.2rem,3.2cqw)] text-[length:max(0.78rem,1.4cqw)] font-normal text-ink outline-none transition-[background-color,color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-ink hover:text-white focus-visible:ring-2 focus-visible:ring-ink/40 active:scale-[0.97]"
            >
              <span>Click Here</span>
              <HandClickIcon className="h-[1.15em] w-[1.15em] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[0.2em] group-hover:-rotate-12" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Large player, only opened from the expand button on a playing card */}
      <VideoModal
        isOpen={Boolean(expandedVideo)}
        onClose={() => setExpandedVideo(null)}
        videoSrc={expandedVideo?.video}
        title={expandedVideo ? `${expandedVideo.title ?? 'Short Video'}` : undefined}
      />
    </section>
  );
}

export default ShortVideosSection;
