import { useEffect } from 'react';
import {
  HomeHero,
  ClientFeedback,
  BrandsMarquee,
  ProjectsCarousel,
  StatsSection,
  ServiceMarquee,
  CreatorsToBrands,
  WorkflowSection,
  FaqSection,
} from '@/components/sections/home';

export function Home() {
  useEffect(() => {
    document.title = 'Axen Media — Consistent, Fast & Reliable Video Editing Agency';
  }, []);

  return (
    <div className="w-full bg-white flex flex-col">
      <HomeHero />
      <ClientFeedback />
      <BrandsMarquee />
      <ProjectsCarousel />
      <StatsSection />
      <ServiceMarquee />
      <CreatorsToBrands />
      <WorkflowSection />
      <FaqSection />
    </div>
  );
}

export default Home;
