import React, { useState } from 'react';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';
import { BusinessSettings } from '../types/index.js';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  settings: BusinessSettings;
  onOpenQuoteModal: (productInfo?: { name: string; sku: string }) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  settings,
  onOpenQuoteModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Collections' },
    { id: 'calculators', label: 'Calculators' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNav = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strictly compliant 3-Zone Top Bar */}
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleNav('home')}
            className="text-left font-serif-luxury text-2xl sm:text-3xl tracking-wide text-amber-100 hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {settings.businessName}
          </button>

          {/* Zone 2: Concise single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-300">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id || (link.id === 'calculators' && (currentTab === 'wallpaper-calc' || currentTab === 'panel-calc'));
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 relative ${
                    isActive ? 'text-amber-300 font-semibold' : 'hover:text-amber-100 text-stone-300'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${settings.businessName}, I would like to explore your wall panels and wallpaper collections.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-stone-200 hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
            <button
              onClick={() => onOpenQuoteModal()}
              className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
            >
              Get Free Quote
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => onOpenQuoteModal()}
              className="sm:hidden px-3 py-1.5 text-xs font-semibold text-stone-950 bg-amber-400 rounded transition-colors"
            >
              Quote
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-300 hover:text-white focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-800 bg-stone-900 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              className={`block w-full text-left py-2.5 px-3 rounded text-base ${
                currentTab === link.id
                  ? 'bg-stone-800 text-amber-300 font-semibold'
                  : 'text-stone-300 hover:bg-stone-800/50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-stone-800 flex flex-col gap-2.5">
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${settings.businessName}, I would like to speak to your team.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-stone-800 text-emerald-400 font-medium text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp ({settings.whatsappNumber})
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuoteModal();
              }}
              className="w-full py-2.5 px-4 rounded bg-amber-400 text-stone-950 font-semibold text-sm"
            >
              Request Custom Quotation
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
