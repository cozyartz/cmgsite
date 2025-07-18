// Cal.com API Integration Library
// Documentation: https://cal.com/docs/api

interface CalComBookingRequest {
  eventTypeId: string;
  start: string; // ISO date string
  attendee: {
    name: string;
    email: string;
    phone?: string;
  };
  metadata?: Record<string, any>;
}

interface CalComBookingResponse {
  id: number;
  uid: string;
  title: string;
  startTime: string;
  endTime: string;
  attendees: Array<{
    name: string;
    email: string;
    timeZone: string;
  }>;
  meetingUrl?: string;
  status: string;
}

class CalComService {
  private apiUrl = 'https://api.cal.com/v1';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.apiUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Cal.com API error: ${response.status}`);
    }

    return response.json();
  }

  async createBooking(bookingData: CalComBookingRequest): Promise<CalComBookingResponse> {
    return this.makeRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getBooking(bookingId: string): Promise<CalComBookingResponse> {
    return this.makeRequest(`/bookings/${bookingId}`);
  }

  async updateBooking(bookingId: string, updateData: Partial<CalComBookingRequest>): Promise<CalComBookingResponse> {
    return this.makeRequest(`/bookings/${bookingId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  }

  async cancelBooking(bookingId: string, reason?: string): Promise<{ message: string }> {
    return this.makeRequest(`/bookings/${bookingId}/cancel`, {
      method: 'DELETE',
      body: JSON.stringify({ reason }),
    });
  }

  async getEventTypes(): Promise<any[]> {
    return this.makeRequest('/event-types');
  }

  async getAvailability(eventTypeId: string, dateFrom: string, dateTo: string): Promise<any> {
    const params = new URLSearchParams({
      eventTypeId,
      dateFrom,
      dateTo,
    });
    return this.makeRequest(`/availability?${params}`);
  }

  // Helper method to create domain consultation booking
  async createDomainConsultationBooking(bookingDetails: {
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    selectedDateTime: string;
    projectDetails: string;
    meetingType: 'phone' | 'video' | 'in-person';
    urgency: 'standard' | 'urgent';
    paymentId: string;
    userId?: string;
  }): Promise<CalComBookingResponse> {
    const bookingData: CalComBookingRequest = {
      eventTypeId: 'domain-meeting', // This should match your Cal.com event type slug
      start: bookingDetails.selectedDateTime,
      attendee: {
        name: bookingDetails.clientName,
        email: bookingDetails.clientEmail,
        phone: bookingDetails.clientPhone,
      },
      metadata: {
        projectDetails: bookingDetails.projectDetails,
        meetingType: bookingDetails.meetingType,
        urgency: bookingDetails.urgency,
        paymentId: bookingDetails.paymentId,
        userId: bookingDetails.userId,
        bookingSource: 'cozyartz-client-portal',
        timestamp: new Date().toISOString(),
      },
    };

    return this.createBooking(bookingData);
  }
}

export default CalComService;
export type { CalComBookingRequest, CalComBookingResponse };