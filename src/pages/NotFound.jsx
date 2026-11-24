import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';

export function NotFound() {
  useEffect(() => {
    document.title = '404 Page Not Found — Axen Media';
  }, []);

  return (
    <div className="pt-36 sm:pt-44 pb-24 sm:pb-32 min-h-[70vh] flex items-center justify-center bg-white select-none">
      <Container className="text-center max-w-xl">
        <span className="text-5xl sm:text-6xl font-black text-accent block mb-4">
          404
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink mb-4">
          Page Not Found
        </h1>
        <p className="text-base text-muted mb-8 leading-relaxed">
          The frame you are looking for has been cut from the final edit or never existed.
        </p>
        <Button to="/" variant="yellow" size="lg" className="px-8 shadow-sm">
          Return to Home
        </Button>
      </Container>
    </div>
  );
}

export default NotFound;
