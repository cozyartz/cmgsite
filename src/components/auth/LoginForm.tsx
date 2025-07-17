import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Github, Chrome, Mail, Eye, EyeOff, ArrowRight, Sparkles, TrendingUp, Shield, Zap, CheckCircle, Star, BarChart3, Users, Clock } from 'lucide-react';

interface LoginFormProps {
  onToggleMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { icon: TrendingUp, label: 'Client Success Rate', value: '95%', color: 'text-green-400' },
    { icon: Users, label: 'Active Clients', value: '500+', color: 'text-blue-400' },
    { icon: Clock, label: 'Time Saved Monthly', value: '40hrs', color: 'text-purple-400' }
  ];

  const features = [
    { icon: BarChart3, text: 'Real-time SEO analytics & insights' },
    { icon: Zap, text: 'AI-powered content optimization' },
    { icon: Shield, text: 'Enterprise-grade security & compliance' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login('email', formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
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
        {/* Left side - Welcome Back & Stats */}
        <div className="hidden lg:block space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full mb-4">
              <Shield className="h-4 w-4 text-blue-400" />
              <span className="text-blue-400 font-medium">Secure Client Portal</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome Back
              <span className="block text-blue-400">To Your Dashboard</span>
            </h1>
            <p className="text-slate-300 text-lg">
              Continue managing your SEO campaigns and growing your business
            </p>
          </div>

          {/* Animated Stats */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className={`text-center p-4 rounded-lg transition-all duration-500 ${
                    animationStep === index ? 'bg-slate-700 border border-slate-600 scale-105' : 'bg-slate-800/50'
                  }`}
                >
                  <div className="flex justify-center mb-2">
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-slate-400">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
                  <div className="p-2 bg-teal-500/20 rounded-lg">
                    <Icon className="h-5 w-5 text-teal-400" />
                  </div>
                  <p className="text-slate-300">{feature.text}</p>
                </div>
              );
            })}
          </div>

          {/* Quick Access */}
          <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-teal-400" />
              <span className="text-teal-400 font-medium">Quick Access</span>
            </div>
            <p className="text-slate-300 mb-4">
              Jump straight to your dashboard after login to view your latest SEO performance metrics.
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Real-time data</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>AI insights</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className="bg-slate-800 rounded-xl p-8 shadow-2xl border border-slate-700">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-500 p-3 rounded-full mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-slate-300">Sign in to your SEO command center</p>
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

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                onChange={handleChange}
                required
                className="w-full pl-4 pr-10 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-lg font-bold text-lg transition-all duration-200 disabled:opacity-50 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                <span>Signing you in...</span>
              </>
            ) : (
              <>
                <Shield className="h-5 w-5" />
                <span>Access Dashboard</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>

          {/* Trust Indicators */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <div className="flex items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span>256-bit SSL</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>SOC 2 Certified</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>
        </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400">
                Don't have an account?{' '}
                <button
                  onClick={onToggleMode}
                  className="text-teal-400 hover:text-teal-300 font-medium transition-colors"
                >
                  Start free trial
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;