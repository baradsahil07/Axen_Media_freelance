import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function RadioChips({
  options = [],
  value,
  onChange,
  name = 'radio-group',
  label,
  className,
}) {
  return (
    <div className={cn('w-full space-y-2', className)}>
      {label && (
        <span className="block text-xs sm:text-sm font-semibold text-ink">
          {label}
        </span>
      )}

      <div
        role="radiogroup"
        aria-label={label}
        className="flex flex-wrap gap-2 sm:gap-3"
      >
        {options.map((option) => {
          const isSelected = value === option;

          return (
            <button
              key={option}
              type="button"
              name={name}
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange && onChange(option)}
              className={cn(
                'relative px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl sm:rounded-2xl transition-colors duration-200 cursor-pointer select-none',
                isSelected
                  ? 'text-ink'
                  : 'bg-surface text-ink/80 hover:bg-surface/80 hover:text-ink'
              )}
            >
              {isSelected && (
                <motion.div
                  layoutId="radio-chip-active"
                  className="absolute inset-0 bg-primary rounded-xl sm:rounded-2xl -z-10 shadow-xs"
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                />
              )}
              <span className="relative z-10">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default RadioChips;
