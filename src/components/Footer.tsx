import React from 'react';
import { Mail, Phone, MapPin, Facebook, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
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
            <p className="text-gray-300 mb-6 max-w-md">
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
            </ul>
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
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Cozyartz Media Group. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-teal-300 text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-teal-300 text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-teal-300 text-sm transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;