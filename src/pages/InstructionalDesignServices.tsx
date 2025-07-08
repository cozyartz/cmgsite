import React, { useEffect } from 'react';
import { BookOpen, Users, Target, Award, CheckCircle, ArrowRight, GraduationCap, Building2, Star } from 'lucide-react';
import SEO from '../components/SEO';

const InstructionalDesignServices = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="Instructional Design Services | Amy Cozart-Lundin M.Ed | E-Learning Development"
        description="Expert instructional design services by Amy Cozart-Lundin, M.Ed. 10+ years experience serving MongoDB, UnitedLex, Securitas, and Fortune 500 companies. Transform your training programs with engaging, effective learning experiences."
        keywords="Amy Cozart-Lundin, instructional design, e-learning development, corporate training, educational content, learning management systems, training programs, curriculum design, MongoDB, UnitedLex, Securitas, M.Ed"
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
        canonical="https://cozyartzmedia.com/instructional-design-services"
        businessType="ProfessionalService"
        services={[
          "Instructional Design",
          "E-Learning Development",
          "Corporate Training",
          "Educational Content Creation",
          "Learning Management Systems",
          "Curriculum Design"
        ]}
        foundingDate="2016"
      />
      
      <div className="min-h-screen bg-slate-900">
        {/* Hero Section */}
        <section className="pt-24 pb-12 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-6">
                <BookOpen className="h-16 w-16 text-teal-400 mx-auto mb-4" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Expert Instructional Design
                <span className="block text-teal-400">by Amy Cozart-Lundin, M.Ed</span>
              </h1>
              <p className="text-xl text-slate-300 mb-4 leading-relaxed">
                Transform your training programs with expertly crafted learning experiences from a Master's-level instructional designer with 10+ years of experience.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="bg-slate-800/50 px-4 py-2 rounded-full text-teal-300 text-sm font-semibold">
                  <GraduationCap className="inline h-4 w-4 mr-2" />
                  M.Ed in eLearning & Instructional Design
                </div>
                <div className="bg-slate-800/50 px-4 py-2 rounded-full text-teal-300 text-sm font-semibold">
                  <Building2 className="inline h-4 w-4 mr-2" />
                  Trusted by Fortune 500 Companies
                </div>
                <div className="bg-slate-800/50 px-4 py-2 rounded-full text-teal-300 text-sm font-semibold">
                  <Star className="inline h-4 w-4 mr-2" />
                  10+ Years Experience
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://link.amylundin.me" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full font-semibold transition-colors inline-flex items-center justify-center gap-2"
                >
                  Start Your Project
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a 
                  href="#portfolio" 
                  className="border-2 border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-slate-900 px-8 py-3 rounded-full font-semibold transition-colors inline-flex items-center justify-center gap-2"
                >
                  View Portfolio
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Expert Profile Section */}
        <section className="py-20 bg-slate-800">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Meet Your Instructional Design Expert
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-teal-500 rounded-full p-3">
                        <GraduationCap className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Amy Cozart-Lundin, M.Ed</h3>
                        <p className="text-slate-300">
                          Master of Education in eLearning and Instructional Design with deep expertise in adult learning theories and multimedia integration.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-teal-500 rounded-full p-3">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">10+ Years of Excellence</h3>
                        <p className="text-slate-300">
                          Proven track record of creating engaging learning experiences that drive measurable results for organizations worldwide.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-teal-500 rounded-full p-3">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Leadership Experience</h3>
                        <p className="text-slate-300">
                          Experienced in leading teams of designers, technical writers, and LMS administrators to deliver comprehensive learning solutions.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <a 
                      href="https://link.amylundin.me" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full font-semibold transition-colors inline-flex items-center gap-2"
                    >
                      Connect with Amy
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
                
                <div className="bg-slate-700 rounded-lg p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">Professional Credentials</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-600 rounded-lg">
                      <span className="text-white font-semibold">Education</span>
                      <span className="text-teal-400">M.Ed in eLearning & Instructional Design</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-600 rounded-lg">
                      <span className="text-white font-semibold">Experience</span>
                      <span className="text-teal-400">10+ Years</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-600 rounded-lg">
                      <span className="text-white font-semibold">Specialization</span>
                      <span className="text-teal-400">Corporate Training & E-Learning</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-600 rounded-lg">
                      <span className="text-white font-semibold">Contact</span>
                      <a href="https://link.amylundin.me" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300">link.amylundin.me</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Client Success Stories */}
        <section className="py-20 bg-slate-900">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Trusted by Industry Leaders
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  Amy has successfully delivered instructional design solutions for Fortune 500 companies across diverse industries.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                <div className="bg-slate-800 rounded-lg p-8 text-center hover:bg-slate-700 transition-colors">
                  <div className="bg-teal-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">MongoDB</h3>
                  <p className="text-slate-300">Database Technology</p>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-8 text-center hover:bg-slate-700 transition-colors">
                  <div className="bg-teal-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">UnitedLex</h3>
                  <p className="text-slate-300">Legal Services</p>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-8 text-center hover:bg-slate-700 transition-colors">
                  <div className="bg-teal-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Securitas</h3>
                  <p className="text-slate-300">Security Services</p>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-8 text-center hover:bg-slate-700 transition-colors">
                  <div className="bg-teal-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Cosan Group</h3>
                  <p className="text-slate-300">Energy & Agriculture</p>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-8 text-center hover:bg-slate-700 transition-colors">
                  <div className="bg-teal-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Pfizer</h3>
                  <p className="text-slate-300">Pharmaceutical</p>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-8 text-center hover:bg-slate-700 transition-colors">
                  <div className="bg-teal-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">And Many More</h3>
                  <p className="text-slate-300">Global Enterprises</p>
                </div>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Industry Experience</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-teal-400 mb-2">Technology</div>
                    <p className="text-slate-300">Database platforms, SaaS companies, tech startups</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-teal-400 mb-2">Healthcare</div>
                    <p className="text-slate-300">Pharmaceutical, medical devices, healthcare services</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-teal-400 mb-2">Legal</div>
                    <p className="text-slate-300">Law firms, legal services, compliance training</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-teal-400 mb-2">Security</div>
                    <p className="text-slate-300">Security services, risk management, safety training</p>
                  </div>
                </div>
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
                  Comprehensive Instructional Design Services
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  Amy's expertise spans the full spectrum of instructional design, from learning needs analysis to LMS implementation, with a focus on adult learning theories and multimedia integration.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <Target className="h-12 w-12 text-teal-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Learning Needs Analysis</h3>
                  <p className="text-slate-300">
                    Comprehensive assessment using adult learning theories to identify training gaps, learning objectives, and target audience characteristics for maximum impact.
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <BookOpen className="h-12 w-12 text-teal-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Curriculum Development</h3>
                  <p className="text-slate-300">
                    Strategic design of learning pathways with multimedia integration, clear learning objectives, progressive assessments, and measurable outcomes aligned with business goals.
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <Users className="h-12 w-12 text-teal-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">E-Learning Development</h3>
                  <p className="text-slate-300">
                    Interactive online courses featuring multimedia elements, SCORM compliance, engaging simulations, gamification, and responsive design for all devices.
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <Award className="h-12 w-12 text-teal-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Corporate Training Programs</h3>
                  <p className="text-slate-300">
                    Customized training solutions for employee onboarding, compliance training, technical skills development, leadership programs, and change management initiatives.
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <CheckCircle className="h-12 w-12 text-teal-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Assessment & Evaluation</h3>
                  <p className="text-slate-300">
                    Comprehensive evaluation tools including formative assessments, summative evaluations, competency-based testing, and ROI measurement frameworks.
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <ArrowRight className="h-12 w-12 text-teal-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">LMS Administration</h3>
                  <p className="text-slate-300">
                    Expert LMS setup, configuration, content deployment, user management, reporting systems, and ongoing platform administration and optimization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-slate-900">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Our Design Process
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  We follow a systematic approach to ensure your learning objectives are met effectively.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="bg-teal-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Analysis</h3>
                  <p className="text-slate-300">
                    Understand your learners, objectives, and constraints to create a solid foundation.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-teal-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Design</h3>
                  <p className="text-slate-300">
                    Create detailed blueprints and storyboards for your learning experience.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-teal-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Development</h3>
                  <p className="text-slate-300">
                    Build interactive content with multimedia elements and engaging activities.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-teal-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">4</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Evaluation</h3>
                  <p className="text-slate-300">
                    Test, refine, and optimize your learning solution for maximum effectiveness.
                  </p>
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
                Ready to Work with Amy?
              </h2>
              <p className="text-xl text-teal-100 mb-8">
                Join the ranks of MongoDB, UnitedLex, and other industry leaders who trust Amy's expertise to transform their training programs and drive measurable results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://link.amylundin.me" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-teal-600 hover:bg-slate-100 px-8 py-3 rounded-full font-semibold transition-colors inline-flex items-center justify-center gap-2"
                >
                  Contact Amy Directly
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a 
                  href="mailto:hello@cozyartzmedia.com" 
                  className="border-2 border-white text-white hover:bg-white hover:text-teal-600 px-8 py-3 rounded-full font-semibold transition-colors inline-flex items-center justify-center gap-2"
                >
                  Schedule Consultation
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default InstructionalDesignServices;