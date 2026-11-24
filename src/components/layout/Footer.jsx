import { Link } from 'react-router-dom';
import { footerLinks } from '@/data/nav';
import { siteConfig } from '@/data/site';

const logoLight = '/images/brand/footer-logo.svg';

const headingClass =
  'mb-[max(0.75rem,1.3cqw)] text-[length:max(0.85rem,1.3cqw)] font-medium leading-[1.3] text-white';
const listClass = 'flex flex-col gap-[max(0.5rem,0.9cqw)]';
const linkClass =
  'inline-block text-[length:max(0.75rem,1.05cqw)] font-normal leading-[1.4] text-white/80 transition-colors duration-300 hover:text-primary';

export function Footer() {
  return (
    <footer className="w-full select-none bg-[#111111] px-4 text-white sm:px-8 lg:px-[6.4vw]">
      <div className="mx-auto w-full max-w-[1680px] [container-type:inline-size]">
        <div className="pb-[max(1.25rem,2cqw)] pt-[max(2.5rem,5cqw)]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[12cqw_30.7cqw_17.6cqw_21.2cqw_1fr] lg:items-center lg:gap-0">
            <Link to="/" aria-label="Axen Media" className="group inline-block w-fit">
              <div className="h-[max(2.5rem,4.2cqw)] w-[max(2rem,3cqw)] transition-transform duration-300 group-hover:scale-105">
                <img src={logoLight} alt="Axen Media" className="h-full w-full object-contain" />
              </div>
            </Link>

            <div className="max-w-[17.5cqw] text-[length:max(0.75rem,1.15cqw)] leading-[1.5] text-white/90 max-lg:max-w-sm">
              <p>{siteConfig.address.footerFormatted}</p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-block underline underline-offset-2 transition-colors duration-300 hover:text-primary"
              >
                {siteConfig.email}
              </a>
            </div>

            <div className="grid grid-cols-3 gap-6 lg:contents">
              {/* Company */}
              <div className="lg:self-start">
                <h4 className={headingClass}>Company</h4>
                <ul className={listClass}>
                  {footerLinks.company.map((link) => (
                    <li key={link.label}>
                      <Link to={link.path} className={linkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:self-start lg:pt-[1.2cqw]">
                <h4 className={headingClass}>Legal</h4>
                <ul className={listClass}>
                  {footerLinks.legal.map((link) => (
                    <li key={link.label}>
                      <Link to={link.path} className={linkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:self-start">
                <h4 className={headingClass}>Community</h4>
                <ul className={listClass}>
                  {footerLinks.community.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <p className="mt-[max(2.5rem,6cqw)] text-center text-[length:max(0.7rem,1.05cqw)] leading-[1.4] text-white/80">
            © 2026 Axen Media. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
