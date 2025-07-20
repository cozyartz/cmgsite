import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { apiService } from '../../lib/api';
import ConsultationPayment from '../payment/ConsultationPayment';
import { 
  Calendar, 
  Clock, 
  Video, 
  Phone, 
  DollarSign, 
  User, 
  CheckCircle,
  XCircle,
  Plus,
  FileText,
  Download,
  X
} from 'lucide-react';

interface Consultation {
  id: string;
  type: 'strategic' | 'partnership' | 'implementation';
  title: string;
  duration: number;
  hourlyRate: number;
  scheduledAt: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  recordingUrl?: string;
}

const Consultations: React.FC = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedType, setSelectedType] = useState<'strategic' | 'partnership' | 'implementation'>('strategic');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const response = await apiService.call('/api/consultations', {
        requireAuth: true
      });
      
      setConsultations(response);
    } catch (error) {
      console.error('Failed to fetch consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const consultationTypes = [
    {
      id: 'strategic' as const,
      name: 'Strategic Advisory',
      description: 'High-level business strategy and planning sessions',
      rate: 250,
      duration: 120,
      features: [
        'Business strategy development',
        'Market analysis and positioning',
        'Growth planning and execution',
        'Competitive analysis'
      ]
    },
    {
      id: 'partnership' as const,
      name: 'Partnership Development',
      description: 'Leverage Fortune 500 network for business growth',
      rate: 500,
      duration: 120,
      features: [
        'Fortune 500 relationship leverage',
        'Joint venture opportunities',
        'Strategic partnership development',
        'Enterprise deal negotiation'
      ]
    },
    {
      id: 'implementation' as const,
      name: 'Implementation Support',
      description: 'Technical setup and campaign optimization',
      rate: 150,
      duration: 60,
      features: [
        'Platform setup and training',
        'Campaign optimization',
        'Technical troubleshooting',
        'Performance monitoring'
      ]
    }
  ];

  const mockConsultations: Consultation[] = [
    {
      id: '1',
      type: 'strategic',
      title: 'Q1 Strategic Planning Session',
      duration: 120,
      hourlyRate: 250,
      scheduledAt: '2024-01-20T14:00:00Z',
      status: 'scheduled',
      notes: 'Focus on partnership expansion strategy'
    },
    {
      id: '2',
      type: 'implementation',
      title: 'Platform Setup Review',
      duration: 60,
      hourlyRate: 150,
      scheduledAt: '2024-01-15T10:00:00Z',
      status: 'completed',
      notes: 'Covered dashboard customization and AI tool setup',
      recordingUrl: '/recordings/session-2.mp4'
    },
    {
      id: '3',
      type: 'partnership',
      title: 'Fortune 500 Outreach Strategy',
      duration: 120,
      hourlyRate: 500,
      scheduledAt: '2024-01-10T16:00:00Z',
      status: 'completed',
      notes: 'Identified 5 key Fortune 500 prospects for partnership discussions',
      recordingUrl: '/recordings/session-3.mp4'
    }
  ];

  const data = consultations.length > 0 ? consultations : mockConsultations;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-400';
      case 'completed': return 'text-green-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const bookConsultation = async (type: string, scheduledAt: string) => {
    try {
      await apiService.call('/api/consultations', {
        method: 'POST',
        body: {
          type,
          scheduledAt,
          clientId: user?.id
        },
        requireAuth: true
      });

      setShowBookingModal(false);
      fetchConsultations();
    } catch (error) {
      console.error('Failed to book consultation:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-800 p-6 rounded-lg">
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-slate-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Consultations</h1>
          <p className="text-slate-400">Book expert sessions and review past consultations</p>
        </div>
        <button
          onClick={() => setShowBookingModal(true)}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Book Consultation</span>
        </button>
      </div>

      {/* Consultation Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {consultationTypes.map((type) => (
          <div key={type.id} className="bg-slate-800 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{type.name}</h3>
              <div className="text-right">
                <p className="text-teal-400 font-bold">${type.rate}/hour</p>
                <p className="text-slate-400 text-sm">{type.duration} min sessions</p>
              </div>
            </div>
            
            <p className="text-slate-300 text-sm mb-4">{type.description}</p>
            
            <ul className="space-y-2 mb-6">
              {type.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-slate-300">
                  <CheckCircle className="h-4 w-4 text-teal-400 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <button
              onClick={() => {
                setSelectedType(type.id);
                setShowBookingModal(true);
              }}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Book Session
            </button>
          </div>
        ))}
      </div>

      {/* Upcoming Consultations */}
      <div className="bg-slate-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Upcoming Sessions</h3>
        <div className="space-y-4">
          {data.filter(c => c.status === 'scheduled').map((consultation) => (
            <div key={consultation.id} className="border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-teal-400">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{consultation.title}</h4>
                    <p className="text-slate-400 text-sm">{formatDate(consultation.scheduledAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">${consultation.hourlyRate}/hour</p>
                  <p className="text-slate-400 text-sm">{consultation.duration} minutes</p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={getStatusColor(consultation.status)}>
                    {getStatusIcon(consultation.status)}
                  </div>
                  <span className={`text-sm capitalize ${getStatusColor(consultation.status)}`}>
                    {consultation.status}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors">
                    <Video className="h-4 w-4" />
                  </button>
                  <button className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors">
                    <Phone className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Consultations */}
      <div className="bg-slate-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Past Sessions</h3>
        <div className="space-y-4">
          {data.filter(c => c.status === 'completed').map((consultation) => (
            <div key={consultation.id} className="border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-green-400">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{consultation.title}</h4>
                    <p className="text-slate-400 text-sm">{formatDate(consultation.scheduledAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">${consultation.hourlyRate}/hour</p>
                  <p className="text-slate-400 text-sm">{consultation.duration} minutes</p>
                </div>
              </div>
              
              {consultation.notes && (
                <div className="mt-4 p-3 bg-slate-700 rounded-lg">
                  <p className="text-slate-300 text-sm">{consultation.notes}</p>
                </div>
              )}
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-400">Completed</span>
                </div>
                <div className="flex space-x-2">
                  {consultation.recordingUrl && (
                    <button className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors">
                      <Video className="h-4 w-4" />
                    </button>
                  )}
                  <button className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors">
                    <FileText className="h-4 w-4" />
                  </button>
                  <button className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Consultation Hours */}
      <div className="bg-slate-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Consultation Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-teal-400">8</p>
            <p className="text-slate-400">Total Sessions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-teal-400">14</p>
            <p className="text-slate-400">Hours Consulted</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-teal-400">$3,200</p>
            <p className="text-slate-400">Total Investment</p>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-900 p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Book Consultation</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <ConsultationPayment
              onSuccess={() => {
                setShowBookingModal(false);
                fetchConsultations();
              }}
              onCancel={() => setShowBookingModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Consultations;