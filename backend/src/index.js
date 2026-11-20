import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

const app = new Hono();

// Global Middleware
app.use('*', logger());
app.use('*', cors({
  origin: (origin) => {
    if (!origin) return '*';
    if (
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.includes('pages.dev') ||
      origin.includes('accoladescreenlady.com')
    ) {
      return origin;
    }
    return '*';
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Admin-PIN'],
  exposeHeaders: ['Content-Length', 'ETag'],
  maxAge: 86400,
}));

// Helper to verify Admin PIN
function verifyAdminPin(c, providedPin) {
  const validPin = c.env?.ADMIN_PIN || 'screenlady2026';
  const headerPin = c.req.header('X-Admin-PIN');
  const pin = providedPin || headerPin;
  return Boolean(pin && (pin === validPin || pin.toLowerCase() === validPin.toLowerCase()));
}

// ==========================================
// D1 DATABASE ROW SERIALIZATION & NORMALIZATION
// ==========================================

function rowToItem(row) {
  if (!row) return null;
  let tags = [];
  try {
    tags = row.tags ? JSON.parse(row.tags) : [];
  } catch {
    tags = row.tags ? row.tags.split(',').map((s) => s.trim()) : [];
  }

  let extra = {};
  if (row.extra_data) {
    try {
      extra = JSON.parse(row.extra_data);
    } catch {}
  }

  return {
    id: row.id,
    section: row.section,
    curatedSection: row.curated_section,
    type: row.type || 'photo-info',
    title: row.title || '',
    headline: row.headline || row.title || '',
    womanName: row.woman_name || '',
    author: row.author || '',
    authorDesignation: row.author_designation || '',
    category: row.category || '',
    categoryBadge: row.category_badge || '',
    summary: row.summary || '',
    infoSummary: row.summary || '',
    pullQuote: row.pull_quote || '',
    fullBody: row.full_body || '',
    fullInfo: row.full_body || '',
    fullContent: row.full_body || '',
    photo: row.photo || '',
    venue: row.venue || '',
    date: row.date || '',
    displayDate: row.display_date || row.date || '',
    readTime: row.read_time || '',
    duration: row.duration || '',
    host: row.host || '',
    guest: row.guest || '',
    audioUrl: row.audio_url || '',
    socialLink: row.social_link || '',
    tags,
    isHomepageNews: Boolean(row.is_homepage_news),
    isCustom: Boolean(row.is_custom),
    timestamp: row.timestamp || (row.created_at ? new Date(row.created_at).getTime() : Date.now()),
    createdAt: row.created_at || new Date().toISOString(),
    ...extra
  };
}

function itemToRow(section, item) {
  const id = item.id || `item_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const now = new Date().toISOString();
  const timestamp = item.timestamp || Date.now();
  const curatedSection =
    item.curatedSection ||
    (['filmy_adda', 'bizz_world', 'women_inspiration', 'fashion_lifestyle', 'news'].includes(section)
      ? section
      : null);
  const isHomepageNews = item.isHomepageNews || section === 'news' ? 1 : 0;
  const isCustom = item.isCustom !== undefined ? (item.isCustom ? 1 : 0) : 1;
  const tagsStr = Array.isArray(item.tags)
    ? JSON.stringify(item.tags)
    : typeof item.tags === 'string'
    ? item.tags
    : '[]';
  const summary = item.summary || item.infoSummary || item.excerpt || '';
  const fullBody = item.fullBody || item.fullInfo || item.fullContent || item.description || item.caption || '';

  const knownKeys = new Set([
    'id', 'section', 'curatedSection', 'type', 'title', 'headline', 'womanName',
    'name', 'author', 'authorDesignation', 'category', 'categoryBadge', 'summary',
    'infoSummary', 'pullQuote', 'fullBody', 'fullInfo', 'fullContent', 'description',
    'caption', 'photo', 'image', 'venue', 'date', 'displayDate', 'readTime',
    'duration', 'host', 'guest', 'audioUrl', 'socialLink', 'tags', 'isHomepageNews',
    'isCustom', 'timestamp', 'createdAt'
  ]);

  const extra = {};
  for (const [k, v] of Object.entries(item)) {
    if (!knownKeys.has(k) && v !== undefined) {
      extra[k] = v;
    }
  }

  return {
    id,
    section: section || item.section || 'updates',
    curated_section: curatedSection,
    type: item.type || 'photo-info',
    title: item.title || item.headline || '',
    headline: item.headline || item.title || '',
    woman_name: item.womanName || item.name || '',
    author: item.author || '',
    author_designation: item.authorDesignation || '',
    category: item.category || '',
    category_badge: item.categoryBadge || '',
    summary,
    pull_quote: item.pullQuote || '',
    full_body: fullBody,
    photo: item.photo || item.image || '',
    venue: item.venue || '',
    date: item.date || now.split('T')[0],
    display_date: item.displayDate || item.date || '',
    read_time: item.readTime || '',
    duration: item.duration || '',
    host: item.host || '',
    guest: item.guest || '',
    audio_url: item.audioUrl || '',
    social_link: item.socialLink || '',
    tags: tagsStr,
    is_homepage_news: isHomepageNews,
    is_custom: isCustom,
    timestamp,
    created_at: item.createdAt || now,
    extra_data: Object.keys(extra).length > 0 ? JSON.stringify(extra) : null
  };
}

function rowToOrder(row) {
  if (!row) return null;
  let extra = {};
  if (row.extra_data) {
    try {
      extra = JSON.parse(row.extra_data);
    } catch {}
  }
  return {
    id: row.id,
    orderId: row.order_id || row.id,
    name: row.name,
    customerName: row.name,
    phone: row.phone,
    customerPhone: row.phone,
    email: row.email || 'N/A',
    address: row.address,
    deliveryAddress: row.address,
    city: row.city || 'N/A',
    pincode: row.pincode || 'N/A',
    state: row.state || 'N/A',
    issue: row.edition || "Collector's Print Edition",
    edition: row.edition || "Collector's Print Edition",
    quantity: row.quantity || 1,
    amount: row.amount || 220,
    status: row.status || 'received',
    paymentStatus: row.payment_status || 'pending',
    dispatchStatus: row.dispatch_status || 'processing',
    paymentMethod: row.payment_method || 'COD',
    paymentId: row.payment_id || '',
    trackingNumber: row.tracking_number || '',
    notes: row.notes || '',
    timestamp: row.timestamp || (row.created_at ? new Date(row.created_at).getTime() : Date.now()),
    createdAt: row.created_at || new Date().toISOString(),
    date: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    displayDate: row.created_at
      ? new Date(row.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      : '',
    ...extra
  };
}

function rowToMagazine(row) {
  if (!row) {
    return {
      activeIssue: 'Latest Edition',
      coverImage: '/assets/images/magazine-cover-latest.jpg',
      page2Image: '/assets/images/magazine-page2-feature.jpg',
      price: 220,
      currency: 'INR',
      homeDelivery: true,
      availableIssues: []
    };
  }
  let availableIssues = [];
  if (row.available_issues) {
    try {
      availableIssues = JSON.parse(row.available_issues);
    } catch {}
  }
  return {
    activeIssue: row.active_issue || 'Latest Edition',
    coverImage: row.cover_image || '/assets/images/magazine-cover-latest.jpg',
    page2Image: row.page2_image || '/assets/images/magazine-page2-feature.jpg',
    price: row.price || 220,
    currency: row.currency || 'INR',
    homeDelivery: Boolean(row.home_delivery),
    availableIssues
  };
}

// ==========================================
// ROOT HEALTH CHECK & DASHBOARD STATS
// ==========================================

app.get('/', (c) => {
  return c.json({
    service: 'Accolade Screenlady Cloudflare Worker API',
    status: 'online',
    version: '1.4.0',
    database: {
      type: 'Cloudflare D1 (Serverless SQLite)',
      connected: Boolean(c.env?.DB)
    },
    media: {
      provider: 'ImageKit.io',
      configured: Boolean(c.env?.IMAGEKIT_PRIVATE_KEY),
      endpoint: c.env?.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/accoladescreenlady'
    },
    environment: c.env?.ENVIRONMENT || 'production',
    endpoints: {
      health: 'GET /',
      stats: 'GET /api/stats',
      updates: 'GET /api/updates',
      news: 'GET /api/news (Screenlady Updates Real-Time Live News)',
      editorials: 'GET /api/editorials',
      photos: 'GET /api/photos',
      podcast: 'GET /api/podcast',
      magazine: {
        get: 'GET /api/magazine',
        update: 'POST /api/magazine'
      },
      orders: {
        create: 'POST /api/orders',
        list: 'GET /api/orders',
        update: 'PUT /api/orders/:id',
        delete: 'DELETE /api/orders/:id'
      },
      media: {
        stream: 'GET /api/media/* (ImageKit CDN proxy)',
        upload: 'POST /api/media/upload (ImageKit upload)',
        auth: 'GET /api/imagekit/auth (ImageKit client auth parameters)'
      },
      admin: {
        publish: 'POST /api/publish',
        delete: 'POST /api/delete'
      },
      razorpay: {
        createOrder: 'POST /api/razorpay/create-order',
        verifyPayment: 'POST /api/razorpay/verify'
      }
    }
  });
});

function getDb(c) {
  if (!c.env?.DB) {
    throw new Error('Database binding (DB) is not configured in backend environment');
  }
  return c.env.DB;
}

// GET /api/stats - Global counters for Admin Dashboard
app.get('/api/stats', async (c) => {
  try {
    const db = getDb(c);
    const rows = await db.prepare(`
      SELECT section, COUNT(*) as count 
      FROM content_items 
      WHERE id NOT IN (SELECT id FROM deleted_records)
      GROUP BY section
    `).all();

    const counts = {};
    for (const r of rows.results || []) {
      counts[r.section] = r.count;
    }

    const orderCount = await db.prepare('SELECT COUNT(*) as count FROM orders').first();

    return c.json({
      success: true,
      stats: {
        editorials: counts['editorials'] || 0,
        updates: (counts['updates'] || 0) + (counts['news'] || 0) + (counts['filmy_adda'] || 0) + (counts['bizz_world'] || 0) + (counts['women_inspiration'] || 0) + (counts['fashion_lifestyle'] || 0),
        photos: counts['photos'] || 0,
        podcasts: counts['podcast'] || 0,
        orders: orderCount?.count || 0
      }
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// ==========================================
// 1. CONTENT FEEDS ENDPOINTS (PERSISTED IN D1)
// ==========================================

// GET /api/deleted-ids - List of globally removed IDs
app.get('/api/deleted-ids', async (c) => {
  try {
    const db = getDb(c);
    const rows = await db.prepare('SELECT id FROM deleted_records').all();
    const dbDeletedIds = (rows.results || []).map((r) => r.id);
    return c.json({
      success: true,
      deletedIds: dbDeletedIds
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// GET /api/updates - Live news, events, bulletins & curated sections
app.get('/api/updates', async (c) => {
  try {
    const db = getDb(c);
    const sectionFilter = c.req.query('section');

    if (sectionFilter) {
      const rows = await db.prepare(`
        SELECT * FROM content_items
        WHERE id NOT IN (SELECT id FROM deleted_records)
          AND (curated_section = ? OR section = ?)
        ORDER BY timestamp DESC
      `).bind(sectionFilter, sectionFilter).all();

      const items = (rows.results || []).map(rowToItem);
      return c.json({
        success: true,
        total: items.length,
        data: items
      });
    }

    const rows = await db.prepare(`
      SELECT * FROM content_items
      WHERE id NOT IN (SELECT id FROM deleted_records)
        AND (section = 'updates' OR curated_section IS NOT NULL)
      ORDER BY timestamp DESC
    `).all();

    const items = (rows.results || []).map(rowToItem);
    return c.json({
      success: true,
      total: items.length,
      data: items
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// GET /api/news - Dedicated endpoint for Screenlady Updates (Real-Time Live News)
app.get('/api/news', async (c) => {
  try {
    const db = getDb(c);
    const rows = await db.prepare(`
      SELECT * FROM content_items
      WHERE id NOT IN (SELECT id FROM deleted_records)
        AND (
          is_homepage_news = 1 
          OR section = 'news' 
          OR (section = 'updates' AND (curated_section IS NULL OR curated_section = '' OR curated_section = 'news' OR curated_section = 'updates'))
        )
        AND (curated_section NOT IN ('filmy_adda', 'bizz_world', 'women_inspiration', 'fashion_lifestyle') OR curated_section IS NULL)
      ORDER BY timestamp DESC
    `).all();

    const items = (rows.results || []).map(rowToItem);
    return c.json({
      success: true,
      total: items.length,
      data: items
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// GET /api/editorials - In-depth editorial columns & articles
app.get('/api/editorials', async (c) => {
  try {
    const db = getDb(c);
    const rows = await db.prepare(`
      SELECT * FROM content_items
      WHERE id NOT IN (SELECT id FROM deleted_records)
        AND section = 'editorials'
      ORDER BY timestamp DESC
    `).all();

    const items = (rows.results || []).map(rowToItem);
    return c.json({
      success: true,
      total: items.length,
      data: items
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// GET /api/photos - Curated event photos & gallery archives
app.get('/api/photos', async (c) => {
  try {
    const db = getDb(c);
    const rows = await db.prepare(`
      SELECT * FROM content_items
      WHERE id NOT IN (SELECT id FROM deleted_records)
        AND section IN ('photos', 'home_photos')
      ORDER BY timestamp DESC
    `).all();

    const items = (rows.results || []).map(rowToItem);
    return c.json({
      success: true,
      total: items.length,
      data: items
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// GET /api/podcast - Podcast episodes & streaming previews
app.get('/api/podcast', async (c) => {
  try {
    const db = getDb(c);
    const rows = await db.prepare(`
      SELECT * FROM content_items
      WHERE id NOT IN (SELECT id FROM deleted_records)
        AND section = 'podcast'
      ORDER BY timestamp DESC
    `).all();

    const items = (rows.results || []).map(rowToItem);
    return c.json({
      success: true,
      total: items.length,
      data: items
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// GET /api/magazine - Magazine settings & available issues
app.get('/api/magazine', async (c) => {
  try {
    const db = getDb(c);
    const row = await db.prepare('SELECT * FROM magazine_settings WHERE id = ?').bind('current').first();
    return c.json({
      success: true,
      data: rowToMagazine(row)
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// POST /api/magazine - Update magazine settings (Admin PIN protected)
app.post('/api/magazine', async (c) => {
  try {
    const body = await c.req.json();
    const { settings, adminPin } = body;

    if (!verifyAdminPin(c, adminPin)) {
      return c.json({ error: 'Unauthorized: Invalid Administrator Passcode' }, 401);
    }

    const db = getDb(c);
    const existingRow = await db.prepare('SELECT * FROM magazine_settings WHERE id = ?').bind('current').first();
    const current = rowToMagazine(existingRow);
    const m = { ...current, ...settings };

    await db.prepare(`
      INSERT OR REPLACE INTO magazine_settings (
        id, active_issue, cover_image, page2_image, price, currency, home_delivery, available_issues, updated_at
      ) VALUES ('current', ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      m.activeIssue || 'Latest Edition',
      m.coverImage || '/assets/images/magazine-cover-latest.jpg',
      m.page2Image || '/assets/images/magazine-page2-feature.jpg',
      m.price || 220,
      m.currency || 'INR',
      m.homeDelivery ? 1 : 0,
      JSON.stringify(m.availableIssues || []),
      new Date().toISOString()
    ).run();

    return c.json({
      success: true,
      data: m,
      message: 'Magazine settings updated successfully.'
    });
  } catch (err) {
    return c.json({ error: err.message || 'Failed to update magazine settings' }, 500);
  }
});

// ==========================================
// 2. ADMIN PORTAL PUBLISHING & DELETION ENDPOINTS
// ==========================================

// POST /api/publish - Add or update editorial, update, photo, or podcast
app.post('/api/publish', async (c) => {
  try {
    const body = await c.req.json();
    const { section, item, adminPin } = body;

    // Secure PIN verification
    if (!verifyAdminPin(c, adminPin)) {
      return c.json({ error: 'Unauthorized: Invalid Administrator Passcode' }, 401);
    }

    if (!section || !item) {
      return c.json({ error: 'Section and item payload are required' }, 400);
    }

    item.id = item.id || `item_${Date.now()}`;
    item.createdAt = item.createdAt || new Date().toISOString();
    item.timestamp = item.timestamp || Date.now();

    let normalizedSection = section;

    if (section === 'editorials') {
      normalizedSection = 'editorials';
    } else if (section === 'news') {
      item.curatedSection = 'news';
      item.isHomepageNews = true;
      item.type = 'news';
      normalizedSection = 'news';
    } else if (section === 'updates') {
      item.curatedSection = 'updates';
      item.isHomepageNews = false;
      normalizedSection = 'updates';
    } else if (section === 'photos' || section === 'home_photos') {
      item.curatedSection = section;
      normalizedSection = 'photos';
    } else if (section === 'podcast') {
      normalizedSection = 'podcast';
    } else if (
      section === 'filmy_adda' ||
      section === 'bizz_world' ||
      section === 'women_inspiration' ||
      section === 'fashion_lifestyle'
    ) {
      item.curatedSection = section;
      item.isHomepageNews = false;
      item.type = section;
      normalizedSection = section;
    } else {
      return c.json({ error: `Unknown section: ${section}` }, 400);
    }

    const db = getDb(c);
    const r = itemToRow(normalizedSection, item);
    await db.prepare(`
      INSERT OR REPLACE INTO content_items (
        id, section, curated_section, type, title, headline, woman_name, author,
        author_designation, category, category_badge, summary, pull_quote, full_body,
        photo, venue, date, display_date, read_time, duration, host, guest,
        audio_url, social_link, tags, is_homepage_news, is_custom, timestamp, created_at, extra_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      r.id, r.section, r.curated_section, r.type, r.title, r.headline, r.woman_name,
      r.author, r.author_designation, r.category, r.category_badge, r.summary,
      r.pull_quote, r.full_body, r.photo, r.venue, r.date, r.display_date,
      r.read_time, r.duration, r.host, r.guest, r.audio_url, r.social_link,
      r.tags, r.is_homepage_news, r.is_custom, r.timestamp, r.created_at, r.extra_data
    ).run();

    await db.prepare('DELETE FROM deleted_records WHERE id = ?').bind(item.id).run();

    return c.json({
      success: true,
      section: normalizedSection,
      item,
      message: `Successfully published entry to ${normalizedSection} (persisted to database).`
    }, 201);
  } catch (err) {
    return c.json({ error: err.message || 'Failed to publish entry' }, 500);
  }
});

// POST /api/delete - Delete entry from feed (Admin PIN protected)
app.post('/api/delete', async (c) => {
  try {
    const body = await c.req.json();
    const { section, id, adminPin } = body;

    if (!verifyAdminPin(c, adminPin)) {
      return c.json({ error: 'Unauthorized: Invalid Administrator Passcode' }, 401);
    }

    if (!section || !id) {
      return c.json({ error: 'Section and item id are required' }, 400);
    }

    const db = getDb(c);
    await db.prepare('DELETE FROM content_items WHERE id = ?').bind(id).run();
    await db.prepare('INSERT OR REPLACE INTO deleted_records (id, deleted_at) VALUES (?, ?)').bind(
      id,
      new Date().toISOString()
    ).run();

    const rows = await db.prepare('SELECT id FROM deleted_records').all();
    const deletedIds = (rows.results || []).map((r) => r.id);

    return c.json({
      success: true,
      section,
      id,
      deletedIds,
      message: `Item ${id} deleted successfully from ${section} (persisted in database).`
    });
  } catch (err) {
    return c.json({ error: err.message || 'Failed to delete entry' }, 500);
  }
});

// ==========================================
// 3. MAGAZINE ORDERS ENDPOINTS (PERSISTED IN D1)
// ==========================================

// POST /api/orders - Receive and process magazine order from Frontend
app.post('/api/orders', async (c) => {
  try {
    const body = await c.req.json();
    const { name, phone, email, address, pincode, city, state, issue, amount } = body;

    if (!name || !phone || !address) {
      return c.json({
        error: 'Validation failed: Name, phone number, and delivery address are required.'
      }, 400);
    }

    const orderId = `SL-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderId,
      orderId,
      name,
      customerName: name,
      phone,
      customerPhone: phone,
      email: email || 'N/A',
      address,
      deliveryAddress: address,
      pincode: pincode || 'N/A',
      city: city || 'N/A',
      state: state || 'N/A',
      issue: issue || "Collector's Print Edition",
      amount: amount || 220,
      createdAt: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      displayDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      paymentStatus: 'pending',
      dispatchStatus: 'processing',
      status: 'received'
    };

    const db = getDb(c);
    await db.prepare(`
      INSERT INTO orders (
        id, order_id, name, phone, email, address, city, pincode, state, edition,
        quantity, amount, status, payment_status, dispatch_status, payment_method,
        payment_id, tracking_number, notes, timestamp, created_at, extra_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      newOrder.id, newOrder.orderId, newOrder.name, newOrder.phone, newOrder.email,
      newOrder.address, newOrder.city, newOrder.pincode, newOrder.state, newOrder.issue,
      1, newOrder.amount, newOrder.status, newOrder.paymentStatus, newOrder.dispatchStatus,
      'COD', '', '', '', Date.now(), newOrder.createdAt, null
    ).run();

    return c.json({
      success: true,
      order: newOrder,
      message: 'Magazine order received successfully. Our team will verify and dispatch your edition.'
    }, 201);
  } catch (err) {
    return c.json({ error: err.message || 'Invalid JSON request body' }, 400);
  }
});

// GET /api/orders - List all orders (Admin or internal verification)
app.get('/api/orders', async (c) => {
  try {
    const db = getDb(c);
    const rows = await db.prepare('SELECT * FROM orders ORDER BY timestamp DESC').all();
    const orders = (rows.results || []).map(rowToOrder);
    return c.json({
      success: true,
      total: orders.length,
      orders
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// PUT /api/orders/:id - Update order status (Admin PIN protected)
app.put('/api/orders/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { paymentStatus, dispatchStatus, status, adminPin } = body;

    if (!verifyAdminPin(c, adminPin)) {
      return c.json({ error: 'Unauthorized: Invalid Administrator Passcode' }, 401);
    }

    const db = getDb(c);
    await db.prepare(`
      UPDATE orders SET
        status = COALESCE(?, status),
        payment_status = COALESCE(?, payment_status),
        dispatch_status = COALESCE(?, dispatch_status)
      WHERE id = ? OR order_id = ?
    `).bind(status || null, paymentStatus || null, dispatchStatus || null, id, id).run();

    const row = await db.prepare('SELECT * FROM orders WHERE id = ? OR order_id = ?').bind(id, id).first();
    const updated = rowToOrder(row);

    return c.json({
      success: true,
      order: updated || { id, paymentStatus, dispatchStatus, status },
      message: `Order ${id} updated successfully.`
    });
  } catch (err) {
    return c.json({ error: err.message || 'Failed to update order' }, 500);
  }
});

// DELETE /api/orders/:id - Delete order record (Admin PIN protected)
app.delete('/api/orders/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const adminPin = c.req.query('adminPin') || c.req.header('X-Admin-PIN');

    if (!verifyAdminPin(c, adminPin)) {
      return c.json({ error: 'Unauthorized: Invalid Administrator Passcode' }, 401);
    }

    const db = getDb(c);
    await db.prepare('DELETE FROM orders WHERE id = ? OR order_id = ?').bind(id, id).run();

    return c.json({
      success: true,
      id,
      message: `Order ${id} deleted successfully.`
    });
  } catch (err) {
    return c.json({ error: err.message || 'Failed to delete order' }, 500);
  }
});

// ==========================================
// 4. IMAGEKIT MEDIA ASSET ENDPOINTS
// ==========================================

// GET /api/imagekit/auth - Generate authentication parameters for client-side ImageKit uploads
app.get('/api/imagekit/auth', async (c) => {
  const privateKey = c.env?.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) {
    return c.json({
      error: 'IMAGEKIT_PRIVATE_KEY is not configured in backend environment.'
    }, 400);
  }

  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 1800; // 30 minutes
  const dataToSign = `${token}${expire}`;

  // HMAC-SHA1 calculation with Web Crypto API
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(privateKey),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  const sigBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(dataToSign));
  const signature = Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return c.json({
    token,
    expire,
    signature,
    publicKey: c.env?.IMAGEKIT_PUBLIC_KEY || '',
    urlEndpoint: c.env?.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/accoladescreenlady'
  });
});

// GET /api/media/* - Proxy or redirect to ImageKit CDN URL
app.get('/api/media/*', async (c) => {
  const path = c.req.path.replace(/^\/api\/media\/?/, '');
  if (!path) {
    return c.text('Media path is required. Example: /api/media/uploads/photo.jpg', 400);
  }

  const urlEndpoint = (c.env?.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/accoladescreenlady').replace(/\/+$/, '');
  const cleanPath = path.replace(/^\/+/, '');
  const targetUrl = `${urlEndpoint}/${cleanPath}`;

  // Redirect to ImageKit global CDN for fast edge delivery and transformations
  return c.redirect(targetUrl, 302);
});

// POST /api/media/upload - Upload file directly to ImageKit Media Library
app.post('/api/media/upload', async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body['file'];
    const customKey = body['key'] || body['fileName'];
    const folder = body['folder'] || '/screenlady/uploads';

    if (!file || typeof file === 'string') {
      return c.json({ error: 'Valid file is required in multipart form-data (key: "file")' }, 400);
    }

    const sanitizedName = file.name ? file.name.replace(/\s+/g, '_') : `file_${Date.now()}`;
    const fileName = customKey
      ? customKey.includes('/')
        ? customKey.split('/').pop()
        : customKey
      : `${Date.now()}-${sanitizedName}`;

    const privateKey = c.env?.IMAGEKIT_PRIVATE_KEY;

    if (privateKey) {
      const arrayBuffer = await file.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);
      let binary = '';
      for (let i = 0; i < uint8.byteLength; i++) {
        binary += String.fromCharCode(uint8[i]);
      }
      const base64Data = btoa(binary);

      const imagekitFormData = new FormData();
      imagekitFormData.append('file', `data:${file.type || 'image/jpeg'};base64,${base64Data}`);
      imagekitFormData.append('fileName', fileName);
      imagekitFormData.append('folder', folder);
      imagekitFormData.append('useUniqueFileName', 'true');
      imagekitFormData.append('tags', 'screenlady,upload');

      const authHeader = 'Basic ' + btoa(`${privateKey}:`);
      const ikRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        headers: {
          Authorization: authHeader
        },
        body: imagekitFormData
      });

      const ikJson = await ikRes.json();
      if (!ikRes.ok) {
        throw new Error(ikJson.message || `ImageKit upload failed with HTTP ${ikRes.status}`);
      }

      return c.json({
        success: true,
        provider: 'imagekit',
        fileId: ikJson.fileId,
        name: ikJson.name,
        url: ikJson.url,
        thumbnailUrl: ikJson.thumbnailUrl || ikJson.url,
        filePath: ikJson.filePath,
        size: ikJson.size,
        fileType: ikJson.fileType,
        height: ikJson.height,
        width: ikJson.width
      }, 201);
    }

    // Dev/Local fallback when IMAGEKIT_PRIVATE_KEY is not yet configured in environment
    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);
    let binary = '';
    const len = Math.min(uint8.byteLength, 1024 * 1024);
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8[i]);
    }
    const base64 = btoa(binary);
    const dataUrl = `data:${file.type || 'image/jpeg'};base64,${base64}`;

    return c.json({
      success: true,
      provider: 'imagekit_dev_preview',
      url: dataUrl,
      thumbnailUrl: dataUrl,
      fileName,
      notice: 'IMAGEKIT_PRIVATE_KEY secret not detected in session; returned local preview data. Set IMAGEKIT_PRIVATE_KEY and IMAGEKIT_URL_ENDPOINT to enable live ImageKit CDN uploads.'
    }, 201);
  } catch (err) {
    return c.json({ error: err.message || 'ImageKit upload failed' }, 500);
  }
});

// ==========================================
// 5. RAZORPAY PAYMENT GATEWAY ENDPOINTS
// ==========================================

// POST /api/razorpay/create-order
app.post('/api/razorpay/create-order', async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const { amount = 220, currency = 'INR', receipt = `rcpt_${Date.now()}` } = body;

    const keyId = c.env?.RAZORPAY_KEY_ID;
    const keySecret = c.env?.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return c.json({
        mock: true,
        orderId: `order_mock_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency,
        keyId: keyId || 'rzp_test_placeholder',
        notice: 'Configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET using wrangler secret put for live payments.'
      });
    }

    const authHeader = btoa(`${keyId}:${keySecret}`);
    const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${authHeader}`
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency,
        receipt,
        payment_capture: 1
      })
    });

    const data = await rzpResponse.json();
    return c.json(data, rzpResponse.status);
  } catch (err) {
    return c.json({ error: err.message || 'Razorpay order creation failed' }, 500);
  }
});

// POST /api/razorpay/verify
app.post('/api/razorpay/verify', async (c) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await c.req.json();

    const keySecret = c.env?.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return c.json({
        verified: true,
        mock: true,
        message: 'Signature verified in test mode (no secret key configured).'
      });
    }

    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(keySecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(text));
    const generatedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const isMatch = generatedSignature === razorpay_signature;

    return c.json({
      verified: isMatch,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id
    }, isMatch ? 200 : 400);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// 404 Handler
app.notFound((c) => {
  return c.json({ error: 'Endpoint Not Found', path: c.req.path }, 404);
});

// Error Handler
app.onError((err, c) => {
  console.error('Unhandled Worker error:', err);
  return c.json({ error: err.message || 'Internal Server Error' }, 500);
});

export default app;
