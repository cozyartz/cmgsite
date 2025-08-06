import React from 'react';
import { Shield, Eye, Bot, Globe, Lock, Users } from 'lucide-react';

const PrivacyPolicyContent: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 prose prose-lg">
      {/* Header */}
      <div className="text-center mb-12 not-prose">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-teal-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        </div>
        <p className="text-lg text-gray-600 mb-4">
          Your privacy is important to us. This policy explains how we collect, use, and protect your information.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            <Globe className="w-4 h-4" />
            GDPR Compliant
          </div>
          <div className="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full">
            <Shield className="w-4 h-4" />
            CCPA Compliant
          </div>
          <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
            <Bot className="w-4 h-4" />
            AI Act 2025
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          <strong>Effective Date:</strong> January 1, 2025 • <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* 1. Information We Collect */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-4">
          <Eye className="w-6 h-6 text-teal-600" />
          1. Information We Collect
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">1.1 Information You Provide Directly</h3>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Contact Information:</strong> Name, email address, phone number, company details</li>
          <li><strong>Service Inquiries:</strong> Project details, budget range, timeline preferences</li>
          <li><strong>AI Chat Data:</strong> Messages you send to our AI chatbot system</li>
          <li><strong>Account Information:</strong> Login credentials, preferences, profile data</li>
          <li><strong>Communication Records:</strong> Email correspondence, consultation notes</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">1.2 Information Collected Automatically</h3>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Technical Data:</strong> IP address, browser type, device information, operating system</li>
          <li><strong>Usage Analytics:</strong> Pages visited, time spent, click patterns, referral sources</li>
          <li><strong>AI Interaction Data:</strong> Conversation metadata, intent analysis, sentiment scores</li>
          <li><strong>Performance Data:</strong> Page load times, error logs, system diagnostics</li>
          <li><strong>Location Data:</strong> Country and region (for compliance and localization)</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">1.3 Cookies and Tracking Technologies</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-blue-900 mb-2">Cookie Categories:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li><strong>Strictly Necessary:</strong> Essential website functionality, security, basic AI features</li>
            <li><strong>Analytics:</strong> Google Analytics, AI performance metrics, usage patterns</li>
            <li><strong>Marketing:</strong> Advertising cookies, social media pixels, remarketing tags</li>
            <li><strong>Functional:</strong> Language preferences, personalization, enhanced AI features</li>
          </ul>
        </div>
      </section>

      {/* 2. AI Technology and Data Processing */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-4">
          <Bot className="w-6 h-6 text-teal-600" />
          2. AI Technology and Data Processing
        </h2>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-amber-900 mb-2">
            <Bot className="w-5 h-5" />
            EU AI Act 2025 Disclosure
          </h3>
          <p className="text-amber-800">
            Our website uses artificial intelligence systems for customer service and lead qualification. 
            When you interact with our chatbot, you are communicating with AI technology powered by 
            Cloudflare Workers AI. Human assistance is always available upon request.
          </p>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 AI Systems We Use</h3>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Chatbot AI:</strong> Llama 3.3 70B and Llama 3.1 8B models for customer service</li>
          <li><strong>Intent Classification:</strong> Automatic detection of user inquiries and needs</li>
          <li><strong>Sentiment Analysis:</strong> Understanding emotional context of conversations</li>
          <li><strong>Lead Scoring:</strong> AI-powered qualification of potential customers</li>
          <li><strong>Content Generation:</strong> AI-assisted responses and suggestions</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 How AI Processes Your Data</h3>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Real-time Processing:</strong> Messages analyzed immediately for intent and sentiment</li>
          <li><strong>Conversation Memory:</strong> Session data stored for 24 hours (with consent)</li>
          <li><strong>Model Training:</strong> Aggregate conversation patterns (no personal data)</li>
          <li><strong>Quality Improvement:</strong> AI responses evaluated for accuracy and helpfulness</li>
          <li><strong>Security Filtering:</strong> Automated detection and prevention of inappropriate requests</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 AI Data Security</h3>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Encryption:</strong> All AI conversation data encrypted in transit and at rest</li>
          <li><strong>Access Controls:</strong> Limited AI model access with authentication</li>
          <li><strong>Content Filtering:</strong> Automatic removal of sensitive information</li>
          <li><strong>Audit Logging:</strong> All AI interactions logged for security and compliance</li>
        </ul>
      </section>

      {/* 3. How We Use Your Information */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-4">
          <Users className="w-6 h-6 text-teal-600" />
          3. How We Use Your Information
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Business Operations</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide and improve our web design, SEO, and digital marketing services</li>
          <li>Process service inquiries and generate project proposals</li>
          <li>Communicate about projects, updates, and support</li>
          <li>Manage client accounts and billing</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 AI Enhancement and Personalization</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Improve chatbot responses and accuracy</li>
          <li>Personalize user experience based on preferences</li>
          <li>Analyze conversation patterns for service improvement</li>
          <li>Provide contextual recommendations and suggestions</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 Marketing and Communication</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Send service-related updates and newsletters (with consent)</li>
          <li>Display relevant advertisements and content</li>
          <li>Conduct market research and gather feedback</li>
          <li>Promote our services through various channels</li>
        </ul>
      </section>

      {/* 4. Legal Basis for Processing */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Legal Basis for Processing (GDPR)</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Data Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Legal Basis</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm">Contact Information</td>
                <td className="px-4 py-3 text-sm">Legitimate Interest</td>
                <td className="px-4 py-3 text-sm">Service provision and communication</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm">AI Chat Data</td>
                <td className="px-4 py-3 text-sm">Consent</td>
                <td className="px-4 py-3 text-sm">Chatbot functionality and improvement</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm">Analytics Cookies</td>
                <td className="px-4 py-3 text-sm">Consent</td>
                <td className="px-4 py-3 text-sm">Website optimization and performance</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm">Marketing Data</td>
                <td className="px-4 py-3 text-sm">Consent</td>
                <td className="px-4 py-3 text-sm">Promotional communications and ads</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Data Sharing and Third Parties */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Sharing and Third Parties</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Service Providers</h3>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Cloudflare:</strong> AI processing, CDN, security (US company with adequate protections)</li>
          <li><strong>Google Analytics:</strong> Website usage analytics (with data processing agreement)</li>
          <li><strong>Breakcold CRM:</strong> Lead management and customer communications</li>
          <li><strong>Email Services:</strong> Transactional and marketing email delivery</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 International Transfers</h3>
        <p className="mb-4">
          Some data may be processed in the United States by our service providers. We ensure adequate 
          protection through Standard Contractual Clauses (SCCs) and data processing agreements compliant 
          with GDPR requirements.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">5.3 We Do NOT Sell Personal Data</h3>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-800">
            <strong>California Residents:</strong> We do not sell, rent, or share personal information 
            for monetary or other valuable consideration. Your data is used solely for business operations 
            and service improvement.
          </p>
        </div>
      </section>

      {/* 6. Your Rights */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-4">
          <Lock className="w-6 h-6 text-teal-600" />
          6. Your Privacy Rights
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* GDPR Rights */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">EU/UK Residents (GDPR)</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate information</li>
              <li><strong>Erasure:</strong> Request deletion of your data</li>
              <li><strong>Portability:</strong> Transfer data to another service</li>
              <li><strong>Object:</strong> Opt-out of certain processing activities</li>
              <li><strong>Restrict:</strong> Limit how we process your data</li>
              <li><strong>Withdraw Consent:</strong> Revoke permission at any time</li>
            </ul>
          </div>

          {/* CCPA Rights */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-900 mb-3">California Residents (CCPA)</h3>
            <ul className="text-sm text-red-800 space-y-2">
              <li><strong>Know:</strong> What personal info we collect and how it's used</li>
              <li><strong>Delete:</strong> Request deletion of your personal information</li>
              <li><strong>Opt-Out:</strong> Prevent sale/sharing of personal data</li>
              <li><strong>Non-Discrimination:</strong> Equal service regardless of privacy choices</li>
              <li><strong>Correct:</strong> Fix inaccurate personal information</li>
              <li><strong>Limit:</strong> Restrict use of sensitive personal information</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">How to Exercise Your Rights</h3>
          <p className="text-gray-700 mb-3">
            To exercise any of these rights, contact us through the methods below. We'll respond within 30 days 
            (GDPR) or 45 days (CCPA) and may require identity verification.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span><strong>Email:</strong> privacy@cozyartzmedia.com</span>
            <span><strong>Phone:</strong> 269.261.0069</span>
            <span><strong>Online:</strong> Use our privacy settings dashboard</span>
          </div>
        </div>
      </section>

      {/* 7. Data Security */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Security</h2>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Encryption:</strong> AES-256 encryption for data at rest and TLS 1.3 for data in transit</li>
          <li><strong>Access Controls:</strong> Role-based access with multi-factor authentication</li>
          <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
          <li><strong>AI Security:</strong> Prompt injection protection and content filtering</li>
          <li><strong>Incident Response:</strong> 72-hour breach notification procedures</li>
        </ul>
      </section>

      {/* 8. Data Retention */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Data Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Retention Period</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm">AI Conversations</td>
                <td className="px-4 py-3 text-sm">24 hours (with consent)</td>
                <td className="px-4 py-3 text-sm">Service continuity</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm">Analytics Data</td>
                <td className="px-4 py-3 text-sm">12 months</td>
                <td className="px-4 py-3 text-sm">Performance optimization</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm">Client Records</td>
                <td className="px-4 py-3 text-sm">7 years</td>
                <td className="px-4 py-3 text-sm">Business and legal requirements</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm">Compliance Logs</td>
                <td className="px-4 py-3 text-sm">3 years</td>
                <td className="px-4 py-3 text-sm">Regulatory compliance</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 9. Contact Information */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Information</h2>
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-teal-900 mb-4">Cozyartz Media Group</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-teal-800">
            <div>
              <p><strong>Data Controller:</strong> Cozyartz Media Group</p>
              <p><strong>Address:</strong> Michigan, USA</p>
              <p><strong>Phone:</strong> 269.261.0069</p>
            </div>
            <div>
              <p><strong>General Inquiries:</strong> hello@cozyartzmedia.com</p>
              <p><strong>Privacy Officer:</strong> privacy@cozyartzmedia.com</p>
              <p><strong>DPO (EU):</strong> dpo@cozyartzmedia.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Changes to Policy */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this privacy policy to reflect changes in our practices, technology, legal requirements, 
          or other factors. We will notify you of significant changes through our website banner, email, or other 
          appropriate means. Your continued use of our services after changes become effective constitutes 
          acceptance of the updated policy.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            <strong>Version Control:</strong> This privacy policy version 2025.1 is effective as of January 1, 2025. 
            Previous versions are available upon request for reference and compliance verification.
          </p>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyContent;