import { useEffect, useRef, useState } from 'react';
import { resolveAsset } from '@/lib/assets';
import { cn } from '@/lib/utils';
import { Image as ImageIcon } from 'lucide-react';

export function SmartImage({
  src,
  alt = '',
  className,
  containerClassName,
  aspectRatio,
  fit = 'cover',
  position = 'center',
  placeholderLabel,
  loading = 'lazy',
  ...props
}) {
  const imgRef = useRef(null);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const resolvedUrl = resolveAsset(src);
  const isAvailable = Boolean(resolvedUrl) && !hasError;
  const displayName = placeholderLabel || src?.split('/')?.pop() || 'Asset Image';

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [resolvedUrl]);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) setIsLoaded(true);
  }, [resolvedUrl]);

  return (
    <div
      className={cn('relative h-full w-full overflow-hidden select-none', containerClassName)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {isAvailable ? (
        <img
          ref={imgRef}
          src={resolvedUrl}
          alt={alt}
          loading={loading}
          decoding="async"
          draggable={false}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={cn(
            'absolute inset-0 h-full w-full transition-opacity duration-500',
            fit === 'contain' ? 'object-contain' : 'object-cover',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          style={{ objectPosition: position }}
          {...props}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#EFEFEF] to-[#E2E2E2] p-4 text-center">
          <ImageIcon className="mb-2 h-8 w-8 stroke-[1.5] text-muted/60" />
          <span className="max-w-[200px] truncate rounded bg-white/70 px-2 py-0.5 text-xs font-medium text-muted/80">
            {displayName}
          </span>
        </div>
      )}
    </div>
  );
}

export default SmartImage;
