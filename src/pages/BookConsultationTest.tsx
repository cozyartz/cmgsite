import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const BookConsultationTest: React.FC = () => {
  return (
    <>
      <SEO
        title="Book Consultation Test - Cozyartz Media Group"
        description="Test booking page"
      />
      <Header />
      
      <div className="min-h-screen bg-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Book a Consultation - Test Page
            </h1>
            <p className="text-slate-300 text-lg">
              This is a simple test version to verify the booking page works.
            </p>
            
            <div className="mt-8 bg-slate-800 rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Form</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    placeholder="Tell us about your project"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BookConsultationTest;