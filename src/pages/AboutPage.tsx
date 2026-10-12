import React from 'react';
import { Award, ShieldCheck, MapPin, Wrench, CheckCircle2, MessageCircle } from 'lucide-react';
import { BusinessSettings } from '../types/index.js';

interface AboutPageProps {
  settings: BusinessSettings;
  onOpenQuoteModal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, onOpenQuoteModal }) => {
  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero / Intro */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
          About {settings.businessName}
        </span>
        <h1 className="font-serif-luxury text-4xl sm:text-5xl text-stone-900 leading-tight">
          Curating Tactile Architectural Wall Finishes in India
        </h1>
        <p className="text-base text-stone-600 leading-relaxed">
          {settings.businessName} specializes in high-durability wall decor materials—bridging the gap between imported European design aesthetics and the practical moisture, heat, and termite resistance demanded by Indian architecture.
        </p>
      </div>

      {/* Core Philosophies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded bg-amber-100 text-amber-800 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif-luxury text-xl text-stone-900">Engineered For Climate Resilience</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Every WPC louver, PVC board, and vinyl wallpaper is selected for waterproof performance, zero flaking, and high scrub resistance under humid coastal and monsoon conditions.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded bg-amber-100 text-amber-800 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-serif-luxury text-xl text-stone-900">Direct Showroom Material Access</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            By coordinating directly with leading polymer composite manufacturers and European wallpaper mills, we supply genuine batch-matched rolls and panels at competitive trade pricing.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded bg-amber-100 text-amber-800 flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
          <h3 className="font-serif-luxury text-xl text-stone-900">Precision Turnkey Installation</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Materials are only as good as their installation. Our certified technicians use laser levels, specialized starch adhesives, and hidden clips to deliver crisp seams.
          </p>
        </div>
      </div>

      {/* Service Coverage Area */}
      <div className="bg-stone-900 text-stone-100 rounded-lg p-8 sm:p-12 border border-stone-800">
        <div className="max-w-2xl space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Coverage & Logistics
          </span>
          <h2 className="font-serif-luxury text-3xl text-amber-100">
            Service Area & Logistics Across India
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            We provide local on-site measurement and installation teams across <strong>Mumbai Metropolitan Region (MMR), Pune, Thane, and Navi Mumbai</strong>, along with secure pan-India surface freight for wallpaper rolls and panel bundles.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full Installation Service: MMR & Pune</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Swatches & Samples: Dispatched Pan-India</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>B2B Architect & Contractor Pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Protective Wooden Crate Freight Packaging</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenQuoteModal}
              className="px-5 py-2.5 rounded bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-semibold transition-colors cursor-pointer"
            >
              Request Project Estimate
            </button>
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${settings.businessName}, I would like to inquire about material delivery to my city.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded bg-stone-800 hover:bg-stone-700 text-emerald-400 text-xs font-semibold border border-stone-700 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Check Delivery Pincode on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
