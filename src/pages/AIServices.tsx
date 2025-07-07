import React, { useEffect } from 'react';
import { Bot, Workflow, Brain, Lightbulb, Cog, TrendingUp, Target, Users, Clock, DollarSign, Shield } from 'lucide-react';
import SEO from '../components/SEO';

const AIServices = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="AI Services | Business Automation & Workflow Optimization"
        description="Transform your business with AI-powered automation, intelligent workflows, and custom AI solutions. Expert AI implementation services for modern businesses."
        keywords="AI services, artificial intelligence, business automation, workflow optimization, AI integration, machine learning, intelligent systems, process automation, AI consulting"
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
        canonical="https://cozyartzmedia.com/ai-services"
        businessType="ProfessionalService"
        services={[
          "AI Business Automation",
          "Intelligent Workflow Design",
          "AI-Powered Content Creation",
          "Custom AI Solutions",
          "Process Optimization",
          "AI Training & Implementation",
          "Intelligent Customer Service",
          "Data Analysis & Insights"
        ]}
        foundingDate="2016"
      />
      
      <div className="min-h-screen bg-slate-900">
        {/* Hero Section */}
        <section className="pt-24 pb-12 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-6">
                <Bot className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                AI-Powered Business
                <span className="block text-purple-400">Solutions</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Transform your business with intelligent automation, streamlined workflows, and custom AI solutions. 
                We leverage cutting-edge AI technology to help you work smarter, not harder.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
                  Start Your AI Journey
                </button>
                <button className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-slate-900 px-8 py-3 rounded-full font-semibold transition-colors">
                  View AI Solutions
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* AI Partnership Section */}
        <section className="py-16 bg-slate-800">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-slate-700 rounded-lg p-8 border-2 border-purple-400">
                <Brain className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  AI-Enhanced Creative Partnership
                </h2>
                <p className="text-lg text-slate-300 mb-6">
                  We combine human creativity with artificial intelligence to deliver unprecedented results. 
                  Our AI-powered approach amplifies our team's capabilities across all services.
                </p>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-white font-semibold">10x Faster</p>
                    <p className="text-slate-300 text-sm">Content Creation</p>
                  </div>
                  <div>
                    <Target className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-white font-semibold">95% Accuracy</p>
                    <p className="text-slate-300 text-sm">Process Automation</p>
                  </div>
                  <div>
                    <DollarSign className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-white font-semibold">40% Cost Savings</p>
                    <p className="text-slate-300 text-sm">Average Client ROI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core AI Services */}
        <section className="py-20 bg-slate-900">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Comprehensive AI Solutions
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  From intelligent automation to custom AI implementations, we provide end-to-end AI services that transform how you work.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-slate-800 rounded-lg p-8 hover:bg-slate-700 transition-colors">
                  <Workflow className="h-12 w-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Intelligent Workflow Automation</h3>
                  <p className="text-slate-300 mb-4">
                    Streamline repetitive tasks and complex processes with AI-powered automation that learns and adapts.
                  </p>
                  <ul className="text-sm text-slate-400 space-y-2">
                    <li>• Document processing automation</li>
                    <li>• Email and communication workflows</li>
                    <li>• Data entry and validation</li>
                    <li>• Report generation and distribution</li>
                  </ul>
                </div>

                <div className="bg-slate-800 rounded-lg p-8 hover:bg-slate-700 transition-colors">
                  <Bot className="h-12 w-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">AI-Powered Customer Service</h3>
                  <p className="text-slate-300 mb-4">
                    Enhance customer experience with intelligent chatbots and automated support systems.
                  </p>
                  <ul className="text-sm text-slate-400 space-y-2">
                    <li>• 24/7 intelligent chat support</li>
                    <li>• Automated ticket routing</li>
                    <li>• Knowledge base integration</li>
                    <li>• Multilingual support capabilities</li>
                  </ul>
                </div>

                <div className="bg-slate-800 rounded-lg p-8 hover:bg-slate-700 transition-colors">
                  <Lightbulb className="h-12 w-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Intelligent Content Creation</h3>
                  <p className="text-slate-300 mb-4">
                    Scale your content production with AI-assisted writing, editing, and optimization tools.
                  </p>
                  <ul className="text-sm text-slate-400 space-y-2">
                    <li>• AI-enhanced copywriting</li>
                    <li>• Automated content optimization</li>
                    <li>• Social media post generation</li>
                    <li>• SEO content strategy</li>
                  </ul>
                </div>

                <div className="bg-slate-800 rounded-lg p-8 hover:bg-slate-700 transition-colors">
                  <Brain className="h-12 w-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Data Analysis & Insights</h3>
                  <p className="text-slate-300 mb-4">
                    Transform raw data into actionable insights with AI-powered analytics and reporting.
                  </p>
                  <ul className="text-sm text-slate-400 space-y-2">
                    <li>• Predictive analytics</li>
                    <li>• Customer behavior analysis</li>
                    <li>• Performance optimization</li>
                    <li>• Automated reporting dashboards</li>
                  </ul>
                </div>

                <div className="bg-slate-800 rounded-lg p-8 hover:bg-slate-700 transition-colors">
                  <Cog className="h-12 w-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Custom AI Solutions</h3>
                  <p className="text-slate-300 mb-4">
                    Tailored AI implementations designed specifically for your business needs and industry.
                  </p>
                  <ul className="text-sm text-slate-400 space-y-2">
                    <li>• Industry-specific AI models</li>
                    <li>• Integration with existing systems</li>
                    <li>• Scalable AI architectures</li>
                    <li>• Ongoing optimization and support</li>
                  </ul>
                </div>

                <div className="bg-slate-800 rounded-lg p-8 hover:bg-slate-700 transition-colors">
                  <Users className="h-12 w-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">AI Training & Implementation</h3>
                  <p className="text-slate-300 mb-4">
                    Comprehensive training and support to help your team leverage AI tools effectively.
                  </p>
                  <ul className="text-sm text-slate-400 space-y-2">
                    <li>• AI literacy workshops</li>
                    <li>• Tool-specific training</li>
                    <li>• Best practices implementation</li>
                    <li>• Ongoing support and optimization</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Industry Applications */}
        <section className="py-20 bg-slate-800">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  AI Solutions by Industry
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  We understand that every industry has unique challenges. Our AI solutions are tailored to meet specific sector needs.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-slate-700 rounded-lg p-6 border-l-4 border-purple-400">
                  <h3 className="text-xl font-bold text-white mb-4">Healthcare</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Patient data management</li>
                    <li>• Appointment scheduling automation</li>
                    <li>• Medical record processing</li>
                    <li>• Compliance monitoring</li>
                  </ul>
                </div>

                <div className="bg-slate-700 rounded-lg p-6 border-l-4 border-purple-400">
                  <h3 className="text-xl font-bold text-white mb-4">Education</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Personalized learning paths</li>
                    <li>• Automated grading systems</li>
                    <li>• Student progress tracking</li>
                    <li>• Content curriculum development</li>
                  </ul>
                </div>

                <div className="bg-slate-700 rounded-lg p-6 border-l-4 border-purple-400">
                  <h3 className="text-xl font-bold text-white mb-4">E-commerce</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Product recommendation engines</li>
                    <li>• Inventory management</li>
                    <li>• Customer service chatbots</li>
                    <li>• Price optimization</li>
                  </ul>
                </div>

                <div className="bg-slate-700 rounded-lg p-6 border-l-4 border-purple-400">
                  <h3 className="text-xl font-bold text-white mb-4">Real Estate</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Lead qualification automation</li>
                    <li>• Property valuation tools</li>
                    <li>• Market analysis reports</li>
                    <li>• Client communication systems</li>
                  </ul>
                </div>

                <div className="bg-slate-700 rounded-lg p-6 border-l-4 border-purple-400">
                  <h3 className="text-xl font-bold text-white mb-4">Finance</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Fraud detection systems</li>
                    <li>• Risk assessment automation</li>
                    <li>• Document processing</li>
                    <li>• Regulatory compliance</li>
                  </ul>
                </div>

                <div className="bg-slate-700 rounded-lg p-6 border-l-4 border-purple-400">
                  <h3 className="text-xl font-bold text-white mb-4">Manufacturing</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Quality control automation</li>
                    <li>• Predictive maintenance</li>
                    <li>• Supply chain optimization</li>
                    <li>• Production planning</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-slate-900">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Why Choose AI Solutions?
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  Discover the transformative benefits of integrating AI into your business operations.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Operational Excellence</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Clock className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-white font-semibold">Time Savings</p>
                        <p className="text-slate-300">Automate repetitive tasks and reduce manual work by up to 80%</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Target className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-white font-semibold">Improved Accuracy</p>
                        <p className="text-slate-300">Eliminate human error with AI-powered validation and processing</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-white font-semibold">Scalable Growth</p>
                        <p className="text-slate-300">Handle increased workload without proportional staff increases</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Competitive Advantage</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-white font-semibold">Cost Reduction</p>
                        <p className="text-slate-300">Reduce operational costs while improving service quality</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Brain className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-white font-semibold">Data-Driven Insights</p>
                        <p className="text-slate-300">Make informed decisions based on AI-powered analytics</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-white font-semibold">Future-Ready</p>
                        <p className="text-slate-300">Stay ahead of the competition with cutting-edge technology</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Process */}
        <section className="py-20 bg-slate-800">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Our AI Implementation Process
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  A systematic approach to AI integration that ensures successful adoption and maximum ROI.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="bg-purple-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Discovery & Assessment</h3>
                  <p className="text-slate-300">
                    Analyze your current processes and identify AI opportunities that align with your goals.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Strategy & Planning</h3>
                  <p className="text-slate-300">
                    Develop a comprehensive AI roadmap with clear milestones and success metrics.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Implementation & Integration</h3>
                  <p className="text-slate-300">
                    Deploy AI solutions with seamless integration into your existing systems.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">4</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Training & Optimization</h3>
                  <p className="text-slate-300">
                    Provide comprehensive training and continuous optimization for sustained success.
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
                Ready to Transform Your Business with AI?
              </h2>
              <p className="text-xl text-purple-100 mb-8">
                Join the AI revolution and unlock your business's full potential with our expert AI solutions and implementation services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-purple-600 hover:bg-slate-100 px-8 py-3 rounded-full font-semibold transition-colors">
                  Get AI Assessment
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 rounded-full font-semibold transition-colors">
                  Schedule Discovery Call
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AIServices;