import { useState } from 'react';
import { motion } from 'framer-motion';
import { thumbnailsData } from '@/data/thumbnails';
import { ThumbnailCard } from '@/components/media/ThumbnailCard';
import { ImageLightbox } from '@/components/media/ImageLightbox';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1];

const headerV = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const lineUp = { hidden: { y: '110%' }, show: { y: 0, transition: { duration: 1, ease: EASE } } };

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

export function ThumbnailSection() {
  const prefersReduced = useReducedMotion();
  const [showAll, setShowAll] = useState(false);
  const [selectedThumb, setSelectedThumb] = useState(null);

  const hasMore = thumbnailsData.length > 3;
  const displayItems = showAll ? thumbnailsData : thumbnailsData.slice(0, 3);

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
                <span className="text-accent">THUMBNAIL</span>{' '}
                <span className="text-[#2B2B2B]">DESIGN</span>
              </motion.span>
            </span>
          </h2>
        </motion.div>

        <div className="mt-[max(1.25rem,3cqw)] grid grid-cols-1 gap-[max(0.75rem,1.2cqw)] sm:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((item, i) => (
            <ThumbnailCard key={item.id ?? i} item={item} onClick={setSelectedThumb} />
          ))}
        </div>
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-[max(1.5rem,4cqw)] flex justify-center"
        >
          <button
            type="button"
            onClick={() => hasMore && setShowAll((v) => !v)}
            aria-expanded={hasMore ? showAll : undefined}
            className="group inline-flex h-[max(2.5rem,5.5cqw)] items-center justify-center gap-[max(0.4rem,0.65cqw)] whitespace-nowrap rounded-[max(0.6rem,1.35cqw)] border border-ink bg-white px-[max(1.2rem,3.2cqw)] text-[length:max(0.78rem,1.4cqw)] font-normal text-ink outline-none transition-[background-color,color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-ink hover:text-white focus-visible:ring-2 focus-visible:ring-ink/40 active:scale-[0.97]"
          >
            <span>{showAll ? 'Show Less' : 'Click Here'}</span>
            <HandClickIcon className="h-[1.15em] w-[1.15em] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[0.2em] group-hover:-rotate-12" />
          </button>
        </motion.div>
      </div>

      <ImageLightbox
        isOpen={Boolean(selectedThumb)}
        onClose={() => setSelectedThumb(null)}
        imageSrc={selectedThumb?.image}
        title={selectedThumb?.title}
      />
    </section>
  );
}

export default ThumbnailSection;
