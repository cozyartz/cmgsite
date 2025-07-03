import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
          <div className="flex items-center space-x-3">
            <img 
              src="/cmgLogo.png" 
              alt="Cozyartz Media Group" 
              className="h-12 w-12 object-contain"
            />
            <div className="text-white">
              <h1 className="text-xl font-bold">COZYARTZ</h1>
              <p className="text-xs text-teal-300 tracking-wider">MEDIA GROUP</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-white hover:text-teal-300 transition-colors">Home</a>
            <div className="relative group">
              <button className="flex items-center text-white hover:text-teal-300 transition-colors">
                Services <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <a href="#web-design" className="block px-4 py-3 text-white hover:bg-teal-600 rounded-t-lg">Web & Graphic Design</a>
                <a href="#instructional" className="block px-4 py-3 text-white hover:bg-teal-600">Instructional Design</a>
                <a href="#multimedia" className="block px-4 py-3 text-white hover:bg-teal-600 rounded-b-lg">Multimedia Production</a>
              </div>
            </div>
            <a href="#portfolio" className="text-white hover:text-teal-300 transition-colors">Portfolio</a>
            <a href="#about" className="text-white hover:text-teal-300 transition-colors">About</a>
            <a href="#contact" className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-full transition-colors">
              Contact
            </a>
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
              <a href="#home" className="text-white hover:text-teal-300 transition-colors">Home</a>
              <a href="#web-design" className="text-white hover:text-teal-300 transition-colors">Web & Graphic Design</a>
              <a href="#instructional" className="text-white hover:text-teal-300 transition-colors">Instructional Design</a>
              <a href="#multimedia" className="text-white hover:text-teal-300 transition-colors">Multimedia Production</a>
              <a href="#portfolio" className="text-white hover:text-teal-300 transition-colors">Portfolio</a>
              <a href="#about" className="text-white hover:text-teal-300 transition-colors">About</a>
              <a href="#contact" className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-full transition-colors text-center">
                Contact
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;