import React, { useState } from 'react';
import { X, MessageCircle, FileText, CheckCircle, ShieldCheck, Wrench, Layers, Maximize2, Sparkles } from 'lucide-react';
import { Product, BusinessSettings } from '../types/index.js';
import { VisualPattern } from './VisualPattern.js';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  settings: BusinessSettings;
  onRequestQuote: (product: Product) => void;
  allProducts: Product[];
  onSelectRelated: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  settings,
  onRequestQuote,
  allProducts,
  onSelectRelated,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'installation'>('overview');

  if (!product) return null;

  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const handleWhatsApp = () => {
    const text = `Hi ${settings.businessName},\nI would like to inquire about this product:\n- Product: ${product.name}\n- SKU Code: ${product.sku}\n- Category: ${product.categoryName}\n- Material: ${product.material}\nPlease provide quotation, available stock colors, and installation details.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-lg shadow-2xl text-stone-100 my-8 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-stone-400 hover:text-white rounded-full bg-stone-950/80 hover:bg-stone-800 transition-colors"
          aria-label="Close product details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Gallery Slot (Left) */}
          <div className="md:col-span-5 bg-stone-950 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-800">
            <div>
              <div className="relative rounded overflow-hidden aspect-[4/3] border border-stone-800 shadow-inner">
                <VisualPattern type={product.image || product.patternType} aspect="4:3" />
                <div className="absolute top-2 right-2 bg-stone-950/80 backdrop-blur-xs text-[10px] text-amber-300 px-2 py-0.5 rounded font-mono border border-stone-800">
                  {product.sku}
                </div>
              </div>

              {/* Sample disclaimer */}
              <div className="mt-4 p-3 rounded bg-stone-900/80 border border-stone-800 text-[11px] text-stone-400">
                <span className="text-amber-300 font-medium block mb-0.5">Showroom Sample Specification</span>
                Colors & grain textures may vary slightly per manufacturing batch. Order swatches before installation.
              </div>
            </div>

            {/* Price & Action quick strip */}
            <div className="mt-6 pt-4 border-t border-stone-800">
              <div className="mb-4">
                <span className="text-xs text-stone-400 block">Indicative Price</span>
                {product.requestPriceOnly || product.price === null ? (
                  <span className="font-serif-luxury text-2xl text-amber-300">
                    Price on Request
                  </span>
                ) : (
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono text-3xl font-bold text-amber-300 tabular-nums">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">
                      {product.priceUnit}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => onRequestQuote(product)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Request Written Quotation</span>
                </button>
                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Inquire on WhatsApp with SKU</span>
                </button>
              </div>
            </div>
          </div>

          {/* Details & Specs Slot (Right) */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="mb-4">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
                  <span>{product.categoryName}</span>
                  <span className="text-stone-600">·</span>
                  <span className="text-stone-400 font-mono text-[11px]">{product.sku}</span>
                </div>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl text-stone-100">
                  {product.name}
                </h2>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-4 border-b border-stone-800 pb-2 mb-4 text-xs font-medium">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-2 transition-colors relative cursor-pointer ${
                    activeTab === 'overview' ? 'text-amber-300 font-semibold' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Overview & Aesthetics
                  {activeTab === 'overview' && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-2 transition-colors relative cursor-pointer ${
                    activeTab === 'specs' ? 'text-amber-300 font-semibold' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Specifications Table
                  {activeTab === 'specs' && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('installation')}
                  className={`pb-2 transition-colors relative cursor-pointer ${
                    activeTab === 'installation' ? 'text-amber-300 font-semibold' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Installation Guide
                  {activeTab === 'installation' && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400" />
                  )}
                </button>
              </div>

              {/* Tab Contents */}
              {activeTab === 'overview' && (
                <div className="space-y-4 text-sm text-stone-300 leading-relaxed">
                  <p>{product.description}</p>

                  <div className="pt-2">
                    <h4 className="text-xs uppercase tracking-wider text-amber-300/90 font-semibold mb-2">
                      Ideal Applications:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.applications.map((app, i) => (
                        <span
                          key={i}
                          className="bg-stone-800 text-stone-200 text-xs px-2.5 py-1 rounded border border-stone-700/60"
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <h4 className="text-xs uppercase tracking-wider text-amber-300/90 font-semibold mb-2">
                      Available Color / Wood Tones:
                    </h4>
                    <div className="flex flex-wrap gap-2 text-xs text-stone-300">
                      {product.colors.map((c, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 bg-stone-950 px-2.5 py-1 rounded border border-stone-800">
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 py-2 border-b border-stone-800/60">
                    <span className="text-stone-400 font-medium">Material Composition</span>
                    <span className="text-stone-200">{product.material}</span>
                  </div>
                  <div className="grid grid-cols-2 py-2 border-b border-stone-800/60">
                    <span className="text-stone-400 font-medium">Surface Finish</span>
                    <span className="text-stone-200">{product.finish}</span>
                  </div>
                  <div className="grid grid-cols-2 py-2 border-b border-stone-800/60">
                    <span className="text-stone-400 font-medium">Dimensions</span>
                    <span className="text-stone-200">{product.dimensions}</span>
                  </div>
                  <div className="grid grid-cols-2 py-2 border-b border-stone-800/60">
                    <span className="text-stone-400 font-medium">Profile Thickness</span>
                    <span className="text-stone-200">{product.thickness}</span>
                  </div>
                  <div className="grid grid-cols-2 py-2 border-b border-stone-800/60">
                    <span className="text-stone-400 font-medium">Product Code / SKU</span>
                    <span className="font-mono text-amber-300">{product.sku}</span>
                  </div>
                  <div className="grid grid-cols-2 py-2 border-b border-stone-800/60">
                    <span className="text-stone-400 font-medium">Availability</span>
                    <span className={product.isAvailable ? 'text-emerald-400 font-medium' : 'text-stone-400'}>
                      {product.isAvailable ? 'In Stock (Sample showroom)' : 'Order to site'}
                    </span>
                  </div>
                </div>
              )}

              {activeTab === 'installation' && (
                <div className="space-y-4 text-xs text-stone-300 leading-relaxed">
                  <div className="p-3 bg-stone-950 border border-stone-800 rounded">
                    <h5 className="font-semibold text-amber-200 mb-1">Installation Method:</h5>
                    <p>{product.installationInfo}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Professional installer dispatch available across Mumbai, MMR, and major Maharashtra hubs.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Waterproof substrate inspection and wall levelling guidance provided.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Accessories, edge beading, L-trims, and adhesives supplied concurrently.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
              <div className="mt-8 pt-4 border-t border-stone-800">
                <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold block mb-3">
                  Complementary Designs in {product.categoryName}:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {relatedProducts.map((rel) => (
                    <button
                      key={rel.id}
                      onClick={() => onSelectRelated(rel)}
                      className="text-left bg-stone-950 border border-stone-800 hover:border-stone-700 p-2 rounded transition-colors group cursor-pointer"
                    >
                      <div className="text-[11px] font-medium text-stone-200 group-hover:text-amber-300 line-clamp-1">
                        {rel.name}
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                        {rel.sku}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
