import { SmartImage } from './SmartImage';
import { cn } from '@/lib/utils';

export function ThumbnailCard({ item, onClick, className }) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open ${item.title || 'thumbnail'}`}
      onClick={() => onClick?.(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(item);
        }
      }}
      className={cn(
        'relative aspect-[345/189] w-full cursor-pointer select-none overflow-hidden bg-ink outline-none focus-visible:ring-2 focus-visible:ring-ink/40',
        className
      )}
    >
      <SmartImage
        src={item.image}
        alt={item.title || 'Video thumbnail'}
        className="h-full w-full object-cover"
        containerClassName="h-full w-full"
        placeholderLabel={item.title}
      />

      <span className="pointer-events-none absolute bottom-[3.5%] right-[2.8%] text-[length:max(0.7rem,1.3cqw)] font-medium leading-none text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">
        {item.duration || '24:45'}
      </span>
    </div>
  );
}

export default ThumbnailCard;
