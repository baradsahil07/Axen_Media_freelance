import { Button } from '@/components/ui/Button';

export function CtaBanner() {
  return (
    <section className="py-16 sm:py-24 bg-white select-none">
      <div className="w-full max-w-[1680px] mx-auto px-8">
        <div className="bg-[#111111] text-white rounded-3xl sm:rounded-4xl p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="text-center md:text-left max-w-xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
              Contact us today!
            </h2>
            <p className="text-base sm:text-lg text-gray-300">
              Our team is here to help whenever you need it
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
            <Button to="/contact" variant="yellow" size="lg" className="px-8 shadow-md">
              Contact Us
            </Button>
            <Button to="/portfolio" variant="white" size="lg" className="px-8">
              Our Projects
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaBanner;
