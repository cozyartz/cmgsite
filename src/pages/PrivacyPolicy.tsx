import React from 'react';
import SEO from '../components/SEO';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Shield, Eye, Database, Lock, Users, Globe, FileText, AlertCircle } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <SEO
        title="Privacy Policy - Cozyartz Media Group"
        description="Our comprehensive privacy policy explains how we collect, use, and protect your personal information in compliance with GDPR and other privacy regulations."
        keywords="privacy policy, data protection, GDPR compliance, personal information, data security"
        canonical="https://cozyartzmedia.com/privacy-policy"
      />
      
      <Header />
      
      <main className="min-h-screen bg-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-teal-500/10 px-4 py-2 rounded-full mb-4">
              <Shield className="h-5 w-5 text-teal-400" />
              <span className="text-teal-400 font-medium">Privacy & Data Protection</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-slate-300 text-lg">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Content */}
          <div className="bg-slate-800 rounded-lg p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="h-6 w-6 text-teal-400" />
                Introduction
              </h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  Cozyartz Media Group ("we," "our," or "us") is committed to protecting your privacy and ensuring 
                  the security of your personal information. This Privacy Policy explains how we collect, use, 
                  disclose, and safeguard your information when you visit our website, use our services, or 
                  interact with us.
                </p>
                <p>
                  This policy applies to all users of our services, including our main website, client portal, 
                  SEO services, and any other digital platforms we operate. By using our services, you consent 
                  to the data practices described in this policy.
                </p>
              </div>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Database className="h-6 w-6 text-teal-400" />
                Information We Collect
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Personal Information</h3>
                  <div className="text-slate-300 space-y-2">
                    <p><strong>Contact Information:</strong> Name, email address, phone number, business address</p>
                    <p><strong>Account Information:</strong> Username, password, profile information, preferences</p>
                    <p><strong>Business Information:</strong> Company name, website URL, industry, business goals</p>
                    <p><strong>Payment Information:</strong> Billing address, payment method details (processed securely by PayPal)</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Technical Information</h3>
                  <div className="text-slate-300 space-y-2">
                    <p><strong>Usage Data:</strong> Pages visited, time spent, clicks, navigation patterns</p>
                    <p><strong>Device Information:</strong> IP address, browser type, device type, operating system</p>
                    <p><strong>Analytics Data:</strong> Website performance metrics, user behavior, conversion tracking</p>
                    <p><strong>Cookies:</strong> Session cookies, preference cookies, analytics cookies (with consent)</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">SEO & Marketing Data</h3>
                  <div className="text-slate-300 space-y-2">
                    <p><strong>Website Data:</strong> Domain information, keyword rankings, competitor analysis</p>
                    <p><strong>Content Data:</strong> Blog posts, meta descriptions, marketing copy created with AI</p>
                    <p><strong>Campaign Data:</strong> Marketing campaign performance, lead generation metrics</p>
                  </div>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Eye className="h-6 w-6 text-teal-400" />
                How We Use Your Information
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Service Delivery</h3>
                  <ul className="text-slate-300 space-y-1 ml-4">
                    <li>• Provide SEO services, web design, and digital marketing</li>
                    <li>• Generate AI-powered content and recommendations</li>
                    <li>• Monitor and report on campaign performance</li>
                    <li>• Provide customer support and technical assistance</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Account Management</h3>
                  <ul className="text-slate-300 space-y-1 ml-4">
                    <li>• Create and manage user accounts</li>
                    <li>• Process payments and billing</li>
                    <li>• Send service notifications and updates</li>
                    <li>• Authenticate users and prevent fraud</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Business Operations</h3>
                  <ul className="text-slate-300 space-y-1 ml-4">
                    <li>• Improve our services and develop new features</li>
                    <li>• Analyze usage patterns and optimize performance</li>
                    <li>• Conduct market research and competitive analysis</li>
                    <li>• Comply with legal obligations and regulations</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Legal Basis for Processing */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Lock className="h-6 w-6 text-teal-400" />
                Legal Basis for Processing (GDPR)
              </h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  Under the General Data Protection Regulation (GDPR), we process your personal data based on 
                  the following legal grounds:
                </p>
                <ul className="space-y-2 ml-4">
                  <li><strong>Contract:</strong> Processing necessary for service delivery and contract fulfillment</li>
                  <li><strong>Consent:</strong> Marketing communications, analytics cookies, and optional features</li>
                  <li><strong>Legitimate Interest:</strong> Business operations, fraud prevention, and service improvement</li>
                  <li><strong>Legal Obligation:</strong> Compliance with tax, accounting, and regulatory requirements</li>
                </ul>
              </div>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="h-6 w-6 text-teal-400" />
                Data Sharing and Disclosure
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Service Providers</h3>
                  <p className="text-slate-300">
                    We share data with trusted third-party service providers who assist in delivering our services:
                  </p>
                  <ul className="text-slate-300 space-y-1 ml-4 mt-2">
                    <li>• <strong>Cloudflare:</strong> Website hosting, security, and performance optimization</li>
                    <li>• <strong>PayPal:</strong> Payment processing and billing management</li>
                    <li>• <strong>Google Analytics:</strong> Website analytics and user behavior tracking</li>
                    <li>• <strong>OpenAI/Claude:</strong> AI-powered content generation and analysis</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Legal Requirements</h3>
                  <p className="text-slate-300">
                    We may disclose information when required by law or to protect our rights:
                  </p>
                  <ul className="text-slate-300 space-y-1 ml-4 mt-2">
                    <li>• Legal proceedings and court orders</li>
                    <li>• Regulatory compliance and investigations</li>
                    <li>• Protection of rights, property, or safety</li>
                    <li>• Prevention of fraud or illegal activities</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-teal-400" />
                Data Security
              </h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  We implement industry-standard security measures to protect your personal information:
                </p>
                <ul className="space-y-2 ml-4">
                  <li><strong>Encryption:</strong> All data transmitted using 256-bit SSL encryption</li>
                  <li><strong>Access Controls:</strong> Role-based access with multi-factor authentication</li>
                  <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
                  <li><strong>Data Minimization:</strong> We collect only necessary information for service delivery</li>
                  <li><strong>Secure Storage:</strong> Data stored in SOC 2 compliant cloud infrastructure</li>
                </ul>
              </div>
            </section>

            {/* International Transfers */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Globe className="h-6 w-6 text-teal-400" />
                International Data Transfers
              </h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  Your information may be transferred to and processed in countries other than your own. 
                  We ensure appropriate safeguards are in place:
                </p>
                <ul className="space-y-2 ml-4">
                  <li>• Standard Contractual Clauses (SCCs) for EU data transfers</li>
                  <li>• Adequacy decisions for approved countries</li>
                  <li>• Binding corporate rules for internal transfers</li>
                  <li>• Appropriate technical and organizational measures</li>
                </ul>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-teal-400" />
                Data Retention
              </h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  We retain your personal information only as long as necessary for the purposes outlined 
                  in this policy:
                </p>
                <ul className="space-y-2 ml-4">
                  <li><strong>Account Data:</strong> Until account deletion or 3 years after last activity</li>
                  <li><strong>Transaction Records:</strong> 7 years for tax and accounting purposes</li>
                  <li><strong>Marketing Data:</strong> Until consent is withdrawn or 2 years of inactivity</li>
                  <li><strong>Analytics Data:</strong> Anonymized after 26 months (Google Analytics standard)</li>
                  <li><strong>Legal Records:</strong> As required by applicable laws and regulations</li>
                </ul>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="h-6 w-6 text-teal-400" />
                Your Rights
              </h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  Under GDPR and other privacy laws, you have the following rights regarding your personal data:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Access & Portability</h3>
                    <ul className="space-y-1 ml-4">
                      <li>• Request access to your personal data</li>
                      <li>• Receive data in a portable format</li>
                      <li>• Transfer data to another service provider</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Control & Deletion</h3>
                    <ul className="space-y-1 ml-4">
                      <li>• Correct inaccurate information</li>
                      <li>• Delete personal data ("right to be forgotten")</li>
                      <li>• Restrict or object to processing</li>
                    </ul>
                  </div>
                </div>
                <p className="mt-4">
                  To exercise these rights, contact us at{' '}
                  <a href="mailto:privacy@cozyartzmedia.com" className="text-teal-400 hover:text-teal-300">
                    privacy@cozyartzmedia.com
                  </a>
                  {' '}or use our{' '}
                  <a href="/data-subject-request" className="text-teal-400 hover:text-teal-300">
                    Data Subject Request Form
                  </a>
                  .
                </p>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Eye className="h-6 w-6 text-teal-400" />
                Cookies and Tracking
              </h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  We use cookies and similar technologies to enhance your experience and analyze website usage. 
                  You can manage your cookie preferences through our cookie consent banner or by visiting our{' '}
                  <a href="/cookie-policy" className="text-teal-400 hover:text-teal-300">
                    Cookie Policy
                  </a>
                  .
                </p>
                <p>
                  Types of cookies we use:
                </p>
                <ul className="space-y-2 ml-4">
                  <li><strong>Necessary:</strong> Essential for website functionality and security</li>
                  <li><strong>Analytics:</strong> Help us understand website usage and performance</li>
                  <li><strong>Marketing:</strong> Enable personalized advertising and retargeting</li>
                  <li><strong>Functional:</strong> Enhance user experience with chat, videos, and social features</li>
                </ul>
              </div>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-teal-400" />
                Children's Privacy
              </h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  Our services are not intended for individuals under the age of 16. We do not knowingly 
                  collect personal information from children under 16. If you are a parent or guardian and 
                  believe your child has provided us with personal information, please contact us immediately.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="h-6 w-6 text-teal-400" />
                Contact Information
              </h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
                </p>
                <div className="bg-slate-700 p-4 rounded-lg">
                  <p><strong>Cozyartz Media Group</strong></p>
                  <p>Email: <a href="mailto:privacy@cozyartzmedia.com" className="text-teal-400 hover:text-teal-300">privacy@cozyartzmedia.com</a></p>
                  <p>Phone: <a href="tel:2692610069" className="text-teal-400 hover:text-teal-300">269.261.0069</a></p>
                  <p>Address: Battle Creek, Michigan 49015</p>
                </div>
                <p>
                  For EU residents, you also have the right to lodge a complaint with your local data protection authority.
                </p>
              </div>
            </section>

            {/* Updates */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-teal-400" />
                Policy Updates
              </h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. 
                  We will notify you of significant changes by email or through a notice on our website at least 30 days 
                  before the changes take effect.
                </p>
                <p>
                  Your continued use of our services after the effective date of the updated policy constitutes acceptance 
                  of the changes.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default PrivacyPolicy;