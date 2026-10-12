import React, { useState } from 'react';
import { GalleryItem, BusinessSettings } from '../types/index.js';
import { VisualPattern } from '../components/VisualPattern.js';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider.js';
import { Info, Sparkles, MessageCircle } from 'lucide-react';

interface GalleryPageProps {
  gallery: GalleryItem[];
  settings: BusinessSettings;
  onOpenQuoteModal: (productInfo?: { name: string; sku: string }) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  gallery,
  settings,
  onOpenQuoteModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Spaces' },
    { id: 'Living Room', label: 'Living Room' },
    { id: 'TV Unit', label: 'TV Units' },
    { id: 'Bedroom', label: 'Bedrooms' },
    { id: 'Office', label: 'Offices' },
    { id: 'Commercial', label: 'Commercial' },
    { id: 'Before-After', label: 'Before & After' },
  ];

  const filteredItems = gallery.filter((item) =>
    activeCategory === 'all' ? true : item.category === activeCategory
  );

  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
          Inspiration & Transformations
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl text-stone-900 mt-1">
          Interior Wall Design Gallery
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed">
          Explore architectural elevations showcasing how WPC fluted louvers, UV marble slabs, wallpaper panels, and acoustic slats interact with cove lighting and room elements.
        </p>

        {/* Clear Notice */}
        <div className="mt-4 p-3 bg-stone-100 border border-stone-200 rounded flex items-start gap-2.5 text-xs text-stone-600">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p>
            <strong className="text-stone-800">Concept Portfolio:</strong> Rendered architectural project concepts illustrating surface material possibilities. As an administrator, you can upload your actual on-site client photographs in the Admin Portal.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-stone-900 text-stone-100 font-semibold shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:text-stone-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Before & After Interactive Showcase (when filter is all or Before-After) */}
      {(activeCategory === 'all' || activeCategory === 'Before-After') && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h3 className="font-serif-luxury text-2xl text-stone-900">
              Interactive Before & After Comparison
            </h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BeforeAfterSlider
              beforeType="living-before"
              afterType="living-after"
              title="Living Room Accent Wall Transformation"
              subtitle="Drywall installation with integrated LED channels and European wallpaper backing."
            />
            <BeforeAfterSlider
              beforeType="foyer-before"
              afterType="foyer-after"
              title="Entrance Foyer Damp Wall Overhaul"
              subtitle="Persistent dampness concealed with waterproof PVC tongue-and-groove cladding."
            />
          </div>
        </div>
      )}

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems
          .filter((item) => item.category !== 'Before-After')
          .map((item) => (
            <div
              key={item.id}
              className="bg-white border border-stone-200 rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-200 group"
            >
              <div className="aspect-[4/3] bg-stone-950 overflow-hidden relative">
                <VisualPattern type={item.image} aspect="4:3" />
                <div className="absolute top-2 left-2 bg-stone-900/80 text-amber-300 text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider backdrop-blur-xs">
                  {item.category}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif-luxury text-xl text-stone-900 group-hover:text-amber-800 transition-colors">
                    {item.title}
                  </h4>
                  <div className="mt-1 text-xs text-amber-700 font-medium">
                    {item.roomType}
                  </div>
                  <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-3 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                    <span className="font-semibold text-stone-700">Materials Used: </span>
                    {item.materialUsed}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => onOpenQuoteModal({ name: item.title, sku: item.category })}
                    className="text-xs font-semibold text-stone-900 hover:text-amber-700 transition-colors"
                  >
                    Request Similar Design
                  </button>
                  <a
                    href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${settings.businessName}, I saw the gallery concept "${item.title}" (${item.materialUsed}) and would like a quote for my wall.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 text-xs font-medium flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
