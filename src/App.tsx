import React, { useState, useEffect } from 'react';
import { initialSettings, initialCategories, initialProducts, initialGallery } from './data/initialData.js';
import { BusinessSettings, ProductCategory, Product, GalleryItem } from './types/index.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { WhatsAppButton } from './components/WhatsAppButton.js';
import { QuoteModal } from './components/QuoteModal.js';
import { ProductDetailModal } from './components/ProductDetailModal.js';
import { HomePage } from './pages/HomePage.js';
import { ProductCatalogPage } from './pages/ProductCatalogPage.js';
import { WallpaperCalculator } from './components/WallpaperCalculator.js';
import { WallPanelCalculator } from './components/WallPanelCalculator.js';
import { GalleryPage } from './pages/GalleryPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { ContactPage } from './pages/ContactPage.js';
import { PoliciesPage } from './pages/PoliciesPage.js';
import { AdminPage } from './pages/AdminPage.js';
import { Calculator, Sparkles, Layers } from 'lucide-react';

export default function App() {
  const [settings, setSettings] = useState<BusinessSettings>(initialSettings);
  const [categories, setCategories] = useState<ProductCategory[]>(initialCategories);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);

  // Router tab state
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  
  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteModalProductInfo, setQuoteModalProductInfo] = useState<{ name: string; sku: string; category?: string } | undefined>(undefined);

  // Sync hash routing on mount and hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        if (hash.startsWith('category-')) {
          const catSlug = hash.replace('category-', '');
          setSelectedCategorySlug(catSlug);
          setCurrentTab('products');
        } else {
          setCurrentTab(hash);
        }
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when tab changes
  const navigateTo = (tab: string) => {
    setCurrentTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch initial data from API
  const refreshData = async () => {
    try {
      const [resSettings, resCats, resProds, resGal] = await Promise.all([
        fetch('/api/settings').catch(() => null),
        fetch('/api/categories').catch(() => null),
        fetch('/api/products').catch(() => null),
        fetch('/api/gallery').catch(() => null),
      ]);

      if (resSettings?.ok) setSettings(await resSettings.json());
      if (resCats?.ok) setCategories(await resCats.json());
      if (resProds?.ok) setProducts(await resProds.json());
      if (resGal?.ok) setGallery(await resGal.json());
    } catch (err) {
      console.warn('Using client memory initial state while server boots:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleOpenQuoteModal = (productInfo?: { name: string; sku: string; category?: string }) => {
    setQuoteModalProductInfo(productInfo);
    setQuoteModalOpen(true);
  };

  const handleSelectCategory = (slug: string) => {
    setSelectedCategorySlug(slug);
    navigateTo('products');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-amber-200 selection:text-stone-900">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={navigateTo}
        settings={settings}
        onOpenQuoteModal={() => handleOpenQuoteModal()}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            settings={settings}
            categories={categories}
            products={products}
            gallery={gallery}
            onNavigate={navigateTo}
            onSelectCategory={handleSelectCategory}
            onViewProduct={(p) => setSelectedProduct(p)}
            onOpenQuoteModal={handleOpenQuoteModal}
          />
        )}

        {currentTab === 'products' && (
          <ProductCatalogPage
            products={products}
            categories={categories}
            selectedCategorySlug={selectedCategorySlug}
            onSelectCategory={setSelectedCategorySlug}
            settings={settings}
            onViewProduct={(p) => setSelectedProduct(p)}
            onOpenQuoteModal={handleOpenQuoteModal}
          />
        )}

        {/* Combined Calculators Hub / Individual tabs */}
        {(currentTab === 'calculators' || currentTab === 'wallpaper-calc' || currentTab === 'panel-calc') && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                Interactive Project Estimators
              </span>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl text-stone-900 mt-1">
                Wall Material Quantity Calculators
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed">
                Estimate required wallpaper rolls (accounting for pattern matching buffer) and WPC fluted louvers / panels based on your room dimensions.
              </p>

              {/* Segmented Selector for Calculator Modes */}
              <div className="mt-6 flex items-center gap-2 p-1 bg-stone-200 rounded-lg max-w-md">
                <button
                  onClick={() => setCurrentTab('wallpaper-calc')}
                  className={`flex-1 py-2 px-3 text-xs font-semibold rounded transition-colors text-center cursor-pointer ${
                    currentTab === 'wallpaper-calc' || currentTab === 'calculators'
                      ? 'bg-stone-900 text-stone-100 shadow-xs'
                      : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  Wallpaper Rolls
                </button>
                <button
                  onClick={() => setCurrentTab('panel-calc')}
                  className={`flex-1 py-2 px-3 text-xs font-semibold rounded transition-colors text-center cursor-pointer ${
                    currentTab === 'panel-calc'
                      ? 'bg-stone-900 text-stone-100 shadow-xs'
                      : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  Wall Panels & Louvers
                </button>
              </div>
            </div>

            {currentTab === 'panel-calc' ? (
              <WallPanelCalculator
                settings={settings}
                onRequestQuote={(summary) =>
                  handleOpenQuoteModal({
                    name: 'Wall Panel Quantity Estimate',
                    sku: summary,
                    category: 'WPC Fluted Louvers',
                  })
                }
              />
            ) : (
              <WallpaperCalculator
                settings={settings}
                onRequestQuote={(summary) =>
                  handleOpenQuoteModal({
                    name: 'Wallpaper Rolls Estimate',
                    sku: summary,
                    category: 'Designer Wallpapers',
                  })
                }
              />
            )}
          </div>
        )}

        {currentTab === 'gallery' && (
          <GalleryPage
            gallery={gallery}
            settings={settings}
            onOpenQuoteModal={handleOpenQuoteModal}
          />
        )}

        {currentTab === 'about' && (
          <AboutPage
            settings={settings}
            onOpenQuoteModal={() => handleOpenQuoteModal()}
          />
        )}

        {currentTab === 'contact' && (
          <ContactPage
            settings={settings}
            onOpenQuoteModal={() => handleOpenQuoteModal()}
          />
        )}

        {currentTab === 'policy-privacy' && (
          <PoliciesPage initialTab="privacy" settings={settings} />
        )}

        {currentTab === 'policy-terms' && (
          <PoliciesPage initialTab="terms" settings={settings} />
        )}

        {currentTab === 'policy-shipping' && (
          <PoliciesPage initialTab="shipping" settings={settings} />
        )}

        {currentTab === 'policy-refund' && (
          <PoliciesPage initialTab="refund" settings={settings} />
        )}

        {currentTab === 'admin' && (
          <AdminPage
            settings={settings}
            categories={categories}
            products={products}
            gallery={gallery}
            onRefreshData={refreshData}
          />
        )}
      </main>

      {/* Floating WhatsApp Contact Button */}
      <WhatsAppButton settings={settings} />

      {/* Quotation Request Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        settings={settings}
        initialProductInfo={quoteModalProductInfo}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        settings={settings}
        onRequestQuote={(prod) => {
          setSelectedProduct(null);
          handleOpenQuoteModal({ name: prod.name, sku: prod.sku, category: prod.categoryName });
        }}
        allProducts={products}
        onSelectRelated={(p) => setSelectedProduct(p)}
      />

      {/* Global Footer */}
      <Footer
        settings={settings}
        onNavigate={navigateTo}
        onSelectCategory={handleSelectCategory}
      />
    </div>
  );
}
