import React, { useState } from 'react';
import { X, Send, MessageCircle, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { BusinessSettings } from '../types/index.js';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BusinessSettings;
  initialProductInfo?: { name: string; sku: string; category?: string };
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  settings,
  initialProductInfo,
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    mobileNumber: '',
    city: '',
    category: initialProductInfo?.category || 'WPC Fluted Louvers',
    productNameOrCode: initialProductInfo ? `${initialProductInfo.name} (${initialProductInfo.sku})` : '',
    wallDimensions: '',
    quantityRequired: '',
    installationRequired: true,
    additionalMessage: '',
    // Honeypot fields for anti-spam
    company_website: '',
    fax_number: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ id: string; message: string } | null>(null);

  if (!isOpen) return null;

  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Frontend validation
    if (!formData.customerName.trim()) {
      setError('Please provide your name.');
      return;
    }
    const cleanNum = formData.mobileNumber.replace(/[^0-9+]/g, '');
    if (cleanNum.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.city.trim()) {
      setError('Please enter your city to calculate delivery and installation.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit quotation inquiry.');
      }

      setSuccessData({
        id: data.quotationId,
        message: data.message,
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your quotation.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppAlternative = () => {
    const text = `Hi ${settings.businessName},\nI would like to request an estimate:\n- Name: ${formData.customerName || 'Inquirer'}\n- City: ${formData.city || 'Not specified'}\n- Product/SKU: ${formData.productNameOrCode || 'General Catalog'}\n- Dimensions: ${formData.wallDimensions || 'To be measured'}\n- Installation: ${formData.installationRequired ? 'Yes' : 'No'}`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-lg shadow-2xl text-stone-100 p-6 my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white rounded-full bg-stone-800 hover:bg-stone-700 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {successData ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-serif-luxury text-2xl text-amber-100">Quotation Request Received</h3>
            <p className="text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
              {successData.message}
            </p>
            <div className="bg-stone-950 border border-stone-800 p-3 rounded text-xs text-stone-400 font-mono">
              Reference ID: {successData.id}
            </div>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleWhatsAppAlternative}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                Also Forward to WhatsApp
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h3 className="font-serif-luxury text-2xl text-amber-100">
                Request Detailed Quotation
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Receive customized product pricing, roll/panel quantity calculation, and optional turnkey installation charges.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Anti-spam honeypot (hidden from real users) */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="company_website"
                  tabIndex={-1}
                  value={formData.company_website}
                  onChange={(e) => setFormData({ ...formData, company_website: e.target.value })}
                  autoComplete="off"
                />
                <input
                  type="text"
                  name="fax_number"
                  tabIndex={-1}
                  value={formData.fax_number}
                  onChange={(e) => setFormData({ ...formData, fax_number: e.target.value })}
                  autoComplete="off"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Your Full Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Sharma"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-sm text-stone-100 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Mobile Number (WhatsApp) <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98200 12345"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-sm text-stone-100 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    City / Location <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai, Pune, Thane"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-sm text-stone-100 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Product Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-sm text-stone-100 focus:outline-hidden focus:border-amber-400"
                  >
                    <option value="Designer Wallpapers">Designer Wallpapers</option>
                    <option value="WPC Fluted Louvers">WPC Fluted Louvers</option>
                    <option value="UV Marble Sheets">UV Marble Sheets</option>
                    <option value="Charcoal Wall Panels">Charcoal Wall Panels</option>
                    <option value="3D Wall Panels">3D Wall Panels</option>
                    <option value="PVC Wall Panels">PVC Wall Panels</option>
                    <option value="Wooden Wall Panels">Wooden Wall Panels</option>
                    <option value="Decorative Wall Cladding">Decorative Wall Cladding</option>
                    <option value="Ceiling Panels">Ceiling Panels</option>
                    <option value="Custom Interior Wall Designs">Custom Interior Wall Designs</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Product Name or SKU Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. WAL-WPC-201 or Nordic Teak"
                    value={formData.productNameOrCode}
                    onChange={(e) => setFormData({ ...formData, productNameOrCode: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-sm text-stone-100 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Approx. Wall Dimensions
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12 ft wide x 10 ft high"
                    value={formData.wallDimensions}
                    onChange={(e) => setFormData({ ...formData, wallDimensions: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-sm text-stone-100 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Estimated Quantity (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5 rolls or 25 panels (or leave blank if unsure)"
                  value={formData.quantityRequired}
                  onChange={(e) => setFormData({ ...formData, quantityRequired: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-sm text-stone-100 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div className="p-3 rounded bg-stone-950 border border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-stone-200 block">
                    Installation Service Required?
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Include certified installer visit and paste/clip fixing in estimate
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.installationRequired}
                    onChange={(e) => setFormData({ ...formData, installationRequired: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Additional Details or Project Requirements
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us about the room type, timeline, or site readiness..."
                  value={formData.additionalMessage}
                  onChange={(e) => setFormData({ ...formData, additionalMessage: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-sm text-stone-100 focus:outline-hidden focus:border-amber-400 resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting Inquiry...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Quotation Request
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppAlternative}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-stone-800 hover:bg-stone-700 text-emerald-400 text-xs font-semibold border border-stone-700 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  Ask Directly on WhatsApp
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
