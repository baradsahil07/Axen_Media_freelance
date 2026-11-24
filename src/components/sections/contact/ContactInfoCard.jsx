import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';
import { contactDetails } from '@/data/contact';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const EASE = [0.22, 1, 0.36, 1];

const twitterIcon = '/images/icons/social/twitter.svg';
const instagramIcon = '/images/icons/social/instagram.svg';
const dribbbleIcon = '/images/icons/social/dribbble.svg';

const socialIcons = {
  twitter: twitterIcon,
  instagram: instagramIcon,
  dribbble: dribbbleIcon,
};

const rowClass =
  'group grid grid-cols-[max(2rem,3.1cqw)_1fr] items-start text-[length:clamp(0.85rem,1.45cqw,1.25rem)] font-normal leading-[1.3] text-white transition-colors duration-300 hover:text-primary';
const iconWrapClass = 'flex h-[1.3em] items-center';
const iconClass = 'size-[0.95em] stroke-[1.75]';
const textClass =
  'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 motion-reduce:transform-none';

export function ContactInfoCard() {
  const prefersReduced = useReducedMotion();

  const container = {
    hidden: { opacity: 0, x: prefersReduced ? 0 : -30 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: prefersReduced ? 0 : 0.7,
        ease: EASE,
        when: 'beforeChildren',
        staggerChildren: prefersReduced ? 0 : 0.09,
        delayChildren: prefersReduced ? 0 : 0.15,
      },
    },
  };
  const item = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReduced ? 0 : 0.6, ease: EASE },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex h-full flex-col justify-between gap-[max(2.5rem,5cqw)] rounded-[max(0.6rem,1.1cqw)] bg-[#111111] p-[max(1.5rem,4cqw)] text-white"
    >
      <motion.div variants={item}>
        <h3 className="text-[length:clamp(1.25rem,2.4cqw,2.5rem)] font-bold leading-[1.15] tracking-[-0.02em] text-white">
          {contactDetails.title}
        </h3>
        <p className="mt-[max(0.25rem,0.5cqw)] text-[length:clamp(0.75rem,1.2cqw,1.05rem)] font-normal leading-[1.4] text-white/55">
          {contactDetails.subtitle}
        </p>
      </motion.div>

      <div className="flex flex-col gap-[max(1.25rem,3cqw)]">
        <motion.a
          variants={item}
          href={`tel:${contactDetails.phone.replace(/[^+\d]/g, '')}`}
          className={rowClass}
        >
          <span className={iconWrapClass}>
            <Phone className={iconClass} aria-hidden="true" />
          </span>
          <span className={textClass}>{contactDetails.phone}</span>
        </motion.a>

        <motion.a variants={item} href={`mailto:${contactDetails.email}`} className={rowClass}>
          <span className={iconWrapClass}>
            <Mail className={iconClass} aria-hidden="true" />
          </span>
          <span className={`${textClass} break-all`}>{contactDetails.email}</span>
        </motion.a>

        <motion.div variants={item} className={rowClass}>
          <span className={iconWrapClass}>
            <MapPin className={iconClass} aria-hidden="true" />
          </span>
          <span className={textClass}>{contactDetails.address}</span>
        </motion.div>
      </div>

      <motion.div variants={item} className="flex items-center gap-[max(0.6rem,1.3cqw)]">
        {contactDetails.socials.map((social) => (
          <motion.a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            whileHover={prefersReduced ? undefined : { y: -3, scale: 1.08 }}
            whileTap={prefersReduced ? undefined : { scale: 0.95 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="group grid size-[clamp(2.25rem,3.4cqw,3.5rem)] place-items-center rounded-full bg-white/15 transition-colors duration-300 hover:bg-primary"
          >
            <img
              src={socialIcons[social.icon]}
              alt=""
              aria-hidden="true"
              className="size-[40%] object-contain invert transition-[filter] duration-300 group-hover:invert-0"
            />
          </motion.a>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default ContactInfoCard;
