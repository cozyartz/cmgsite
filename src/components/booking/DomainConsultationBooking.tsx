import React, { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign, CheckCircle, AlertCircle, Phone, Video, Users } from 'lucide-react';

interface DomainConsultationBookingProps {
  userId?: string;
  onBookingComplete?: (bookingId: string) => void;
}

interface BookingData {
  selectedDate: string;
  selectedTime: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  projectDetails: string;
  meetingType: 'phone' | 'video' | 'in-person';
  urgency: 'standard' | 'urgent';
}

const DomainConsultationBooking: React.FC<DomainConsultationBookingProps> = ({
  userId,
  onBookingComplete
}) => {
  const [step, setStep] = useState<'form' | 'payment' | 'booking' | 'confirmation'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<BookingData>({
    selectedDate: '',
    selectedTime: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    projectDetails: '',
    meetingType: 'video',
    urgency: 'standard'
  });
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Pricing based on urgency and type
  const getPricing = () => {
    const basePrice = 50.00; // $50 for standard consultation
    const urgentSurcharge = bookingData.urgency === 'urgent' ? 25.00 : 0;
    const inPersonSurcharge = bookingData.meetingType === 'in-person' ? 25.00 : 0;
    
    return {
      basePrice,
      urgentSurcharge,
      inPersonSurcharge,
      total: basePrice + urgentSurcharge + inPersonSurcharge
    };
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData.clientName || !bookingData.clientEmail || !bookingData.projectDetails) {
      setError('Please fill in all required fields');
      return;
    }
    setError(null);
    setStep('payment');
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    setPaymentId(paymentId);
    setStep('booking');
    await processCalComBooking();
  };

  const processCalComBooking = async () => {
    setLoading(true);
    try {
      // First, create the booking with Cal.com
      const calBookingResponse = await fetch('/api/cal-com/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventTypeId: 'domain-meeting', // Cal.com event type
          start: `${bookingData.selectedDate}T${bookingData.selectedTime}:00`,
          attendee: {
            name: bookingData.clientName,
            email: bookingData.clientEmail,
            phone: bookingData.clientPhone,
          },
          metadata: {
            projectDetails: bookingData.projectDetails,
            meetingType: bookingData.meetingType,
            urgency: bookingData.urgency,
            paymentId: paymentId,
            userId: userId
          }
        }),
      });

      if (!calBookingResponse.ok) {
        throw new Error('Failed to create Cal.com booking');
      }

      const calBookingData = await calBookingResponse.json();
      
      // Then save the booking to our database
      const dbResponse = await fetch('/api/bookings/domain-consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingData,
          paymentId,
          calComBookingId: calBookingData.id,
          calComBookingUid: calBookingData.uid,
          meetingUrl: calBookingData.meetingUrl,
          pricing: getPricing(),
          status: 'confirmed',
          userId
        }),
      });

      if (!dbResponse.ok) {
        throw new Error('Failed to save booking to database');
      }

      const dbBookingData = await dbResponse.json();
      setBookingId(dbBookingData.id);
      setStep('confirmation');
      
      // Send confirmation email
      await sendConfirmationEmail(dbBookingData);
      
      onBookingComplete?.(dbBookingData.id);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete booking');
      setStep('payment');
    } finally {
      setLoading(false);
    }
  };

  const sendConfirmationEmail = async (booking: any) => {
    try {
      await fetch('/api/email/booking-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: bookingData.clientEmail,
          booking: booking,
          calComUrl: `https://cal.com/team/cozyartz/domain-meeting`
        }),
      });
    } catch (err) {
      console.error('Failed to send confirmation email:', err);
    }
  };

  const PayPalButton = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete Payment</h3>
      
      <div className="mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Domain Consultation</span>
            <span className="text-sm font-medium">${getPricing().basePrice.toFixed(2)}</span>
          </div>
          
          {getPricing().urgentSurcharge > 0 && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Urgent Consultation</span>
              <span className="text-sm font-medium">+${getPricing().urgentSurcharge.toFixed(2)}</span>
            </div>
          )}
          
          {getPricing().inPersonSurcharge > 0 && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">In-Person Meeting</span>
              <span className="text-sm font-medium">+${getPricing().inPersonSurcharge.toFixed(2)}</span>
            </div>
          )}
          
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-lg font-semibold text-blue-600">${getPricing().total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div id="paypal-button-container">
        {/* PayPal button will be rendered here */}
      </div>
    </div>
  );

  // Initialize PayPal when step changes to payment
  useEffect(() => {
    if (step === 'payment' && !loading) {
      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=your_paypal_client_id&currency=USD';
      script.async = true;
      script.onload = () => {
        if (window.paypal) {
          window.paypal.Buttons({
            createOrder: (data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: getPricing().total.toFixed(2),
                    currency_code: 'USD'
                  },
                  description: `Domain Consultation - ${bookingData.urgency === 'urgent' ? 'Urgent' : 'Standard'}`,
                  custom_id: `domain-consultation-${Date.now()}`,
                  invoice_id: `DC-${Date.now()}`
                }]
              });
            },
            onApprove: async (data: any, actions: any) => {
              const order = await actions.order.capture();
              await handlePaymentSuccess(order.id);
            },
            onError: (err: any) => {
              console.error('PayPal error:', err);
              setError('Payment failed. Please try again.');
            }
          }).render('#paypal-button-container');
        }
      };
      document.head.appendChild(script);
    }
  }, [step, loading]);

  if (step === 'form') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <Calendar className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Domain Consultation Booking</h2>
            <p className="text-gray-600">Get expert advice on your domain strategy and requirements</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={bookingData.clientName}
                  onChange={(e) => setBookingData({...bookingData, clientName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={bookingData.clientEmail}
                  onChange={(e) => setBookingData({...bookingData, clientEmail: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={bookingData.clientPhone}
                  onChange={(e) => setBookingData({...bookingData, clientPhone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Type
                </label>
                <select
                  value={bookingData.meetingType}
                  onChange={(e) => setBookingData({...bookingData, meetingType: e.target.value as 'phone' | 'video' | 'in-person'})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="video">Video Call</option>
                  <option value="phone">Phone Call</option>
                  <option value="in-person">In-Person (+$25)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="urgency"
                    value="standard"
                    checked={bookingData.urgency === 'standard'}
                    onChange={(e) => setBookingData({...bookingData, urgency: 'standard'})}
                    className="mr-2"
                  />
                  <span className="text-sm">Standard ($50)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="urgency"
                    value="urgent"
                    checked={bookingData.urgency === 'urgent'}
                    onChange={(e) => setBookingData({...bookingData, urgency: 'urgent'})}
                    className="mr-2"
                  />
                  <span className="text-sm">Urgent - Next 24hrs (+$25)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Details *
              </label>
              <textarea
                required
                rows={4}
                value={bookingData.projectDetails}
                onChange={(e) => setBookingData({...bookingData, projectDetails: e.target.value})}
                placeholder="Please describe your domain needs, current situation, and what you'd like to discuss..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-blue-800 font-medium">
                    Total: ${getPricing().total.toFixed(2)}
                  </span>
                </div>
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Proceed to Payment & Booking
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <PayPalButton />
      </div>
    );
  }

  if (step === 'booking') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Booking Your Meeting</h3>
          <p className="text-gray-600">Please wait while we schedule your domain consultation...</p>
        </div>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h3>
          <p className="text-gray-600 mb-6">
            Your domain consultation has been successfully booked and paid for.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Booking ID:</span>
                <span className="text-sm text-gray-900">{bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Payment ID:</span>
                <span className="text-sm text-gray-900">{paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Amount Paid:</span>
                <span className="text-sm text-gray-900">${getPricing().total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              ✅ Calendar invitation sent to {bookingData.clientEmail}<br />
              ✅ Meeting link will be provided before the call<br />
              ✅ Confirmation email sent with all details
            </p>
            
            <div className="flex justify-center space-x-4">
              <a
                href="https://cal.com/team/cozyartz/domain-meeting"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Calendar className="w-4 h-4 mr-2" />
                View on Cal.com
              </a>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Book Another Meeting
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DomainConsultationBooking;