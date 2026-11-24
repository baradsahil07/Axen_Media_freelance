import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { navItems } from '@/data/nav';
import { TRANSITION_EASE } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function MobileMenu({ isOpen, onClose }) {
  const { pathname } = useLocation();
  const prefersReduced = useReducedMotion();
  const dur = (s) => (prefersReduced ? 0 : s);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: dur(0.4), ease: TRANSITION_EASE }}
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-[2px]"
        />
      )}

      {isOpen && (
        <motion.aside
          key="panel"
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: dur(0.55), ease: TRANSITION_EASE }}
          className="fixed inset-y-0 right-0 z-[61] flex w-[88%] max-w-[26rem] flex-col border-l border-ink bg-white px-6 pb-8 pt-5 shadow-[-12px_0_40px_rgba(0,0,0,0.12)] sm:px-8"
        >
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Menu"
              autoFocus
              className="-mr-2 grid size-11 cursor-pointer place-items-center rounded-full text-ink transition-colors hover:text-accent"
            >
              <X className="h-6 w-6 stroke-[2.5]" />
            </button>
          </div>

          <nav aria-label="Mobile Navigation" className="mt-6">
            <ul>
              {navItems.map((item, i) => {
                const isActive = pathname === item.path;

                return (
                  <motion.li
                    key={item.path}
                    initial={{ opacity: 0, x: 32 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: {
                        delay: dur(0.2 + i * 0.07),
                        duration: dur(0.5),
                        ease: TRANSITION_EASE,
                      },
                    }}
                    className="border-b border-ink/15"
                  >
                    <Link
                      to={item.path}
                      onClick={onClose}
                      aria-current={isActive ? 'page' : undefined}
                      className={`block py-3 text-lg font-bold uppercase leading-[1.15] tracking-[-0.03em] transition-colors duration-200 ${
                        isActive ? 'text-ink' : 'text-ink/45 hover:text-ink'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: dur(0.2 + navItems.length * 0.07),
                duration: dur(0.5),
                ease: TRANSITION_EASE,
              },
            }}
            className="mt-auto pt-8"
          >
            <Link
              to="/contact"
              onClick={onClose}
              className="flex w-full items-center justify-center rounded-[14px] border border-ink/90 bg-primary px-6 py-4 text-base font-normal leading-[1.2] text-ink transition-[filter,transform] duration-200 hover:brightness-95 active:scale-[0.98]"
            >
              Hire Us
            </Link>
          </motion.div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export default MobileMenu;
