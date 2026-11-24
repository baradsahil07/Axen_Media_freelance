import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Container = forwardRef(function Container(
  { className, children, as: Component = 'div', ...props },
  ref
) {
  return (
    <Component
      ref={ref}
      className={cn('w-full max-w-[1680px] mx-auto px-8', className)}
      {...props}
    >
      {children}
    </Component>
  );
});

export default Container;
