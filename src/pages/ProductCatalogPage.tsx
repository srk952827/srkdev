import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, Info, Sparkles, Tag } from 'lucide-react';
import { Product, ProductCategory, BusinessSettings } from '../types/index.js';
import { ProductCard } from '../components/ProductCard.js';

interface ProductCatalogPageProps {
  products: Product[];
  categories: ProductCategory[];
  selectedCategorySlug: string;
  onSelectCategory: (slug: string) => void;
  settings: BusinessSettings;
  onViewProduct: (product: Product) => void;
  onOpenQuoteModal: (productInfo?: { name: string; sku: string }) => void;
}

export const ProductCatalogPage: React.FC<ProductCatalogPageProps> = ({
  products,
  categories,
  selectedCategorySlug,
  onSelectCategory,
  settings,
  onViewProduct,
  onOpenQuoteModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'featured' | 'price-asc' | 'price-desc' | 'name-asc'>('featured');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'in-stock'>('all');

  const currentCategory = categories.find((c) => c.slug === selectedCategorySlug);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category check
        if (selectedCategorySlug !== 'all' && p.categoryId !== selectedCategorySlug) {
          return false;
        }
        // Availability check
        if (availabilityFilter === 'in-stock' && !p.isAvailable) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.material.toLowerCase().includes(q) ||
            p.categoryName.toLowerCase().includes(q) ||
            p.colors.some((c) => c.toLowerCase().includes(q)) ||
            p.patterns.some((pat) => pat.toLowerCase().includes(q));
          if (!matches) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'price-asc') {
          return (a.price || 999999) - (b.price || 999999);
        }
        if (sortOption === 'price-desc') {
          return (b.price || 0) - (a.price || 0);
        }
        if (sortOption === 'name-asc') {
          return a.name.localeCompare(b.name);
        }
        // Default: featured first, then trending
        if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
        if (a.isTrending !== b.isTrending) return a.isTrending ? -1 : 1;
        return 0;
      });
  }, [products, selectedCategorySlug, availabilityFilter, searchQuery, sortOption]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
          Wall Materials Showroom
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl text-stone-900 mt-1">
          {currentCategory ? currentCategory.name : 'All Wall Coverings & Panel Collections'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed">
          {currentCategory
            ? currentCategory.description
            : 'Browse wallpapers, WPC fluted louvers, UV marble sheets, 3D relief panels, and architectural cladding with benchmark sample pricing and direct WhatsApp quotation.'}
        </p>

        {/* Sample Data Disclaimer Box */}
        <div className="mt-4 p-3 bg-stone-100 border border-stone-200 rounded flex items-start gap-2.5 text-xs text-stone-600">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p>
            <strong className="text-stone-800">Sample Catalog Data:</strong> Prices, dimensions, and SKU codes displayed are representative demonstration benchmark values. As the business owner, you can edit, add, or replace all products and toggle pricing via the Admin Portal.
          </p>
        </div>
      </div>

      {/* Category Pills/Filter Bar */}
      <div className="overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max p-1 bg-stone-200/80 rounded-lg">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedCategorySlug === 'all'
                ? 'bg-stone-900 text-stone-100 shadow-xs font-semibold'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            All Products ({products.length})
          </button>
          {categories.map((c) => {
            const count = products.filter((p) => p.categoryId === c.slug).length;
            const isSelected = selectedCategorySlug === c.slug;
            return (
              <button
                key={c.id}
                onClick={() => onSelectCategory(c.slug)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900 text-stone-100 shadow-xs font-semibold'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                {c.name} {count > 0 && <span className="opacity-70 font-mono text-[11px]">({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Sort Controls Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-3.5 rounded-lg border border-stone-200 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by name, SKU (e.g. WAL-WPC), color, finish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded pl-9 pr-3 py-1.5 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3 self-end sm:self-auto text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500 font-medium">Stock:</span>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as any)}
              className="bg-stone-50 border border-stone-200 rounded px-2.5 py-1 text-xs text-stone-800 focus:outline-hidden"
            >
              <option value="all">All Items</option>
              <option value="in-stock">In Stock Only</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-stone-500 font-medium">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="bg-stone-50 border border-stone-200 rounded px-2.5 py-1 text-xs text-stone-800 focus:outline-hidden"
            >
              <option value="featured">Featured & Trending</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-stone-200 p-8 space-y-3">
          <p className="font-serif-luxury text-2xl text-stone-700">No matching wall designs found</p>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search query or reset the category filter to view our full collection.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              onSelectCategory('all');
            }}
            className="px-4 py-2 bg-stone-900 text-stone-100 rounded text-xs font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              settings={settings}
              onViewDetails={onViewProduct}
              onRequestQuote={() => onOpenQuoteModal({ name: prod.name, sku: prod.sku })}
            />
          ))}
        </div>
      )}
    </div>
  );
};
