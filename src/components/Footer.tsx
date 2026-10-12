import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { BusinessSettings } from '../types/index.js';

interface FooterProps {
  settings: BusinessSettings;
  onNavigate: (tab: string) => void;
  onSelectCategory?: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate, onSelectCategory }) => {
  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800">
      {/* Top Banner / Callout */}
      <div className="border-b border-stone-900 bg-stone-900/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif-luxury text-2xl text-amber-100 mb-1">
              Need Site Measurement or Material Samples in India?
            </h3>
            <p className="text-sm text-stone-400">
              Speak directly with our wall surface specialists. Catalog dispatch and technician site visits available.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${settings.businessName}, I would like to request physical material samples and site measurement.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Inquiry
            </a>
            <button
              onClick={() => onNavigate('contact')}
              className="px-5 py-2.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-sm transition-colors border border-stone-700"
            >
              Showroom Location
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Address Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="font-serif-luxury text-2xl text-amber-200 tracking-wider">
              {settings.businessName}
            </div>
            <p className="text-stone-400 text-sm leading-relaxed max-w-sm">
              {settings.tagline} Premium European wallpapers, WPC fluted louvers, UV marble sheets, and decorative wall cladding for discerning residential and commercial projects.
            </p>

            <div className="space-y-2.5 text-xs text-stone-400 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {settings.address}, {settings.city}, {settings.state} – {settings.pincode}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-stone-200">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-stone-200">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.businessHours}</span>
              </div>
            </div>
          </div>

          {/* Core Collections */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-amber-300/90 font-semibold">
              Popular Collections
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button
                  onClick={() => {
                    onSelectCategory?.('designer-wallpapers');
                    onNavigate('products');
                  }}
                  className="hover:text-stone-200 transition-colors text-left"
                >
                  Designer Wallpapers
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory?.('wpc-fluted-louvers');
                    onNavigate('products');
                  }}
                  className="hover:text-stone-200 transition-colors text-left"
                >
                  WPC Fluted Louvers
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory?.('uv-marble-sheets');
                    onNavigate('products');
                  }}
                  className="hover:text-stone-200 transition-colors text-left"
                >
                  UV Marble Sheets
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory?.('charcoal-wall-panels');
                    onNavigate('products');
                  }}
                  className="hover:text-stone-200 transition-colors text-left"
                >
                  Charcoal Panels
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory?.('3d-wall-panels');
                    onNavigate('products');
                  }}
                  className="hover:text-stone-200 transition-colors text-left"
                >
                  3D Wall Panels
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory?.('pvc-wall-panels');
                    onNavigate('products');
                  }}
                  className="hover:text-stone-200 transition-colors text-left"
                >
                  PVC Waterproof Panels
                </button>
              </li>
            </ul>
          </div>

          {/* Interactive Tools & Company */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-amber-300/90 font-semibold">
              Planning & Tools
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button onClick={() => onNavigate('wallpaper-calc')} className="hover:text-stone-200 transition-colors text-left">
                  Wallpaper Roll Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('panel-calc')} className="hover:text-stone-200 transition-colors text-left">
                  Wall Panel Quantity Estimator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-stone-200 transition-colors text-left">
                  Transformation Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-stone-200 transition-colors text-left">
                  About Our Showroom
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-stone-200 transition-colors text-left">
                  Contact & Directions
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Policies & Admin */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-amber-300/90 font-semibold">
              Policies & Admin
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button onClick={() => onNavigate('policy-privacy')} className="hover:text-stone-200 transition-colors text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policy-terms')} className="hover:text-stone-200 transition-colors text-left">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policy-shipping')} className="hover:text-stone-200 transition-colors text-left">
                  Shipping & Delivery Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policy-refund')} className="hover:text-stone-200 transition-colors text-left">
                  Return & Refund Policy
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => onNavigate('admin')}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium bg-stone-900 border border-stone-800 px-3 py-1.5 rounded transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Dashboard
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-900 py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {settings.businessName}. All rights reserved.</p>
          <p className="text-stone-500 text-center sm:text-right">
            Sample demonstration data. Custom business profile, SKUs, and pricing editable via Admin panel.
          </p>
        </div>
      </div>
    </footer>
  );
};
