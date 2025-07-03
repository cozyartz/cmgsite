import React, { useEffect } from 'react';
import { BookOpen, Users, Target, Award, CheckCircle, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const InstructionalDesignServices = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="Instructional Design Services | E-Learning Development"
        description="Professional instructional design services for corporate training, e-learning development, and educational content creation. Transform your training programs with engaging, effective learning experiences."
        keywords="instructional design, e-learning development, corporate training, educational content, learning management systems, training programs, curriculum design"
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
                Instructional Design
                <span className="block text-teal-400">Services</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Transform your training programs with expertly crafted learning experiences that engage learners and drive measurable results.
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
                  Our Instructional Design Services
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  We create comprehensive learning solutions tailored to your organization's needs and learner preferences.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <Target className="h-12 w-12 text-teal-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Learning Needs Analysis</h3>
                  <p className="text-slate-300">
                    Comprehensive assessment of your organization's training needs, learning objectives, and target audience to create focused solutions.
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <BookOpen className="h-12 w-12 text-teal-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Curriculum Development</h3>
                  <p className="text-slate-300">
                    Design and develop structured learning pathways with clear objectives, assessments, and measurable outcomes.
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <Users className="h-12 w-12 text-teal-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">E-Learning Development</h3>
                  <p className="text-slate-300">
                    Interactive online courses with multimedia elements, quizzes, simulations, and engaging content delivery.
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <Award className="h-12 w-12 text-teal-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Corporate Training</h3>
                  <p className="text-slate-300">
                    Customized training programs for employee onboarding, compliance, skills development, and leadership training.
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <CheckCircle className="h-12 w-12 text-teal-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Assessment Design</h3>
                  <p className="text-slate-300">
                    Create effective evaluation tools and assessments to measure learning outcomes and training effectiveness.
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-8 hover:bg-slate-600 transition-colors">
                  <ArrowRight className="h-12 w-12 text-teal-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">LMS Integration</h3>
                  <p className="text-slate-300">
                    Seamless integration with Learning Management Systems and deployment of training content across platforms.
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
                Ready to Transform Your Training?
              </h2>
              <p className="text-xl text-teal-100 mb-8">
                Let's create engaging learning experiences that drive real results for your organization.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-teal-600 hover:bg-slate-100 px-8 py-3 rounded-full font-semibold transition-colors">
                  Get Started Today
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-teal-600 px-8 py-3 rounded-full font-semibold transition-colors">
                  Schedule Consultation
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default InstructionalDesignServices;