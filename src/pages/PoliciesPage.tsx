import React, { useState } from 'react';
import { Shield, FileText, Truck, RotateCcw, Info } from 'lucide-react';
import { BusinessSettings } from '../types/index.js';

interface PoliciesPageProps {
  initialTab?: 'privacy' | 'terms' | 'shipping' | 'refund';
  settings: BusinessSettings;
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({
  initialTab = 'privacy',
  settings,
}) => {
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | 'shipping' | 'refund'>(initialTab);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
          Store Information & Terms
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl text-stone-900 mt-1">
          Business Policies & Terms
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Standard operational conditions for material supply, quotation validity, delivery, and returns for {settings.businessName}.
        </p>

        <div className="mt-3 p-3 bg-stone-100 border border-stone-200 rounded flex items-center gap-2 text-xs text-stone-600">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Editable policy terms. Business owners may adjust operational guidelines in accordance with local commercial regulations.</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActivePolicy('privacy')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
            activePolicy === 'privacy'
              ? 'bg-stone-900 text-stone-100 font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Privacy Policy</span>
        </button>

        <button
          onClick={() => setActivePolicy('terms')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
            activePolicy === 'terms'
              ? 'bg-stone-900 text-stone-100 font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Terms & Conditions</span>
        </button>

        <button
          onClick={() => setActivePolicy('shipping')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
            activePolicy === 'shipping'
              ? 'bg-stone-900 text-stone-100 font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Shipping & Delivery Policy</span>
        </button>

        <button
          onClick={() => setActivePolicy('refund')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
            activePolicy === 'refund'
              ? 'bg-stone-900 text-stone-100 font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Return & Refund Policy</span>
        </button>
      </div>

      {/* Policy Content Body */}
      <div className="bg-white p-6 sm:p-8 rounded-lg border border-stone-200 shadow-xs prose prose-stone text-xs leading-relaxed max-w-none text-stone-700 space-y-4">
        {activePolicy === 'privacy' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-stone-900">Privacy Policy</h2>
            <p>
              At {settings.businessName}, we respect customer privacy regarding any information we collect while operating our website. We only request personal information—such as your name, mobile number, city, and approximate wall dimensions—when you submit an inquiry form or contact us via WhatsApp to generate product quotations.
            </p>
            <h3 className="text-sm font-semibold text-stone-900">1. Information We Collect</h3>
            <p>
              We collect information provided directly by you when submitting quotation inquiries: name, phone/WhatsApp number, city, room dimensions, and specific wall material selections. This information is utilized solely to provide customized price quotes, coordinate site measurement visits, and answer material specifications.
            </p>
            <h3 className="text-sm font-semibold text-stone-900">2. Communication & Consent</h3>
            <p>
              By submitting your mobile number on our quotation forms, you grant consent for representatives of {settings.businessName} to contact you via telephone or WhatsApp regarding your specific project inquiry. We do not sell or trade user contact details to third-party marketing brokers.
            </p>
            <h3 className="text-sm font-semibold text-stone-900">3. Data Retention</h3>
            <p>
              Quotation records are retained internally to facilitate future project orders and warranty support. You may contact us at {settings.email} at any time to request removal of your inquiry records.
            </p>
          </div>
        )}

        {activePolicy === 'terms' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-stone-900">Terms and Conditions</h2>
            <p>
              Welcome to the website of {settings.businessName}. By browsing our website, requesting quotations, or engaging our installation services, you agree to comply with the following operational terms.
            </p>
            <h3 className="text-sm font-semibold text-stone-900">1. Quotations and Sample Benchmark Data</h3>
            <p>
              Pricing displayed on this website represents sample trade estimates. Final quotation totals will be provided in a formal written estimate based on site dimensions, verified product availability, transport freight, and optional installation charges. Quotations remain valid for 15 days from issuance date.
            </p>
            <h3 className="text-sm font-semibold text-stone-900">2. Color and Batch Variation</h3>
            <p>
              Wallpapers, WPC fluted louvers, and UV marble sheets are produced in industrial manufacturing batches. While high color consistency is maintained, subtle shade variations of 2%–5% may occur across distinct production runs. We strongly advise ordering sufficient quantities for an entire wall in a single batch to guarantee color alignment.
            </p>
            <h3 className="text-sm font-semibold text-stone-900">3. Site Readiness for Installation</h3>
            <p>
              Where installation is contracted through {settings.businessName}, the client is responsible for providing a clean, cleared, and illuminated workspace. Plastered walls must be structurally cured and free from active water leakage.
            </p>
          </div>
        )}

        {activePolicy === 'shipping' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-stone-900">Shipping and Delivery Policy</h2>
            <p>
              {settings.businessName} provides local delivery across Mumbai Metropolitan Region (MMR) and arranges surface road freight for orders across other regions of India.
            </p>
            <h3 className="text-sm font-semibold text-stone-900">1. Local MMR & Pune Dispatch</h3>
            <p>
              In-stock wallpaper rolls and fluted louvers are generally delivered within 24 to 72 hours of order confirmation. Local delivery is coordinated via dedicated cargo vehicles to prevent damage to 9.5-ft panel lengths.
            </p>
            <h3 className="text-sm font-semibold text-stone-900">2. Inter-State & Outstation Surface Freight</h3>
            <p>
              Outstation orders are securely packaged with protective corner edge-guards and bubble wrap, packed into rigid cartons or wooden crates. Transit times generally range between 4 to 8 business days depending on destination pincode.
            </p>
            <h3 className="text-sm font-semibold text-stone-900">3. Delivery Inspection</h3>
            <p>
              Clients or their site contractors must inspect crates upon arrival for visible transit damage before signing delivery receipts. Any transit discrepancy must be noted immediately with photograph evidence.
            </p>
          </div>
        )}

        {activePolicy === 'refund' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-stone-900">Return and Refund Policy</h2>
            <p>
              Because wall decoration materials such as wallpapers, WPC louvers, and UV marble sheets are ordered in batch-matched quantities or custom-cut lengths, our returns policy is structured to balance fair customer protection with material integrity.
            </p>
            <h3 className="text-sm font-semibold text-stone-900">1. Manufacturing Defects & Transit Damage</h3>
            <p>
              If a product arrives with visible manufacturing flaws or damage sustained during shipping, notify our team within 48 hours of receipt with clear photographs. Damaged items will be replaced free of charge or refunded upon inspection.
            </p>
            <h3 className="text-sm font-semibold text-stone-900">2. Unopened Standard Rolls</h3>
            <p>
              Standard stock wallpaper rolls that remain in their original factory cellophane shrink-wrap with matching batch numbers may be returned within 7 days, subject to a 10% restocking fee. Return shipping costs are the responsibility of the purchaser.
            </p>
            <h3 className="text-sm font-semibold text-stone-900">3. Custom & Cut Materials</h3>
            <p>
              Custom-cut panels, made-to-order mural wallpapers, and panels installed or glued to walls cannot be returned or refunded once cut or pasted.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
