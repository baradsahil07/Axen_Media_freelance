import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Created once at module level (not inside render).
// If you're on framer-motion < 11, use `motion(Link)` instead of `motion.create(Link)`.
const MotionLink = motion.create(Link);
const MotionAnchor = motion.create('a');

const sizeStyles = {
  sm: 'text-xs px-4 py-2',
  md: 'text-sm sm:text-base px-6 py-2.5 sm:py-3',
  lg: 'text-base sm:text-lg px-8 py-3.5 sm:py-4',
  // Matches the header "Hire Us" proportions (scales with the parent's font size)
  nav: 'text-[1em] px-[1.7em] py-[0.95em] !font-normal leading-[1.2]',
};

// base = resting colours, fill = colour that sweeps in on hover,
// hoverText = text colour once the fill arrives (full class strings so Tailwind keeps them)
const variants = {
  yellow: {
    base: 'bg-primary text-ink',
    fill: 'bg-ink',
    hoverText: 'text-white',
    shadow: 'shadow-sm hover:shadow-glow',
  },
  outline: {
    base: 'bg-white text-ink',
    fill: 'bg-ink',
    hoverText: 'text-white',
    shadow: '',
  },
  white: {
    base: 'bg-white text-ink',
    fill: 'bg-primary',
    hoverText: 'text-ink',
    shadow: 'shadow-sm',
  },
  dark: {
    base: 'bg-ink text-white',
    fill: 'bg-primary',
    hoverText: 'text-ink',
    shadow: '',
  },
};

const tapAndHover = {
  whileHover: { y: -2 },
  whileTap: { scale: 0.96, y: 0 },
  transition: { type: 'spring', stiffness: 400, damping: 22 },
};

export const Button = forwardRef(function Button(
  {
    children,
    className,
    variant = 'yellow',
    size = 'md',
    to,
    href,
    type = 'button',
    disabled = false,
    icon: Icon,
    iconPosition = 'left',
    // Tailwind class string; the leading ! is needed so it beats the base styles
    radius = '!rounded-[24px]',
    ...props
  },
  ref
) {
  const v = variants[variant] ?? variants.yellow;

  const combinedClass = cn(
    'group relative inline-flex items-center justify-center font-semibold',
    '!border !border-[#000000] overflow-hidden select-none cursor-pointer',
    radius,
    'transition-[box-shadow,opacity] duration-300',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:pointer-events-none',
    sizeStyles[size],
    v.base,
    v.shadow,
    className
  );

  const icon = Icon && (
    <Icon
      className={cn(
        'w-4 h-4 shrink-0 transition-transform duration-300 ease-out',
        iconPosition === 'right'
          ? 'group-hover:translate-x-1'
          : 'group-hover:-rotate-6 group-hover:scale-110'
      )}
    />
  );

  const content = (
    <>
      {/* Colour that rises from the bottom with a curved leading edge */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-x-[-10%] bottom-0 z-0 h-[150%]',
          'rounded-t-[50%] translate-y-full group-hover:translate-y-0',
          'transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          v.fill
        )}
      />

      <span className="relative z-10 inline-flex items-center gap-2">
        {iconPosition === 'left' && icon}

        {/* Text roll: original slides up and out, a copy slides in from below */}
        <span className="relative inline-block overflow-hidden leading-tight">
          <span className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
            {children}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              'absolute inset-0 block translate-y-full',
              'transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0',
              v.hoverText
            )}
          >
            {children}
          </span>
        </span>

        {iconPosition === 'right' && icon}
      </span>
    </>
  );

  if (to) {
    return (
      <MotionLink to={to} ref={ref} className={combinedClass} {...tapAndHover} {...props}>
        {content}
      </MotionLink>
    );
  }

  if (href) {
    return (
      <MotionAnchor
        href={href}
        target={props.target || '_blank'}
        rel="noopener noreferrer"
        ref={ref}
        className={combinedClass}
        {...tapAndHover}
        {...props}
      >
        {content}
      </MotionAnchor>
    );
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      className={combinedClass}
      {...tapAndHover}
      {...props}
    >
      {content}
    </motion.button>
  );
});

export default Button;
