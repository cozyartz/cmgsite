import React from 'react';
import { AlertTriangle, Shield, FileText } from 'lucide-react';

interface LegalDisclaimerProps {
  type?: 'results' | 'general' | 'testimonials' | 'pricing';
  className?: string;
}

const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({ type = 'general', className = '' }) => {
  const getDisclaimerContent = () => {
    switch (type) {
      case 'results':
        return {
          icon: AlertTriangle,
          title: 'Results Disclaimer',
          content: 'Results may vary. Past performance does not guarantee future results. SEO and marketing outcomes depend on many factors including market conditions, competition, and implementation quality.',
          color: 'text-yellow-400'
        };
      
      case 'testimonials':
        return {
          icon: Shield,
          title: 'Testimonial Disclaimer',
          content: 'Testimonials are from real clients but results are not typical. Individual results will vary based on business model, market conditions, and effort invested.',
          color: 'text-blue-400'
        };
      
      case 'pricing':
        return {
          icon: FileText,
          title: 'Pricing Disclaimer',
          content: 'Pricing subject to change. Additional fees may apply for custom work or overages. See Terms of Service for complete pricing details.',
          color: 'text-purple-400'
        };
      
      default:
        return {
          icon: AlertTriangle,
          title: 'Legal Disclaimer',
          content: 'This website and its services are provided "as is" without warranties. Results may vary and are not guaranteed. Please review our Terms of Service and Privacy Policy.',
          color: 'text-orange-400'
        };
    }
  };

  const disclaimer = getDisclaimerContent();
  const Icon = disclaimer.icon;

  return (
    <div className={`bg-slate-800 border border-slate-600 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 ${disclaimer.color} mt-0.5 flex-shrink-0`} />
        <div>
          <h4 className="text-white font-medium text-sm mb-1">{disclaimer.title}</h4>
          <p className="text-slate-300 text-xs leading-relaxed">{disclaimer.content}</p>
        </div>
      </div>
    </div>
  );
};

export default LegalDisclaimer;