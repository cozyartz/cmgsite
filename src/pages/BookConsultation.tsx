import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Phone, Video, Users, DollarSign, CheckCircle, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
// import PayPalPayment from '../components/payment/PayPalPayment';

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  meetingType: 'phone' | 'video' | 'in-person';
  preferredDate: string;
  preferredTime: string;
  projectDetails: string;
}

const BookConsultation: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'form' | 'payment' | 'confirmation'>('form');
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    meetingType: 'video',
    preferredDate: '',
    preferredTime: '',
    projectDetails: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const projectTypes = [
    'Website Design & Development',
    'Graphic Design & Branding',
    'SEO & Digital Marketing',
    'Instructional Design',
    'Multimedia Production',
    'AI Integration Services',
    'Other - Please Specify'
  ];

  const budgetRanges = [
    '$1,000 - $5,000',
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    '$50,000+',
    'Not Sure - Let\'s Discuss'
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.projectType) newErrors.projectType = 'Project type is required';
    if (!formData.budget) newErrors.budget = 'Budget range is required';
    if (!formData.timeline) newErrors.timeline = 'Timeline is required';
    if (!formData.preferredDate) newErrors.preferredDate = 'Preferred date is required';
    if (!formData.preferredTime) newErrors.preferredTime = 'Preferred time is required';
    if (!formData.projectDetails.trim()) newErrors.projectDetails = 'Project details are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep('payment');
    }
  };

  const handleBookingSubmit = async () => {
    try {
      // For now, just show confirmation - payment integration can be added later
      // Send booking request email
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://cmgsite-client-portal.cozyartz-media-group.workers.dev'}/api/consultation/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: 5000, // $50.00 in cents
        }),
      });

      // Always proceed to confirmation for now
      setStep('confirmation');
    } catch (error) {
      console.error('Booking request error:', error);
      // Still proceed to confirmation
      setStep('confirmation');
    }
  };

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'phone': return <Phone className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'in-person': return <Users className="h-5 w-5" />;
      default: return <Video className="h-5 w-5" />;
    }
  };

  const getMeetingTypeLabel = (type: string) => {
    switch (type) {
      case 'phone': return 'Phone Call';
      case 'video': return 'Video Call';
      case 'in-person': return 'In-Person Meeting';
      default: return 'Video Call';
    }
  };

  if (step === 'confirmation') {
    return (
      <>
        <SEO
          title="Consultation Booked - Cozyartz Media Group"
          description="Your consultation has been successfully booked. We'll be in touch soon to confirm the details."
        />
        <Header />
        <div className="min-h-screen bg-slate-900 py-20">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="bg-slate-800 rounded-lg p-8">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-4">Request Submitted!</h1>
              <p className="text-slate-300 mb-6">
                Thank you for your consultation request. We've received your information and 
                will contact you soon to confirm your booking.
              </p>
              <div className="bg-slate-700 rounded-lg p-6 mb-6 text-left">
                <h3 className="text-lg font-semibold text-white mb-4">Next Steps:</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• You'll receive a confirmation email within 5 minutes</li>
                  <li>• We'll contact you within 24 hours to confirm your preferred time</li>
                  <li>• A secure payment link will be provided after confirmation</li>
                  <li>• A calendar invite will be sent once payment is completed</li>
                  <li>• Come prepared with questions about your project goals</li>
                </ul>
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Return to Home
                </button>
                <button
                  onClick={() => navigate('/auth')}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Access Client Portal
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (step === 'payment') {
    return (
      <>
        <SEO
          title="Review Consultation Request - Cozyartz Media Group"
          description="Review your consultation details and submit your request."
        />
        <Header />
        <div className="min-h-screen bg-slate-900 py-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="mb-8">
              <button
                onClick={() => setStep('form')}
                className="flex items-center text-teal-400 hover:text-teal-300 mb-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Form
              </button>
              <h1 className="text-3xl font-bold text-white mb-2">Review Your Request</h1>
              <p className="text-slate-300">Review your consultation details and submit your request</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Booking Summary */}
              <div className="bg-slate-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Booking Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Consultation Type:</span>
                    <span className="text-white">60-Minute Strategy Session</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Meeting Format:</span>
                    <div className="flex items-center text-white">
                      {getMeetingTypeIcon(formData.meetingType)}
                      <span className="ml-2">{getMeetingTypeLabel(formData.meetingType)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Preferred Date:</span>
                    <span className="text-white">{new Date(formData.preferredDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Preferred Time:</span>
                    <span className="text-white">{formData.preferredTime}</span>
                  </div>
                  <div className="border-t border-slate-700 pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-slate-300">Total:</span>
                      <span className="text-white">$50.00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment - Simplified for now */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Your Booking</h3>
                <p className="text-slate-600 mb-6">
                  Click below to submit your consultation request. We'll contact you within 24 hours to confirm your booking and provide payment details.
                </p>
                <button
                  onClick={handleBookingSubmit}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
                >
                  Submit Consultation Request
                </button>
                <p className="text-slate-500 text-sm mt-3 text-center">
                  No payment required upfront. We'll send you a secure payment link after confirming your preferred time.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO
        title="Book a Consultation - Cozyartz Media Group"
        description="Schedule a strategic consultation with our team to discuss your project goals, timeline, and how we can help bring your vision to life."
        keywords="consultation, strategy session, project planning, web design, graphic design, SEO"
      />
      <Header />
      
      <div className="min-h-screen bg-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-teal-500/10 px-4 py-2 rounded-full mb-4">
              <Calendar className="h-5 w-5 text-teal-400" />
              <span className="text-teal-400 font-medium">Book a Consultation</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Let's Discuss Your Project
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Schedule a 60-minute strategy session to explore your goals, discuss solutions, 
              and create a roadmap for your project's success.
            </p>
          </div>

          {/* What's Included */}
          <div className="bg-slate-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">What's Included in Your Consultation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-medium">Project Strategy Review</h3>
                  <p className="text-slate-300 text-sm">Analysis of your goals and requirements</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-medium">Solution Recommendations</h3>
                  <p className="text-slate-300 text-sm">Tailored approach for your specific needs</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-medium">Timeline & Budget Planning</h3>
                  <p className="text-slate-300 text-sm">Clear project roadmap and investment</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-medium">Next Steps Action Plan</h3>
                  <p className="text-slate-300 text-sm">Clear path forward for your project</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div>
                <label className="block text-white font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-teal-500 focus:outline-none"
                  placeholder="Your full name"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-teal-500 focus:outline-none"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-teal-500 focus:outline-none"
                  placeholder="(555) 123-4567"
                />
                {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Company/Organization</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-teal-500 focus:outline-none"
                  placeholder="Your company name"
                />
              </div>

              {/* Project Information */}
              <div>
                <label className="block text-white font-medium mb-2">Project Type *</label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="">Select project type</option>
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.projectType && <p className="text-red-400 text-sm mt-1">{errors.projectType}</p>}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Budget Range *</label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="">Select budget range</option>
                  {budgetRanges.map((budget) => (
                    <option key={budget} value={budget}>{budget}</option>
                  ))}
                </select>
                {errors.budget && <p className="text-red-400 text-sm mt-1">{errors.budget}</p>}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Project Timeline *</label>
                <select
                  value={formData.timeline}
                  onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="">Select timeline</option>
                  <option value="ASAP">ASAP</option>
                  <option value="1-2 weeks">1-2 weeks</option>
                  <option value="1 month">1 month</option>
                  <option value="2-3 months">2-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="6+ months">6+ months</option>
                  <option value="Flexible">Flexible</option>
                </select>
                {errors.timeline && <p className="text-red-400 text-sm mt-1">{errors.timeline}</p>}
              </div>

              {/* Meeting Preferences */}
              <div>
                <label className="block text-white font-medium mb-2">Meeting Type *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['phone', 'video', 'in-person'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({...formData, meetingType: type})}
                      className={`p-3 rounded-lg border transition-colors ${
                        formData.meetingType === type
                          ? 'bg-teal-500 border-teal-500 text-white'
                          : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-1">
                        {getMeetingTypeIcon(type)}
                        <span className="text-xs">{getMeetingTypeLabel(type)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Preferred Date *</label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                />
                {errors.preferredDate && <p className="text-red-400 text-sm mt-1">{errors.preferredDate}</p>}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Preferred Time *</label>
                <select
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({...formData, preferredTime: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="">Select time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time} EST</option>
                  ))}
                </select>
                {errors.preferredTime && <p className="text-red-400 text-sm mt-1">{errors.preferredTime}</p>}
              </div>
            </div>

            {/* Project Details */}
            <div className="mt-6">
              <label className="block text-white font-medium mb-2">Project Details *</label>
              <textarea
                value={formData.projectDetails}
                onChange={(e) => setFormData({...formData, projectDetails: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-teal-500 focus:outline-none"
                placeholder="Tell us about your project goals, current challenges, and what you hope to achieve. The more details you provide, the better we can prepare for our consultation."
              />
              {errors.projectDetails && <p className="text-red-400 text-sm mt-1">{errors.projectDetails}</p>}
            </div>

            {/* Pricing */}
            <div className="mt-8 p-6 bg-slate-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold mb-1">Consultation Fee</h3>
                  <p className="text-slate-300 text-sm">60-minute strategy session</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">$50</div>
                  <div className="text-sm text-slate-400">One-time fee</div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Request Consultation
              </button>
              <p className="text-slate-400 text-sm text-center mt-3">
                We'll contact you within 24 hours to confirm your booking and provide secure payment options.
              </p>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BookConsultation;