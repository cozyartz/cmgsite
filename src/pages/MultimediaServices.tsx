import React, { useEffect } from 'react';
import { Video, Music, Image, Mic, Play, FileVideo, Volume2, Edit } from 'lucide-react';
import SEO from '../components/SEO';

const MultimediaServices = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="Multimedia Services | Video Production & Audio Design"
        description="Professional multimedia services including video production, audio design, animation, and interactive media. Create compelling content that engages your audience."
        keywords="multimedia services, video production, audio design, animation, interactive media, corporate video, promotional video, podcast production"
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
        canonical="https://cozyartzmedia.com/multimedia-services"
        businessType="ProfessionalService"
        services={[
          "Video Production",
          "Audio Design",
          "Animation",
          "Interactive Media",
          "Corporate Video",
          "Promotional Video",
          "Podcast Production"
        ]}
        foundingDate="2016"
      />
      
      <div className="min-h-screen bg-slate-900">
        {/* Hero Section */}
        <section className="pt-24 pb-12 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-6">
                <Video className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Multimedia
                <span className="block text-purple-400">Services</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Bring your stories to life with our comprehensive multimedia production services. From corporate videos to interactive presentations, we create engaging content that captivates your audience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
                  Start Your Project
                </button>
                <button className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-slate-900 px-8 py-3 rounded-full font-semibold transition-colors">
                  View Showcase
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
                  Our Multimedia Services
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  Complete multimedia solutions from concept to final delivery, tailored to your brand and messaging needs.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <Video className="h-12 w-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Video Production</h3>
                  <p className="text-slate-300">
                    Professional video production from concept to completion, including corporate videos, commercials, and promotional content.
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <Music className="h-12 w-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Audio Design</h3>
                  <p className="text-slate-300">
                    Custom audio solutions including soundtracks, voice-overs, podcast production, and audio branding.
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <Image className="h-12 w-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Animation & Motion Graphics</h3>
                  <p className="text-slate-300">
                    Engaging 2D and 3D animations, motion graphics, and visual effects to enhance your message.
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <Play className="h-12 w-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Interactive Media</h3>
                  <p className="text-slate-300">
                    Interactive presentations, touchscreen experiences, and multimedia installations for events and exhibits.
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <Mic className="h-12 w-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Podcast Production</h3>
                  <p className="text-slate-300">
                    Complete podcast production services from recording to distribution, including editing and sound design.
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <Edit className="h-12 w-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Post-Production</h3>
                  <p className="text-slate-300">
                    Professional editing, color correction, sound mixing, and final delivery in any format you need.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities Section */}
        <section className="py-20 bg-slate-900">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Our Capabilities
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  State-of-the-art equipment and creative expertise to bring your vision to life.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <FileVideo className="h-8 w-8 text-purple-400 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">8K Video Production</h3>
                      <p className="text-slate-300">
                        Ultra-high-definition video capture and production with professional 8K cameras and equipment.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Volume2 className="h-8 w-8 text-purple-400 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Studio-Quality Audio</h3>
                      <p className="text-slate-300">
                        Professional audio recording and mixing in our acoustically treated studio space.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Image className="h-8 w-8 text-purple-400 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">3D Animation</h3>
                      <p className="text-slate-300">
                        Complex 3D modeling, animation, and rendering for product visualization and storytelling.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Play className="h-8 w-8 text-purple-400 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Live Streaming</h3>
                      <p className="text-slate-300">
                        Multi-camera live streaming production for events, webinars, and corporate communications.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Video Formats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700 rounded-lg p-4 text-center">
                      <div className="text-purple-400 font-bold text-2xl">8K</div>
                      <div className="text-slate-300 text-sm">Ultra HD+</div>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-4 text-center">
                      <div className="text-purple-400 font-bold text-2xl">4K</div>
                      <div className="text-slate-300 text-sm">Ultra HD</div>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-4 text-center">
                      <div className="text-purple-400 font-bold text-2xl">1080p</div>
                      <div className="text-slate-300 text-sm">Full HD</div>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-4 text-center">
                      <div className="text-purple-400 font-bold text-2xl">VR</div>
                      <div className="text-slate-300 text-sm">360° Video</div>
                    </div>
                  </div>
                  
                  <h4 className="text-xl font-bold text-white mt-6 mb-4">Delivery Options</h4>
                  <div className="space-y-2 text-slate-300">
                    <div className="flex justify-between">
                      <span>Digital Download</span>
                      <span className="text-purple-400">✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cloud Storage</span>
                      <span className="text-purple-400">✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Physical Media</span>
                      <span className="text-purple-400">✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Streaming Ready</span>
                      <span className="text-purple-400">✓</span>
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
                  Our Production Process
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  From initial concept to final delivery, we guide you through every step of the production process.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
                <div className="text-center">
                  <div className="bg-purple-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Discovery</h3>
                  <p className="text-slate-300">
                    Understanding your goals, audience, and vision for the project.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Concept</h3>
                  <p className="text-slate-300">
                    Developing creative concepts and detailed production plans.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Production</h3>
                  <p className="text-slate-300">
                    Professional filming, recording, and content creation.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">4</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Post-Production</h3>
                  <p className="text-slate-300">
                    Editing, effects, color correction, and audio mixing.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">5</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Delivery</h3>
                  <p className="text-slate-300">
                    Final delivery in your preferred format and platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-700">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Create Something Amazing?
              </h2>
              <p className="text-xl text-purple-100 mb-8">
                Let's bring your vision to life with professional multimedia production services that engage and inspire.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-purple-600 hover:bg-slate-100 px-8 py-3 rounded-full font-semibold transition-colors">
                  Start Your Project
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 rounded-full font-semibold transition-colors">
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

export default MultimediaServices;