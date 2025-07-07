import React, { useEffect } from 'react';
import { Search, TrendingUp, Target, Award, Globe, BarChart, CheckCircle, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const SEOServices = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="SEO Services | Search Engine Optimization Experts"
        description="Professional SEO services to boost your online visibility and drive organic traffic. Google-certified experts helping local and global businesses dominate search results."
        keywords="SEO services, search engine optimization, Google SEO, local SEO, organic traffic, search rankings, digital marketing, Google certified, SEO experts"
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
        canonical="https://cozyartzmedia.com/seo-services"
        businessType="ProfessionalService"
        services={[
          "Search Engine Optimization",
          "Local SEO",
          "Technical SEO",
          "Content Optimization",
          "Link Building",
          "SEO Audits",
          "Google Analytics",
          "Keyword Research"
        ]}
        foundingDate="2016"
      />
      
      <div className="min-h-screen bg-slate-900">
        {/* Hero Section */}
        <section className="pt-24 pb-12 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-6">
                <Search className="h-16 w-16 text-teal-400 mx-auto mb-4" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Professional SEO
                <span className="block text-teal-400">Services</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Boost your online visibility and dominate search results with our Google-certified SEO experts. We help local and global businesses achieve sustainable organic growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
                  Get SEO Analysis
                </button>
                <button className="border-2 border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-slate-900 px-8 py-3 rounded-full font-semibold transition-colors">
                  View Case Studies
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Google Certification Section */}
        <section className="py-16 bg-slate-800">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-slate-700 rounded-lg p-8 border-2 border-teal-400">
                <Award className="h-12 w-12 text-teal-400 mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Google Certified SEO Experts
                </h2>
                <p className="text-lg text-slate-300 mb-6">
                  Our team holds official Google certifications, ensuring we stay current with the latest SEO best practices and algorithm updates.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <div className="h-16 w-16 bg-teal-500 rounded-lg border-2 border-teal-400 flex items-center justify-center">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-white font-semibold">Google Digital Marketing Certificate</p>
                    <p className="text-teal-400">Verified Professional Certification</p>
                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                      <a 
                        href="https://coursera.org/share/d16cbdefad99e7812a4a3c7ddbd42a5d" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-teal-400 hover:text-teal-300 underline text-sm"
                      >
                        View Online Certificate →
                      </a>
                      <a 
                        href="/GoogleCert.pdf" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-teal-400 hover:text-teal-300 underline text-sm"
                      >
                        Download PDF →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-20 bg-slate-900">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Comprehensive SEO Solutions
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  From technical audits to content optimization, we provide end-to-end SEO services that deliver measurable results.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-slate-800 rounded-lg p-8 hover:bg-slate-700 transition-colors">
                  <Target className="h-12 w-12 text-teal-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Keyword Research & Strategy</h3>
                  <p className="text-slate-300">
                    In-depth analysis to identify high-value keywords that drive qualified traffic to your business.
                  </p>
                </div>

                <div className="bg-slate-800 rounded-lg p-8 hover:bg-slate-700 transition-colors">
                  <BarChart className="h-12 w-12 text-teal-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Technical SEO Audits</h3>
                  <p className="text-slate-300">
                    Comprehensive website analysis to identify and fix technical issues that impact search performance.
                  </p>
                </div>

                <div className="bg-slate-800 rounded-lg p-8 hover:bg-slate-700 transition-colors">
                  <Globe className="h-12 w-12 text-teal-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Local SEO Optimization</h3>
                  <p className="text-slate-300">
                    Dominate local search results with Google My Business optimization and local citation building.
                  </p>
                </div>

                <div className="bg-slate-800 rounded-lg p-8 hover:bg-slate-700 transition-colors">
                  <TrendingUp className="h-12 w-12 text-teal-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Content Optimization</h3>
                  <p className="text-slate-300">
                    Strategic content creation and optimization to improve rankings and engage your target audience.
                  </p>
                </div>

                <div className="bg-slate-800 rounded-lg p-8 hover:bg-slate-700 transition-colors">
                  <CheckCircle className="h-12 w-12 text-teal-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Link Building</h3>
                  <p className="text-slate-300">
                    Ethical, high-quality link building strategies to boost your website's authority and rankings.
                  </p>
                </div>

                <div className="bg-slate-800 rounded-lg p-8 hover:bg-slate-700 transition-colors">
                  <ArrowRight className="h-12 w-12 text-teal-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Analytics & Reporting</h3>
                  <p className="text-slate-300">
                    Detailed performance tracking and reporting to measure ROI and optimize your SEO strategy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-slate-800">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Why Choose Our SEO Services?
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  We combine proven strategies with the latest SEO techniques to deliver sustainable results for your business.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Proven Track Record</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-teal-400 mt-1 flex-shrink-0" />
                      <p className="text-slate-300">Over 8 years of SEO experience since 2016</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-teal-400 mt-1 flex-shrink-0" />
                      <p className="text-slate-300">Google-certified professionals with verified credentials</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-teal-400 mt-1 flex-shrink-0" />
                      <p className="text-slate-300">Successful campaigns for local and global businesses</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-teal-400 mt-1 flex-shrink-0" />
                      <p className="text-slate-300">White-hat SEO practices that comply with Google guidelines</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Results-Driven Approach</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-6 w-6 text-teal-400 mt-1 flex-shrink-0" />
                      <p className="text-slate-300">Increase organic traffic by 150% on average</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Target className="h-6 w-6 text-teal-400 mt-1 flex-shrink-0" />
                      <p className="text-slate-300">Improve search rankings for high-value keywords</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="h-6 w-6 text-teal-400 mt-1 flex-shrink-0" />
                      <p className="text-slate-300">Boost local visibility and Google My Business presence</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <BarChart className="h-6 w-6 text-teal-400 mt-1 flex-shrink-0" />
                      <p className="text-slate-300">Detailed analytics and transparent reporting</p>
                    </div>
                  </div>
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
                  Our SEO Process
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  A systematic approach to SEO that ensures sustainable, long-term results for your business.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="bg-teal-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">SEO Audit</h3>
                  <p className="text-slate-300">
                    Comprehensive analysis of your current SEO performance and opportunities.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-teal-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Strategy Development</h3>
                  <p className="text-slate-300">
                    Create a customized SEO strategy based on your goals and market analysis.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-teal-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Implementation</h3>
                  <p className="text-slate-300">
                    Execute on-page and off-page optimization strategies for maximum impact.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-teal-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">4</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Monitor & Optimize</h3>
                  <p className="text-slate-300">
                    Continuous monitoring and optimization to maintain and improve rankings.
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
                Ready to Dominate Search Results?
              </h2>
              <p className="text-xl text-teal-100 mb-8">
                Let our Google-certified SEO experts help your business achieve higher rankings and increased organic traffic.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-teal-600 hover:bg-slate-100 px-8 py-3 rounded-full font-semibold transition-colors">
                  Get Free SEO Audit
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

export default SEOServices;