import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import Header from './components/Header';
import ImageRevealInit from './components/ImageRevealInit';
import Footer from './components/Footer';
import FinalCTA from './components/FinalCTA';
import Home from './pages/Home';
import Collection from './pages/Collection';
import Detail from './pages/Detail';
import About from './pages/About';
import Expertise from './pages/Expertise';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import { usePageTransition } from './hooks/usePageTransition';

/**
 * PageTransition
 *
 * Renders the route tree using `displayedPath` (the page currently on screen)
 * rather than the live location during the exit phase.  This keeps the OLD
 * page visible while it plays its exit animation, then swaps content and plays
 * the enter animation.
 *
 * The wrapper `key` is tied to `displayedPath` so React only unmounts/mounts
 * when the visible content actually changes, not on every location update.
 */
function PageTransition({ children }: { children: React.ReactNode }) {
  // usePageTransition must be called inside the Router so it can access
  // useLocation — it is called here, one level below Router in MainLayout.
  const { phase, displayedPath } = usePageTransition();

  // Map phase to CSS class
  const phaseClass =
    phase === 'exiting'  ? 'page-exiting'  :
    phase === 'entering' ? 'page-entering' :
    '';

  return (
    <div
      key={displayedPath}             // unmount/mount only when content changes
      className={`page-transition-wrapper ${phaseClass}`.trim()}
      aria-live="polite"
    >
      {children}
    </div>
  );
}

function MainLayout() {
  const location = useLocation();

  // Suppress final CTA on the contact page, detail pages, or 404 page
  const showFinalCTA =
    location.pathname !== '/contact' &&
    location.pathname !== '/404' &&
    !location.pathname.startsWith('/gemstones/');

  return (
    <div
      className="app-shell"
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <Header />
      <ImageRevealInit />

      {/* Main Content Area */}
      <main style={{ flexGrow: 1 }}>
        <PageTransition>
          <Routes>
            <Route path="/"                  element={<Home />} />
            <Route path="/collection"        element={<Collection />} />
            <Route path="/gemstones/:slug"   element={<Detail />} />
            <Route path="/about"             element={<About />} />
            <Route path="/expertise"         element={<Expertise />} />
            <Route path="/gallery"           element={<Gallery />} />
            <Route path="/contact"           element={<Contact />} />
            <Route path="*"                  element={<NotFound />} />
          </Routes>
        </PageTransition>
      </main>

      {showFinalCTA && <FinalCTA />}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <MainLayout />
    </Router>
  );
}

export default App;
