import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Tabs({
  tabs = [],
  activeTab,
  onChange,
  layoutId = 'active-tab-indicator',
  className,
  tabClassName,
  variant = 'underline',
}) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth py-2',
        className
      )}
    >
      {tabs.map((tab) => {
        const id = typeof tab === 'string' ? tab : tab.id;
        const label = typeof tab === 'string' ? tab : tab.label;
        const isActive = activeTab === id;

        return (
          <button
            key={id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(id)}
            className={cn(
              'relative px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer rounded-full select-none',
              isActive ? 'text-ink font-bold' : 'text-muted hover:text-ink',
              tabClassName
            )}
          >
            {variant === 'pill' && isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 bg-primary rounded-full -z-10 shadow-sm"
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              />
            )}

            <span className="relative z-10">{label}</span>

            {variant === 'underline' && isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute bottom-0 left-2 right-2 h-0.5 bg-ink rounded-full"
                transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
