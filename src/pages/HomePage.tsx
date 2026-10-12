import React from 'react';
import { ArrowRight, MessageCircle, Sparkles, ShieldCheck, Clock, Award, Hammer, CheckCircle2, ChevronRight } from 'lucide-react';
import { BusinessSettings, ProductCategory, Product, GalleryItem } from '../types/index.js';
import { VisualPattern } from '../components/VisualPattern.js';
import { ProductCard } from '../components/ProductCard.js';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider.js';

interface HomePageProps {
  settings: BusinessSettings;
  categories: ProductCategory[];
  products: Product[];
  gallery: GalleryItem[];
  onNavigate: (tab: string) => void;
  onSelectCategory: (categorySlug: string) => void;
  onViewProduct: (product: Product) => void;
  onOpenQuoteModal: (productInfo?: { name: string; sku: string }) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  categories,
  products,
  gallery,
  onNavigate,
  onSelectCategory,
  onViewProduct,
  onOpenQuoteModal,
}) => {
  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const trendingProducts = products.filter((p) => p.isTrending || p.isFeatured).slice(0, 4);

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-stone-950 text-stone-100 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-300 font-semibold bg-stone-900 border border-stone-800 px-3 py-1 rounded">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Interior Wall Paneling & Wallpaper Showroom</span>
              </div>

              <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl tracking-tight text-amber-100 leading-[1.15] text-balance">
                Transform Your Walls. <br className="hidden sm:inline" />
                <span className="text-amber-400 italic">Elevate Your Space.</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-xl">
                Discover bespoke European wallpapers, WPC fluted louvers, seamless Italian UV marble sheets, and acoustic 3D wall panels designed for modern luxury homes and commercial spaces in India.
              </p>

              {/* 3 Core Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('products')}
                  className="px-6 py-3.5 rounded bg-amber-400 hover:bg-amber-300 text-stone-950 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenQuoteModal()}
                  className="px-6 py-3.5 rounded bg-stone-900 hover:bg-stone-800 text-stone-100 text-sm font-semibold border border-stone-700 transition-colors cursor-pointer"
                >
                  Get a Free Quote
                </button>

                <a
                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${settings.businessName}, I saw your collection and would like to explore options for my home.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              {/* Value indicators */}
              <div className="pt-6 border-t border-stone-800/80 grid grid-cols-3 gap-4 text-xs text-stone-400">
                <div>
                  <div className="font-serif-luxury text-xl text-amber-300 font-bold">100%</div>
                  <div className="mt-0.5">Water & Termite Proof</div>
                </div>
                <div>
                  <div className="font-serif-luxury text-xl text-amber-300 font-bold">24-48h</div>
                  <div className="mt-0.5">Quick Installation</div>
                </div>
                <div>
                  <div className="font-serif-luxury text-xl text-amber-300 font-bold">500+</div>
                  <div className="mt-0.5">Catalog Textures</div>
                </div>
              </div>
            </div>

            {/* Right Architectural Living Room Visual Slot */}
            <div className="lg:col-span-5">
              <div className="relative rounded-lg overflow-hidden border border-stone-800 shadow-2xl">
                <VisualPattern type="hero-living-room" aspect="16:9" />
                <div className="p-4 bg-stone-900/90 border-t border-stone-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-amber-200 font-medium block">
                      Contemporary TV Console Elevation
                    </span>
                    <span className="text-stone-400 text-[11px]">
                      Bookmatched Calacatta UV Marble & Teak Louvers
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigate('gallery')}
                    className="text-amber-400 hover:text-amber-300 font-medium text-xs flex items-center gap-1"
                  >
                    <span>View More</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
              Showroom Range
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-stone-900 mt-1">
              Curated Wall Surface Categories
            </h2>
            <p className="text-sm text-stone-600 mt-2 max-w-xl">
              From European washable wallpapers to fluted exterior cladding, explore high-durability decorative surfaces for every interior elevation.
            </p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-900 hover:text-amber-700 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>View All 10 Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.slug);
                onNavigate('products');
              }}
              className="group bg-white border border-stone-200 rounded-lg overflow-hidden flex flex-col justify-between hover:border-amber-400 hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <div className="aspect-[4/3] bg-stone-950 overflow-hidden relative">
                <VisualPattern type={cat.image} aspect="4:3" />
                <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif-luxury text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                    {cat.tagline}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-amber-700 font-medium">
                  <span>Explore range</span>
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TRENDING DESIGNS SECTION */}
      <section className="bg-stone-900 text-stone-100 py-16 border-y border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                Trending In Showrooms
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl text-amber-100 mt-1">
                Best-Selling Wall Coverings
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-2 max-w-xl">
                Most requested wall panel textures and luxury wallpaper patterns among architects and interior stylists.
              </p>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="text-xs font-semibold text-amber-300 hover:text-amber-200 uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Full Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                settings={settings}
                onViewDetails={onViewProduct}
                onRequestQuote={() => onOpenQuoteModal({ name: prod.name, sku: prod.sku })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. BEFORE & AFTER TRANSFORMATION SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
            Real Impact
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-stone-900 mt-1">
            Interior Transformations
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            See how ordinary, plain, or moisture-affected walls are elevated into architectural statement focal points in hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BeforeAfterSlider
            beforeType="living-before"
            afterType="living-after"
            title="Living Room Entertainment Feature Wall"
            subtitle="Concealed wiring, bookmatched Italian UV marble finish, and fluted teak louvers."
          />
          <BeforeAfterSlider
            beforeType="foyer-before"
            afterType="foyer-after"
            title="Damp Wall to Luxury Entrance Foyer"
            subtitle="Persistent coastal dampness waterproofed with tongue-and-groove composite paneling."
          />
        </div>
      </section>

      {/* 5. CALCULATORS CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-stone-800 rounded-lg p-8 sm:p-12 text-stone-100 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
              Precision Material Planning
            </span>
            <h3 className="font-serif-luxury text-3xl text-amber-100">
              Calculate Rolls & Panel Quantities for Your Wall
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed">
              Eliminate guesswork. Input your wall width and height to calculate wallpaper rolls (with pattern matching buffer) or WPC fluted louvers.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('wallpaper-calc')}
              className="px-5 py-3 rounded bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-colors cursor-pointer"
            >
              Wallpaper Calculator
            </button>
            <button
              onClick={() => onNavigate('panel-calc')}
              className="px-5 py-3 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-700 transition-colors cursor-pointer"
            >
              Wall Panel Calculator
            </button>
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE US & INSTALLATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                Material Excellence
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl text-stone-900 mt-1">
                Why Architects & Homeowners Partner With {settings.businessName}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded bg-amber-100 text-amber-800 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-stone-900">Termite & 100% Moisture Proof</h4>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    Unlike natural solid wood that bows under tropical monsoon humidity, our polymer composite WPC and UV boards never swell, rot, or attract termites.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded bg-amber-100 text-amber-800 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-stone-900">Fast 1-Day Dry Installation</h4>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    No wet plaster mess, no days of sanding dust. Interlocking tongue-and-groove profiles mount cleanly onto existing walls with structural adhesive or hidden clips.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded bg-amber-100 text-amber-800 mt-0.5">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-stone-900">Certified Installation Teams</h4>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    Our verified installation technicians ensure laser-straight seams, accurate pattern repeats, and seamless mitered corner finishes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-stone-900 border border-stone-800 rounded-lg p-6 sm:p-8 text-stone-100">
            <h3 className="font-serif-luxury text-2xl text-amber-100 mb-2">
              End-to-End Turnkey Execution
            </h3>
            <p className="text-xs text-stone-400 mb-6">
              How we help take your wall concept from catalog selection to finished installation:
            </p>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded bg-stone-950 border border-stone-800 flex items-start gap-3">
                <span className="font-mono text-amber-400 font-bold text-sm">01</span>
                <div>
                  <h5 className="font-semibold text-stone-200">Catalog Selection & Swatches</h5>
                  <p className="text-stone-400 mt-0.5">Explore samples online or request physical swatches dispatched to your site.</p>
                </div>
              </div>
              <div className="p-3.5 rounded bg-stone-950 border border-stone-800 flex items-start gap-3">
                <span className="font-mono text-amber-400 font-bold text-sm">02</span>
                <div>
                  <h5 className="font-semibold text-stone-200">Site Measurement & Elevation Planning</h5>
                  <p className="text-stone-400 mt-0.5">Technicians inspect wall moisture, calculate precise panel pieces, and verify lighting grooves.</p>
                </div>
              </div>
              <div className="p-3.5 rounded bg-stone-950 border border-stone-800 flex items-start gap-3">
                <span className="font-mono text-amber-400 font-bold text-sm">03</span>
                <div>
                  <h5 className="font-semibold text-stone-200">Material Delivery & Professional Fixing</h5>
                  <p className="text-stone-400 mt-0.5">Hassle-free delivery with certified technicians completing most residential walls in 1 day.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between">
              <span className="text-xs text-stone-400">Ready to discuss your site?</span>
              <button
                onClick={() => onOpenQuoteModal()}
                className="px-4 py-2 rounded bg-amber-400 text-stone-950 text-xs font-semibold hover:bg-amber-300 transition-colors"
              >
                Schedule Site Visit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DEMONSTRATION PORTFOLIO REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-100 rounded-lg p-8 sm:p-12 border border-stone-200">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-700">
              Demonstration Portfolio
            </span>
            <h3 className="font-serif-luxury text-3xl text-stone-900 mt-1">
              Sample Project Case Studies
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              *Sample demonstration testimonials illustrating typical interior fit-out outcomes. Actual customer feedback can be added via the admin panel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-xs flex flex-col justify-between">
              <p className="text-xs text-stone-700 italic leading-relaxed">
                "The WPC fluted louvers and UV marble sheet combination completely transformed our living room TV wall. The finish looks exactly like imported Italian marble without the heavy structural weight."
              </p>
              <div className="mt-4 pt-3 border-t border-stone-100">
                <span className="font-semibold text-xs text-stone-900 block">Rajesh & Priya S.</span>
                <span className="text-[11px] text-stone-500">4BHK Residence, Bandra West, Mumbai</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-xs flex flex-col justify-between">
              <p className="text-xs text-stone-700 italic leading-relaxed">
                "As an interior designer, I need materials that withstand coastal humidity while offering high tactile appeal. Ajanta's charcoal panels and acoustic slats have become my go-to recommendation for executive cabins."
              </p>
              <div className="mt-4 pt-3 border-t border-stone-100">
                <span className="font-semibold text-xs text-stone-900 block">Kavita Narang</span>
                <span className="text-[11px] text-stone-500">Principal Architect, Studio Forma</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-xs flex flex-col justify-between">
              <p className="text-xs text-stone-700 italic leading-relaxed">
                "We had persistent peeling paint on our entrance wall due to moisture. The AquaShield PVC interlocking paneling resolved the issue permanently and gave our home entrance a 5-star hotel foyer feel."
              </p>
              <div className="mt-4 pt-3 border-t border-stone-100">
                <span className="font-semibold text-xs text-stone-900 block">Arjun Varma</span>
                <span className="text-[11px] text-stone-500">Penthouse, Pune</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. BOTTOM INQUIRY CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-950 text-stone-100 rounded-lg border border-stone-800 p-8 sm:p-14 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-amber-100">
              Ready to Upgrade Your Interior Walls?
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Get an instant itemized estimate with roll/panel quantities and optional certified installation in your city.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onOpenQuoteModal()}
                className="px-6 py-3 rounded bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-colors cursor-pointer"
              >
                Request Free Quotation
              </button>
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${settings.businessName}, I would like to consult with an expert for my interior wall decor.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
