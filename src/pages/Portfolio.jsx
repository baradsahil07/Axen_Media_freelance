import { useEffect } from 'react';
import {
  PortfolioHero,
  PolaroidString,
  VideoCategorySection,
  ShortVideosSection,
  ThumbnailSection,
  CtaBanner,
} from '@/components/sections/portfolio';

export function Portfolio() {
  useEffect(() => {
    document.title = 'Portfolio & Showcase — Axen Media';
  }, []);

  return (
    <div className="w-full bg-white flex flex-col">
      <PortfolioHero />
      <PolaroidString />
      <VideoCategorySection />
      <ShortVideosSection />
      <ThumbnailSection />
      <CtaBanner />
    </div>
  );
}

export default Portfolio;
