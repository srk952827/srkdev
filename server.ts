import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { db } from './server/db.js';
import { Product, ProductCategory, QuotationRequest, GalleryItem } from './src/types/index.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Admin sessions / tokens
const activeAdminTokens = new Set<string>();
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || crypto.randomBytes(32).toString('hex');

function generateAdminToken(): string {
  const token = crypto.randomBytes(32).toString('hex');
  activeAdminTokens.add(token);
  return token;
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
  }
  const token = authHeader.split(' ')[1];
  if (!activeAdminTokens.has(token)) {
    return res.status(403).json({ error: 'Forbidden: Invalid or expired admin session' });
  }
  next();
}

// Request rate limiter / honeypot spam protection for quotation inquiries
const rateLimitMap = new Map<string, { count: number; firstSeen: number }>();

function quotationSpamFilter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const clientWindow = rateLimitMap.get(ip);

  if (clientWindow) {
    if (now - clientWindow.firstSeen < 60000) { // 1 min window
      if (clientWindow.count >= 5) {
        return res.status(429).json({ error: 'Too many requests. Please wait a minute before submitting again or contact via WhatsApp.' });
      }
      clientWindow.count += 1;
    } else {
      rateLimitMap.set(ip, { count: 1, firstSeen: now });
    }
  } else {
    rateLimitMap.set(ip, { count: 1, firstSeen: now });
  }

  // Honeypot field check
  if (req.body.company_website || req.body.fax_number) {
    // Hidden bot fields filled out
    return res.status(400).json({ error: 'Spam detected' });
  }

  next();
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ---- PUBLIC & ADMIN API ROUTES ----

// Settings
app.get('/api/settings', (_req: Request, res: Response) => {
  res.json(db.getSettings());
});

app.put('/api/settings', requireAdmin, async (req: Request, res: Response) => {
  try {
    const updated = await db.updateSettings(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update settings' });
  }
});

// Categories
app.get('/api/categories', (_req: Request, res: Response) => {
  res.json(db.getCategories());
});

app.post('/api/categories', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name, slug, tagline, description, image, materialSummary, applications } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required' });
    const newCat: ProductCategory = {
      id: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name,
      tagline: tagline || '',
      description: description || '',
      image: image || 'wallpaper-hero',
      materialSummary: materialSummary || '',
      applications: Array.isArray(applications) ? applications : [],
    };
    const created = await db.addCategory(newCat);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to add category' });
  }
});

app.put('/api/categories/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const updated = await db.updateCategory(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Category not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update category' });
  }
});

app.delete('/api/categories/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const deleted = await db.deleteCategory(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Category not found' });
    res.json({ success: true, message: 'Category deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete category' });
  }
});

// Products
app.get('/api/products', (req: Request, res: Response) => {
  let products = db.getProducts();
  const { category, search, trending, featured, sort } = req.query;

  if (category && typeof category === 'string') {
    products = products.filter((p) => p.categoryId === category || p.categoryName.toLowerCase() === category.toLowerCase());
  }

  if (trending === 'true') {
    products = products.filter((p) => p.isTrending);
  }

  if (featured === 'true') {
    products = products.filter((p) => p.isFeatured);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.colors.some((c) => c.toLowerCase().includes(q))
    );
  }

  if (sort === 'price-asc') {
    products = [...products].sort((a, b) => (a.price || 999999) - (b.price || 999999));
  } else if (sort === 'price-desc') {
    products = [...products].sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sort === 'name-asc') {
    products = [...products].sort((a, b) => a.name.localeCompare(b.name));
  }

  res.json(products);
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = db.getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.post('/api/products', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name, categoryId, categoryName, sku, material, finish, colors, patterns, dimensions, thickness, price, priceUnit, requestPriceOnly, isAvailable, isTrending, isFeatured, description, applications, installationInfo, image, patternType } = req.body;

    if (!name || !sku || !categoryId) {
      return res.status(400).json({ error: 'Name, SKU, and Category are required' });
    }

    const id = `prod-${Date.now()}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newProduct: Product = {
      id,
      name,
      slug,
      categoryId,
      categoryName: categoryName || categoryId,
      sku,
      material: material || 'Premium Composite',
      finish: finish || 'Standard Matte',
      colors: Array.isArray(colors) ? colors : colors ? [colors] : ['Natural'],
      patterns: Array.isArray(patterns) ? patterns : patterns ? [patterns] : ['Standard'],
      dimensions: dimensions || 'Standard Sizing',
      thickness: thickness || 'Standard Gauge',
      price: price !== undefined && price !== null && price !== '' ? Number(price) : null,
      priceUnit: priceUnit || 'per unit',
      requestPriceOnly: Boolean(requestPriceOnly),
      isAvailable: isAvailable !== false,
      isTrending: Boolean(isTrending),
      isFeatured: Boolean(isFeatured),
      description: description || 'High quality decorative wall material for interior transformation.',
      applications: Array.isArray(applications) ? applications : ['Living Rooms', 'Bedrooms'],
      installationInfo: installationInfo || 'Professional on-site installation available on request.',
      image: image || 'wallpaper-artdeco',
      patternType: patternType || 'fluted',
      createdAt: new Date().toISOString(),
    };

    const created = await db.addProduct(newProduct);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create product' });
  }
});

app.put('/api/products/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const updated = await db.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update product' });
  }
});

app.delete('/api/products/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const deleted = await db.deleteProduct(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete product' });
  }
});

// Quotation Requests
app.post('/api/quotations', quotationSpamFilter, async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      mobileNumber,
      city,
      category,
      productNameOrCode,
      wallDimensions,
      quantityRequired,
      installationRequired,
      additionalMessage,
    } = req.body;

    // Strict Server-Side Validation
    if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter a valid customer name (at least 2 characters).' });
    }

    if (!mobileNumber || typeof mobileNumber !== 'string') {
      return res.status(400).json({ error: 'Mobile number is required.' });
    }

    const cleanMobile = mobileNumber.replace(/[^0-9+]/g, '');
    if (cleanMobile.length < 10) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number for WhatsApp & call communication.' });
    }

    if (!city || city.trim().length < 2) {
      return res.status(400).json({ error: 'City is required for delivery & installation estimate.' });
    }

    const newQuotation: QuotationRequest = {
      id: `quote-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      customerName: customerName.trim(),
      mobileNumber: mobileNumber.trim(),
      city: city.trim(),
      category: category ? category.trim() : 'General Inquiry',
      productNameOrCode: productNameOrCode ? productNameOrCode.trim() : 'General Wall Covering',
      wallDimensions: wallDimensions ? wallDimensions.trim() : 'Not specified',
      quantityRequired: quantityRequired ? quantityRequired.trim() : 'Estimate needed',
      installationRequired: Boolean(installationRequired),
      additionalMessage: additionalMessage ? additionalMessage.trim() : '',
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    const saved = await db.addQuotation(newQuotation);
    res.status(201).json({
      success: true,
      message: 'Quotation request submitted successfully. Our team will review your specifications and contact you promptly via WhatsApp and phone.',
      quotationId: saved.id,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to submit quotation' });
  }
});

app.get('/api/quotations', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getQuotations());
});

app.put('/api/quotations/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const updated = await db.updateQuotation(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Quotation not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update quotation' });
  }
});

app.delete('/api/quotations/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const deleted = await db.deleteQuotation(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Quotation not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete quotation' });
  }
});

// CSV Export for quotations
app.get('/api/quotations/export', requireAdmin, (_req: Request, res: Response) => {
  const quotations = db.getQuotations();
  const headers = ['Quotation ID', 'Date', 'Customer Name', 'Mobile Number', 'City', 'Category', 'Product / SKU', 'Wall Dimensions', 'Quantity', 'Installation Required', 'Status', 'Notes', 'Message'];

  const rows = quotations.map((q) => [
    `"${q.id}"`,
    `"${new Date(q.createdAt).toLocaleDateString('en-IN')}"`,
    `"${q.customerName.replace(/"/g, '""')}"`,
    `"${q.mobileNumber}"`,
    `"${q.city.replace(/"/g, '""')}"`,
    `"${q.category.replace(/"/g, '""')}"`,
    `"${q.productNameOrCode.replace(/"/g, '""')}"`,
    `"${q.wallDimensions.replace(/"/g, '""')}"`,
    `"${q.quantityRequired.replace(/"/g, '""')}"`,
    `"${q.installationRequired ? 'Yes' : 'No'}"`,
    `"${q.status}"`,
    `"${(q.notes || '').replace(/"/g, '""')}"`,
    `"${(q.additionalMessage || '').replace(/"/g, '""')}"`,
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="ajanta_quotations_${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send(csv);
});

// Gallery
app.get('/api/gallery', (_req: Request, res: Response) => {
  res.json(db.getGallery());
});

app.post('/api/gallery', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { title, category, roomType, materialUsed, description, image, beforeImage } = req.body;
    if (!title || !category) return res.status(400).json({ error: 'Title and category required' });
    const item: GalleryItem = {
      id: `gal-${Date.now()}`,
      title,
      category,
      roomType: roomType || 'Interior Space',
      materialUsed: materialUsed || 'Decorative Wall Panels',
      description: description || '',
      image: image || 'living-after',
      beforeImage,
    };
    const saved = await db.addGalleryItem(item);
    res.status(201).json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to add gallery item' });
  }
});

app.delete('/api/gallery/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const deleted = await db.deleteGalleryItem(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Gallery item not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete gallery item' });
  }
});

// Admin Auth
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  const isValid = db.verifyAdmin(password);
  if (!isValid) {
    return res.status(401).json({ error: 'Incorrect administrator password.' });
  }

  const token = generateAdminToken();
  res.json({
    success: true,
    token,
    message: 'Authenticated as administrator.',
  });
});

app.get('/api/admin/verify', requireAdmin, (_req: Request, res: Response) => {
  res.json({ authenticated: true });
});

app.post('/api/admin/change-password', requireAdmin, (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters.' });
  }

  const success = db.changeAdminPassword(oldPassword, newPassword);
  if (!success) {
    return res.status(400).json({ error: 'Current password is incorrect.' });
  }

  res.json({ success: true, message: 'Password changed successfully.' });
});

// ---- FRONTEND MOUNTING ----

async function startServer() {
  await db.init();

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ajanta Interiors server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
