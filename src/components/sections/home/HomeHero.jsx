import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { Button } from '@/components/ui/Button';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { AxenWordmark } from './AxenWordmark';
import { HeroCollage } from './HeroCollage';
import { HeroFloaters } from './HeroFloaters';

const INTRO_DELAY = 0.1;

const TITLE_LINES = ['Consistent, Fast & Reliable', "Everything a Freelancer Isn't."];

export function HomeHero() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const buttonsRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced) return;

      const q = gsap.utils.selector(containerRef);
      const words = titleRef.current.querySelectorAll('.hero-word');
      const avatars = q('[data-pop="avatar"]');
      const cardLeft = q('[data-pop="card-left"]');
      const cardRight = q('[data-pop="card-right"]');
      const tagline = q('[data-pop="tagline"]');
      const floaters = q('[data-pop="floater"]');

      // Set the start state before paint so there is no flash of the final content
      gsap.set(words, {
        yPercent: 120,
        rotate: 6,
        skewY: 6,
        opacity: 0,
        filter: 'blur(8px)',
        transformOrigin: '0% 100%',
      });
      gsap.set(subRef.current, { y: 25, opacity: 0, filter: 'blur(6px)' });
      gsap.set(buttonsRef.current.children, { y: 20, opacity: 0 });

      // Collage start states
      gsap.set(avatars, {
        scale: 0.2,
        opacity: 0,
        rotate: -8,
        transformOrigin: '50% 50%',
      });
      gsap.set(cardLeft, { x: -40, opacity: 0 });
      gsap.set(cardRight, { x: 40, opacity: 0 });
      gsap.set(tagline, { y: 12, opacity: 0 });
      gsap.set(floaters, { scale: 0, opacity: 0, transformOrigin: '50% 50%' });

      const tl = gsap.timeline({
        delay: INTRO_DELAY,
        defaults: { ease: 'power4.out' },
      });

      // 1. Text intro
      tl.to(words, {
        yPercent: 0,
        rotate: 0,
        skewY: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.2,
        stagger: { each: 0.07, from: 'start' },
        clearProps: 'filter,transform',
      })
        .to(
          subRef.current,
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' },
          '-=0.75'
        )
        .to(
          buttonsRef.current.children,
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out' },
          '-=0.6'
        );

      // 2. Collage pop-in (starts while the text is still settling)
      tl.to(
        avatars,
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.7,
          ease: 'back.out(1.8)',
          stagger: 0.18, // top-left -> bottom-left -> top-right -> bottom-right
        },
        0.35
      )
        .to(cardLeft, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.25')
        .to(cardRight, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '<0.1')
        .to(tagline, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.3')
        .to(
          floaters,
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: 'back.out(2.2)',
            stagger: { each: 0.12, from: 'random' },
          },
          '-=0.2'
        );

      // 3. Gentle idle float for the small floaters after they pop in
      floaters.forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 ? -8 : 8,
          duration: 2 + i * 0.3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 2,
        });
      });
    },
    { scope: containerRef, dependencies: [prefersReduced] }
  );

  return (
    <section ref={containerRef} className="relative pt-16 sm:pt-40 pb-16 sm:pb-24 overflow-hidden">
      {/* <HeroFloaters /> */}
      <div className="relative z-10 w-full max-w-[1680px] mx-auto md:px-8 px-5 text-center">
        <h1
          ref={titleRef}
          aria-label={TITLE_LINES.join(' ')}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-ink mx-auto leading-[1.08] mb-6"
        >
          {TITLE_LINES.map((line) => (
            <span
              key={line}
              aria-hidden="true"
              className="block overflow-hidden pb-[0.12em] -mb-[0.12em]"
            >
              {line.split(' ').map((word, i, arr) => (
                <span key={i} className="inline-block overflow-hidden align-top">
                  <span className="hero-word inline-block will-change-transform">
                    {word}
                    {i < arr.length - 1 ? '\u00A0' : ''}
                  </span>
                </span>
              ))}
            </span>
          ))}
        </h1>

        <p
          ref={subRef}
          className="text-base sm:text-lg md:text-xl text-[#21272A] max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-10"
        >
          Global brands and creators rely on us for high-end, conversion-driven video production.
          Delivered fast, consistently, and at a cost that&apos;s 40% lower than US-based editors.
        </p>

        <div
          ref={buttonsRef}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 mb-5"
        >
          <Button to="/portfolio" variant="yellow" size="lg" className="px-8 shadow-sm">
            See Our Work
          </Button>
          <Button to="/contact" variant="outline" size="lg" className="px-8">
            Book a Free Call
          </Button>
        </div>

        <AxenWordmark />
        <HeroCollage />
      </div>
    </section>
  );
}

export default HomeHero;
