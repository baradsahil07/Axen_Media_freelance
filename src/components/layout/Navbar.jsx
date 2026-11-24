import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { navItems } from '@/data/nav';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { MobileMenu } from './MobileMenu';
import { Button } from '@/components/ui/Button';

const logoMark = '/images/brand/logo.svg';
const EASE = [0.22, 1, 0.36, 1];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollDirection, isAtTop } = useScrollDirection();
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isHidden = scrollDirection === 'down' && !isAtTop && !mobileMenuOpen;

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: isHidden ? '-110%' : 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-50 border-b px-4 transition-[background-color,box-shadow,border-color] duration-300 sm:px-8 lg:px-[6.4vw] ${
          isAtTop
            ? 'border-transparent'
            : 'border-border/40 bg-white/95 shadow-xs backdrop-blur-md'
        }`}
      >
        <div className="mx-auto w-full max-w-[1680px] [container-type:inline-size]">
          <div
            className={`grid grid-cols-[1fr_auto_1fr] items-center text-[length:clamp(0.8rem,1.4cqw,1.1rem)] transition-[padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isAtTop ? 'py-[clamp(1rem,3.4cqw,2.75rem)]' : 'py-[clamp(0.75rem,1.6cqw,1.25rem)]'
            }`}
          >
            <Link
              to="/"
              aria-label="Axen Media Home"
              className="group col-start-1 w-fit cursor-pointer"
            >
              <div className="h-10 w-7 transition-transform duration-300 group-hover:scale-105 md:h-[2.3em] md:w-[1.6em]">
                <img
                  src={logoMark}
                  alt="Axen Media Mark"
                  className="h-full w-full object-contain"
                />
              </div>
            </Link>

            <nav
              aria-label="Primary Navigation"
              className="col-start-2 hidden rounded-[0.95em] border border-ink/90 bg-white px-[1.6em] py-[0.95em] md:block"
            >
              <ul className="flex items-center gap-[1.7em]">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;

                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        aria-current={isActive ? 'page' : undefined}
                        className={`relative inline-block font-normal uppercase leading-[1.2] text-ink transition-opacity duration-200 ${
                          isActive ? '' : 'opacity-100 hover:opacity-60'
                        }`}
                      >
                        {item.label}

                        {isActive && (
                          <motion.span
                            layoutId="nav-underline"
                            className="absolute inset-x-0 -bottom-[0.35em] mx-auto h-px w-[1.1em] bg-ink"
                            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="col-start-3 justify-self-end">
              <div className="hidden md:block">
                <Button to="/contact" variant="yellow" size="nav" radius="!rounded-[0.95em]">
                  Hire Us
                </Button>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open Menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                className="-mr-2 flex cursor-pointer items-center p-2 text-ink transition-[color,transform] duration-200 hover:text-accent active:scale-90 md:hidden"
              >
                <Menu className="h-6 w-6 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}

export default Navbar;
