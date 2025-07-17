import React, { useEffect, useState } from 'react';
import { Search, TrendingUp, Target, Award, Globe, BarChart, CheckCircle, ArrowRight, Zap, Brain, Sparkles, Rocket, Users, FileText, Mail, RefreshCw, Bot, Shield, Star, Clock, DollarSign, X } from 'lucide-react';
import SEO from '../components/SEO';
import LegalDisclaimer from '../components/legal/LegalDisclaimer';
import PayPalPayment from '../components/payment/PayPalPayment';

const SEOServices = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pricingPlans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 29,
      priceInCents: 2900,
      aiCredits: 100,
      features: [
        'AI Content Generator',
        'Basic Keyword Research',
        'SEO Analytics',
        'Email Support'
      ]
    },
    {
      id: 'growth',
      name: 'Growth',
      price: 99,
      priceInCents: 9900,
      aiCredits: 500,
      features: [
        'Everything in Starter',
        'Advanced Competitor Analysis',
        'Email Optimization Tools',
        'Priority Support',
        'Monthly SEO Consultation'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 299,
      priceInCents: 29900,
      aiCredits: 'unlimited',
      features: [
        'Everything in Growth',
        'White-label Solutions',
        'API Access',
        'Dedicated Account Manager',
        'Custom Integrations'
      ]
    }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (paymentResult: any) => {
    console.log('Payment successful:', paymentResult);
    setShowPayment(false);
    setSelectedPlan(null);
    // Redirect to client portal or success page
    window.location.href = '/client-portal';
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error);
    alert('Payment failed. Please try again.');
  };

  const getSelectedPlan = () => {
    return pricingPlans.find(plan => plan.id === selectedPlan);
  };

  return (
    <>
      <SEO
        title="AI-Powered SEO Platform | Revolutionary SEO SaaS Tools & Services"
        description="Experience the future of SEO with our AI-powered SaaS platform. Instant content generation, keyword research, competitor analysis, plus professional SEO services from Google-certified experts."
        keywords="AI SEO platform, SEO SaaS, AI content generation, automated SEO tools, keyword research AI, SEO automation, AI-powered SEO services, search engine optimization platform, SEO software"
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
          "AI-Powered SEO Platform",
          "SEO Content Generation",
          "Automated Keyword Research",
          "AI Competitor Analysis",
          "Email Optimization AI",
          "Professional SEO Services",
          "Local SEO Optimization",
          "Technical SEO Audits",
          "SEO Analytics Dashboard"
        ]}
        foundingDate="2016"
      />
      
      <div className="min-h-screen bg-slate-900">
        {/* Hero Section */}
        <section className="pt-24 pb-12 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
          </div>
          
          <div className="container mx-auto px-6 relative">
            <div className="max-w-6xl mx-auto text-center">
              <div className="mb-8">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="relative">
                    <Search className="h-16 w-16 text-teal-400" />
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full p-1">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <Bot className="h-16 w-16 text-blue-400" />
                  <Rocket className="h-16 w-16 text-purple-400" />
                </div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500/20 to-blue-500/20 backdrop-blur-sm px-6 py-3 rounded-full border border-teal-500/30 mb-6">
                  <Zap className="h-5 w-5 text-teal-400" />
                  <span className="text-teal-300 font-semibold">NEW: AI-Powered SEO SaaS Platform</span>
                  <span className="bg-teal-500 text-white px-2 py-1 rounded-full text-xs font-bold">BETA</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-7xl font-bold text-white mb-6">
                <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Revolutionary</span>
                <span className="block bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">AI-Powered SEO</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed max-w-4xl mx-auto">
                Experience the future of SEO with our cutting-edge AI SaaS platform. Get instant content generation, keyword research, competitor analysis, and professional SEO services all in one revolutionary solution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button 
                  onClick={() => handlePlanSelect('growth')}
                  className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
                >
                  <Rocket className="h-5 w-5" />
                  Try AI Platform FREE
                </button>
                <button 
                  onClick={() => window.location.href = '/contact'}
                  className="border-2 border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-slate-900 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Award className="h-5 w-5" />
                  Professional SEO Services
                </button>
              </div>
              
              {/* Stats Banner */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
                  <div className="text-3xl font-bold text-teal-400 mb-1">10K+</div>
                  <div className="text-slate-300 text-sm">AI Content Generated</div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
                  <div className="text-3xl font-bold text-blue-400 mb-1">500+</div>
                  <div className="text-slate-300 text-sm">Active Users</div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
                  <div className="text-3xl font-bold text-purple-400 mb-1">99.9%</div>
                  <div className="text-slate-300 text-sm">Uptime</div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
                  <div className="text-3xl font-bold text-green-400 mb-1">8 Years</div>
                  <div className="text-slate-300 text-sm">SEO Experience</div>
                </div>
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

        {/* AI SaaS Platform Features */}
        <section className="py-20 bg-slate-900 relative">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500/20 to-blue-500/20 backdrop-blur-sm px-6 py-3 rounded-full border border-teal-500/30 mb-6">
                  <Brain className="h-5 w-5 text-teal-400" />
                  <span className="text-teal-300 font-semibold">AI-Powered SaaS Platform</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  <span className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">Revolutionary</span> SEO Tools
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  Harness the power of advanced AI to generate SEO content, research keywords, and optimize your digital presence in seconds, not hours.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 hover:from-slate-700 hover:to-slate-800 transition-all duration-300 border border-slate-700/50 hover:border-teal-500/50 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg group-hover:scale-110 transition-transform">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-teal-400" />
                      <span className="text-teal-400 text-sm font-medium">AI-Powered</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Content Generator</h3>
                  <p className="text-slate-300 mb-4">
                    Generate SEO-optimized blog posts, meta descriptions, and social media content instantly with our advanced AI.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Clock className="h-4 w-4" />
                    <span>Instant generation</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 hover:from-slate-700 hover:to-slate-800 transition-all duration-300 border border-slate-700/50 hover:border-blue-500/50 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg group-hover:scale-110 transition-transform">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-blue-400" />
                      <span className="text-blue-400 text-sm font-medium">Smart Research</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Keyword Research</h3>
                  <p className="text-slate-300 mb-4">
                    Discover high-value keywords and long-tail opportunities with AI-powered research and competitive analysis.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <TrendingUp className="h-4 w-4" />
                    <span>Real-time insights</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 hover:from-slate-700 hover:to-slate-800 transition-all duration-300 border border-slate-700/50 hover:border-purple-500/50 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg group-hover:scale-110 transition-transform">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-purple-400" />
                      <span className="text-purple-400 text-sm font-medium">Competitive Edge</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Competitor Analysis</h3>
                  <p className="text-slate-300 mb-4">
                    Analyze competitor strategies and find content gaps to dominate your market with AI-driven insights.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <BarChart className="h-4 w-4" />
                    <span>Deep analysis</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 hover:from-slate-700 hover:to-slate-800 transition-all duration-300 border border-slate-700/50 hover:border-green-500/50 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg group-hover:scale-110 transition-transform">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 text-sm font-medium">High-Converting</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Email Optimizer</h3>
                  <p className="text-slate-300 mb-4">
                    Create compelling email campaigns and subject lines that drive engagement and conversions.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <RefreshCw className="h-4 w-4" />
                    <span>A/B test ready</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 hover:from-slate-700 hover:to-slate-800 transition-all duration-300 border border-slate-700/50 hover:border-orange-500/50 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg group-hover:scale-110 transition-transform">
                      <BarChart className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-orange-400" />
                      <span className="text-orange-400 text-sm font-medium">Real-time</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Analytics Dashboard</h3>
                  <p className="text-slate-300 mb-4">
                    Track your SEO performance with comprehensive analytics and AI-powered insights.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <TrendingUp className="h-4 w-4" />
                    <span>Live monitoring</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 hover:from-slate-700 hover:to-slate-800 transition-all duration-300 border border-slate-700/50 hover:border-indigo-500/50 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg group-hover:scale-110 transition-transform">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-indigo-400" />
                      <span className="text-indigo-400 text-sm font-medium">Local Focus</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Local SEO Tools</h3>
                  <p className="text-slate-300 mb-4">
                    Dominate local search results with AI-powered local SEO optimization and Google My Business tools.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Target className="h-4 w-4" />
                    <span>Local dominance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-gradient-to-br from-slate-800 to-slate-900">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Choose Your SEO Solution
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  From self-service AI tools to full-service SEO management, we have the perfect solution for your needs.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Starter Plan */}
                <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 hover:border-teal-500/50 transition-all duration-300">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
                    <p className="text-slate-400 mb-4">Perfect for small businesses</p>
                    <div className="text-4xl font-bold text-teal-400 mb-2">$29<span className="text-xl text-slate-400">/month</span></div>
                    <p className="text-slate-400">100 AI credits included</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-teal-400" />
                      <span className="text-slate-300">AI Content Generator</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-teal-400" />
                      <span className="text-slate-300">Basic Keyword Research</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-teal-400" />
                      <span className="text-slate-300">SEO Analytics</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-teal-400" />
                      <span className="text-slate-300">Email Support</span>
                    </li>
                  </ul>
                  <button 
                    onClick={() => handlePlanSelect('starter')}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                  >
                    Start Free Trial
                  </button>
                </div>

                {/* Growth Plan */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border-2 border-teal-500 relative hover:border-teal-400 transition-all duration-300">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">MOST POPULAR</span>
                  </div>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Growth</h3>
                    <p className="text-slate-400 mb-4">Best for growing businesses</p>
                    <div className="text-4xl font-bold text-teal-400 mb-2">$99<span className="text-xl text-slate-400">/month</span></div>
                    <p className="text-slate-400">500 AI credits included</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-teal-400" />
                      <span className="text-slate-300">Everything in Starter</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-teal-400" />
                      <span className="text-slate-300">Advanced Competitor Analysis</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-teal-400" />
                      <span className="text-slate-300">Email Optimization Tools</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-teal-400" />
                      <span className="text-slate-300">Priority Support</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-teal-400" />
                      <span className="text-slate-300">Monthly SEO Consultation</span>
                    </li>
                  </ul>
                  <button 
                    onClick={() => handlePlanSelect('growth')}
                    className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300"
                  >
                    Start Free Trial
                  </button>
                </div>

                {/* Enterprise Plan */}
                <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 hover:border-purple-500/50 transition-all duration-300">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                    <p className="text-slate-400 mb-4">For large organizations</p>
                    <div className="text-4xl font-bold text-purple-400 mb-2">$299<span className="text-xl text-slate-400">/month</span></div>
                    <p className="text-slate-400">Unlimited AI credits</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-purple-400" />
                      <span className="text-slate-300">Everything in Growth</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-purple-400" />
                      <span className="text-slate-300">White-label Solutions</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-purple-400" />
                      <span className="text-slate-300">API Access</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-purple-400" />
                      <span className="text-slate-300">Dedicated Account Manager</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-purple-400" />
                      <span className="text-slate-300">Custom Integrations</span>
                    </li>
                  </ul>
                  <button 
                    onClick={() => handlePlanSelect('enterprise')}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300"
                  >
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Traditional SEO Services */}
        <section className="py-20 bg-slate-900">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Professional SEO Services
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  Need hands-off SEO management? Our Google-certified experts provide comprehensive SEO services to drive organic growth.
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
                      <p className="text-slate-300">Help increase organic traffic significantly</p>
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
        <section className="py-20 bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-6 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Rocket className="h-12 w-12 text-white" />
                  <Target className="h-12 w-12 text-white" />
                  <Zap className="h-12 w-12 text-white" />
                </div>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Revolutionize</span> Your SEO?
              </h2>
              <p className="text-xl text-slate-100 mb-8 max-w-3xl mx-auto">
                Join thousands of businesses already using our AI-powered SEO platform to dominate search results. Start your free trial today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button 
                  onClick={() => handlePlanSelect('growth')}
                  className="bg-white text-purple-600 hover:bg-slate-100 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
                >
                  <Rocket className="h-5 w-5" />
                  Try AI Platform FREE
                </button>
                <button 
                  onClick={() => window.location.href = '/contact'}
                  className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Award className="h-5 w-5" />
                  Get Professional SEO
                </button>
              </div>
              
              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">30-Day</div>
                  <div className="text-sm text-slate-200">Free Trial</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">No</div>
                  <div className="text-sm text-slate-200">Credit Card</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-sm text-slate-200">Support</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div className="text-sm text-slate-200">Uptime</div>
                </div>
              </div>
              
              {/* Legal Disclaimer */}
              <div className="max-w-2xl mx-auto mt-12">
                <LegalDisclaimer type="results" />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* PayPal Payment Modal */}
      {showPayment && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Complete Your Purchase
                </h2>
                <button
                  onClick={() => setShowPayment(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {getSelectedPlan() && (
                <div className="mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {getSelectedPlan()?.name} Plan
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>AI Credits: {getSelectedPlan()?.aiCredits}</p>
                      <p>Monthly billing</p>
                      <p className="font-semibold text-lg text-gray-900">
                        ${getSelectedPlan()?.price}/month
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <PayPalPayment
                amount={getSelectedPlan()?.priceInCents || 0}
                description={`${getSelectedPlan()?.name} Plan - Monthly Subscription`}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                subscriptionPlan={selectedPlan}
                tier={selectedPlan}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SEOServices;