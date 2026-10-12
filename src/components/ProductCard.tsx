import React from 'react';
import { MessageCircle, Eye, CheckCircle2, Sparkles } from 'lucide-react';
import { Product, BusinessSettings } from '../types/index.js';
import { VisualPattern } from './VisualPattern.js';

interface ProductCardProps {
  product: Product;
  settings: BusinessSettings;
  onViewDetails: (product: Product) => void;
  onRequestQuote: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  settings,
  onViewDetails,
  onRequestQuote,
}) => {
  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `Hi ${settings.businessName}, I would like to inquire about "${product.name}" (Code: ${product.sku}). Please share current pricing, sample swatches, and availability.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="group bg-stone-900 border border-stone-800 rounded-lg overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:border-stone-700 hover:shadow-xl cursor-pointer"
    >
      {/* Visual Image / Texture Slot */}
      <div className="relative overflow-hidden bg-stone-950 aspect-[4/3]">
        <VisualPattern type={product.image || product.patternType} aspect="4:3" />

        {/* Status & Trending markers */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 pointer-events-none">
          {product.isTrending && (
            <span className="bg-stone-900/90 text-amber-300 backdrop-blur-xs text-[10px] font-semibold px-2 py-0.5 rounded tracking-wide border border-amber-400/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Trending
            </span>
          )}
          <span
            className={`text-[10px] px-2 py-0.5 rounded font-medium backdrop-blur-xs ${
              product.isAvailable
                ? 'bg-stone-900/80 text-emerald-300 border border-emerald-500/30'
                : 'bg-stone-900/80 text-stone-400 border border-stone-700'
            }`}
          >
            {product.isAvailable ? 'In Stock (Sample)' : 'On Order'}
          </span>
        </div>

        {/* Overlay SKU code */}
        <div className="absolute bottom-2.5 right-2.5 bg-stone-950/80 text-stone-300 font-mono text-[10px] px-2 py-0.5 rounded border border-stone-800 backdrop-blur-xs">
          {product.sku}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category kicker */}
          <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-400/90 mb-1">
            {product.categoryName}
          </div>

          {/* Product Name */}
          <h3 className="font-serif-luxury text-lg sm:text-xl text-stone-100 group-hover:text-amber-200 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Material & Finish */}
          <div className="mt-2 text-xs text-stone-400 space-y-1">
            <p className="line-clamp-1">
              <span className="text-stone-300 font-medium">Material:</span> {product.material}
            </p>
            <p className="line-clamp-1">
              <span className="text-stone-300 font-medium">Finish:</span> {product.finish}
            </p>
            <p className="line-clamp-1 text-[11px]">
              <span className="text-stone-300 font-medium">Dims:</span> {product.dimensions}
            </p>
          </div>

          {/* Color swatches preview */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-3 flex items-center gap-1 text-[11px] text-stone-400">
              <span className="text-stone-300 font-medium">Colors:</span>
              <span className="truncate">{product.colors.join(' · ')}</span>
            </div>
          )}
        </div>

        {/* Pricing & Actions */}
        <div className="mt-4 pt-3 border-t border-stone-800/80">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              {product.requestPriceOnly || product.price === null ? (
                <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                  Request Price
                </span>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-lg font-bold text-amber-300 tabular-nums">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-stone-400">
                    {product.priceUnit}
                  </span>
                </div>
              )}
            </div>
            <span className="text-[10px] text-stone-400 italic">
              Sample Benchmark
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(product);
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors cursor-pointer border border-stone-700/60"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
