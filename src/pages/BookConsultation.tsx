import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/SupabaseAuthContext';
import DomainConsultationBooking from '../components/booking/DomainConsultationBooking';

const BookConsultation: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBookingComplete = (bookingId: string) => {
    // Redirect to client portal or booking confirmation page
    navigate('/client-portal?tab=bookings');
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 shadow-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/client-portal')}
                className="flex items-center text-white hover:text-slate-300 transition-colors mr-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </button>
              <h1 className="text-xl font-semibold text-white">Book Domain Consultation</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-300">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <DomainConsultationBooking 
          userId={user?.id}
          onBookingComplete={handleBookingComplete}
        />
      </div>
    </div>
  );
};

export default BookConsultation;