import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function Preloader({ onComplete }) {
  const [showPreloader, setShowPreloader] = useState(false);
  const [wipePhase, setWipePhase] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const seen = sessionStorage.getItem('axen_intro_seen');
    if (seen || prefersReduced) {
      if (onComplete) onComplete();
      return;
    }

    setShowPreloader(true);

    const wipeTimer = setTimeout(() => {
      setWipePhase(true);
    }, 1100);

    const endTimer = setTimeout(() => {
      sessionStorage.setItem('axen_intro_seen', 'true');
      setShowPreloader(false);
      window.dispatchEvent(new CustomEvent('preloaderComplete'));
      if (onComplete) onComplete();
    }, 1900);

    return () => {
      clearTimeout(wipeTimer);
      clearTimeout(endTimer);
    };
  }, [onComplete, prefersReduced]);

  if (!showPreloader) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden pointer-events-auto"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* White intro backdrop */}
        <div className="absolute inset-0 bg-white flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: [0.7, 1.05, 1], opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <svg
              className="w-16 h-20 text-ink drop-shadow-sm"
              viewBox="0 0 40 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                d="M20 2C20 2 6 18 6 32C6 39.732 12.268 46 20 46C27.732 46 34 39.732 34 32C34 18 20 2 20 2Z"
                fill="#111111"
              />
              <path d="M20 14L14 32H26L20 14Z" fill="#FFE11A" />
              <circle cx="20" cy="27" r="2.2" fill="#111111" />
              <path d="M20 27V38" stroke="#111111" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-4 font-extrabold tracking-widest text-xs uppercase text-ink"
            >
              Axen Media
            </motion.span>
          </motion.div>
        </div>

        {wipePhase && (
          <motion.div
            className="absolute inset-0 bg-primary z-20 origin-bottom"
            initial={{ y: '100%' }}
            animate={{ y: '-100%' }}
            transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default Preloader;
