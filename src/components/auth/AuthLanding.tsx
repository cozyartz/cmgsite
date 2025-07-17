import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Shield, Zap, CheckCircle, Star, ArrowRight, Play, Users, BarChart3, Clock, Target, Rocket, Award } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import LegalDisclaimer from '../legal/LegalDisclaimer';

const AuthLanding: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [animatedNumbers, setAnimatedNumbers] = useState({
    clients: 0,
    growth: 0,
    saved: 0
  });

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Director",
      company: "TechCorp Solutions",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b9c04ac4?w=64&h=64&fit=crop&crop=face",
      quote: "We achieved significant organic traffic growth in just 3 months. The AI tools are absolutely game-changing for our SEO strategy. Results may vary.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "CEO",
      company: "Growth Dynamics",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      quote: "The consultation insights alone saved us $50K in ad spend. This platform pays for itself within weeks.",
      rating: 5
    },
    {
      name: "Jennifer Walsh",
      role: "VP Marketing",
      company: "InnovateTech",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      quote: "Finally, an SEO platform that actually understands our business. The partnership development features are incredible.",
      rating: 5
    }
  ];

  const features = [
    {
      icon: TrendingUp,
      title: "Significant SEO Growth",
      description: "Our AI-powered platform delivers measurable results with advanced keyword tracking and content optimization.",
      color: "from-green-400 to-emerald-600"
    },
    {
      icon: Zap,
      title: "AI Content Generation",
      description: "Create high-converting content in seconds with our trained AI models specialized for SEO and partnerships.",
      color: "from-yellow-400 to-orange-600"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with SOC 2 compliance, 256-bit SSL encryption, and multi-factor authentication.",
      color: "from-blue-400 to-cyan-600"
    },
    {
      icon: Target,
      title: "Partnership Development",
      description: "Connect with Fortune 500 companies and scale your business through strategic partnership opportunities.",
      color: "from-purple-400 to-pink-600"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Monitor your SEO performance with live data, custom dashboards, and actionable insights.",
      color: "from-teal-400 to-blue-600"
    },
    {
      icon: Users,
      title: "Expert Consultations",
      description: "Get personalized guidance from our team of SEO experts and partnership development specialists.",
      color: "from-indigo-400 to-purple-600"
    }
  ];

  useEffect(() => {
    const testimonialTimer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(testimonialTimer);
  }, [testimonials.length]);

  useEffect(() => {
    const animateNumbers = () => {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;
      
      const targets = { clients: 500, growth: 300, saved: 40 };
      
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        setAnimatedNumbers({
          clients: Math.floor(targets.clients * easeOut),
          growth: Math.floor(targets.growth * easeOut),
          saved: Math.floor(targets.saved * easeOut)
        });
        
        if (step >= steps) {
          clearInterval(timer);
        }
      }, stepDuration);
    };

    const timeout = setTimeout(animateNumbers, 500);
    return () => clearTimeout(timeout);
  }, []);

  const toggleTab = (tab: 'login' | 'register') => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        <div className="relative container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 px-6 py-3 rounded-full mb-8">
              <Sparkles className="h-5 w-5 text-teal-400" />
              <span className="text-teal-400 font-medium">Trusted by 500+ Fortune 500 Companies</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
              Transform Your
              <span className="block bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                SEO Strategy
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Join thousands of businesses using our AI-powered SEO platform to scale their organic growth,
              develop strategic partnerships, and compete effectively in their market.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
              <div className="text-center">
                <div className="text-5xl font-bold text-green-400 mb-2">
                  {animatedNumbers.clients}+
                </div>
                <div className="text-slate-400">Active Clients</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-teal-400 mb-2">
                  {animatedNumbers.growth}%
                </div>
                <div className="text-slate-400">Average Growth</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-400 mb-2">
                  {animatedNumbers.saved}hrs
                </div>
                <div className="text-slate-400">Saved Monthly</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={() => setActiveTab('register')}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Rocket className="h-5 w-5" />
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <button className="flex items-center gap-2 px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors">
                <Play className="h-5 w-5" />
                Watch Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 text-slate-400 mb-16">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>SOC 2 Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                <span>G2 Leader</span>
              </div>
            </div>
          </div>

          {/* Auth Forms */}
          <div className="max-w-7xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-slate-800 rounded-lg p-2 flex">
                <button
                  onClick={() => toggleTab('register')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'register'
                      ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Start Free Trial
                </button>
                <button
                  onClick={() => toggleTab('login')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'login'
                      ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="transition-all duration-300">
              {activeTab === 'register' ? (
                <RegisterForm onToggleMode={() => setActiveTab('login')} />
              ) : (
                <LoginForm onToggleMode={() => setActiveTab('register')} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to <span className="text-teal-400">Scale</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Our comprehensive platform combines AI-powered SEO tools, partnership development, 
              and expert consultations to grow your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="group bg-slate-800 rounded-xl p-6 hover:bg-slate-700 transition-all duration-300 transform hover:scale-105"
                >
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-300 group-hover:text-white transition-colors">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by <span className="text-teal-400">Industry Leaders</span>
            </h2>
            <p className="text-xl text-slate-300">
              See what our clients are saying about their results
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800 rounded-xl p-8 relative overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 ${
                    index === currentTestimonial ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-8 absolute inset-0 p-8'
                  }`}
                >
                  <div className="flex items-center mb-6">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-bold text-white text-lg">{testimonial.name}</div>
                      <div className="text-slate-400">{testimonial.role}</div>
                      <div className="text-teal-400 text-sm">{testimonial.company}</div>
                    </div>
                    <div className="ml-auto flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <blockquote className="text-slate-300 text-lg italic">
                    "{testimonial.quote}"
                  </blockquote>
                </div>
              ))}
            </div>

            {/* Testimonial Navigation */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentTestimonial ? 'bg-teal-400' : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
            
            {/* Legal Disclaimers */}
            <div className="max-w-4xl mx-auto mt-16 space-y-4">
              <LegalDisclaimer type="testimonials" />
              <LegalDisclaimer type="results" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLanding;