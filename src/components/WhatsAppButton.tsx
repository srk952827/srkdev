import React, { useState } from 'react';
import { MessageCircle, X, ChevronRight, Send } from 'lucide-react';
import { BusinessSettings } from '../types/index.js';

interface WhatsAppButtonProps {
  settings: BusinessSettings;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const quickPrompts = [
    { label: 'Request PDF Catalog', text: `Hi ${settings.businessName}, please share your latest wallpaper & wall panel catalog.` },
    { label: 'Book Site Measurement', text: `Hi ${settings.businessName}, I would like to schedule a technician visit for wall measurement.` },
    { label: 'Price & Sample Inquiry', text: `Hi ${settings.businessName}, could you please share pricing and sample availability?` },
  ];

  const handleSend = (text: string) => {
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Popover Card */}
      {isOpen && (
        <div className="mb-3 w-80 bg-stone-900 border border-stone-800 rounded-lg shadow-2xl p-4 text-stone-100 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-serif-luxury text-lg text-amber-200">{settings.businessName}</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white p-1"
              aria-label="Close chat dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-stone-300 my-3 leading-relaxed">
            Welcome to {settings.businessName}! How can we assist with your interior wall decoration project today?
          </p>

          <div className="space-y-1.5 mb-3">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.text)}
                className="w-full text-left text-xs bg-stone-800/80 hover:bg-stone-800 text-stone-200 hover:text-amber-300 p-2 rounded transition-colors flex items-center justify-between group"
              >
                <span>{p.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-400" />
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (customMsg.trim()) handleSend(customMsg.trim());
            }}
            className="flex items-center gap-2 pt-2 border-t border-stone-800"
          >
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-stone-950 border border-stone-800 rounded px-3 py-1.5 text-xs text-stone-100 focus:outline-hidden focus:border-amber-400"
            />
            <button
              type="submit"
              className="p-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              aria-label="Send WhatsApp message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Pill/Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group"
        aria-label="Open WhatsApp conversation"
      >
        <MessageCircle className="w-6 h-6 shrink-0 transition-transform group-hover:scale-110" />
        <span className="text-sm font-semibold pr-1">WhatsApp Us</span>
      </button>
    </div>
  );
};
