import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { BusinessSettings, ProductCategory, Product, GalleryItem, QuotationRequest } from '../src/types/index.js';
import { initialSettings, initialCategories, initialProducts, initialGallery, initialQuotations } from '../src/data/initialData.js';

interface DatabaseSchema {
  settings: BusinessSettings;
  categories: ProductCategory[];
  products: Product[];
  gallery: GalleryItem[];
  quotations: QuotationRequest[];
  adminPasswordHash: string;
  adminPasswordSalt: string;
}

const DB_FILE_PATH = path.resolve(process.cwd(), 'data', 'db.json');

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

class Database {
  private data: DatabaseSchema | null = null;
  private isSaving = false;

  async init(): Promise<void> {
    try {
      await fs.mkdir(path.dirname(DB_FILE_PATH), { recursive: true });
      const fileExists = await fs.stat(DB_FILE_PATH).then(() => true).catch(() => false);

      if (fileExists) {
        const raw = await fs.readFile(DB_FILE_PATH, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        const salt = crypto.randomBytes(16).toString('hex');
        const defaultPassword = process.env.ADMIN_PASSWORD || 'wallora@admin2026';
        const hash = hashPassword(defaultPassword, salt);

        this.data = {
          settings: initialSettings,
          categories: initialCategories,
          products: initialProducts,
          gallery: initialGallery,
          quotations: initialQuotations,
          adminPasswordSalt: salt,
          adminPasswordHash: hash,
        };
        await this.persist();
      }
    } catch (err) {
      console.error('Error initializing database, falling back to in-memory initial data:', err);
      const salt = crypto.randomBytes(16).toString('hex');
      this.data = {
        settings: initialSettings,
        categories: initialCategories,
        products: initialProducts,
        gallery: initialGallery,
        quotations: initialQuotations,
        adminPasswordSalt: salt,
        adminPasswordHash: hashPassword('wallora@admin2026', salt),
      };
    }
  }

  private async persist(): Promise<void> {
    if (!this.data) return;
    if (this.isSaving) return;
    this.isSaving = true;
    try {
      const tempPath = `${DB_FILE_PATH}.tmp`;
      await fs.writeFile(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      await fs.rename(tempPath, DB_FILE_PATH);
    } catch (err) {
      console.error('Failed to persist database to disk:', err);
    } finally {
      this.isSaving = false;
    }
  }

  // Admin auth
  verifyAdmin(password: string): boolean {
    if (!this.data) return false;
    const computed = hashPassword(password, this.data.adminPasswordSalt);
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(this.data.adminPasswordHash));
  }

  changeAdminPassword(oldPass: string, newPass: string): boolean {
    if (!this.verifyAdmin(oldPass)) return false;
    const newSalt = crypto.randomBytes(16).toString('hex');
    const newHash = hashPassword(newPass, newSalt);
    this.data!.adminPasswordSalt = newSalt;
    this.data!.adminPasswordHash = newHash;
    this.persist();
    return true;
  }

  // Settings
  getSettings(): BusinessSettings {
    return this.data?.settings || initialSettings;
  }

  async updateSettings(newSettings: Partial<BusinessSettings>): Promise<BusinessSettings> {
    if (!this.data) await this.init();
    this.data!.settings = { ...this.data!.settings, ...newSettings };
    await this.persist();
    return this.data!.settings;
  }

  // Categories
  getCategories(): ProductCategory[] {
    return this.data?.categories || [];
  }

  async addCategory(cat: ProductCategory): Promise<ProductCategory> {
    this.data!.categories.push(cat);
    await this.persist();
    return cat;
  }

  async updateCategory(id: string, updates: Partial<ProductCategory>): Promise<ProductCategory | null> {
    const idx = this.data!.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data!.categories[idx] = { ...this.data!.categories[idx], ...updates };
    await this.persist();
    return this.data!.categories[idx];
  }

  async deleteCategory(id: string): Promise<boolean> {
    const initialLen = this.data!.categories.length;
    this.data!.categories = this.data!.categories.filter((c) => c.id !== id);
    const deleted = this.data!.categories.length < initialLen;
    if (deleted) await this.persist();
    return deleted;
  }

  // Products
  getProducts(): Product[] {
    return this.data?.products || [];
  }

  getProductById(id: string): Product | null {
    return this.data?.products.find((p) => p.id === id || p.slug === id) || null;
  }

  async addProduct(product: Product): Promise<Product> {
    this.data!.products.unshift(product);
    await this.persist();
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const idx = this.data!.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data!.products[idx] = { ...this.data!.products[idx], ...updates };
    await this.persist();
    return this.data!.products[idx];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const initialLen = this.data!.products.length;
    this.data!.products = this.data!.products.filter((p) => p.id !== id);
    const deleted = this.data!.products.length < initialLen;
    if (deleted) await this.persist();
    return deleted;
  }

  // Quotations
  getQuotations(): QuotationRequest[] {
    return this.data?.quotations || [];
  }

  async addQuotation(quote: QuotationRequest): Promise<QuotationRequest> {
    this.data!.quotations.unshift(quote);
    await this.persist();
    return quote;
  }

  async updateQuotation(id: string, updates: Partial<QuotationRequest>): Promise<QuotationRequest | null> {
    const idx = this.data!.quotations.findIndex((q) => q.id === id);
    if (idx === -1) return null;
    this.data!.quotations[idx] = { ...this.data!.quotations[idx], ...updates };
    await this.persist();
    return this.data!.quotations[idx];
  }

  async deleteQuotation(id: string): Promise<boolean> {
    const initialLen = this.data!.quotations.length;
    this.data!.quotations = this.data!.quotations.filter((q) => q.id !== id);
    const deleted = this.data!.quotations.length < initialLen;
    if (deleted) await this.persist();
    return deleted;
  }

  // Gallery
  getGallery(): GalleryItem[] {
    return this.data?.gallery || [];
  }

  async addGalleryItem(item: GalleryItem): Promise<GalleryItem> {
    this.data!.gallery.unshift(item);
    await this.persist();
    return item;
  }

  async deleteGalleryItem(id: string): Promise<boolean> {
    const initialLen = this.data!.gallery.length;
    this.data!.gallery = this.data!.gallery.filter((g) => g.id !== id);
    const deleted = this.data!.gallery.length < initialLen;
    if (deleted) await this.persist();
    return deleted;
  }
}

export const db = new Database();
