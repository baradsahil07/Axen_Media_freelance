import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar, Footer, SmoothScroll, Preloader, PageTransition } from '@/components/layout';

const Home = lazy(() => import('@/pages/Home'));
const Portfolio = lazy(() => import('@/pages/Portfolio'));
const Contact = lazy(() => import('@/pages/Contact'));
const GetHired = lazy(() => import('@/pages/GetHired'));
const NotFound = lazy(() => import('@/pages/NotFound'));

export function App() {
  const location = useLocation();

  return (
    <SmoothScroll>
      <Preloader />

      <div className="min-h-screen flex flex-col bg-white text-ink selection:bg-primary selection:text-ink">
        <Navbar />
        <main className="flex-grow flex flex-col">
          <AnimatePresence mode="wait">
            <Suspense
              fallback={
                <div className="w-full min-h-[60vh] flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
              }
            >
              <Routes location={location} key={location.pathname}>
                <Route
                  path="/"
                  element={
                    <PageTransition>
                      <Home />
                    </PageTransition>
                  }
                />
                <Route
                  path="/portfolio"
                  element={
                    <PageTransition>
                      <Portfolio />
                    </PageTransition>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <PageTransition>
                      <Contact />
                    </PageTransition>
                  }
                />
                <Route
                  path="/get-hired"
                  element={
                    <PageTransition>
                      <GetHired />
                    </PageTransition>
                  }
                />
                <Route
                  path="*"
                  element={
                    <PageTransition>
                      <NotFound />
                    </PageTransition>
                  }
                />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}

export default App;
