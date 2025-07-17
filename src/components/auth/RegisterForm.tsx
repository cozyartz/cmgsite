import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Github, Chrome, Mail, Eye, EyeOff, User, ArrowRight, Sparkles, TrendingUp, Shield, Zap, CheckCircle, Star } from 'lucide-react';

interface RegisterFormProps {
  onToggleMode: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const { register, login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [animationStep, setAnimationStep] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/)) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'bg-red-500';
    if (passwordStrength < 50) return 'bg-orange-500';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const benefits = [
    { icon: TrendingUp, text: 'Boost SEO rankings significantly', highlight: 'significantly' },
    { icon: Zap, text: 'AI-powered content generation', highlight: 'AI-powered' },
    { icon: Shield, text: 'Enterprise-grade security', highlight: 'Enterprise-grade' },
    { icon: Sparkles, text: 'Automated keyword research', highlight: 'Automated' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      await register(formData.email, formData.password, formData.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    setLoading(true);
    setError('');
    
    try {
      await login(provider);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OAuth login failed');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Benefits & Social Proof */}
        <div className="hidden lg:block space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-teal-500/10 px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-4 w-4 text-teal-400" />
              <span className="text-teal-400 font-medium">Trusted by 500+ Businesses</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Transform Your SEO
              <span className="block text-teal-400">In 30 Days</span>
            </h1>
            <p className="text-slate-300 text-lg">
              Join Fortune 500 companies using our AI-powered SEO platform
            </p>
          </div>

          {/* Animated Benefits */}
          <div className="space-y-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div 
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-500 ${
                    animationStep === index ? 'bg-teal-500/10 border border-teal-500/20 scale-105' : 'bg-slate-800/50'
                  }`}
                >
                  <div className="p-2 bg-teal-500/20 rounded-lg">
                    <Icon className="h-6 w-6 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {benefit.text.split(benefit.highlight)[0]}
                      <span className="text-teal-400">{benefit.highlight}</span>
                      {benefit.text.split(benefit.highlight)[1]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Social Proof */}
          <div className="bg-slate-800/50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
              <span className="text-white font-medium ml-2">4.9/5</span>
            </div>
            <blockquote className="text-slate-300 italic">
              "Achieved significant organic traffic growth in just 3 months. The AI tools are game-changing. Results may vary."
            </blockquote>
            <p className="text-slate-400 mt-2">— Sarah Chen, Marketing Director at TechCorp</p>
          </div>
        </div>

        {/* Right side - Registration Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className="bg-slate-800 rounded-xl p-8 shadow-2xl border border-slate-700">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 p-3 rounded-full mb-4">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Start Your Journey</h2>
              <p className="text-slate-300">Join thousands of businesses growing with AI-powered SEO</p>
              <div className="flex items-center justify-center gap-4 mt-4 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Free 14-day trial</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleOAuthLogin('github')}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <Github className="h-5 w-5" />
            Continue with GitHub
          </button>
          
          <button
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <Chrome className="h-5 w-5" />
            Continue with Google
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-slate-800 px-2 text-slate-400">or</span>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                value={formData.password}
                onChange={handlePasswordChange}
                required
                className="w-full pl-4 pr-10 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 bg-slate-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400">
                    {passwordStrength < 25 ? 'Weak' : passwordStrength < 50 ? 'Fair' : passwordStrength < 75 ? 'Good' : 'Strong'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-lg font-bold text-lg transition-all duration-200 disabled:opacity-50 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                <span>Creating Your Account...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Start Free Trial</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>

          {/* Trust Indicators */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <div className="flex items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>SOC 2 Certified</span>
              </div>
            </div>
          </div>
        </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400">
                Already have an account?{' '}
                <button
                  onClick={onToggleMode}
                  className="text-teal-400 hover:text-teal-300 font-medium transition-colors"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;