import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // If on home page, scroll to about section
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on another page, navigate to home and then scroll to about
      navigate('/');
      setTimeout(() => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    setIsMenuOpen(false);
  };

  const handlePortfolioClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // If on home page, scroll to portfolio section
      const portfolioSection = document.getElementById('portfolio');
      if (portfolioSection) {
        portfolioSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on another page, navigate to home and then scroll to portfolio
      navigate('/');
      setTimeout(() => {
        const portfolioSection = document.getElementById('portfolio');
        if (portfolioSection) {
          portfolioSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    setIsMenuOpen(false);
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // If on home page, scroll to contact section
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on another page, navigate to home and then scroll to contact
      navigate('/');
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle escape key and click outside to close mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    
    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <header 
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/cmgLogo.png" 
              alt="Cozyartz Media Group" 
              className="h-12 w-12 object-contain"
            />
            <div className="text-white">
              <h1 className="text-xl font-bold">COZYARTZ</h1>
              <p className="text-xs text-teal-300 tracking-wider">MEDIA GROUP</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-teal-300 transition-colors">Home</Link>
            <div className="relative group">
              <button className="flex items-center text-white hover:text-teal-300 transition-colors">
                Services <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link to="/web-graphic-design-services" className="block px-4 py-3 text-white hover:bg-teal-600 rounded-t-lg">Web & Graphic Design</Link>
                <Link to="/seo-services" className="block px-4 py-3 text-white hover:bg-teal-600">SEO Services</Link>
                <Link to="/ai-services" className="block px-4 py-3 text-white hover:bg-teal-600">AI Services</Link>
                <Link to="/instructional-design-services" className="block px-4 py-3 text-white hover:bg-teal-600">Instructional Design</Link>
                <Link to="/multimedia-services" className="block px-4 py-3 text-white hover:bg-teal-600">Multimedia Services</Link>
                <Link to="/drone-services" className="block px-4 py-3 text-white hover:bg-teal-600 rounded-b-lg">Drone Services</Link>
              </div>
            </div>
            <button onClick={handlePortfolioClick} className="text-white hover:text-teal-300 transition-colors">Portfolio</button>
            <button onClick={handleAboutClick} className="text-white hover:text-teal-300 transition-colors">About</button>
            <Link to="/pricing" className="text-white hover:text-teal-300 transition-colors">Pricing</Link>
            <Link to="/book-consultation" className="text-white hover:text-teal-300 transition-colors">Book Consultation</Link>
            <Link to="/auth" className="text-white hover:text-teal-300 transition-colors">Client Portal</Link>
            <button onClick={handleContactClick} className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-full transition-colors">
              Contact
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close main menu" : "Open main menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav 
            id="mobile-menu"
            className="md:hidden mt-4 pb-4 border-t border-slate-700 bg-slate-900/95 backdrop-blur-md rounded-b-lg shadow-xl"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col space-y-1 pt-4 px-2">
              <Link 
                to="/" 
                className="text-white hover:text-teal-300 hover:bg-slate-700/50 focus:bg-slate-700/50 focus:text-teal-300 transition-colors px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" 
                onClick={() => setIsMenuOpen(false)}
                tabIndex={0}
              >
                Home
              </Link>
              
              {/* Services Section */}
              <div className="px-4 py-2">
                <div className="text-slate-400 text-sm font-medium uppercase tracking-wide mb-2">Services</div>
                <div className="flex flex-col space-y-1 pl-4 border-l-2 border-slate-700">
                  <Link 
                    to="/web-graphic-design-services" 
                    className="text-white hover:text-teal-300 hover:bg-slate-700/50 focus:bg-slate-700/50 focus:text-teal-300 transition-colors px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" 
                    onClick={() => setIsMenuOpen(false)}
                    tabIndex={0}
                  >
                    Web & Graphic Design
                  </Link>
                  <Link 
                    to="/seo-services" 
                    className="text-white hover:text-teal-300 hover:bg-slate-700/50 focus:bg-slate-700/50 focus:text-teal-300 transition-colors px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" 
                    onClick={() => setIsMenuOpen(false)}
                    tabIndex={0}
                  >
                    SEO Services
                  </Link>
                  <Link 
                    to="/ai-services" 
                    className="text-white hover:text-teal-300 hover:bg-slate-700/50 focus:bg-slate-700/50 focus:text-teal-300 transition-colors px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" 
                    onClick={() => setIsMenuOpen(false)}
                    tabIndex={0}
                  >
                    AI Services
                  </Link>
                  <Link 
                    to="/instructional-design-services" 
                    className="text-white hover:text-teal-300 hover:bg-slate-700/50 focus:bg-slate-700/50 focus:text-teal-300 transition-colors px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" 
                    onClick={() => setIsMenuOpen(false)}
                    tabIndex={0}
                  >
                    Instructional Design
                  </Link>
                  <Link 
                    to="/multimedia-services" 
                    className="text-white hover:text-teal-300 hover:bg-slate-700/50 focus:bg-slate-700/50 focus:text-teal-300 transition-colors px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" 
                    onClick={() => setIsMenuOpen(false)}
                    tabIndex={0}
                  >
                    Multimedia Services
                  </Link>
                  <Link 
                    to="/drone-services" 
                    className="text-white hover:text-teal-300 hover:bg-slate-700/50 focus:bg-slate-700/50 focus:text-teal-300 transition-colors px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" 
                    onClick={() => setIsMenuOpen(false)}
                    tabIndex={0}
                  >
                    Drone Services
                  </Link>
                </div>
              </div>

              <button 
                onClick={handlePortfolioClick} 
                className="text-white hover:text-teal-300 hover:bg-slate-700/50 focus:bg-slate-700/50 focus:text-teal-300 transition-colors px-4 py-3 rounded-md text-left focus:outline-none focus:ring-2 focus:ring-teal-500"
                tabIndex={0}
              >
                Portfolio
              </button>
              <button 
                onClick={handleAboutClick} 
                className="text-white hover:text-teal-300 hover:bg-slate-700/50 focus:bg-slate-700/50 focus:text-teal-300 transition-colors px-4 py-3 rounded-md text-left focus:outline-none focus:ring-2 focus:ring-teal-500"
                tabIndex={0}
              >
                About
              </button>
              <Link 
                to="/pricing" 
                className="text-white hover:text-teal-300 hover:bg-slate-700/50 focus:bg-slate-700/50 focus:text-teal-300 transition-colors px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" 
                onClick={() => setIsMenuOpen(false)}
                tabIndex={0}
              >
                Pricing
              </Link>
              <Link 
                to="/book-consultation" 
                className="text-white hover:text-teal-300 hover:bg-slate-700/50 focus:bg-slate-700/50 focus:text-teal-300 transition-colors px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" 
                onClick={() => setIsMenuOpen(false)}
                tabIndex={0}
              >
                Book Consultation
              </Link>
              <Link 
                to="/auth" 
                className="text-white hover:text-teal-300 hover:bg-slate-700/50 focus:bg-slate-700/50 focus:text-teal-300 transition-colors px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" 
                onClick={() => setIsMenuOpen(false)}
                tabIndex={0}
              >
                Client Portal
              </Link>
              <div className="px-4 pt-2">
                <button 
                  onClick={handleContactClick} 
                  className="w-full bg-teal-500 hover:bg-teal-600 focus:bg-teal-600 text-white px-6 py-3 rounded-full transition-colors text-center font-medium focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-900"
                  tabIndex={0}
                >
                  Contact Us
                </button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;