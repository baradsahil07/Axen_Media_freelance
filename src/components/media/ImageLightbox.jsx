import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { resolveAsset } from '@/lib/assets';

export function ImageLightbox({ isOpen, onClose, imageSrc, title }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const resolved = resolveAsset(imageSrc);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative max-w-5xl max-h-[90vh] z-10 flex flex-col items-center"
        >
          <button
            onClick={onClose}
            aria-label="Close image lightbox"
            className="absolute -top-12 right-0 w-9 h-9 rounded-full bg-white/20 text-white hover:bg-primary hover:text-ink flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2]" />
          </button>

          {resolved ? (
            <img
              src={resolved}
              alt={title || 'Thumbnail lightbox'}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
          ) : (
            <div className="p-16 bg-surface-dark text-white rounded-2xl text-center">
              <p className="font-semibold text-lg">{title || 'Thumbnail Design'}</p>
              <p className="text-sm text-gray-400 mt-2">{imageSrc}</p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ImageLightbox;
