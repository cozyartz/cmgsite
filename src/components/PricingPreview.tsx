import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Star } from 'lucide-react';

const PricingPreview: React.FC = () => {
  const featuredPlans = [
    {
      id: 'growth',
      name: 'Growth',
      price: 1500,
      description: 'Most popular for growing businesses',
      features: [
        'Advanced SEO tools',
        'Bi-weekly reporting',
        'Priority support',
        '250 AI calls/month',
        '5 domains',
        'Competitor analysis'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 2500,
      description: 'Complete solution for large organizations',
      features: [
        'Full SEO suite',
        'Weekly reporting',
        'Dedicated account manager',
        '500 AI calls/month',
        '25 domains',
        'White-label options'
      ]
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-slate-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Enterprise-Grade SEO & AI Services
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Professional SEO and AI-powered solutions designed for businesses ready to scale. 
            Starting at $1,000/month with advanced features and dedicated support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {featuredPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-slate-900 rounded-2xl p-8 border-2 transition-all hover:shadow-xl ${
                plan.popular 
                  ? 'border-teal-500 ring-2 ring-teal-500/20' 
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-teal-400">${plan.price.toLocaleString()}</span>
                  <span className="text-slate-400 ml-2">/month</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-teal-400 mr-3 flex-shrink-0" />
                    <span className="text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/pricing"
                className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-teal-500 hover:bg-teal-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-600'
                }`}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/pricing"
            className="inline-flex items-center px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
          >
            View All Plans & Pricing
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <p className="text-slate-400 mt-4">
            6 plans available • Coupon codes accepted • 3-month prepayment discounts
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingPreview;