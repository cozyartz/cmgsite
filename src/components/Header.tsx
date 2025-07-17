import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
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
            <Link to="/auth" className="text-white hover:text-teal-300 transition-colors">Client Portal</Link>
            <button onClick={handleContactClick} className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-full transition-colors">
              Contact
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-slate-700">
            <div className="flex flex-col space-y-4 pt-4">
              <Link to="/" className="text-white hover:text-teal-300 transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/web-graphic-design-services" className="text-white hover:text-teal-300 transition-colors" onClick={() => setIsMenuOpen(false)}>Web & Graphic Design</Link>
              <Link to="/seo-services" className="text-white hover:text-teal-300 transition-colors" onClick={() => setIsMenuOpen(false)}>SEO Services</Link>
              <Link to="/ai-services" className="text-white hover:text-teal-300 transition-colors" onClick={() => setIsMenuOpen(false)}>AI Services</Link>
              <Link to="/instructional-design-services" className="text-white hover:text-teal-300 transition-colors" onClick={() => setIsMenuOpen(false)}>Instructional Design</Link>
              <Link to="/multimedia-services" className="text-white hover:text-teal-300 transition-colors" onClick={() => setIsMenuOpen(false)}>Multimedia Services</Link>
              <Link to="/drone-services" className="text-white hover:text-teal-300 transition-colors" onClick={() => setIsMenuOpen(false)}>Drone Services</Link>
              <button onClick={handlePortfolioClick} className="text-white hover:text-teal-300 transition-colors text-left">Portfolio</button>
              <button onClick={handleAboutClick} className="text-white hover:text-teal-300 transition-colors text-left">About</button>
              <Link to="/pricing" className="text-white hover:text-teal-300 transition-colors" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
              <Link to="/auth" className="text-white hover:text-teal-300 transition-colors" onClick={() => setIsMenuOpen(false)}>Client Portal</Link>
              <button onClick={handleContactClick} className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-full transition-colors text-center">
                Contact
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;