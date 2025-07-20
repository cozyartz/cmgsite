import React, { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function EmailTest() {
  const [email, setEmail] = useState('a.cozartlundin@gmail.com');
  const [name, setName] = useState('Amy');
  const [couponCode, setCouponCode] = useState('AMYFREE');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; emailId?: string } | null>(null);

  const handleSendAdvisorEmail = async () => {
    if (!email || !name) {
      setResult({
        success: false,
        message: 'Please fill in all fields'
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/email/send-advisor-welcome', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          couponCode,
          advisorType: 'business'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: 'Advisor welcome email sent successfully!',
          emailId: data.emailId
        });
        // Clear form
        setEmail('');
        setName('');
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to send email'
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Network error: Failed to send email'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Mail className="w-6 h-6 text-teal-600" />
        <h2 className="text-2xl font-bold text-gray-900">Email System Test</h2>
      </div>

      <div className="space-y-6">
        {/* Advisor Email Test */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Advisor Welcome Email</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Advisor Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Amy Tipton"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="amy.tipton@company.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label htmlFor="couponCode" className="block text-sm font-medium text-gray-700 mb-1">
                Coupon Code
              </label>
              <select
                id="couponCode"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="AMYFREE">AMYFREE - 6 months free StarterPlus</option>
                <option value="AMYCOMPANY40">AMYCOMPANY40 - 40% off for company</option>
                <option value="JON250">JON250 - $250/month off for 3 months</option>
              </select>
            </div>

            <button
              onClick={handleSendAdvisorEmail}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {isLoading ? 'Sending...' : 'Send Advisor Welcome Email'}
            </button>
          </div>
        </div>

        {/* Result Display */}
        {result && (
          <div className={`p-4 rounded-lg border ${
            result.success 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <span className="font-medium">{result.message}</span>
            </div>
            {result.emailId && (
              <div className="mt-2 text-sm opacity-75">
                Email ID: {result.emailId}
              </div>
            )}
          </div>
        )}

        {/* Email Templates Info */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Email Templates</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between items-center">
              <span>Welcome Email</span>
              <span className="text-green-600">✓ Auto-sent on registration</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Coupon Redemption</span>
              <span className="text-green-600">✓ Auto-sent on coupon use</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Payment Confirmation</span>
              <span className="text-green-600">✓ Auto-sent on payment</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Prepayment Confirmation</span>
              <span className="text-green-600">✓ Auto-sent on prepayment</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Advisor Welcome</span>
              <span className="text-blue-600">✓ Manual send (above)</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Usage Warnings</span>
              <span className="text-yellow-600">⚡ API endpoint available</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Billing Reminders</span>
              <span className="text-yellow-600">⚡ API endpoint available</span>
            </div>
          </div>
        </div>

        {/* Configuration Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-blue-800">
              <div className="font-medium">Configuration Required</div>
              <div className="text-sm mt-1">
                Set the <code>RESEND_API_KEY</code> secret in Cloudflare Workers for email functionality to work.
                <br />
                Command: <code>wrangler secret put RESEND_API_KEY</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}