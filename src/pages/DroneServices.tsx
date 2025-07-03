import React, { useEffect } from 'react';
import { Camera, MapPin, Building, Zap, Film, Eye, Compass, Shield } from 'lucide-react';
import SEO from '../components/SEO';

const DroneServices = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="Professional Drone Services | Aerial Photography & Videography"
        description="Professional drone services for aerial photography, videography, real estate, construction, and commercial projects. FAA certified pilots delivering stunning aerial content."
        keywords="drone services, aerial photography, aerial videography, commercial drone, real estate photography, construction monitoring, FAA certified drone pilot"
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
        canonical="https://cozyartzmedia.com/drone-services"
        businessType="ProfessionalService"
        services={[
          "Aerial Photography",
          "Aerial Videography",
          "Real Estate Drone Services",
          "Construction Monitoring",
          "Commercial Drone Operations",
          "Event Aerial Coverage"
        ]}
        foundingDate="2016"
      />
      
      <div className="min-h-screen bg-slate-900">
        {/* Hero Section */}
        <section className="pt-24 pb-12 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-6">
                <Camera className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Professional Drone
                <span className="block text-blue-400">Services</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Elevate your perspective with our FAA-certified aerial photography and videography services. From real estate to construction, we capture stunning aerial content that tells your story from above.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
                  Book Flight Session
                </button>
                <button className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-slate-900 px-8 py-3 rounded-full font-semibold transition-colors">
                  View Gallery
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-20 bg-slate-800">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Our Drone Services
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  Professional aerial solutions for every industry and project, delivered by certified pilots with cutting-edge equipment.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <Building className="h-12 w-12 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Real Estate</h3>
                  <p className="text-slate-300">
                    Showcase properties with breathtaking aerial views that highlight unique features and neighborhood context.
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <Film className="h-12 w-12 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Commercial Video</h3>
                  <p className="text-slate-300">
                    Dynamic aerial footage for marketing campaigns, corporate videos, and brand storytelling.
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <MapPin className="h-12 w-12 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Construction Monitoring</h3>
                  <p className="text-slate-300">
                    Track construction progress with regular aerial documentation and site inspection services.
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <Eye className="h-12 w-12 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Event Coverage</h3>
                  <p className="text-slate-300">
                    Capture weddings, festivals, and special events from unique aerial perspectives.
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <Compass className="h-12 w-12 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Land Surveying</h3>
                  <p className="text-slate-300">
                    Accurate topographical mapping and land surveying for development and planning projects.
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <Zap className="h-12 w-12 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Infrastructure Inspection</h3>
                  <p className="text-slate-300">
                    Safe and efficient inspection of towers, bridges, and other infrastructure assets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-slate-900">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Why Choose Our Drone Services?
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  Professional equipment, certified pilots, and comprehensive insurance coverage for peace of mind.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <Shield className="h-8 w-8 text-blue-400 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">FAA Certified</h3>
                      <p className="text-slate-300">
                        All flights conducted by FAA Part 107 certified pilots with proper licensing and insurance.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Camera className="h-8 w-8 text-blue-400 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Professional Equipment</h3>
                      <p className="text-slate-300">
                        High-resolution cameras and stabilized gimbals for crisp, professional-quality imagery.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Zap className="h-8 w-8 text-blue-400 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Fast Turnaround</h3>
                      <p className="text-slate-300">
                        Quick delivery of edited photos and videos to meet your project deadlines.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Shield className="h-8 w-8 text-blue-400 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Fully Insured</h3>
                      <p className="text-slate-300">
                        Comprehensive liability coverage for all commercial drone operations.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Equipment Specs</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                      <span className="text-slate-300">Camera Resolution</span>
                      <span className="text-blue-400 font-semibold">4K/6K Video</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                      <span className="text-slate-300">Photo Resolution</span>
                      <span className="text-blue-400 font-semibold">20MP+</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                      <span className="text-slate-300">Flight Time</span>
                      <span className="text-blue-400 font-semibold">Up to 30 min</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                      <span className="text-slate-300">Wind Resistance</span>
                      <span className="text-blue-400 font-semibold">25+ mph</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Range</span>
                      <span className="text-blue-400 font-semibold">.5 miles</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-slate-800">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Our Process
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  From initial consultation to final delivery, we ensure every flight is planned and executed professionally.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Planning</h3>
                  <p className="text-slate-300">
                    Site assessment, weather evaluation, and flight path planning for optimal results.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Authorization</h3>
                  <p className="text-slate-300">
                    Obtain necessary airspace clearances and ensure compliance with all regulations.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Execution</h3>
                  <p className="text-slate-300">
                    Professional flight operations with real-time monitoring and safety protocols.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">4</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Delivery</h3>
                  <p className="text-slate-300">
                    Professional editing and delivery of high-quality photos and videos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Take Flight?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Let's capture your project from a whole new perspective with professional drone services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-3 rounded-full font-semibold transition-colors">
                  Schedule Flight
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-full font-semibold transition-colors">
                  Get Quote
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default DroneServices;