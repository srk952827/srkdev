export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  materialSummary: string;
  applications: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  sku: string;
  material: string;
  finish: string;
  colors: string[];
  patterns: string[];
  dimensions: string;
  thickness: string;
  price: number | null;
  priceUnit: string; // e.g. "per roll", "per sq.ft", "per panel"
  requestPriceOnly: boolean;
  isAvailable: boolean;
  isTrending: boolean;
  isFeatured: boolean;
  description: string;
  applications: string[];
  installationInfo: string;
  image: string;
  patternType: 'geometric' | 'marble' | 'fluted' | 'wood' | 'botanical' | 'acoustic' | '3d';
  createdAt: string;
}

export interface QuotationRequest {
  id: string;
  customerName: string;
  mobileNumber: string;
  city: string;
  category: string;
  productNameOrCode: string;
  wallDimensions: string;
  quantityRequired: string;
  installationRequired: boolean;
  additionalMessage: string;
  status: 'new' | 'contacted' | 'quoted' | 'closed';
  notes?: string;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Living Room' | 'Bedroom' | 'TV Unit' | 'Office' | 'Commercial' | 'Before-After';
  roomType: string;
  materialUsed: string;
  description: string;
  image: string;
  beforeImage?: string;
}

export interface BusinessSettings {
  businessName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  businessHours: string;
  googleMapsUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  pinterestUrl: string;
  wallpaperCalculator: {
    standardRollWidthM: number;
    standardRollLengthM: number;
    defaultWastagePct: number;
  };
  panelCalculator: {
    defaultPanelWidthMm: number;
    defaultPanelHeightMm: number;
    defaultWastagePct: number;
  };
}
