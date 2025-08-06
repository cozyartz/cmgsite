import React, { useEffect, useState } from 'react';
import { Search, TrendingUp, Target, Award, Globe, BarChart, CheckCircle, ArrowRight, Zap, Brain, Sparkles, Rocket, Users, FileText, Mail, RefreshCw, Bot, Shield, Star, Clock, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import Header from '../components/Header';
import LegalDisclaimer from '../components/legal/LegalDisclaimer';

const SEOServices = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pricingPlans = [
    {
      id: 'starter',
      name: 'Starter',
      price: billingCycle === 'monthly' ? 59 : 47.20,
      originalPrice: billingCycle === 'yearly' ? 59 : undefined,
      aiCredits: 250,
      features: [
        'AI Content Generator',
        'Basic Keyword Research', 
        'SEO Analytics',
        'Email Support',
        'Basic Templates',
        'Usage Tracking',
        'Up to 3 domains'
      ]
    },
    {
      id: 'growth',
      name: 'Growth',
      price: billingCycle === 'monthly' ? 99 : 79.20,
      originalPrice: billingCycle === 'yearly' ? 99 : undefined,
      aiCredits: 750,
      features: [
        'Everything in Starter',
        'Advanced AI Tools',
        'Real-time Analytics',
        'Priority Support',
        'Custom Templates',
        'Competitor Tracking',
        'Up to 10 domains',
        'API Access'
      ],
      popular: true
    },
    {
      id: 'professional',
      name: 'Professional',
      price: billingCycle === 'monthly' ? 199 : 159.20,
      originalPrice: billingCycle === 'yearly' ? 199 : undefined,
      aiCredits: 1500,
      features: [
        'Everything in Growth',
        'Professional SEO Suite',
        'Weekly Reporting',
        'Priority Support',
        'Advanced Analytics',
        'White-label Reporting',
        'Up to 25 domains',
        'Custom Integrations'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? 299 : 239.20,
      originalPrice: billingCycle === 'yearly' ? 299 : undefined,
      aiCredits: -1,
      features: [
        'Everything in Professional',
        'Unlimited AI Tools',
        'Custom Analytics Dashboard',
        'Dedicated Account Manager',
        'White-label Platform',
        'Monthly Strategy Calls',
        'Unlimited domains',
        'Enterprise API Access'
      ]
    }
  ];

  const handlePlanSelect = (planId: string) => {
    // Redirect to checkout page with selected plan
    navigate(`/checkout?tier=${planId}&billing=${billingCycle}`);
  };

  const handleBillingToggle = () => {
    setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly');
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
      
      <Header />
      
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
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500/20 to-blue-500/20 backdrop-blur-sm px-6 py-3 rounded-full border border-teal-500/30 mb-4">
                  <Zap className="h-5 w-5 text-teal-400" />
                  <span className="text-teal-300 font-semibold">NEW: AI-Powered SEO SaaS Platform</span>
                  <span className="bg-teal-500 text-white px-2 py-1 rounded-full text-xs font-bold">BETA</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm px-6 py-3 rounded-full border border-green-500/30 mb-6">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-green-300 font-bold">NO COMMITMENT • CANCEL ANYTIME</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-7xl font-bold text-white mb-6">
                <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Flexible SEO:</span>
                <span className="block bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">AI-Powered SEO</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed max-w-4xl mx-auto">
                Start boosting your search rankings today with our AI-powered SEO platform. <span className="text-green-400 font-semibold">No commitment required</span> - cancel anytime with one click.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button 
                  onClick={() => handlePlanSelect('growth')}
                  className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
                >
                  <Rocket className="h-5 w-5" />
                  Start Free Setup - $99/month
                </button>
                <button 
                  onClick={() => window.location.href = '/contact'}
                  className="border-2 border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-slate-900 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Award className="h-5 w-5" />
                  Professional SEO Services
                </button>
              </div>
              
              {/* Flexible Benefits */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto border border-green-500/30 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">Cancel Anytime</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">No Setup Fees</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">Monthly Billing</span>
                  </div>
                </div>
              </div>
              
              {/* Quick Results Banner */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
                  <div className="text-3xl font-bold text-teal-400 mb-1">150%</div>
                  <div className="text-slate-300 text-sm">Traffic Boost in 30 Days</div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
                  <div className="text-3xl font-bold text-blue-400 mb-1">500+</div>
                  <div className="text-slate-300 text-sm">Happy Customers</div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
                  <div className="text-3xl font-bold text-purple-400 mb-1">24/7</div>
                  <div className="text-slate-300 text-sm">AI-Powered Support</div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
                  <div className="text-3xl font-bold text-green-400 mb-1">1-Click</div>
                  <div className="text-slate-300 text-sm">Cancel Anytime</div>
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
                  Flexible SEO Plans - No Long-Term Commitment
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-6">
                  From self-service AI tools to full-service SEO management - cancel anytime, no commitment required.
                </p>
                
                {/* Billing Toggle */}
                <div className="flex items-center justify-center mb-8">
                  <div className="bg-slate-800 rounded-full p-1 border border-slate-700">
                    <button
                      onClick={handleBillingToggle}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        billingCycle === 'monthly'
                          ? 'bg-teal-500 text-white shadow-lg'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={handleBillingToggle}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        billingCycle === 'yearly'
                          ? 'bg-teal-500 text-white shadow-lg'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Yearly
                      <span className="ml-2 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                        Save 20%
                      </span>
                    </button>
                  </div>
                </div>
                
                <div className="inline-flex items-center space-x-2 bg-green-500/20 text-green-300 px-6 py-3 rounded-full text-sm font-medium border border-green-500/30 mb-4">
                  <span>✓ NO COMMITMENT</span>
                  <span>•</span>
                  <span>✓ CANCEL ANYTIME</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Starter Plan */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-teal-500/50 transition-all duration-300">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
                    <p className="text-slate-400 mb-4 text-sm">Perfect for small businesses</p>
                    {billingCycle === 'yearly' && pricingPlans[0].originalPrice && (
                      <div className="mb-2">
                        <span className="text-slate-500 line-through text-lg">${pricingPlans[0].originalPrice}</span>
                        <span className="ml-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">20% OFF</span>
                      </div>
                    )}
                    <div className="text-3xl font-bold text-teal-400 mb-2">${pricingPlans[0].price}<span className="text-lg text-slate-400">/{billingCycle === 'yearly' ? 'mo' : 'month'}</span></div>
                    {billingCycle === 'yearly' && <p className="text-xs text-slate-500 mb-2">Billed annually</p>}
                    <p className="text-slate-400 text-sm">{pricingPlans[0].aiCredits} AI credits included</p>
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
                  <div className="mb-3">
                    <p className="text-xs text-center text-slate-400">Cancel anytime • No commitment</p>
                  </div>
                  <button 
                    onClick={() => handlePlanSelect('starter')}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors text-sm"
                  >
                    Get Started
                  </button>
                </div>

                {/* Growth Plan */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border-2 border-teal-500 relative hover:border-teal-400 transition-all duration-300">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">POPULAR</span>
                  </div>
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">Growth</h3>
                    <p className="text-slate-400 mb-4 text-sm">Best for growing businesses</p>
                    {billingCycle === 'yearly' && pricingPlans[1].originalPrice && (
                      <div className="mb-2">
                        <span className="text-slate-500 line-through text-lg">${pricingPlans[1].originalPrice}</span>
                        <span className="ml-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">20% OFF</span>
                      </div>
                    )}
                    <div className="text-3xl font-bold text-teal-400 mb-2">${pricingPlans[1].price}<span className="text-lg text-slate-400">/{billingCycle === 'yearly' ? 'mo' : 'month'}</span></div>
                    {billingCycle === 'yearly' && <p className="text-xs text-slate-500 mb-2">Billed annually</p>}
                    <p className="text-slate-400 text-sm">{pricingPlans[1].aiCredits} AI credits included</p>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-400" />
                      <span className="text-slate-300 text-sm">Everything in Starter</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-400" />
                      <span className="text-slate-300 text-sm">Advanced AI Tools</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-400" />
                      <span className="text-slate-300 text-sm">Competitor Analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-400" />
                      <span className="text-slate-300 text-sm">Priority Support</span>
                    </li>
                  </ul>
                  <div className="mb-3">
                    <p className="text-xs text-center text-slate-400">Cancel anytime • No commitment</p>
                  </div>
                  <button 
                    onClick={() => handlePlanSelect('growth')}
                    className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 text-sm"
                  >
                    Get Started
                  </button>
                </div>

                {/* Professional Plan */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all duration-300">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">Professional</h3>
                    <p className="text-slate-400 mb-4 text-sm">For established businesses</p>
                    {billingCycle === 'yearly' && pricingPlans[2].originalPrice && (
                      <div className="mb-2">
                        <span className="text-slate-500 line-through text-lg">${pricingPlans[2].originalPrice}</span>
                        <span className="ml-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">20% OFF</span>
                      </div>
                    )}
                    <div className="text-3xl font-bold text-blue-400 mb-2">${pricingPlans[2].price}<span className="text-lg text-slate-400">/{billingCycle === 'yearly' ? 'mo' : 'month'}</span></div>
                    {billingCycle === 'yearly' && <p className="text-xs text-slate-500 mb-2">Billed annually</p>}
                    <p className="text-slate-400 text-sm">{pricingPlans[2].aiCredits} AI credits included</p>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-slate-300 text-sm">Everything in Growth</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-slate-300 text-sm">Professional SEO Suite</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-slate-300 text-sm">Weekly Reporting</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-slate-300 text-sm">Advanced Analytics</span>
                    </li>
                  </ul>
                  <div className="mb-3">
                    <p className="text-xs text-center text-slate-400">Cancel anytime • No commitment</p>
                  </div>
                  <button 
                    onClick={() => handlePlanSelect('professional')}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 text-sm"
                  >
                    Get Started
                  </button>
                </div>

                {/* Enterprise Plan */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-purple-500/50 transition-all duration-300">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
                    <p className="text-slate-400 mb-4 text-sm">For large organizations</p>
                    {billingCycle === 'yearly' && pricingPlans[3].originalPrice && (
                      <div className="mb-2">
                        <span className="text-slate-500 line-through text-lg">${pricingPlans[3].originalPrice}</span>
                        <span className="ml-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">20% OFF</span>
                      </div>
                    )}
                    <div className="text-3xl font-bold text-purple-400 mb-2">${pricingPlans[3].price}<span className="text-lg text-slate-400">/{billingCycle === 'yearly' ? 'mo' : 'month'}</span></div>
                    {billingCycle === 'yearly' && <p className="text-xs text-slate-500 mb-2">Billed annually</p>}
                    <p className="text-slate-400 text-sm">Unlimited AI credits</p>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-400" />
                      <span className="text-slate-300 text-sm">Everything in Professional</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-400" />
                      <span className="text-slate-300 text-sm">Unlimited AI Tools</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-400" />
                      <span className="text-slate-300 text-sm">Dedicated Manager</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-400" />
                      <span className="text-slate-300 text-sm">White-label Platform</span>
                    </li>
                  </ul>
                  <div className="mb-3">
                    <p className="text-xs text-center text-slate-400">Cancel anytime • No commitment</p>
                  </div>
                  <button 
                    onClick={() => handlePlanSelect('enterprise')}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 text-sm"
                  >
                    Get Started
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
                Join thousands of businesses already using our AI-powered SEO platform to dominate search results. Get started today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button 
                  onClick={() => handlePlanSelect('growth')}
                  className="bg-white text-purple-600 hover:bg-slate-100 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
                >
                  <Rocket className="h-5 w-5" />
                  Start Free Setup - $99/month
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
                  <div className="text-2xl font-bold text-white">Enterprise</div>
                  <div className="text-sm text-slate-200">Grade Platform</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">AI</div>
                  <div className="text-sm text-slate-200">Powered Tools</div>
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

    </>
  );
};

export default SEOServices;