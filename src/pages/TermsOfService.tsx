import React from 'react';
import SEO from '../components/SEO';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FileText, Shield, AlertTriangle, CreditCard, Users, Gavel, Globe, Clock } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <>
      <SEO
        title="Terms of Service - Cozyartz Media Group"
        description="Our terms of service outline the rules and regulations for using our website and services, including SEO, web design, and digital marketing."
        keywords="terms of service, user agreement, website terms, service conditions, legal agreement"
        canonical="https://cozyartzmedia.com/terms-of-service"
      />
      
      <Header />
      
      <main className="min-h-screen bg-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full mb-4">
              <Gavel className="h-5 w-5 text-blue-400" />
              <span className="text-blue-400 font-medium">Legal Agreement</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
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
                Agreement to Terms
              </h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  These Terms of Service ("Terms") govern your use of the website and services provided by 
                  Cozyartz Media Group ("Company," "we," "our," or "us"). By accessing or using our services, 
                  you agree to be bound by these Terms and our Privacy Policy.
                </p>
                <p>
                  If you do not agree to these Terms, please do not use our services. We reserve the right 
                  to modify these Terms at any time, and your continued use constitutes acceptance of any changes.
                </p>
              </div>
            </section>

            {/* Services Description */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Globe className="h-6 w-6 text-teal-400" />
                Services Description
              </h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  Cozyartz Media Group provides digital marketing and web development services, including:
                </p>
                <ul className="space-y-2 ml-4">
                  <li>• Search Engine Optimization (SEO) services</li>
                  <li>• Web design and development</li>
                  <li>• Digital marketing and advertising</li>
                  <li>• Content creation and strategy</li>
                  <li>• AI-powered marketing tools and analytics</li>
                  <li>• Consultation and strategic planning services</li>
                  <li>• Client portal and dashboard access</li>
                </ul>
                <p>
                  Services are provided on a subscription basis or as one-time projects, as specified in your 
                  service agreement or purchase order.
                </p>
              </div>
            </section>

            {/* User Accounts */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="h-6 w-6 text-teal-400" />
                User Accounts and Responsibilities
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Account Creation</h3>
                  <p className="text-slate-300">
                    To access certain features, you must create an account with accurate, complete information. 
                    You are responsible for maintaining the security of your account credentials and for all 
                    activities that occur under your account.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Acceptable Use</h3>
                  <p className="text-slate-300 mb-2">You agree not to:</p>
                  <ul className="text-slate-300 space-y-1 ml-4">
                    <li>• Use our services for any illegal or unauthorized purpose</li>
                    <li>• Interfere with or disrupt our services or servers</li>
                    <li>• Attempt to gain unauthorized access to our systems</li>
                    <li>• Use our services to harm, threaten, or harass others</li>
                    <li>• Violate any applicable laws or regulations</li>
                    <li>• Infringe on intellectual property rights</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Content Responsibility</h3>
                  <p className="text-slate-300">
                    You are responsible for all content you provide through our services. You warrant that 
                    you have the right to use such content and that it does not violate any laws or third-party rights.
                  </p>
                </div>
              </div>
            </section>

            {/* Payment Terms */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-teal-400" />
                Payment Terms
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Subscription Plans</h3>
                  <p className="text-slate-300 mb-2">Our subscription plans include:</p>
                  <ul className="text-slate-300 space-y-1 ml-4">
                    <li>• <strong>Starter Plan:</strong> $1,000/month - 100 AI calls, basic SEO tools</li>
                    <li>• <strong>Growth Plan:</strong> $1,500/month - 250 AI calls, advanced analytics</li>
                    <li>• <strong>Enterprise Plan:</strong> $2,500/month - 500 AI calls, priority support</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Payment Processing</h3>
                  <p className="text-slate-300">
                    Payments are processed securely through PayPal. All fees are non-refundable unless 
                    otherwise specified. Subscriptions auto-renew monthly unless cancelled.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Overages and Additional Fees</h3>
                  <ul className="text-slate-300 space-y-1 ml-4">
                    <li>• AI call overages: $0.50 per additional call</li>
                    <li>• Consultation rates: $150-$500 per hour depending on service type</li>
                    <li>• Custom development: Quoted separately based on scope</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Late Payments</h3>
                  <p className="text-slate-300">
                    Late payments may result in service suspension. A 1.5% monthly service charge may be 
                    applied to overdue accounts.
                  </p>
                </div>
              </div>
            </section>

            {/* Cancellation and Refunds */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="h-6 w-6 text-teal-400" />
                Cancellation and Refunds
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Cancellation Policy</h3>
                  <p className="text-slate-300">
                    You may cancel your subscription at any time through your account dashboard or by 
                    contacting support. Cancellations take effect at the end of the current billing cycle.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Refund Policy</h3>
                  <p className="text-slate-300">
                    We offer a 14-day money-back guarantee for new subscribers. After 14 days, fees are 
                    non-refundable. Refunds will be processed within 5-10 business days.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Service Termination</h3>
                  <p className="text-slate-300">
                    We may terminate or suspend your account for violation of these Terms, non-payment, 
                    or other reasonable business purposes with 30 days' notice.
                  </p>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-teal-400" />
                Intellectual Property
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Our IP Rights</h3>
                  <p className="text-slate-300">
                    All content, features, and functionality of our services are owned by Cozyartz Media Group 
                    and are protected by copyright, trademark, and other intellectual property laws.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Client Content</h3>
                  <p className="text-slate-300">
                    You retain ownership of content you provide. By using our services, you grant us a 
                    license to use your content solely for providing our services.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Work Product</h3>
                  <p className="text-slate-300">
                    Content created specifically for your business (websites, campaigns, etc.) becomes 
                    your property upon full payment. General methodologies and know-how remain our property.
                  </p>
                </div>
              </div>
            </section>

            {/* Service Availability */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Globe className="h-6 w-6 text-teal-400" />
                Service Availability and Performance
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Uptime Commitment</h3>
                  <p className="text-slate-300">
                    We strive to maintain 99.9% uptime for our services. Scheduled maintenance will be 
                    announced in advance when possible.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Service Modifications</h3>
                  <p className="text-slate-300">
                    We may modify, suspend, or discontinue services at any time. We will provide reasonable 
                    notice for significant changes that affect your use of our services.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Third-Party Dependencies</h3>
                  <p className="text-slate-300">
                    Our services may depend on third-party providers (AI models, analytics platforms, etc.). 
                    We are not responsible for their availability or performance.
                  </p>
                </div>
              </div>
            </section>

            {/* Disclaimers */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-teal-400" />
                Disclaimers and Limitations
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Service Warranty</h3>
                  <p className="text-slate-300">
                    Our services are provided "as is" without warranties of any kind. We disclaim all 
                    warranties, express or implied, including merchantability and fitness for a particular purpose.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Results Disclaimer</h3>
                  <p className="text-slate-300">
                    While we strive to deliver excellent results, we cannot guarantee specific outcomes 
                    such as search engine rankings, traffic increases, or business results. SEO and 
                    marketing results depend on many factors beyond our control.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Limitation of Liability</h3>
                  <p className="text-slate-300">
                    Our liability for any damages arising from our services is limited to the amount you 
                    paid for services in the 12 months preceding the claim. We are not liable for indirect, 
                    incidental, or consequential damages.
                  </p>
                </div>
              </div>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-teal-400" />
                Indemnification
              </h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  You agree to indemnify and hold harmless Cozyartz Media Group from any claims, damages, 
                  losses, or expenses arising from:
                </p>
                <ul className="space-y-1 ml-4">
                  <li>• Your use of our services</li>
                  <li>• Your violation of these Terms</li>
                  <li>• Content you provide through our services</li>
                  <li>• Your violation of any third-party rights</li>
                </ul>
              </div>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Gavel className="h-6 w-6 text-teal-400" />
                Governing Law and Disputes
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Jurisdiction</h3>
                  <p className="text-slate-300">
                    These Terms are governed by the laws of the State of Michigan, United States. Any 
                    disputes will be resolved in the courts of Michigan.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Dispute Resolution</h3>
                  <p className="text-slate-300">
                    We encourage resolving disputes through direct communication. For formal disputes, 
                    we prefer binding arbitration before litigation.
                  </p>
                </div>
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
                  If you have questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-slate-700 p-4 rounded-lg">
                  <p><strong>Cozyartz Media Group</strong></p>
                  <p>Email: <a href="mailto:legal@cozyartzmedia.com" className="text-teal-400 hover:text-teal-300">legal@cozyartzmedia.com</a></p>
                  <p>Phone: <a href="tel:2692610069" className="text-teal-400 hover:text-teal-300">269.261.0069</a></p>
                  <p>Address: Battle Creek, Michigan 49015</p>
                </div>
              </div>
            </section>

            {/* Updates */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="h-6 w-6 text-teal-400" />
                Terms Updates
              </h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  We may update these Terms of Service periodically. We will notify you of material 
                  changes by email or through our website at least 30 days before they take effect.
                </p>
                <p>
                  Your continued use of our services after the effective date of updated Terms constitutes 
                  acceptance of the changes.
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

export default TermsOfService;