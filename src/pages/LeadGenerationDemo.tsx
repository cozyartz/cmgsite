import React, { useState } from 'react';
import { Users, MessageCircle, BarChart3, Bot, CheckCircle, Target, TrendingUp } from 'lucide-react';
import AIAssistant from '../components/support/AIAssistant';
import LeadCapture from '../components/lead/LeadCapture';
import { useLeadTracking } from '../hooks/useLeadTracking';

const LeadGenerationDemo: React.FC = () => {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [activeDemo, setActiveDemo] = useState<'chatbot' | 'form' | 'analytics'>('chatbot');
  
  const leadTracking = useLeadTracking({
    enableTracking: true,
    context: 'sales',
    autoQualifyThreshold: 40
  });

  const handleLeadSubmit = async (leadData: any) => {
    console.log('Demo lead submitted:', leadData);
    leadTracking.updateLeadData(leadData);
    
    // In production, this would create the lead in Breakcold
    const result = await leadTracking.createLead();
    console.log('Lead creation result:', result);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Bot className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">
              AI-Powered Lead Generation & CRM Integration
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Experience our Breakcold CRM integration with intelligent lead capture, 
              qualification, and automated follow-up workflows.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveDemo('chatbot')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeDemo === 'chatbot'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageCircle className="w-4 h-4 inline mr-2" />
              AI Chatbot Demo
            </button>
            <button
              onClick={() => setActiveDemo('form')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeDemo === 'form'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Lead Capture Form
            </button>
            <button
              onClick={() => setActiveDemo('analytics')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeDemo === 'analytics'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Analytics Dashboard
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Chatbot Demo */}
        {activeDemo === 'chatbot' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                AI-Powered Sales Assistant
              </h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Features:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <strong>Smart Lead Scoring:</strong> Automatically scores leads based on conversation content and engagement
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <strong>Automatic Data Extraction:</strong> Extracts contact info, company details, and project requirements
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <strong>CRM Integration:</strong> Instantly creates or updates leads in Breakcold CRM
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <strong>Contextual Responses:</strong> Tailored conversations based on visitor intent and source
                    </div>
                  </li>
                </ul>
                
                <div className="mt-6 p-4 bg-teal-50 rounded-lg">
                  <h4 className="font-semibold text-teal-800 mb-2">Current Session:</h4>
                  <div className="text-sm space-y-1">
                    <div>Lead Score: <span className="font-mono">{leadTracking.leadScore}/100</span></div>
                    <div>Qualified: <span className={leadTracking.isQualified ? 'text-green-600' : 'text-red-600'}>
                      {leadTracking.isQualified ? 'Yes' : 'No'}
                    </span></div>
                    <div>Messages: <span className="font-mono">{leadTracking.conversationHistory.length}</span></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Try the AI Assistant</h3>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-gray-600 mb-4">
                  Click the chat button to start a conversation and see the lead scoring in action!
                </p>
                <div className="text-sm text-gray-500">
                  Try asking about services, pricing, or sharing your project details.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Demo */}
        {activeDemo === 'form' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Advanced Lead Capture Form
              </h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Form Features:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Target className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <strong>Progressive Profiling:</strong> Collects increasingly detailed information across interactions
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Target className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <strong>Smart Validation:</strong> Real-time validation with helpful error messages
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Target className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <strong>Interest Categorization:</strong> Automatically routes leads to appropriate sales team
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Target className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <strong>Multi-Context Support:</strong> Works as modal, inline form, or embedded widget
                    </div>
                  </li>
                </ul>
                
                <button
                  onClick={() => setShowLeadForm(true)}
                  className="mt-6 w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Try Lead Capture Form
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Form Preview</h3>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <LeadCapture
                  isOpen={true}
                  onClose={() => {}}
                  onSubmit={handleLeadSubmit}
                  context="form"
                  title="Get Started Today"
                  description="Tell us about your project and we'll provide a custom quote within 24 hours."
                />
              </div>
            </div>
          </div>
        )}

        {/* Analytics Demo */}
        {activeDemo === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Lead Generation Analytics
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Leads</p>
                    <p className="text-2xl font-bold text-gray-900">147</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-gray-900">23</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Target className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Qualification Rate</p>
                    <p className="text-2xl font-bold text-gray-900">81%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg. Score</p>
                    <p className="text-2xl font-bold text-gray-900">65.2</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Top Lead Sources</h3>
                <div className="space-y-3">
                  {[
                    { source: 'Website Chatbot', count: 45, percentage: 30.6 },
                    { source: 'Contact Form', count: 32, percentage: 21.8 },
                    { source: 'Social Media', count: 28, percentage: 19.0 },
                    { source: 'Referral', count: 25, percentage: 17.0 }
                  ].map((item) => (
                    <div key={item.source} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{item.source}</span>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-teal-500 h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Interest Categories</h3>
                <div className="space-y-3">
                  {[
                    { interest: 'Web Design', count: 52, percentage: 35.4 },
                    { interest: 'SEO Services', count: 38, percentage: 25.9 },
                    { interest: 'AI Integration', count: 28, percentage: 19.0 },
                    { interest: 'Digital Marketing', count: 19, percentage: 12.9 }
                  ].map((item) => (
                    <div key={item.interest} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{item.interest}</span>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Assistant - Always available */}
      <AIAssistant 
        context="sales"
        enableLeadCapture={true}
      />

      {/* Lead Form Modal */}
      <LeadCapture
        isOpen={showLeadForm}
        onClose={() => setShowLeadForm(false)}
        onSubmit={handleLeadSubmit}
        context="popup"
        title="Start Your Project"
        description="Ready to transform your business with our services? Let's discuss your needs!"
      />
    </div>
  );
};

export default LeadGenerationDemo;