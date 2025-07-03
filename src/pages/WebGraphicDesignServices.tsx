import React, { useEffect } from 'react';
import { Globe, Palette, Smartphone, Code, Layers, Zap, Target, Award } from 'lucide-react';
import SEO from '../components/SEO';

const WebGraphicDesignServices = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="Web & Graphic Design Services | Professional Digital Solutions"
        description="Professional web design and graphic design services for modern businesses. Custom websites, branding, print design, and digital marketing materials that drive results."
        keywords="web design, graphic design, website development, branding, logo design, print design, digital marketing, responsive design, UI/UX design"
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
        canonical="https://cozyartzmedia.com/web-graphic-design-services"
        businessType="ProfessionalService"
        services={[
          "Web Design",
          "Graphic Design",
          "Website Development",
          "Branding",
          "Logo Design",
          "Print Design",
          "Digital Marketing",
          "UI/UX Design"
        ]}
        foundingDate="2016"
      />
      
      <div className="min-h-screen bg-slate-900">
        {/* Hero Section */}
        <section className="pt-24 pb-12 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-6">
                <Globe className="h-16 w-16 text-teal-400 mx-auto mb-4" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Web & Graphic Design
                <span className="block text-teal-400">Services</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Create a powerful digital presence with our comprehensive web and graphic design services. From stunning websites to memorable brand identities, we craft designs that captivate and convert.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
                  Start Your Project
                </button>
                <button className="border-2 border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-slate-900 px-8 py-3 rounded-full font-semibold transition-colors">
                  View Portfolio
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
                  Our Design Services
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  Complete design solutions that combine creativity with strategy to deliver results for your business.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <Globe className="h-12 w-12 text-teal-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Website Design</h3>
                  <p className="text-slate-300">
                    Modern, responsive websites that look great on all devices and convert visitors into customers.
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <Code className="h-12 w-12 text-teal-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Website Development</h3>
                  <p className="text-slate-300">
                    Custom web development with modern technologies, CMS integration, and e-commerce solutions.
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <Palette className="h-12 w-12 text-teal-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Brand Identity</h3>
                  <p className="text-slate-300">
                    Complete brand packages including logos, color schemes, typography, and brand guidelines.
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <Layers className="h-12 w-12 text-teal-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Print Design</h3>
                  <p className="text-slate-300">
                    Business cards, brochures, flyers, and marketing materials that maintain brand consistency.
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <Smartphone className="h-12 w-12 text-teal-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">UI/UX Design</h3>
                  <p className="text-slate-300">
                    User-centered design that creates intuitive and engaging digital experiences.
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <Target className="h-12 w-12 text-teal-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Digital Marketing</h3>
                  <p className="text-slate-300">
                    Social media graphics, email templates, and digital advertising materials that drive engagement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technologies Section */}
        <section className="py-20 bg-slate-900">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Technologies We Use
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  We work with the latest design tools and development technologies to create exceptional digital experiences.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <Code className="h-8 w-8 text-teal-400 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Modern Web Technologies</h3>
                      <p className="text-slate-300">
                        React, TypeScript, Next.js, Tailwind CSS, and other cutting-edge frameworks for fast, scalable websites.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Palette className="h-8 w-8 text-teal-400 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Design Tools</h3>
                      <p className="text-slate-300">
                        Adobe Creative Suite, Figma, Sketch, and other professional design tools for pixel-perfect results.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Zap className="h-8 w-8 text-teal-400 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Performance Optimization</h3>
                      <p className="text-slate-300">
                        Advanced optimization techniques for fast loading times and excellent user experience.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Smartphone className="h-8 w-8 text-teal-400 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Mobile-First Design</h3>
                      <p className="text-slate-300">
                        Responsive design that looks and works beautifully on all devices and screen sizes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Our Tech Stack</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700 rounded-lg p-3 text-center">
                      <div className="text-teal-400 font-semibold">React</div>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-3 text-center">
                      <div className="text-teal-400 font-semibold">TypeScript</div>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-3 text-center">
                      <div className="text-teal-400 font-semibold">Next.js</div>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-3 text-center">
                      <div className="text-teal-400 font-semibold">Tailwind</div>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-3 text-center">
                      <div className="text-teal-400 font-semibold">Node.js</div>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-3 text-center">
                      <div className="text-teal-400 font-semibold">WordPress</div>
                    </div>
                  </div>

                  <h4 className="text-xl font-bold text-white mt-6 mb-4">Design Tools</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700 rounded-lg p-3 text-center">
                      <div className="text-teal-400 font-semibold">Figma</div>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-3 text-center">
                      <div className="text-teal-400 font-semibold">Adobe CC</div>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-3 text-center">
                      <div className="text-teal-400 font-semibold">Sketch</div>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-3 text-center">
                      <div className="text-teal-400 font-semibold">Elements</div>
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
                  Our Design Process
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  A proven process that ensures your project meets your goals and exceeds expectations.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="bg-teal-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Discovery</h3>
                  <p className="text-slate-300">
                    Understanding your business, goals, and target audience to create the perfect strategy.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-teal-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Strategy</h3>
                  <p className="text-slate-300">
                    Developing a comprehensive plan that aligns design with your business objectives.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-teal-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Design</h3>
                  <p className="text-slate-300">
                    Creating beautiful, functional designs that reflect your brand and engage your audience.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-teal-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">4</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Launch</h3>
                  <p className="text-slate-300">
                    Bringing your project to life with thorough testing and seamless deployment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-20 bg-slate-900">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Results That Matter
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  Our designs don't just look good—they deliver measurable results for your business.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <Award className="h-12 w-12 text-teal-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">150+</div>
                  <div className="text-slate-300">Projects Completed</div>
                </div>

                <div className="text-center">
                  <Target className="h-12 w-12 text-teal-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">98%</div>
                  <div className="text-slate-300">Client Satisfaction</div>
                </div>

                <div className="text-center">
                  <Zap className="h-12 w-12 text-teal-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">2x</div>
                  <div className="text-slate-300">Average Conversion Increase</div>
                </div>

                <div className="text-center">
                  <Globe className="h-12 w-12 text-teal-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">24/7</div>
                  <div className="text-slate-300">Website Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-teal-600 to-teal-700">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Elevate Your Brand?
              </h2>
              <p className="text-xl text-teal-100 mb-8">
                Let's create a stunning digital presence that drives results and grows your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-teal-600 hover:bg-slate-100 px-8 py-3 rounded-full font-semibold transition-colors">
                  Get Started
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-teal-600 px-8 py-3 rounded-full font-semibold transition-colors">
                  View Our Work
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default WebGraphicDesignServices;