import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
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

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Reset page states and trigger transition sequence
    setAnimate(false);
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 40); // slight frame delay to trigger transition repaint
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className={`page-transition-wrapper ${animate ? 'page-enter-active' : 'page-enter'}`}>
      {children}
    </div>
  );
}

function MainLayout() {
  const location = useLocation();

  // Suppress final CTA on the contact page, detail pages, or 404 page to prevent routing loops
  const showFinalCTA = 
    location.pathname !== '/contact' && 
    location.pathname !== '/404' &&
    !location.pathname.startsWith('/gemstones/');

  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      {/* Main Content Area */}
      <main style={{ flexGrow: 1 }}>
        <PageTransition>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/gemstones/:slug" element={<Detail />} />
            <Route path="/about" element={<About />} />
            <Route path="/expertise" element={<Expertise />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
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
    <Router>
      <MainLayout />
    </Router>
  );
}

export default App;
