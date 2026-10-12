import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle, AlertCircle, ExternalLink, Instagram, Facebook } from 'lucide-react';
import { BusinessSettings } from '../types/index.js';

interface ContactPageProps {
  settings: BusinessSettings;
  onOpenQuoteModal: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings, onOpenQuoteModal }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    message: '',
    company_website: '', // honeypot
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || formData.phone.length < 10) {
      setError('Please provide your name and a valid 10-digit phone number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          mobileNumber: formData.phone,
          city: formData.city || 'Not specified',
          category: 'General Inquiry / Contact Form',
          productNameOrCode: 'General Showroom Inquiry',
          wallDimensions: 'Not provided',
          quantityRequired: 'Information requested',
          installationRequired: false,
          additionalMessage: formData.message,
          company_website: formData.company_website,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message.');

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Error sending message. Please chat on WhatsApp directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
          Get In Touch
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl text-stone-900 mt-1">
          Contact Our Materials Showroom
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-xl">
          Visit our sample showroom, request on-site wall measurement, or connect directly with our interior wall specialists on WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info (Left) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-serif-luxury text-xl text-stone-900 border-b border-stone-100 pb-2">
              Showroom Details
            </h3>

            <div className="space-y-3.5 text-xs text-stone-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-800 block">Address:</span>
                  <span>{settings.address}, {settings.city}, {settings.state} – {settings.pincode}</span>
                  {settings.googleMapsUrl && (
                    <div className="mt-1">
                      <a
                        href={settings.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-700 hover:text-amber-800 font-medium inline-flex items-center gap-1"
                      >
                        <span>Open on Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-800 block">Phone Support:</span>
                  <a href={`tel:${settings.phone}`} className="hover:text-stone-900">
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-800 block">WhatsApp Desk:</span>
                  <a
                    href={`https://wa.me/${cleanPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:underline font-medium"
                  >
                    {settings.whatsappNumber} (Instant Response)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-800 block">Email Inquiries:</span>
                  <a href={`mailto:${settings.email}`} className="hover:text-stone-900">
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-800 block">Showroom Hours:</span>
                  <span>{settings.businessHours}</span>
                </div>
              </div>
            </div>

            {/* Social Media links */}
            <div className="pt-3 border-t border-stone-100">
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block mb-2">
                Follow Design Updates:
              </span>
              <div className="flex items-center gap-2">
                {settings.instagramUrl && (
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded bg-stone-100 text-stone-700 hover:text-amber-800 hover:bg-stone-200 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {settings.facebookUrl && (
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded bg-stone-100 text-stone-700 hover:text-amber-800 hover:bg-stone-200 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (Right) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-lg border border-stone-200 shadow-xs">
          <h3 className="font-serif-luxury text-2xl text-stone-900 mb-2">
            Send an Inquiry Message
          </h3>
          <p className="text-xs text-stone-500 mb-6">
            Leave your contact details and message. A showroom representative will reply via WhatsApp or phone within business hours.
          </p>

          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="font-serif-luxury text-xl text-stone-900">Message Received</h4>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                Thank you for contacting {settings.businessName}. We have logged your request and our design consultant will reach out shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', phone: '', city: '', message: '', company_website: '' });
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold bg-stone-900 text-stone-100 rounded"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Anti-spam honeypot */}
              <input
                type="text"
                name="company_website"
                className="hidden"
                value={formData.company_website}
                onChange={(e) => setFormData({ ...formData, company_website: e.target.value })}
                tabIndex={-1}
              />

              {error && (
                <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Your Name <span className="text-amber-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Kapoor"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Mobile Number (WhatsApp) <span className="text-amber-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98200 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    City / Pincode
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, 400053"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  How can we help you?
                </label>
                <textarea
                  rows={3}
                  placeholder="Inquiring about fluted louvers, wallpapers, sample catalog, or quotation..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500 resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:flex-1 py-2.5 px-4 rounded bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? 'Sending...' : 'Send Message'}</span>
                </button>

                <a
                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${settings.businessName}, I would like to make an inquiry.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-2.5 px-4 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
