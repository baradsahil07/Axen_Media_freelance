import { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export const Input = forwardRef(function Input(
  { label, error, className, id, name, type = 'text', required, ...props },
  ref
) {
  const inputId = id || name;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs sm:text-sm font-semibold text-ink"
        >
          {label} {required && <span className="text-accent">*</span>}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        name={name}
        type={type}
        className={cn(
          'w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base text-ink bg-white border rounded-xl sm:rounded-2xl transition-all duration-200 outline-none',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
            : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/40',
          className
        )}
        {...props}
      />

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-red-500 font-medium pl-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

export default Input;
