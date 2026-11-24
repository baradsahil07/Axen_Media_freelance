import { motion } from 'framer-motion';
import { variants } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

export function Reveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration,
  className,
  once = true,
  threshold = 0.15,
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const selectedVariant = variants[variant] || variants.fadeUp;
  const customVariant = {
    ...selectedVariant,
    visible: {
      ...selectedVariant.visible,
      transition: {
        ...selectedVariant.visible?.transition,
        delay,
        ...(duration ? { duration } : {}),
      },
    },
  };

  return (
    <motion.div
      variants={customVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      className={cn('w-full', className)}
    >
      {children}
    </motion.div>
  );
}

export default Reveal;
