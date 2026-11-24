import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { creators } from '@/data/creators';
import { youtubeCard, podcastCard, brandFilmCard } from '@/data/creatorsToBrands';
import { resolveAsset } from '@/lib/assets';
import { Button } from '@/components/ui/Button';
import { SmartImage } from '@/components/media/SmartImage';
import { VideoModal } from '@/components/media/VideoModal';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1];

const UNIT = 'max(0.66rem, 1cqw)';

const CARD =
  'relative flex flex-col rounded-[calc(var(--u)*3.8)] border border-ink md:p-[calc(var(--u)*3)] p-[calc(var(--u)*2)]';
const CARD_SHADOW = { boxShadow: 'calc(var(--u) * 0.3) calc(var(--u) * 0.55) 0 #111' };
const ROW_SHADOW = { boxShadow: '0 calc(var(--u) * 0.3) 0 #111' };
const NUM = 'text-[length:calc(var(--u)*3.5)] font-bold leading-none tracking-[-0.03em]';
const TAG =
  'whitespace-nowrap rounded-full border px-[calc(var(--u)*1.5)] py-[calc(var(--u)*0.6)] text-[length:calc(var(--u)*1)] font-medium uppercase leading-none tracking-wide';
const CHIP =
  'whitespace-nowrap rounded-full border px-[calc(var(--u)*1.5)] py-[calc(var(--u)*0.65)] text-[length:calc(var(--u)*1.05)] font-medium leading-none';
const DESC = 'text-[length:calc(var(--u)*1.2)] leading-[1.5]';

const headerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};
const lineUp = { hidden: { y: '110%' }, show: { y: 0, transition: { duration: 1, ease: EASE } } };

const listV = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } } };
const rowV = {
  hidden: { opacity: 0, x: -18 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } },
};

const cardIn = (reduced, delay = 0) => ({
  initial: reduced ? false : { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.9, ease: EASE, delay },
});
const cardHover = (reduced) =>
  reduced ? undefined : { y: -6, transition: { duration: 0.5, ease: EASE } };

const renderBold = (text) =>
  text.split('**').map((part, i) =>
    i % 2 ? (
      <strong key={i} className="font-bold">
        {part}
      </strong>
    ) : (
      part
    )
  );

const withSubs = (s = '') => (!s || /subscriber/i.test(s) ? s : `${s} subscribers`);
const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

function CardHeader({ number, tag, numberClass, tagClass }) {
  return (
    <div className="mb-[calc(var(--u)*2.2)] flex items-center justify-between gap-3">
      <span className={`${NUM} ${numberClass}`}>{number}</span>
      <span className={`${TAG} ${tagClass}`}>{tag}</span>
    </div>
  );
}

function CreatorAvatar({ creator }) {
  const hasImage = Boolean(resolveAsset(creator.avatar));
  return hasImage ? (
    <SmartImage src={creator.avatar} alt={creator.name} />
  ) : (
    <span className="flex h-full w-full items-center justify-center bg-surface text-[length:calc(var(--u)*1.2)] font-bold text-ink">
      {initials(creator.name)}
    </span>
  );
}

/* ---------- Podcast card video player (no controls, autoplay, muted, loop) ---------- */

function getVimeoParts(url = '') {
  const m = url.match(/vimeo\.com\/(\d+)(?:\/([a-zA-Z0-9]+))?/);
  return { id: m?.[1], hash: m?.[2] };
}

function PodcastPlayer({ tab }) {
  const videoRef = useRef(null);

  // Some browsers ignore the autoPlay attribute, so force muted playback.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, [tab.id]);

  const { id, hash } = getVimeoParts(tab.type === 'vimeo' ? tab.src : '');
  const vimeoSrc = id
    ? `https://player.vimeo.com/video/${id}?${
        hash ? `h=${hash}&` : ''
      }background=1&autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0`
    : null;

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[calc(var(--u)*2.4)] border border-white/15 bg-black">
      <motion.div
        key={tab.id}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {tab.type === 'vimeo' && vimeoSrc && (
          <iframe
            src={vimeoSrc}
            title={tab.label}
            allow="autoplay; fullscreen; picture-in-picture"
            loading="lazy"
            className="pointer-events-none absolute inset-0 h-full w-full border-0"
          />
        )}

        {tab.type === 'file' && (
          <video
            ref={videoRef}
            src={tab.src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="pointer-events-none h-full w-full object-contain"
          />
        )}
      </motion.div>
    </div>
  );
}

function PillTabs({ tabs, active, onChange, reduced }) {
  return (
    <div
      role="tablist"
      aria-label="Podcast formats"
      className="inline-flex items-center rounded-full border border-white/20 bg-[#161616] p-[calc(var(--u)*0.35)]"
    >
      {tabs.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(t.id)}
            className="relative whitespace-nowrap rounded-full px-[calc(var(--u)*1.8)] py-[calc(var(--u)*0.95)] text-[length:calc(var(--u)*1.2)] font-semibold leading-none outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {isActive && (
              <motion.span
                layoutId="podcast-tab-pill"
                transition={
                  reduced ? { duration: 0 } : { type: 'spring', stiffness: 240, damping: 30 }
                }
                className="absolute inset-0 rounded-full bg-primary"
              />
            )}
            <span
              className={`relative z-10 transition-colors duration-300 ${
                isActive ? 'text-ink' : 'text-white'
              }`}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function BrandFilmThumb({ card, reduced, onOpen }) {
  const hasVideo = Boolean(card.video);
  const hasPoster = Boolean(resolveAsset(card.poster));

  return (
    <button
      type="button"
      onClick={hasVideo ? onOpen : undefined}
      aria-label={hasVideo ? `Play ${card.caption}` : card.caption}
      className={`group relative block aspect-[1.85/1] w-full shrink-0 overflow-hidden rounded-[calc(var(--u)*1.6)] bg-black text-left md:w-[calc(var(--u)*16.5)] ${
        hasVideo ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      {hasPoster && (
        <div className="absolute inset-0">
          <SmartImage src={card.poster} alt="" />
        </div>
      )}
      <div className="absolute inset-0 bg-black/50 transition-colors duration-500 group-hover:bg-black/35" />

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          animate={reduced ? undefined : { scale: [1, 1.1, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-[calc(var(--u)*3.8)] w-[calc(var(--u)*3.8)] items-center justify-center rounded-full bg-primary text-ink"
        >
          <Play className="ml-[6%] h-[42%] w-[42%] fill-ink" />
        </motion.span>
      </div>

      <span className="absolute bottom-[calc(var(--u)*0.7)] left-[calc(var(--u)*0.9)] text-[length:calc(var(--u)*0.95)] font-medium leading-none text-white">
        {card.caption}
      </span>
    </button>
  );
}

export function CreatorsToBrands() {
  const prefersReduced = useReducedMotion();
  const [tab, setTab] = useState(podcastCard.tabs[0].id);
  const [filmOpen, setFilmOpen] = useState(false);

  const activeTab = podcastCard.tabs.find((t) => t.id === tab) ?? podcastCard.tabs[0];

  return (
    <section className="select-none bg-white px-4 py-[clamp(4rem,7vw,8.5rem)] sm:px-8 lg:px-[6.4vw]">
      <div className="mx-auto w-full max-w-[1680px]">
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
            What we work on
          </motion.p>

          <h2 className="mt-[clamp(0.75rem,1.2vw,1.5rem)] text-[length:clamp(2rem,4.4vw,5.25rem)] font-bold leading-[1.08] tracking-[-0.03em] text-ink">
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span variants={lineUp} className="block">
                From Creators to Brands
              </motion.span>
            </span>
          </h2>

          <motion.p
            variants={fadeUp}
            className="mt-[clamp(1rem,1.6vw,2rem)] max-w-[44rem] text-[length:clamp(0.95rem,1.15vw,1.375rem)] leading-[1.6] text-[#21272A] [text-wrap:balance]"
          >
            YouTube channels. Podcasts and Brand campaigns. We edit for every format, so your story
            lands right wherever it plays.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-[clamp(1.5rem,2vw,2.5rem)]">
            <Button to="/contact" variant="yellow" size="lg" className="px-8">
              START YOUR PROJECT
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <div className="mx-auto mt-[clamp(2rem,3.5vw,4.5rem)] w-full max-w-[1680px] [container-type:inline-size]">
        <div
          style={{ '--u': UNIT }}
          className="grid grid-cols-1 gap-[calc(var(--u)*1.7)] lg:grid-cols-[1.1fr_1fr]"
        >
          <motion.article
            {...cardIn(prefersReduced, 0)}
            whileHover={cardHover(prefersReduced)}
            className={`${CARD} bg-primary text-ink`}
            style={CARD_SHADOW}
          >
            <CardHeader
              number={youtubeCard.number}
              tag={youtubeCard.tag}
              numberClass="text-ink"
              tagClass="border-ink text-ink"
            />

            <h3 className="text-[length:calc(var(--u)*2.7)] font-bold leading-[1.12] tracking-[-0.025em]">
              {youtubeCard.title}
            </h3>
            <p className={`${DESC} mt-[calc(var(--u)*0.9)] max-w-[90%]`}>
              {renderBold(youtubeCard.text)}
            </p>

            <div className="mt-[calc(var(--u)*1.8)] flex flex-wrap gap-[calc(var(--u)*0.6)]">
              {youtubeCard.chips.map((chip) => (
                <span key={chip} className={`${CHIP} border-ink text-ink`}>
                  {chip}
                </span>
              ))}
            </div>

            <motion.ul
              variants={listV}
              initial={prefersReduced ? false : 'hidden'}
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className="mt-[calc(var(--u)*2.2)] flex flex-col gap-[calc(var(--u)*0.75)]"
            >
              {creators.map((creator) => (
                <motion.li
                  key={creator.id}
                  variants={rowV}
                  whileHover={prefersReduced ? undefined : { y: -2 }}
                  className="group flex items-center gap-[calc(var(--u)*1.2)] rounded-[calc(var(--u)*1.6)] border border-ink bg-white py-[calc(var(--u)*0.65)] pl-[calc(var(--u)*0.7)] pr-[calc(var(--u)*1.2)] transition-shadow duration-300 ease-out [box-shadow:0_0_0_#111] hover:[box-shadow:0_calc(var(--u)*0.3)_0_#111]"
                >
                  <span className="block h-[calc(var(--u)*4)] w-[calc(var(--u)*4)] shrink-0 overflow-hidden rounded-full bg-surface">
                    <CreatorAvatar creator={creator} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[length:calc(var(--u)*1.3)] font-bold leading-tight text-ink transition-colors duration-300 group-hover:text-accent">
                      {creator.name}
                    </span>
                    <span className="mt-[calc(var(--u)*0.2)] block truncate text-[length:calc(var(--u)*1)] leading-tight text-[#555]">
                      {creator.niche} · {withSubs(creator.subscribers)}
                    </span>
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.article>

          <div className="flex flex-col gap-[calc(var(--u)*1.7)]">
            <motion.article
              {...cardIn(prefersReduced, 0.15)}
              whileHover={cardHover(prefersReduced)}
              className={`${CARD} flex-1 bg-[#1F1F1F] text-white`}
              style={CARD_SHADOW}
            >
              <CardHeader
                number={podcastCard.number}
                tag={podcastCard.tag}
                numberClass="text-primary"
                tagClass="border-primary text-primary"
              />

              <h3 className="text-[length:calc(var(--u)*2.3)] font-bold leading-[1.15] tracking-[-0.025em]">
                {podcastCard.title}
              </h3>
              <p className={`${DESC} mt-[calc(var(--u)*0.9)] text-white/60`}>{podcastCard.text}</p>

              <div className="mt-[calc(var(--u)*1.8)]">
                <PodcastPlayer tab={activeTab} />
              </div>

              <div className="mt-[calc(var(--u)*1.6)]">
                <PillTabs
                  tabs={podcastCard.tabs}
                  active={tab}
                  onChange={setTab}
                  reduced={prefersReduced}
                />
              </div>

              <div className="mt-[calc(var(--u)*1.8)] flex items-center gap-[calc(var(--u)*1.4)]">
                <div className="flex shrink-0">
                  {podcastCard.avatars.map((color, i) => (
                    <span
                      key={color + i}
                      className="block h-[calc(var(--u)*4.2)] w-[calc(var(--u)*4.2)] rounded-full"
                      style={{
                        backgroundColor: color,
                        marginLeft: i ? 'calc(var(--u) * -0.8)' : 0,
                        boxShadow: '0 0 0 calc(var(--u) * 0.25) #111',
                      }}
                    />
                  ))}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[length:calc(var(--u)*1.2)] font-medium leading-tight text-white">
                    {podcastCard.showNames}
                  </p>
                  <p className="mt-[calc(var(--u)*0.2)] truncate text-[length:calc(var(--u)*1)] leading-tight text-white/50">
                    {podcastCard.showCount}
                  </p>
                </div>
              </div>
            </motion.article>

            <motion.article
              {...cardIn(prefersReduced, 0.3)}
              whileHover={cardHover(prefersReduced)}
              className={`${CARD} bg-[#F2F2F2] text-ink`}
              style={CARD_SHADOW}
            >
              <CardHeader
                number={brandFilmCard.number}
                tag={brandFilmCard.tag}
                numberClass="text-ink"
                tagClass="border-ink text-ink"
              />

              <h3 className="text-[length:calc(var(--u)*2.3)] font-bold leading-[1.15] tracking-[-0.025em]">
                {brandFilmCard.title}
              </h3>
              <p className={`${DESC} mt-[calc(var(--u)*0.9)] text-ink/70`}>{brandFilmCard.text}</p>

              <div className="mt-[calc(var(--u)*1.8)] flex flex-col gap-[calc(var(--u)*1.4)] md:flex-row md:items-center">
                <BrandFilmThumb
                  card={brandFilmCard}
                  reduced={prefersReduced}
                  onOpen={() => setFilmOpen(true)}
                />
                <div className="flex flex-wrap gap-[calc(var(--u)*0.6)] md:flex-1">
                  {brandFilmCard.chips.map((chip) => (
                    <span key={chip} className={`${CHIP} border-ink bg-white text-ink`}>
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          </div>
        </div>
      </div>

      <VideoModal
        isOpen={filmOpen && Boolean(brandFilmCard.video)}
        onClose={() => setFilmOpen(false)}
        videoSrc={brandFilmCard.video}
        poster={brandFilmCard.poster}
        title={brandFilmCard.caption}
      />
    </section>
  );
}

export default CreatorsToBrands;
