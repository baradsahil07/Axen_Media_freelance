import { cn } from '@/lib/utils';

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  children,
  className,
  align = 'center',
  titleHighlight,
  dark = false,
}) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={cn('max-w-3xl mb-12 lg:mb-16', alignClass, className)}>
      {eyebrow && (
        <span className="inline-block text-accent font-bold text-xs sm:text-sm tracking-widest uppercase mb-3 sm:mb-4 select-none">
          {eyebrow}
        </span>
      )}

      {title && (
        <h2
          className={cn(
            'text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.12] mb-4 sm:mb-5',
            dark ? 'text-white' : 'text-ink'
          )}
        >
          {titleHighlight ? (
            <>
              <span className="text-accent">{titleHighlight} </span>
              {title.replace(titleHighlight, '').trim()}
            </>
          ) : (
            title
          )}
        </h2>
      )}

      {subtitle && (
        <p
          className={cn(
            'text-base sm:text-lg leading-relaxed max-w-2xl',
            align === 'center' ? 'mx-auto' : '',
            dark ? 'text-gray-300' : 'text-muted'
          )}
        >
          {subtitle}
        </p>
      )}

      {children && <div className="mt-6 sm:mt-8">{children}</div>}
    </div>
  );
}

export default SectionHeader;
