import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SmartImage } from '@/components/media/SmartImage';

const FLIP_DEG = -180;
const FLIP_SPRING = { type: 'spring', stiffness: 38, damping: 14, mass: 1.1 };

const THEMES = { yellow: 'bg-primary', dark: 'bg-ink' };

const faceStyle = {
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
};

function QuoteMark({ className }) {
  return (
    <svg viewBox="0 0 64 40" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M0 28C0 12 10 3 26 0V8C19 10 15 14 14.5 18.5A11 11 0 1 1 0 28Z" />
      <path
        transform="translate(34 0)"
        d="M0 28C0 12 10 3 26 0V8C19 10 15 14 14.5 18.5A11 11 0 1 1 0 28Z"
      />
    </svg>
  );
}

export function TestimonialFlipCard({ item, index, isClone = false, reduced = false, onOpen }) {
  const [flipped, setFlipped] = useState(false);
  const theme = item.theme ?? (index % 2 === 0 ? 'yellow' : 'dark');
  const canOpen = Boolean(item.video);

  const handlePointerEnter = (e) => e.pointerType === 'mouse' && setFlipped(true);
  const handlePointerLeave = (e) => e.pointerType === 'mouse' && setFlipped(false);

  const handleClick = (e) => {
    const type = e.nativeEvent.pointerType;
    if (type === 'touch' || type === 'pen') {
      setFlipped((f) => !f);
      return;
    }
    if (canOpen) onOpen?.(item);
  };

  return (
    <div
      role={isClone ? undefined : 'group'}
      aria-label={isClone ? undefined : `${item.name}, ${item.role}`}
      aria-hidden={isClone || undefined}
      tabIndex={isClone ? -1 : 0}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={(e) => e.currentTarget.matches(':focus-visible') && setFlipped(true)}
      onBlur={() => setFlipped(false)}
      onClick={handleClick}
      className={cn(
        'relative shrink-0 rounded-full outline-none',
        'w-[clamp(22rem,27.9vw,33.5rem)] aspect-[16/9] xl:aspect-[535/288]',
        'focus-visible:ring-4 focus-visible:ring-primary/60',
        canOpen ? 'cursor-pointer' : 'cursor-default'
      )}
      style={{ perspective: 2200 }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? FLIP_DEG : 0 }}
        transition={reduced ? { duration: 0 } : FLIP_SPRING}
      >
        <div
          className={cn('absolute inset-0 overflow-hidden rounded-full', THEMES[theme])}
          style={faceStyle}
        >
          <SmartImage
            src={item.image}
            alt={`${item.name}, ${item.role}`}
            position={item.imagePosition ?? 'center'}
            placeholderLabel={item.name}
          />
        </div>

        <div
          className="absolute inset-0 overflow-hidden rounded-full border border-black/10 bg-white [container-type:inline-size]"
          style={{ ...faceStyle, transform: 'rotateY(180deg)' }}
        >
          <div className="flex h-full flex-col items-center px-[14cqw] pb-[7.5cqw] pt-[6.5cqw]">
            <QuoteMark className="h-[max(1.5rem,7.4cqw)] w-auto text-ink" />

            <p className="mt-[2.8cqw] line-clamp-5 max-w-[62cqw] text-center text-[length:max(0.8rem,2.75cqw)] leading-[1.35] tracking-tight text-ink">
              {item.quote}
            </p>

            <div className="mt-auto self-end pr-[2cqw] text-right">
              <p className="text-[length:max(0.95rem,3.1cqw)] font-extrabold leading-tight tracking-tight text-ink">
                {item.name}
              </p>
              <p className="text-[length:max(0.75rem,2.5cqw)] leading-snug text-ink/80">
                {item.role}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default TestimonialFlipCard;
