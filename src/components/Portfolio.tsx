import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  const portfolioItems = [
    {
      id: 1,
      title: "Curriculum Development",
      category: "instructional",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Strategic learning design for high-impact training programs",
      fullDescription: "Custom-built curricula tailored for corporate, nonprofit, and educational clients — grounded in instructional design principles and aligned with business goals."
    },
    {
      id: 2,
      title: "Web Design Projects",
      category: "web",
      image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Clean, user-focused designs that drive engagement",
      fullDescription: "Responsive, accessible, and visually striking websites built to support client storytelling, branding, and functionality across devices."
    },
    {
      id: 3,
      title: "Video Production",
      category: "video",
      image: "https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Cinematic visuals that connect with your audience",
      fullDescription: "End-to-end video production services including scripting, filming, editing, and motion graphics — built for impact across platforms."
    },
    {
      id: 4,
      title: "Logo & Brand Design",
      category: "design",
      image: "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Visual identities that leave a lasting impression",
      fullDescription: "Custom logo and branding packages that reflect your mission, voice, and audience — combining design clarity with conceptual depth."
    },
    {
      id: 5,
      title: "eLearning Design",
      category: "instructional",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Interactive learning experiences for digital platforms",
      fullDescription: "Instructionally sound and visually engaging eLearning modules designed for corporate training, onboarding, and professional development."
    },
    {
      id: 6,
      title: "Aerial Photography Projects",
      category: "video",
      image: "https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Stunning perspectives from above, captured with precision",
      fullDescription: "FAA-certified drone photography for real estate, brand storytelling, and promotional content — delivering cinematic and data-driven visuals."
    }
  ];

  const filters = [
    { key: 'all', label: 'All Projects' },
    { key: 'web', label: 'Web Design' },
    { key: 'design', label: 'Brand Design' },
    { key: 'instructional', label: 'Learning Design' },
    { key: 'video', label: 'Video & Aerial' }
  ];

  const filteredItems = activeFilter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            const items = entry.target.querySelectorAll('.portfolio-item');
            items.forEach((_, index) => {
              setTimeout(() => {
                setVisibleItems(prev => [...prev, index]);
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setVisibleItems([]);
    if (isVisible) {
      const items = document.querySelectorAll('.portfolio-item');
      items.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems(prev => [...prev, index]);
        }, index * 200);
      });
    }
  }, [activeFilter, isVisible]);

  return (
    <section ref={sectionRef} id="portfolio" className="py-20 bg-slate-900">
      <div className="container mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-800 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our <span className="text-teal-400">Portfolio</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Explore our diverse collection of successful projects that showcase our expertise 
            across creative design, learning development, and multimedia production.
          </p>

          {/* Filter Buttons */}
          <div className={`flex flex-wrap justify-center gap-4 transition-all duration-800 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === filter.key
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Client Logos Section */}
        <div className={`text-center mb-16 transition-all duration-800 delay-600 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h3 className="text-2xl font-semibold text-white mb-8">
            Trusted by <span className="text-teal-400">Industry Leaders</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors duration-300">
              <img 
                src="/mongodb-logo.svg" 
                alt="MongoDB" 
                className="h-8 w-auto object-contain filter brightness-0 invert hover:brightness-100 hover:invert-0 transition-all duration-300"
              />
            </div>
            <div className="flex items-center justify-center p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors duration-300">
              <img 
                src="/cosan-logo.svg" 
                alt="Cosan Group" 
                className="h-8 w-auto object-contain filter brightness-0 invert hover:brightness-100 hover:invert-0 transition-all duration-300"
              />
            </div>
            <div className="flex items-center justify-center p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors duration-300">
              <img 
                src="/pfizer-logo.svg" 
                alt="Pfizer" 
                className="h-8 w-auto object-contain filter brightness-0 invert hover:brightness-100 hover:invert-0 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => {
            const isItemVisible = visibleItems.includes(index);
            
            return (
            <div
              key={item.id}
              className={`portfolio-item group relative bg-slate-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-500 ${
                isItemVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-300 mb-2 text-sm font-medium">{item.description}</p>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">{item.fullDescription}</p>
                  <button className="flex items-center text-teal-400 hover:text-teal-300 font-medium">
                    View Project <ExternalLink className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-6 group-hover:opacity-0 transition-opacity duration-300">
                <h3 className="text-xl font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-teal-300 text-sm font-medium mb-2">{item.description}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{item.fullDescription}</p>
              </div>
            </div>
            );
          })}
        </div>

        <div className={`text-center mt-12 transition-all duration-800 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300">
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;