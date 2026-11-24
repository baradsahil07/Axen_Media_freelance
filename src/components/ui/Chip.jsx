import { cn } from '@/lib/utils';

export function Chip({ children, className, variant = 'default', size = 'md' }) {
  const variants = {
    default: 'bg-white text-ink border border-border shadow-2xs',
    dark: 'bg-ink text-white border border-ink',
    yellow: 'bg-primary text-ink border border-primary font-semibold',
    accent: 'bg-accent/10 text-accent border border-accent/20 font-semibold',
    gray: 'bg-surface text-ink border border-border',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-xs sm:text-sm px-3.5 py-1.5',
    lg: 'text-sm px-4 py-2 font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-full select-none transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

export default Chip;
