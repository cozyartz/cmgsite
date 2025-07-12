import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Sparkles, Zap, Star } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const NotFound = () => {
  const [floating, setFloating] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{id: number, x: number, y: number}>>([]);

  useEffect(() => {
    setFloating(true);
    
    // Generate random sparkles
    const generateSparkles = () => {
      const newSparkles = Array.from({length: 20}, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }));
      setSparkles(newSparkles);
    };

    generateSparkles();
    const interval = setInterval(generateSparkles, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <SEO
        title="Oops! Page Lost in Space 🚀 | Cozyartz Media Group"
        description="This page took a rocket ship to the moon! Don't worry, our creative team will help you find your way back to amazing web design and digital solutions."
        keywords="404, page not found, space adventure, Cozyartz Media Group"
        businessName="Cozyartz Media Group"
        phone="+1 (269) 261-0069"
        email="hello@cozyartzmedia.com"
        address={{
          city: "Battle Creek",
          state: "MI", 
          zip: "49015",
          country: "US"
        }}
        geo={{
          latitude: 42.3211,
          longitude: -85.1797
        }}
        canonical="https://cozyartzmedia.com/404"
        businessType="ProfessionalService"
        robotsContent="noindex, follow"
      />
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-24 relative overflow-hidden">
        {/* Animated Background Stars */}
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute animate-pulse"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              animationDelay: `${sparkle.id * 0.1}s`,
            }}
          >
            <Star className="h-2 w-2 text-yellow-300 fill-current" />
          </div>
        ))}

        {/* Floating Planets */}
        <div className="absolute top-20 left-10 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
          <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full shadow-lg"></div>
        </div>
        <div className="absolute top-40 right-20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full shadow-lg"></div>
        </div>
        <div className="absolute bottom-40 left-20 animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}>
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full shadow-lg"></div>
        </div>

        <div className="flex items-center justify-center min-h-screen px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Rocket Ship */}
            <div className={`mb-8 transition-transform duration-1000 ${floating ? 'translate-y-0' : 'translate-y-10'}`}>
              <div className="relative inline-block">
                <div className="text-8xl mb-4 animate-bounce">🚀</div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-2 h-8 bg-gradient-to-b from-orange-400 to-red-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* 404 with Fun Styling */}
            <div className="mb-6">
              <h1 className="text-8xl md:text-9xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                4🌟4
              </h1>
              <div className="flex justify-center items-center gap-2 mb-4">
                <Zap className="h-6 w-6 text-yellow-400 animate-bounce" style={{ animationDelay: '0s' }} />
                <h2 className="text-2xl md:text-4xl font-bold text-white">
                  Houston, We Have a Problem!
                </h2>
                <Zap className="h-6 w-6 text-yellow-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>

            {/* Fun Message */}
            <div className="mb-8 space-y-4">
              <p className="text-xl md:text-2xl text-purple-200 font-semibold">
                🌌 This page blasted off to another galaxy! 🌌
              </p>
              <p className="text-lg text-purple-300 max-w-2xl mx-auto">
                Don't worry, our creative astronauts are here to guide you back to earth. 
                Let's navigate you to some stellar content that's out of this world! ✨
              </p>
            </div>

            {/* Cartoon Characters */}
            <div className="flex justify-center gap-4 mb-8">
              <div className="text-4xl animate-bounce" style={{ animationDelay: '0s' }}>👽</div>
              <div className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🛸</div>
              <div className="text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>🌟</div>
              <div className="text-4xl animate-bounce" style={{ animationDelay: '0.6s' }}>🪐</div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-6">
              <Link
                to="/"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Home className="h-6 w-6" />
                🚀 Blast Off Home
                <Sparkles className="h-6 w-6" />
              </Link>

              {/* Mission Control Links */}
              <div className="mt-12">
                <p className="text-purple-200 mb-6 text-lg font-semibold">
                  🎯 Mission Control - Popular Destinations:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <Link 
                    to="/ai-services" 
                    className="bg-purple-800/50 hover:bg-purple-700/50 text-purple-100 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 border border-purple-600 hover:border-purple-400"
                  >
                    🤖 AI Command Center
                  </Link>
                  <Link 
                    to="/seo-services" 
                    className="bg-blue-800/50 hover:bg-blue-700/50 text-blue-100 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 border border-blue-600 hover:border-blue-400"
                  >
                    🔍 SEO Space Station
                  </Link>
                  <Link 
                    to="/web-graphic-design-services" 
                    className="bg-cyan-800/50 hover:bg-cyan-700/50 text-cyan-100 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 border border-cyan-600 hover:border-cyan-400"
                  >
                    🎨 Design Galaxy
                  </Link>
                  <Link 
                    to="/instructional-design-services" 
                    className="bg-pink-800/50 hover:bg-pink-700/50 text-pink-100 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 border border-pink-600 hover:border-pink-400"
                  >
                    🎓 Learning Universe
                  </Link>
                </div>
              </div>
            </div>

            {/* Fun Footer Message */}
            <div className="mt-12 text-purple-300">
              <p className="text-sm">
                🌙 Lost in space? No worries! Even astronauts need GPS sometimes. 🛰️
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default NotFound;