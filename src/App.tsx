
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion'; // Import AnimatePresence
import { Home, Activity, Layers, Menu, X, BarChart3, BookOpen } from 'lucide-react';
import HomePage from './pages/HomePage';
import ArchivePage from './pages/ArchivePage';
import ComparePage from './pages/ComparePage';
import AssessmentPage from './pages/AssessmentPage';
import GuidesPage from './pages/GuidesPage';
import ProductDetail from './pages/ProductDetail';
import DebugPage from './pages/DebugPage';
import Layout from './components/Layout';
import ComparisonBar from './components/ComparisonBar';
import Footer from './components/Footer';
import { ComparisonProvider } from './context/ComparisonContext';

// Page Transition Wrapper
const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="w-full"
  >
    {children}
  </motion.div>
);

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Overview', icon: Home },
    { path: '/archive', label: 'Archive', icon: Layers },
    { path: '/compare', label: 'Compare', icon: BarChart3 },
    { path: '/assessment', label: 'Analysis', icon: Activity },
    { path: '/guides', label: 'Protocols', icon: BookOpen },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-surfaceHighlight bg-bg/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-custom-gold/20 blur-md rounded-full group-hover:bg-custom-gold/40 transition-all" />
              <img
                src="/images/serio-logo.jpg"
                alt="Serio Sonic Lab"
                className="w-10 h-10 rounded-full border border-custom-gold/30 relative z-10 object-cover shadow-[0_0_15px_rgba(255,215,0,0.2)]"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-widest text-white font-display">THE SONIC LAB</span>
              <span className="text-[8px] text-custom-gold/60 tracking-[0.2em] font-mono uppercase">REFERENCE • TOOL • GUIDE</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-4 py-2 rounded-none text-sm font-medium transition-all duration-300 group overflow-hidden
                      ${isActive ? 'text-custom-gold' : 'text-textDim hover:text-white'}
                    `}
                  >
                    <div className={`absolute inset-0 bg-custom-gold/5 transform transition-transform duration-300 origin-left 
                      ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                    `} />
                    <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-custom-gold/50 transform transition-transform duration-300
                      ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                    `} />

                    <span className="relative z-10 flex items-center gap-2 font-mono">
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-custom-gold p-2">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-surfaceHighlight/90 backdrop-blur-xl border-b border-custom-gold/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 text-base font-medium text-text hover:text-custom-gold hover:bg-custom-gold/5 border-l-2 border-transparent hover:border-custom-gold font-mono"
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

// Separated Routes component to access useLocation context
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/archive" element={<PageWrapper><ArchivePage /></PageWrapper>} />
        <Route path="/compare" element={<PageWrapper><ComparePage /></PageWrapper>} />
        <Route path="/assessment" element={<PageWrapper><AssessmentPage /></PageWrapper>} />
        <Route path="/guides" element={<PageWrapper><GuidesPage /></PageWrapper>} />
        <Route path="/product/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
        <Route path="/debug" element={<PageWrapper><DebugPage /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <ComparisonProvider>
      <Router>
        <Layout>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 py-8 flex-grow w-full relative z-10">
            <AnimatedRoutes />
          </main>

          {/* Floating Comparison Bar */}
          <ComparisonBar />


          <Footer />
        </Layout>
      </Router>
    </ComparisonProvider>
  );
}
