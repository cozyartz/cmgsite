import React from 'react';
import { Mail, Phone, MapPin, Facebook, Linkedin, Github, Shield, FileText, Cookie, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/cmgLogo.png" 
                alt="Cozyartz Media Group" 
                className="h-12 w-12 object-contain"
              />
              <div>
                <h3 className="text-xl font-bold">COZYARTZ</h3>
                <p className="text-sm text-teal-300 tracking-wider">MEDIA GROUP</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              We combine creativity with data-driven strategies to amplify your business growth through 
              innovative design, multimedia production, and instructional excellence.
            </p>
            
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/cozyartzmedia/" target="_blank" rel="noopener noreferrer" className="bg-slate-800 p-3 rounded-full hover:bg-teal-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/cozyartzmediagroup" target="_blank" rel="noopener noreferrer" className="bg-slate-800 p-3 rounded-full hover:bg-teal-500 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://github.com/cozyartz/cmgsite" target="_blank" rel="noopener noreferrer" className="bg-slate-800 p-3 rounded-full hover:bg-teal-500 transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              <li><Link to="/web-graphic-design-services" className="text-gray-300 hover:text-teal-300 transition-colors">Web & Graphic Design</Link></li>
              <li><Link to="/instructional-design-services" className="text-gray-300 hover:text-teal-300 transition-colors">Instructional Design</Link></li>
              <li><Link to="/multimedia-services" className="text-gray-300 hover:text-teal-300 transition-colors">Multimedia Services</Link></li>
              <li><Link to="/drone-services" className="text-gray-300 hover:text-teal-300 transition-colors">Drone Services</Link></li>
              <li><Link to="/seo-services" className="text-gray-300 hover:text-teal-300 transition-colors">SEO Services</Link></li>
              <li><Link to="/ai-services" className="text-gray-300 hover:text-teal-300 transition-colors">AI Services</Link></li>
            </ul>
            <div className="mt-6">
              <h5 className="text-sm font-semibold mb-3 text-teal-300">Quick Actions</h5>
              <ul className="space-y-2">
                <li><Link to="/pricing" className="text-gray-300 hover:text-teal-300 transition-colors text-sm">View Pricing</Link></li>
                <li><Link to="/book-consultation" className="text-gray-300 hover:text-teal-300 transition-colors text-sm">Book Consultation</Link></li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-teal-400" />
                <span className="text-gray-300">hello@cozyartzmedia.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-teal-400" />
                <span className="text-gray-300">+1 (269)261-0069</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-teal-400" />
                <span className="text-gray-300">Remote & On-site in Michigan</span>
              </div>
            </div>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Legal & Compliance</h4>
            <ul className="space-y-3 mb-6">
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-teal-300 transition-colors flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-300 hover:text-teal-300 transition-colors flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-gray-300 hover:text-teal-300 transition-colors flex items-center gap-2">
                  <Cookie className="h-4 w-4" />
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/data-subject-request" className="text-gray-300 hover:text-teal-300 transition-colors flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Data Rights
                </Link>
              </li>
            </ul>
            <div className="flex flex-col items-start">
              <img 
                src="/wosb-badge.png" 
                alt="Women-Owned Small Business (WOSB) Certified" 
                className="h-16 w-auto object-contain mb-2"
              />
              <p className="text-gray-300 text-xs">
                WOSB Certified
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © 2025 Cozyartz Media Group. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                GDPR Compliant • WOSB Certified
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-teal-300 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-teal-300 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookie-policy" className="text-gray-400 hover:text-teal-300 text-sm transition-colors">
                Cookie Policy
              </Link>
              <Link to="/data-subject-request" className="text-gray-400 hover:text-teal-300 text-sm transition-colors">
                Data Rights
              </Link>
              <Link to="/book-consultation" className="text-gray-400 hover:text-teal-300 text-sm transition-colors">
                Book Consultation
              </Link>
              <Link to="/auth" className="text-gray-400 hover:text-teal-300 text-sm transition-colors">
                Client Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;