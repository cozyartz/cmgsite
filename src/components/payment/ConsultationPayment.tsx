import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PayPalPayment from './PayPalPayment';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Video, 
  CheckCircle,
  X
} from 'lucide-react';

interface ConsultationType {
  id: string;
  name: string;
  rate: number;
  duration: number;
  description: string;
  features: string[];
}

interface ConsultationPaymentProps {
  consultationId?: string;
  onSuccess?: (paymentResult: any) => void;
  onCancel?: () => void;
}

const ConsultationPayment: React.FC<ConsultationPaymentProps> = ({
  consultationId,
  onSuccess,
  onCancel
}) => {
  const { client } = useAuth();
  const [selectedType, setSelectedType] = useState<ConsultationType | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(120);
  const [scheduledDate, setScheduledDate] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [notes, setNotes] = useState('');

  const consultationTypes: ConsultationType[] = [
    {
      id: 'strategic',
      name: 'Strategic Advisory',
      rate: 250,
      duration: 120,
      description: 'High-level business strategy and planning sessions',
      features: [
        'Business strategy development',
        'Market analysis and positioning',
        'Growth planning and execution',
        'Competitive analysis',
        'Partnership opportunity assessment'
      ]
    },
    {
      id: 'partnership',
      name: 'Partnership Development',
      rate: 500,
      duration: 120,
      description: 'Leverage Fortune 500 network for business growth',
      features: [
        'Fortune 500 relationship leverage',
        'Joint venture opportunities',
        'Strategic partnership development',
        'Enterprise deal negotiation',
        'Executive introduction facilitation'
      ]
    },
    {
      id: 'implementation',
      name: 'Implementation Support',
      rate: 150,
      duration: 60,
      description: 'Technical setup and campaign optimization',
      features: [
        'Platform setup and training',
        'Campaign optimization',
        'Technical troubleshooting',
        'Performance monitoring',
        'Tool configuration'
      ]
    }
  ];

  const handleTypeSelect = (type: ConsultationType) => {
    setSelectedType(type);
    setSelectedDuration(type.duration);
  };

  const handleBooking = () => {
    if (!selectedType || !scheduledDate) {
      alert('Please select consultation type and date');
      return;
    }
    setShowPayment(true);
  };

  const calculateTotal = () => {
    if (!selectedType) return 0;
    return (selectedType.rate * selectedDuration) / 60; // Rate per hour
  };

  const handlePaymentSuccess = async (paymentResult: any) => {
    try {
      // Create consultation booking
      const response = await fetch('/api/consultations/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          clientId: client?.id,
          consultationType: selectedType!.id,
          duration: selectedDuration,
          scheduledAt: scheduledDate,
          notes,
          paymentId: paymentResult.payment.id,
          amount: calculateTotal()
        })
      });

      if (response.ok) {
        const consultation = await response.json();
        onSuccess?.(consultation);
        setShowPayment(false);
        // Show success message
        alert('Consultation booked successfully!');
      }
    } catch (error) {
      console.error('Consultation booking failed:', error);
      alert('Failed to book consultation');
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error);
    alert('Payment failed. Please try again.');
  };

  const getDiscount = () => {
    if (client?.subscription_tier === 'growth') return 0.1; // 10% discount
    if (client?.subscription_tier === 'enterprise') return 0.2; // 20% discount
    return 0;
  };

  const discountAmount = calculateTotal() * getDiscount();
  const finalAmount = calculateTotal() - discountAmount;

  if (showPayment && selectedType) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Complete Booking</h2>
          <button
            onClick={() => setShowPayment(false)}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Consultation Summary */}
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Consultation Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Type</span>
                <span className="text-white font-medium">{selectedType.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duration</span>
                <span className="text-white font-medium">{selectedDuration} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rate</span>
                <span className="text-white font-medium">${selectedType.rate}/hour</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Time</span>
                <span className="text-white font-medium">
                  {new Date(scheduledDate).toLocaleString()}
                </span>
              </div>
              
              <div className="border-t border-slate-700 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-white">${calculateTotal().toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      {client?.subscription_tier === 'growth' ? 'Growth' : 'Enterprise'} Discount
                    </span>
                    <span className="text-green-400">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-700 pt-2 mt-2">
                  <span className="text-white font-medium">Total</span>
                  <span className="text-teal-400 font-bold">${finalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-400">
                <Video className="h-4 w-4 inline mr-2" />
                Meeting link will be sent after payment
              </p>
            </div>

            {notes && (
              <div className="mt-4 p-3 bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-400 mb-1">Session Notes:</p>
                <p className="text-white text-sm">{notes}</p>
              </div>
            )}
          </div>

          {/* Payment Form */}
          <PayPalPayment
            amount={finalAmount}
            description={`${selectedType.name} Consultation`}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            buttonText="Book Consultation"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Book a Consultation</h2>
        <p className="text-slate-400">
          Get expert guidance tailored to your business needs
        </p>
      </div>

      {/* Consultation Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {consultationTypes.map((type) => (
          <div
            key={type.id}
            className={`bg-slate-800 p-6 rounded-lg border cursor-pointer transition-all ${
              selectedType?.id === type.id 
                ? 'border-teal-400 ring-2 ring-teal-400/20' 
                : 'border-slate-700 hover:border-slate-600'
            }`}
            onClick={() => handleTypeSelect(type)}
          >
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-white mb-2">{type.name}</h3>
              <div className="mb-2">
                <span className="text-2xl font-bold text-teal-400">${type.rate}</span>
                <span className="text-slate-400">/hour</span>
              </div>
              <p className="text-slate-300 text-sm">{type.description}</p>
            </div>

            <div className="space-y-2 mb-4">
              {type.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-teal-400 mr-2 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center text-sm text-slate-400">
              <Clock className="h-4 w-4 mr-1" />
              {type.duration} min sessions
            </div>
          </div>
        ))}
      </div>

      {/* Booking Details */}
      {selectedType && (
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Booking Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Duration
              </label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(Number(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
                <option value={120}>120 minutes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Preferred Date & Time
              </label>
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Session Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What would you like to discuss in this session?"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={3}
            />
          </div>

          {/* Pricing Summary */}
          <div className="mt-6 p-4 bg-slate-700 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white font-medium">
                  {selectedType.name} • {selectedDuration} min
                </p>
                <p className="text-slate-400 text-sm">
                  ${selectedType.rate}/hour • {getDiscount() > 0 ? `${(getDiscount() * 100).toFixed(0)}% discount applied` : 'No discount'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-teal-400 font-bold text-lg">
                  ${finalAmount.toFixed(2)}
                </p>
                {discountAmount > 0 && (
                  <p className="text-sm text-slate-400 line-through">
                    ${calculateTotal().toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleBooking}
            disabled={!selectedType || !scheduledDate}
            className="w-full mt-4 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <DollarSign className="h-4 w-4" />
            <span>Proceed to Payment</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ConsultationPayment;