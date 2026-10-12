import React, { useState, useEffect } from 'react';
import {
  Lock,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Download,
  CheckCircle,
  AlertCircle,
  FileText,
  Package,
  Settings,
  Image as ImageIcon,
  KeyRound,
  BookOpen,
  Eye,
  EyeOff,
  RefreshCw,
  Search,
} from 'lucide-react';
import { Product, ProductCategory, QuotationRequest, BusinessSettings, GalleryItem } from '../types/index.js';

interface AdminPageProps {
  settings: BusinessSettings;
  categories: ProductCategory[];
  products: Product[];
  gallery: GalleryItem[];
  onRefreshData: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  settings,
  categories,
  products,
  gallery,
  onRefreshData,
}) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('wallora_admin_token'));
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<'quotations' | 'products' | 'categories' | 'settings' | 'gallery' | 'guide'>('quotations');

  // Quotation state
  const [quotations, setQuotations] = useState<QuotationRequest[]>([]);
  const [quoteSearch, setQuoteSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Product edit modal state
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Category edit state
  const [editingCategory, setEditingCategory] = useState<Partial<ProductCategory> | null>(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<BusinessSettings>(settings);
  const [settingsSaveMsg, setSettingsSaveMsg] = useState<string | null>(null);

  // Password change state
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passMsg, setPassMsg] = useState<string | null>(null);

  // Load quotations if logged in
  useEffect(() => {
    if (token) {
      fetchQuotations();
    }
  }, [token]);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  const fetchQuotations = async () => {
    try {
      const res = await fetch('/api/quotations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        return;
      }
      const data = await res.json();
      setQuotations(data);
    } catch (err) {
      console.error('Error fetching quotations:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setToken(data.token);
      localStorage.setItem('wallora_admin_token', data.token);
      setPassword('');
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('wallora_admin_token');
  };

  // Quotation actions
  const handleUpdateQuotationStatus = async (id: string, status: QuotationRequest['status']) => {
    try {
      const res = await fetch(`/api/quotations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchQuotations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteQuotation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quotation request?')) return;
    try {
      const res = await fetch(`/api/quotations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchQuotations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    window.open('/api/quotations/export', '_blank');
  };

  // Product Save
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const method = isNewProduct ? 'POST' : 'PUT';
      const url = isNewProduct ? '/api/products' : `/api/products/${editingProduct.id}`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingProduct),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to save product');
        return;
      }

      setEditingProduct(null);
      onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product permanently?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleProductAvailability = async (product: Product) => {
    try {
      await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAvailable: !product.isAvailable }),
      });
      onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaveMsg(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settingsForm),
      });
      if (res.ok) {
        setSettingsSaveMsg('Business details updated successfully!');
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to change password');
      } else {
        setPassMsg('Password changed successfully.');
        setOldPass('');
        setNewPass('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Login Screen if not authenticated
  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-lg p-6 sm:p-8 text-stone-100 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-serif-luxury text-2xl text-amber-100">
              Admin Portal
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Authorized access for {settings.businessName} management
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Administrator Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter password (default: wallora@admin2026)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-sm text-stone-100 focus:outline-hidden focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2.5 px-4 rounded bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              {authLoading ? 'Verifying...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-800 text-center">
            <p className="text-[11px] text-stone-500">
              Default password for demonstration: <code className="text-amber-400 font-mono">wallora@admin2026</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Filtered quotations
  const filteredQuotations = quotations.filter((q) => {
    if (statusFilter !== 'all' && q.status !== statusFilter) return false;
    if (quoteSearch.trim()) {
      const s = quoteSearch.toLowerCase();
      return (
        q.customerName.toLowerCase().includes(s) ||
        q.mobileNumber.toLowerCase().includes(s) ||
        q.city.toLowerCase().includes(s) ||
        q.productNameOrCode.toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-300 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif-luxury text-2xl text-stone-900 font-bold">
              Administrator Dashboard
            </span>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded border border-amber-300">
              Live Session
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage products, leads, categories, and business profile for {settings.businessName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onRefreshData();
              fetchQuotations();
            }}
            className="p-2 text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded transition-colors"
            title="Refresh database"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tab Navigators */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-stone-200">
        <button
          onClick={() => setActiveTab('quotations')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'quotations' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Quotations & Leads ({quotations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'products' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'settings' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Business Details & WhatsApp</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'guide' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span className="text-amber-600 font-semibold">Production Setup Guide</span>
        </button>
      </div>

      {/* 1. QUOTATIONS TAB */}
      {activeTab === 'quotations' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-stone-200">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter inquiries by name, phone, city..."
                  value={quoteSearch}
                  onChange={(e) => setQuoteSearch(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded pl-9 pr-3 py-1.5 text-xs text-stone-900"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded px-3 py-1.5 text-xs text-stone-800"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="quoted">Quoted</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          {filteredQuotations.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-stone-200 text-xs text-stone-500">
              No quotation requests found matching criteria.
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-700 uppercase tracking-wider font-semibold border-b border-stone-200">
                    <tr>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">City</th>
                      <th className="p-3">Product / SKU</th>
                      <th className="p-3">Dimensions / Qty</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {filteredQuotations.map((q) => (
                      <tr key={q.id} className="hover:bg-stone-50 transition-colors">
                        <td className="p-3">
                          <div className="font-semibold text-stone-900">{q.customerName}</div>
                          <div className="text-[10px] text-stone-400 font-mono">
                            {new Date(q.createdAt).toLocaleDateString('en-IN')}
                          </div>
                        </td>
                        <td className="p-3">
                          <a
                            href={`https://wa.me/${q.mobileNumber.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 hover:underline font-medium"
                          >
                            {q.mobileNumber}
                          </a>
                        </td>
                        <td className="p-3 text-stone-700">{q.city}</td>
                        <td className="p-3">
                          <div className="text-stone-900 font-medium">{q.productNameOrCode}</div>
                          <div className="text-[11px] text-stone-500">{q.category}</div>
                        </td>
                        <td className="p-3 text-stone-700">
                          <div>{q.wallDimensions}</div>
                          <div className="text-[11px] text-stone-500">
                            {q.quantityRequired} {q.installationRequired && '· Installation: Yes'}
                          </div>
                        </td>
                        <td className="p-3">
                          <select
                            value={q.status}
                            onChange={(e) => handleUpdateQuotationStatus(q.id, e.target.value as any)}
                            className={`text-[11px] font-semibold rounded px-2 py-1 border ${
                              q.status === 'new'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : q.status === 'contacted'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : q.status === 'quoted'
                                ? 'bg-purple-50 text-purple-800 border-purple-300'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            }`}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="quoted">Quoted</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteQuotation(q.id)}
                            className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                            title="Delete quotation"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-luxury text-xl text-stone-900">Showroom Products</h3>
              <p className="text-xs text-stone-500">Edit prices, toggle Request Price, update SKUs and images.</p>
            </div>
            <button
              onClick={() => {
                setEditingProduct({
                  name: '',
                  sku: `WAL-${Math.floor(Math.random() * 899 + 100)}`,
                  categoryId: categories[0]?.slug || 'designer-wallpapers',
                  categoryName: categories[0]?.name || 'Designer Wallpapers',
                  material: 'Virgin Polymer Composite',
                  finish: 'Matte Natural',
                  dimensions: 'Standard Sizing',
                  thickness: '22 mm',
                  price: 500,
                  priceUnit: 'per unit',
                  requestPriceOnly: false,
                  isAvailable: true,
                  isTrending: false,
                  isFeatured: false,
                  description: '',
                  applications: ['Living Rooms', 'Bedrooms'],
                  installationInfo: 'Clip and structural adhesive mounting.',
                  patternType: 'fluted',
                  colors: ['Natural', 'Charcoal'],
                  patterns: ['Fluted Louvers'],
                });
                setIsNewProduct(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-700 uppercase tracking-wider font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price / Quote</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-3 font-semibold text-stone-900">{p.name}</td>
                    <td className="p-3 font-mono text-stone-600">{p.sku}</td>
                    <td className="p-3 text-stone-700">{p.categoryName}</td>
                    <td className="p-3">
                      {p.requestPriceOnly || p.price === null ? (
                        <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Request Price
                        </span>
                      ) : (
                        <span className="font-mono font-semibold text-stone-900">
                          ₹{p.price.toLocaleString('en-IN')} <span className="text-stone-400 font-normal">{p.priceUnit}</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleProductAvailability(p)}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded border transition-colors ${
                          p.isAvailable
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-stone-100 text-stone-500 border-stone-300'
                        }`}
                      >
                        {p.isAvailable ? 'In Stock' : 'On Order'}
                      </button>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingProduct({ ...p });
                          setIsNewProduct(false);
                        }}
                        className="p-1 text-stone-600 hover:text-stone-900"
                        title="Edit product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1 text-stone-400 hover:text-rose-600"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-lg border border-stone-200 shadow-xs space-y-6">
            <div>
              <h3 className="font-serif-luxury text-2xl text-stone-900">Business Profile & WhatsApp</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Customize your company name, showroom address, and contact numbers.
              </p>
            </div>

            {settingsSaveMsg && (
              <div className="p-3 rounded bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{settingsSaveMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={settingsForm.businessName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, businessName: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    WhatsApp Business Number (with Country Code)
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={settingsForm.whatsappNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 text-stone-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Showroom Phone</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Inquiry Email Address</label>
                <input
                  type="email"
                  value={settingsForm.email}
                  onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-medium text-stone-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    value={settingsForm.city}
                    onChange={(e) => setSettingsForm({ ...settingsForm, city: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Business Hours</label>
                  <input
                    type="text"
                    value={settingsForm.businessHours}
                    onChange={(e) => setSettingsForm({ ...settingsForm, businessHours: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Google Maps URL</label>
                  <input
                    type="text"
                    value={settingsForm.googleMapsUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, googleMapsUrl: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 text-stone-900"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold cursor-pointer"
                >
                  Save Business Details
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-4 bg-white p-6 rounded-lg border border-stone-200 shadow-xs space-y-4">
            <h4 className="font-serif-luxury text-lg text-stone-900">Change Admin Password</h4>
            {passMsg && (
              <div className="p-2.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs">
                {passMsg}
              </div>
            )}
            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-1.5"
                />
              </div>
              <div>
                <label className="block text-stone-700 mb-1">New Password (min 6 chars)</label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-1.5"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-white font-semibold rounded"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. PRODUCTION SETUP GUIDE TAB */}
      {activeTab === 'guide' && (
        <div className="bg-white p-6 sm:p-10 rounded-lg border border-stone-200 shadow-xs space-y-6 text-xs text-stone-700 leading-relaxed">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
              Deployment & Handoff Guide
            </span>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl text-stone-900 mt-1">
              Production Configuration Guide for {settings.businessName}
            </h3>
            <p className="text-stone-500 mt-1">
              Step-by-step checklist to configure business details, database persistence, images, and WhatsApp credentials before publishing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-5 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
              <div className="font-semibold text-stone-900 text-sm flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                1. Configure Business Details & WhatsApp
              </div>
              <p>
                Navigate to the <strong>Business Details & WhatsApp</strong> tab in this admin dashboard. Update the legal company name, showroom physical address, city, and verified WhatsApp number. All product inquiry buttons and WhatsApp floating widgets immediately update dynamically across the entire website.
              </p>
            </div>

            <div className="p-5 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
              <div className="font-semibold text-stone-900 text-sm flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                2. Change Administrator Password
              </div>
              <p>
                The default password is set to <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-800 font-mono">wallora@admin2026</code>. Change it in the Settings column to a strong password. Credentials are cryptographically salted and hashed on the server.
              </p>
            </div>

            <div className="p-5 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
              <div className="font-semibold text-stone-900 text-sm flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                3. Persistent Database Architecture
              </div>
              <p>
                All products, quotations, and settings are saved on the server in <code className="bg-stone-200 px-1 py-0.5 rounded font-mono">data/db.json</code> with atomic file writes. Inquiries submitted by customers persist across server reloads and can be exported as standard CSV files for CRM integration.
              </p>
            </div>

            <div className="p-5 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
              <div className="font-semibold text-stone-900 text-sm flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                4. Customizing Product Catalog & SKUs
              </div>
              <p>
                Sample benchmark products can be replaced or extended with real supplier stock. Toggle items to <em>Request Price</em> if trade pricing fluctuates, and flag popular panels as <em>Trending</em> to highlight them on the homepage.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Product Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-lg border border-stone-200 p-6 max-w-2xl w-full text-xs text-stone-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-serif-luxury text-xl text-stone-900">
                {isNewProduct ? 'Add New Product' : `Edit: ${editingProduct.name}`}
              </h4>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-stone-400 hover:text-stone-700 font-bold text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Product Code / SKU</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Category</label>
                  <select
                    value={editingProduct.categoryId}
                    onChange={(e) => {
                      const selCat = categories.find((c) => c.slug === e.target.value);
                      setEditingProduct({
                        ...editingProduct,
                        categoryId: e.target.value,
                        categoryName: selCat?.name || e.target.value,
                      });
                    }}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Pattern / Visual Style</label>
                  <select
                    value={editingProduct.patternType || 'fluted'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, patternType: e.target.value as any })}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5"
                  >
                    <option value="fluted">Fluted Slat / WPC Louvers</option>
                    <option value="marble">High-Gloss UV Marble</option>
                    <option value="botanical">Wallpaper Damask / Linen</option>
                    <option value="charcoal-gold">Charcoal Metallic</option>
                    <option value="3d">3D Geometric Relief</option>
                    <option value="wood">Natural Timber Veneer</option>
                    <option value="pvc">PVC Waterproof</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    value={editingProduct.price ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value ? Number(e.target.value) : null })}
                    placeholder="e.g. 1850"
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Price Unit</label>
                  <input
                    type="text"
                    value={editingProduct.priceUnit || 'per unit'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, priceUnit: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProduct.requestPriceOnly)}
                      onChange={(e) => setEditingProduct({ ...editingProduct, requestPriceOnly: e.target.checked })}
                    />
                    <span>Request Price Only</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Material</label>
                  <input
                    type="text"
                    value={editingProduct.material || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Finish</label>
                  <input
                    type="text"
                    value={editingProduct.finish || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, finish: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={editingProduct.dimensions || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, dimensions: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Thickness</label>
                  <input
                    type="text"
                    value={editingProduct.thickness || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, thickness: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isAvailable !== false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isAvailable: e.target.checked })}
                  />
                  <span>In Stock</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.isTrending)}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isTrending: e.target.checked })}
                  />
                  <span>Mark Trending</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.isFeatured)}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                  />
                  <span>Featured on Home</span>
                </label>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border rounded text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 text-white font-semibold rounded hover:bg-stone-800"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
