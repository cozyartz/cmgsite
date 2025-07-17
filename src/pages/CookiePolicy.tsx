import React from 'react';
import SEO from '../components/SEO';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Cookie, Shield, Settings, BarChart3, ExternalLink, AlertCircle, Eye } from 'lucide-react';

const CookiePolicy: React.FC = () => {
  return (
    <>
      <SEO
        title="Cookie Policy - Cozyartz Media Group"
        description="Learn about how we use cookies and similar technologies to improve your experience on our website and provide personalized content."
        keywords="cookie policy, cookies, tracking, privacy, website analytics, personalization"
        canonical="https://cozyartzmedia.com/cookie-policy"
      />
      
      <Header />
      
      <main className="min-h-screen bg-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-full mb-4">
              <Cookie className="h-5 w-5 text-orange-400" />
              <span className="text-orange-400 font-medium">Cookie Information</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Cookie Policy</h1>
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
                <Cookie className="h-6 w-6 text-teal-400" />
                What Are Cookies?
              </h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  Cookies are small text files stored on your device when you visit our website. They help us 
                  provide you with a better experience by remembering your preferences, enabling certain features, 
                  and helping us understand how you use our services.
                </p>
                <p>
                  This Cookie Policy explains what cookies are, how we use them, the types of cookies we use, 
                  and how you can manage your cookie preferences.
                </p>
              </div>
            </section>

            {/* How We Use Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Settings className="h-6 w-6 text-teal-400" />
                How We Use Cookies
              </h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  We use cookies for several purposes to enhance your experience and improve our services:
                </p>
                <ul className="space-y-2 ml-4">
                  <li><strong>Authentication:</strong> Keep you logged in to your account</li>
                  <li><strong>Preferences:</strong> Remember your settings and preferences</li>
                  <li><strong>Security:</strong> Protect against fraudulent activity</li>
                  <li><strong>Analytics:</strong> Understand how you use our website</li>
                  <li><strong>Personalization:</strong> Customize content and recommendations</li>
                  <li><strong>Marketing:</strong> Show relevant advertisements (with your consent)</li>
                </ul>
              </div>
            </section>

            {/* Types of Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-teal-400" />
                Types of Cookies We Use
              </h2>
              <div className="space-y-6">
                {/* Necessary Cookies */}
                <div className="border border-slate-700 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-6 w-6 text-red-400" />
                    <h3 className="text-xl font-semibold text-white">Necessary Cookies</h3>
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">Required</span>
                  </div>
                  <p className="text-slate-300 mb-4">
                    Essential for the website to function properly. These cookies enable core functionality 
                    such as security, authentication, and accessibility features.
                  </p>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Examples:</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• <strong>auth_token:</strong> Keeps you logged in to your account</li>
                      <li>• <strong>csrf_token:</strong> Protects against cross-site request forgery</li>
                      <li>• <strong>session_id:</strong> Maintains your browsing session</li>
                      <li>• <strong>cookie_consent:</strong> Remembers your cookie preferences</li>
                    </ul>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="border border-slate-700 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <BarChart3 className="h-6 w-6 text-blue-400" />
                    <h3 className="text-xl font-semibold text-white">Analytics Cookies</h3>
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Optional</span>
                  </div>
                  <p className="text-slate-300 mb-4">
                    Help us understand how visitors interact with our website by collecting and reporting 
                    information anonymously. This helps us improve our services.
                  </p>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Examples:</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• <strong>_ga:</strong> Google Analytics - distinguishes unique users</li>
                      <li>• <strong>_gid:</strong> Google Analytics - distinguishes unique users</li>
                      <li>• <strong>_gat:</strong> Google Analytics - throttles request rate</li>
                      <li>• <strong>analytics_session:</strong> Tracks user sessions and behavior</li>
                    </ul>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="border border-slate-700 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <ExternalLink className="h-6 w-6 text-purple-400" />
                    <h3 className="text-xl font-semibold text-white">Marketing Cookies</h3>
                    <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded">Optional</span>
                  </div>
                  <p className="text-slate-300 mb-4">
                    Used to track visitors across websites to display relevant advertisements and measure 
                    the effectiveness of our marketing campaigns.
                  </p>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Examples:</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• <strong>_fbp:</strong> Facebook Pixel - tracks conversions and retargeting</li>
                      <li>• <strong>ads_preferences:</strong> Stores advertising preferences</li>
                      <li>• <strong>marketing_attribution:</strong> Tracks marketing campaign performance</li>
                      <li>• <strong>retargeting_id:</strong> Enables personalized advertisements</li>
                    </ul>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="border border-slate-700 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Settings className="h-6 w-6 text-green-400" />
                    <h3 className="text-xl font-semibold text-white">Functional Cookies</h3>
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Optional</span>
                  </div>
                  <p className="text-slate-300 mb-4">
                    Enable enhanced functionality and personalization, such as videos, live chat, 
                    and social media features.
                  </p>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Examples:</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• <strong>chat_session:</strong> Enables live chat functionality</li>
                      <li>• <strong>video_preferences:</strong> Remembers video quality settings</li>
                      <li>• <strong>social_login:</strong> Enables social media login features</li>
                      <li>• <strong>ui_preferences:</strong> Saves interface customizations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Third-Party Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <ExternalLink className="h-6 w-6 text-teal-400" />
                Third-Party Cookies
              </h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  Our website may contain cookies from third-party services that we use to enhance functionality 
                  and analyze usage. These third parties may use cookies according to their own privacy policies.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">Google Analytics</h3>
                    <p className="text-sm text-slate-300 mb-2">
                      Provides website analytics and user behavior insights.
                    </p>
                    <a 
                      href="https://policies.google.com/privacy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-teal-400 hover:text-teal-300 text-sm"
                    >
                      Google Privacy Policy →
                    </a>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">PayPal</h3>
                    <p className="text-sm text-slate-300 mb-2">
                      Handles payment processing and transaction security.
                    </p>
                    <a 
                      href="https://www.paypal.com/privacy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-teal-400 hover:text-teal-300 text-sm"
                    >
                      PayPal Privacy Policy →
                    </a>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">Cloudflare</h3>
                    <p className="text-sm text-slate-300 mb-2">
                      Provides security, performance, and content delivery.
                    </p>
                    <a 
                      href="https://www.cloudflare.com/privacy/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-teal-400 hover:text-teal-300 text-sm"
                    >
                      Cloudflare Privacy Policy →
                    </a>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">Social Media</h3>
                    <p className="text-sm text-slate-300 mb-2">
                      Social media platforms may set cookies for embedded content.
                    </p>
                    <p className="text-slate-400 text-xs">
                      Facebook, LinkedIn, Twitter policies apply
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Cookie Management */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Eye className="h-6 w-6 text-teal-400" />
                Managing Your Cookie Preferences
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Cookie Consent Banner</h3>
                  <p className="text-slate-300">
                    When you first visit our website, you'll see a cookie consent banner where you can:
                  </p>
                  <ul className="text-slate-300 space-y-1 ml-4 mt-2">
                    <li>• Accept all cookies</li>
                    <li>• Accept only necessary cookies</li>
                    <li>• Customize your preferences</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Browser Controls</h3>
                  <p className="text-slate-300 mb-2">
                    Most browsers allow you to manage cookies through their settings:
                  </p>
                  <ul className="text-slate-300 space-y-1 ml-4">
                    <li>• <strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
                    <li>• <strong>Firefox:</strong> Settings → Privacy & Security → Cookies</li>
                    <li>• <strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                    <li>• <strong>Edge:</strong> Settings → Privacy → Cookies</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Opt-Out Links</h3>
                  <p className="text-slate-300 mb-2">
                    You can opt out of specific tracking services:
                  </p>
                  <ul className="text-slate-300 space-y-1 ml-4">
                    <li>• <a href="https://tools.google.com/dlpage/gaoptout" className="text-teal-400 hover:text-teal-300">Google Analytics Opt-out</a></li>
                    <li>• <a href="https://optout.aboutads.info/" className="text-teal-400 hover:text-teal-300">Digital Advertising Alliance Opt-out</a></li>
                    <li>• <a href="https://www.networkadvertising.org/choices/" className="text-teal-400 hover:text-teal-300">Network Advertising Initiative Opt-out</a></li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Impact of Disabling Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-teal-400" />
                Impact of Disabling Cookies
              </h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  Disabling certain cookies may affect your experience on our website:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">Necessary Cookies</h3>
                    <p className="text-sm text-slate-300">
                      Disabling these will prevent core functionality like logging in, 
                      making payments, and accessing secure areas.
                    </p>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">Analytics Cookies</h3>
                    <p className="text-sm text-slate-300">
                      We won't be able to track usage patterns or improve our services 
                      based on user behavior.
                    </p>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">Marketing Cookies</h3>
                    <p className="text-sm text-slate-300">
                      You may see less relevant advertisements and we can't measure 
                      campaign effectiveness.
                    </p>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">Functional Cookies</h3>
                    <p className="text-sm text-slate-300">
                      Enhanced features like chat, video content, and social media 
                      integration may not work properly.
                    </p>
                  </div>
                </div>
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
                  We may update this Cookie Policy from time to time to reflect changes in our 
                  practices or legal requirements. We will notify you of significant changes by 
                  updating the "Last updated" date at the top of this policy.
                </p>
                <p>
                  We recommend reviewing this policy periodically to stay informed about how we 
                  use cookies and similar technologies.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Settings className="h-6 w-6 text-teal-400" />
                Contact Information
              </h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  If you have questions about this Cookie Policy or need help managing your cookie preferences, 
                  please contact us:
                </p>
                <div className="bg-slate-700 p-4 rounded-lg">
                  <p><strong>Cozyartz Media Group</strong></p>
                  <p>Email: <a href="mailto:privacy@cozyartzmedia.com" className="text-teal-400 hover:text-teal-300">privacy@cozyartzmedia.com</a></p>
                  <p>Phone: <a href="tel:2692610069" className="text-teal-400 hover:text-teal-300">269.261.0069</a></p>
                  <p>Address: Battle Creek, Michigan 49015</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default CookiePolicy;