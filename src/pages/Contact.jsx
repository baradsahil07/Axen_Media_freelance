import { useEffect } from 'react';
import { ContactHero, ContactInfoCard, ContactForm } from '@/components/sections/contact';

export function Contact() {
  useEffect(() => {
    document.title = 'Contact Axen Media — Tell Us About Your Project';
  }, []);

  return (
    <div className="w-full bg-white flex flex-col pb-24 sm:pb-32">
      <ContactHero />

      <div className="w-full max-w-[1680px] mx-auto px-8">
        <div className="bg-white rounded-3xl sm:rounded-4xl border border-border p-4 sm:p-6 lg:p-8 shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 flex">
            <ContactInfoCard />
          </div>
          <div className="lg:col-span-7 flex flex-col justify-center">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
