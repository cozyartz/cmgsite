import React, { useState } from 'react';
import SEO from '../components/SEO';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Shield, User, Download, Trash2, Eye, Edit, FileText, AlertCircle, CheckCircle, Send } from 'lucide-react';

const DataSubjectRequest: React.FC = () => {
  const [formData, setFormData] = useState({
    requestType: '',
    fullName: '',
    email: '',
    phone: '',
    relationshipToSubject: 'self',
    dataSubjectName: '',
    dataSubjectEmail: '',
    requestDetails: '',
    identityVerification: null as File | null,
    additionalDocuments: null as File | null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      // In a real implementation, this would send to your API
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestTypes = [
    {
      value: 'access',
      label: 'Access Request',
      icon: Eye,
      description: 'Request a copy of your personal data we have on file'
    },
    {
      value: 'portability',
      label: 'Data Portability',
      icon: Download,
      description: 'Request your data in a machine-readable format'
    },
    {
      value: 'rectification',
      label: 'Data Correction',
      icon: Edit,
      description: 'Request correction of inaccurate or incomplete data'
    },
    {
      value: 'deletion',
      label: 'Data Deletion',
      icon: Trash2,
      description: 'Request deletion of your personal data ("Right to be Forgotten")'
    },
    {
      value: 'restriction',
      label: 'Processing Restriction',
      icon: Shield,
      description: 'Request limitation of how we process your data'
    },
    {
      value: 'objection',
      label: 'Processing Objection',
      icon: AlertCircle,
      description: 'Object to the processing of your personal data'
    }
  ];

  return (
    <>
      <SEO
        title="Data Subject Request Form - Cozyartz Media Group"
        description="Submit a request to access, modify, or delete your personal data in compliance with GDPR and other privacy regulations."
        keywords="data subject request, GDPR rights, data access, data deletion, privacy rights, personal data"
        canonical="https://cozyartzmedia.com/data-subject-request"
      />
      
      <Header />
      
      <main className="min-h-screen bg-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full mb-4">
              <User className="h-5 w-5 text-blue-400" />
              <span className="text-blue-400 font-medium">Data Subject Rights</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Data Subject Request</h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Exercise your rights under GDPR and other privacy laws. We'll process your request within 30 days.
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-slate-800 p-6 rounded-lg text-center">
              <Shield className="h-8 w-8 text-teal-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Secure Processing</h3>
              <p className="text-slate-300 text-sm">
                All requests are processed securely with identity verification required.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg text-center">
              <FileText className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">30-Day Response</h3>
              <p className="text-slate-300 text-sm">
                We'll respond to your request within 30 days as required by law.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg text-center">
              <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Free of Charge</h3>
              <p className="text-slate-300 text-sm">
                Most requests are processed free of charge unless excessive.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-slate-800 rounded-lg p-8">
            {submitStatus === 'success' ? (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-4">Request Submitted Successfully</h2>
                <p className="text-slate-300 mb-6">
                  We've received your data subject request and will process it within 30 days. 
                  You'll receive a confirmation email shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitStatus('idle');
                    setFormData({
                      requestType: '',
                      fullName: '',
                      email: '',
                      phone: '',
                      relationshipToSubject: 'self',
                      dataSubjectName: '',
                      dataSubjectEmail: '',
                      requestDetails: '',
                      identityVerification: null,
                      additionalDocuments: null
                    });
                  }}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Request Type */}
                <section>
                  <h2 className="text-xl font-bold text-white mb-4">Type of Request</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {requestTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <label
                          key={type.value}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            formData.requestType === type.value
                              ? 'border-teal-500 bg-teal-500/10'
                              : 'border-slate-600 hover:border-slate-500'
                          }`}
                        >
                          <input
                            type="radio"
                            name="requestType"
                            value={type.value}
                            checked={formData.requestType === type.value}
                            onChange={handleInputChange}
                            className="sr-only"
                            required
                          />
                          <div className="flex items-start gap-3">
                            <Icon className={`h-5 w-5 mt-1 ${
                              formData.requestType === type.value ? 'text-teal-400' : 'text-slate-400'
                            }`} />
                            <div>
                              <h3 className="text-white font-medium">{type.label}</h3>
                              <p className="text-slate-300 text-sm mt-1">{type.description}</p>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </section>

                {/* Personal Information */}
                <section>
                  <h2 className="text-xl font-bold text-white mb-4">Your Information</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Enter your email address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Relationship to Data Subject *
                      </label>
                      <select
                        name="relationshipToSubject"
                        value={formData.relationshipToSubject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="self">Myself</option>
                        <option value="parent">Parent/Guardian</option>
                        <option value="legal">Legal Representative</option>
                        <option value="authorized">Authorized Agent</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* Data Subject Information (if different) */}
                {formData.relationshipToSubject !== 'self' && (
                  <section>
                    <h2 className="text-xl font-bold text-white mb-4">Data Subject Information</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Data Subject's Full Name *
                        </label>
                        <input
                          type="text"
                          name="dataSubjectName"
                          value={formData.dataSubjectName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Enter data subject's full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Data Subject's Email Address *
                        </label>
                        <input
                          type="email"
                          name="dataSubjectEmail"
                          value={formData.dataSubjectEmail}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Enter data subject's email address"
                        />
                      </div>
                    </div>
                  </section>
                )}

                {/* Request Details */}
                <section>
                  <h2 className="text-xl font-bold text-white mb-4">Request Details</h2>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Additional Information
                    </label>
                    <textarea
                      name="requestDetails"
                      value={formData.requestDetails}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Please provide any additional details about your request..."
                    />
                  </div>
                </section>

                {/* File Uploads */}
                <section>
                  <h2 className="text-xl font-bold text-white mb-4">Identity Verification</h2>
                  <p className="text-slate-300 mb-6">
                    To protect your privacy, we require identity verification for all data subject requests.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Identity Verification Document *
                      </label>
                      <input
                        type="file"
                        name="identityVerification"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        required
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-teal-600"
                      />
                      <p className="text-slate-400 text-xs mt-1">
                        Upload a government-issued ID (driver's license, passport, etc.)
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Additional Documents
                      </label>
                      <input
                        type="file"
                        name="additionalDocuments"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-500 file:text-white hover:file:bg-slate-600"
                      />
                      <p className="text-slate-400 text-xs mt-1">
                        Optional: Authorization forms, legal documents, etc.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Legal Notice */}
                <section className="bg-slate-700 p-6 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold mb-2">Important Notice</h3>
                      <p className="text-slate-300 text-sm">
                        By submitting this request, you confirm that the information provided is accurate and that 
                        you have the right to make this request. Fraudulent requests may be subject to legal action. 
                        We may contact you to verify your identity or request additional information.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-4 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Submit Request</span>
                      </>
                    )}
                  </button>
                </div>

                {submitStatus === 'error' && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      <span className="text-red-400 font-medium">Submission Failed</span>
                    </div>
                    <p className="text-red-300 mt-2 text-sm">
                      There was an error submitting your request. Please try again or contact us directly.
                    </p>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default DataSubjectRequest;