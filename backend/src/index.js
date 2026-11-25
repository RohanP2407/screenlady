import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

const app = new Hono();

// Global Middleware
app.use('*', logger());
app.use('*', cors({
  origin: (origin) => {
    if (!origin) return '*';
    const allowed = [
      'https://accoladescreenlady.com',
      'https://www.accoladescreenlady.com',
      'https://admin.accoladescreenlady.com',
      'https://api.accoladescreenlady.com'
    ];
    if (
      allowed.includes(origin) ||
      origin.includes('accoladescreenlady.com') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.includes('pages.dev') ||
      origin.includes('workers.dev')
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

// Helper to get active Admin PIN from D1 database with fallback to env or default
async function getStoredAdminPin(c) {
  try {
    if (c.env?.DB) {
      const row = await c.env.DB.prepare('SELECT pin_hash, pin_plain FROM admin_auth WHERE id = ?').bind('primary').first();
      if (row && (row.pin_plain || row.pin_hash)) {
        return (row.pin_plain || row.pin_hash).trim();
      }
    }
  } catch (err) {
    console.warn('Could not read admin_auth table, falling back to env/default PIN:', err);
  }
  return (c.env?.ADMIN_PIN || 'screenlady2026').trim();
}

// Helper to verify Admin PIN (asynchronous, checking D1 database)
async function verifyAdminPin(c, providedPin) {
  const headerPin = c.req.header('X-Admin-PIN');
  const pin = (providedPin || headerPin || '').trim();
  if (!pin) return false;

  const validPin = await getStoredAdminPin(c);
  return pin === validPin || pin.toLowerCase() === validPin.toLowerCase();
}

function getDb(c) {
  if (!c.env?.DB) {
    throw new Error('Database binding (DB) is not configured in backend environment');
  }
  return c.env.DB;
}

// ==========================================
// SERIALIZATION HELPERS FOR D1 TABLES
// ==========================================

function serializeItem(row, sectionName) {
  if (!row) return null;
  let extra = {};
  if (row.extra_data) {
    try {
      extra = JSON.parse(row.extra_data);
    } catch {}
  }

  return {
    id: row.id,
    section: sectionName || row.section || 'updates',
    curatedSection: row.curated_section || sectionName,
    title: row.title || row.headline || row.brand_name || '',
    headline: row.headline || row.title || '',
    brandName: row.brand_name || row.title || '',
    womanName: row.woman_name || '',
    author: row.author || '',
    authorDesignation: row.author_designation || '',
    category: row.category || '',
    categoryBadge: row.category_badge || (row.category ? `✦ ${row.category}` : ''),
    summary: row.summary || '',
    infoSummary: row.summary || '',
    pullQuote: row.pull_quote || '',
    tagline: row.tagline || '',
    fullBody: row.full_body || '',
    fullInfo: row.full_body || '',
    photo: row.photo || '',
    image: row.photo || '',
    cover: row.photo || '',
    coverImage: row.photo || '',
    monthYear: row.month_year || '',
    price: row.price || 220,
    orderLink: row.order_link || '',
    displayOrder: row.display_order || 0,
    destinationUrl: row.destination_url || '',
    link: row.destination_url || row.social_link || 'javascript:void(0)',
    venue: row.venue || '',
    credit: row.credit || '',
    date: row.date || '',
    displayDate: row.display_date || row.date || '',
    readTime: row.read_time || '',
    duration: row.duration || '',
    host: row.host || '',
    guest: row.guest || '',
    audioUrl: row.audio_url || '',
    socialLink: row.social_link || '',
    timestamp: row.timestamp || (row.created_at ? new Date(row.created_at).getTime() : Date.now()),
    createdAt: row.created_at || new Date().toISOString(),
    isCustom: true,
    ...extra
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
      activeIssue: 'Latest Issue',
      edition: 'Latest Issue',
      coverImage: 'https://ik.imagekit.io/acooladescreenlady/magazine-covers/cover-1795330731064_0Xwt7ILYb',
      page2Image: 'https://ik.imagekit.io/acooladescreenlady/screenlady/general/magazine-page2-feature_gqTZYEREU.jpg',
      price: 220,
      currency: 'INR',
      headline: 'THE ARCHITECTS OF MODERN INFLUENCE',
      subtitle: 'Celebrating Trailblazing Women Behind the Screen & Across Boardrooms',
      popupBadge: 'Screenlady Print Magazine',
      popupMessage: "Collector's Print Edition Now Available • Insured Doorstep Courier Across India",
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
    activeIssue: row.active_issue || 'Latest Issue',
    edition: row.active_issue || 'Latest Issue',
    coverImage: row.cover_image || 'https://ik.imagekit.io/acooladescreenlady/magazine-covers/cover-1795330731064_0Xwt7ILYb',
    page2Image: row.page2_image || 'https://ik.imagekit.io/acooladescreenlady/screenlady/general/magazine-page2-feature_gqTZYEREU.jpg',
    price: row.price || 220,
    currency: row.currency || 'INR',
    headline: row.headline || 'THE ARCHITECTS OF MODERN INFLUENCE',
    subtitle: row.subtitle || 'Celebrating Trailblazing Women Behind the Screen & Across Boardrooms',
    popupBadge: row.popup_badge || 'Screenlady Print Magazine',
    popupMessage: row.popup_message || "Collector's Print Edition Now Available • Insured Doorstep Courier Across India",
    homeDelivery: Boolean(row.home_delivery),
    availableIssues
  };
}

// ==========================================
// ROOT HEALTH CHECK & GLOBAL STATS
// ==========================================

app.get('/', (c) => {
  return c.json({
    service: 'Accolade Screenlady Cloudflare Worker API',
    status: 'online',
    version: '2.0.0',
    database: {
      type: 'Cloudflare D1 (Separate Category Tables)',
      connected: Boolean(c.env?.DB)
    },
    tables: [
      'realtime_updates',
      'business_ads',
      'filmy_adda',
      'bizz_world',
      'women_inspiration',
      'fashion_lifestyle',
      'gallery_photos',
      'editorials',
      'podcasts',
      'orders',
      'magazine_settings',
      'magazine_covers',
      'deleted_records',
      'admin_auth'
    ],
    media: {
      provider: 'ImageKit.io',
      configured: Boolean(c.env?.IMAGEKIT_PRIVATE_KEY),
      endpoint: c.env?.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/accoladescreenlady'
    }
  });
});

// ==========================================
// ADMIN AUTHENTICATION & PASSCODE APIs
// ==========================================

// POST /api/admin/verify-pin - Validate executive passcode
app.post('/api/admin/verify-pin', async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const pin = (body.pin || c.req.header('X-Admin-PIN') || '').trim();
    if (!pin) {
      return c.json({ success: false, error: 'Passcode is required' }, 400);
    }
    const isValid = await verifyAdminPin(c, pin);
    if (!isValid) {
      return c.json({ success: false, error: 'Incorrect administrator passcode' }, 401);
    }
    return c.json({ success: true, message: 'Administrator passcode verified successfully' });
  } catch (err) {
    return c.json({ success: false, error: err.message || 'Verification failed' }, 500);
  }
});

// POST /api/admin/change-pin - Update executive passcode in Cloudflare D1
app.post('/api/admin/change-pin', async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const { currentPin, newPin } = body;
    if (!currentPin || !newPin) {
      return c.json({ success: false, error: 'Both current and new passcodes are required' }, 400);
    }
    const isCurrentValid = await verifyAdminPin(c, currentPin);
    if (!isCurrentValid) {
      return c.json({ success: false, error: 'Current passcode is incorrect' }, 401);
    }
    const trimmedNew = String(newPin).trim();
    if (trimmedNew.length < 6) {
      return c.json({ success: false, error: 'New passcode must be at least 6 characters long' }, 400);
    }

    const db = getDb(c);
    await db.prepare(`
      INSERT INTO admin_auth (id, pin_hash, pin_plain, updated_at)
      VALUES ('primary', ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        pin_hash = excluded.pin_hash,
        pin_plain = excluded.pin_plain,
        updated_at = CURRENT_TIMESTAMP
    `).bind(trimmedNew, trimmedNew).run();

    return c.json({
      success: true,
      message: 'Administrator passcode updated successfully across all devices and database.'
    });
  } catch (err) {
    return c.json({ success: false, error: err.message || 'Failed to update passcode' }, 500);
  }
});

// GET /api/stats - Global Counters for Admin Dashboard
app.get('/api/stats', async (c) => {
  try {
    const db = getDb(c);
    const [
      rtRes,
      adsRes,
      filmyRes,
      bizzRes,
      womenRes,
      fashionRes,
      photosRes,
      editorialsRes,
      podcastsRes,
      ordersRes,
      magCoversRes
    ] = await Promise.all([
      db.prepare('SELECT COUNT(*) as c FROM realtime_updates WHERE id NOT IN (SELECT id FROM deleted_records)').first(),
      db.prepare('SELECT COUNT(*) as c FROM business_ads WHERE id NOT IN (SELECT id FROM deleted_records)').first(),
      db.prepare('SELECT COUNT(*) as c FROM filmy_adda WHERE id NOT IN (SELECT id FROM deleted_records)').first(),
      db.prepare('SELECT COUNT(*) as c FROM bizz_world WHERE id NOT IN (SELECT id FROM deleted_records)').first(),
      db.prepare('SELECT COUNT(*) as c FROM women_inspiration WHERE id NOT IN (SELECT id FROM deleted_records)').first(),
      db.prepare('SELECT COUNT(*) as c FROM fashion_lifestyle WHERE id NOT IN (SELECT id FROM deleted_records)').first(),
      db.prepare('SELECT COUNT(*) as c FROM gallery_photos WHERE id NOT IN (SELECT id FROM deleted_records)').first(),
      db.prepare('SELECT COUNT(*) as c FROM editorials WHERE id NOT IN (SELECT id FROM deleted_records)').first(),
      db.prepare('SELECT COUNT(*) as c FROM podcasts WHERE id NOT IN (SELECT id FROM deleted_records)').first(),
      db.prepare('SELECT COUNT(*) as c FROM orders').first(),
      db.prepare('SELECT COUNT(*) as c FROM magazine_covers WHERE id NOT IN (SELECT id FROM deleted_records)').first()
    ]);

    const rtCount = rtRes?.c || 0;
    const adsCount = adsRes?.c || 0;
    const filmyCount = filmyRes?.c || 0;
    const bizzCount = bizzRes?.c || 0;
    const womenCount = womenRes?.c || 0;
    const fashionCount = fashionRes?.c || 0;
    const photosCount = photosRes?.c || 0;
    const editorialsCount = editorialsRes?.c || 0;
    const podcastsCount = podcastsRes?.c || 0;
    const ordersCount = ordersRes?.c || 0;
    const magCoversCount = magCoversRes?.c || 0;

    return c.json({
      success: true,
      stats: {
        news: rtCount,
        realtimeNews: rtCount,
        businessAds: adsCount,
        filmyAdda: filmyCount,
        bizzWorld: bizzCount,
        womenInspiration: womenCount,
        fashionLifestyle: fashionCount,
        updates: filmyCount + bizzCount + womenCount + fashionCount,
        photos: photosCount,
        editorials: editorialsCount,
        podcasts: podcastsCount,
        orders: ordersCount,
        magazineCovers: magCoversCount
      }
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// GET /api/deleted-ids - Globally deleted record IDs
app.get('/api/deleted-ids', async (c) => {
  try {
    const db = getDb(c);
    const rows = await db.prepare('SELECT id FROM deleted_records').all();
    const deletedIds = (rows.results || []).map((r) => r.id);
    return c.json({
      success: true,
      deletedIds
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// ==========================================
// 1. REAL-TIME NEWS (HOMEPAGE LEFT COLUMN)
// ==========================================

// GET /api/news & GET /api/realtime-updates
const getRealtimeNewsHandler = async (c) => {
  try {
    const db = getDb(c);
    const rows = await db.prepare(`
      SELECT * FROM realtime_updates
      WHERE id NOT IN (SELECT id FROM deleted_records)
      ORDER BY timestamp DESC
    `).all();

    const items = (rows.results || []).map((r) => serializeItem(r, 'news'));
    return c.json({
      success: true,
      total: items.length,
      data: items
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
};

app.get('/api/news', getRealtimeNewsHandler);
app.get('/api/realtime-updates', getRealtimeNewsHandler);

// ==========================================
// 2. BUSINESS SHOWCASE / ADS (HOMEPAGE RIGHT COLUMN)
// Frontend displays as: "Brand Spotlight" / "Featured Partners" (NO 'ads' word)
// ==========================================

const getBusinessAdsHandler = async (c) => {
  try {
    const db = getDb(c);
    const rows = await db.prepare(`
      SELECT * FROM business_ads
      WHERE id NOT IN (SELECT id FROM deleted_records)
      ORDER BY timestamp DESC
    `).all();

    const items = (rows.results || []).map((r) => serializeItem(r, 'business_ads'));
    return c.json({
      success: true,
      total: items.length,
      data: items
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
};

app.get('/api/business-ads', getBusinessAdsHandler);
app.get('/api/business-showcase', getBusinessAdsHandler);
app.get('/api/ads', getBusinessAdsHandler);

// ==========================================
// 3. UPDATES SECTION CATEGORIES
// Dedicated separate tables:
// - filmy_adda
// - bizz_world
// - women_inspiration
// - fashion_lifestyle
// ==========================================

app.get('/api/updates/filmy-adda', async (c) => {
  try {
    const db = getDb(c);
    const rows = await db.prepare(`
      SELECT * FROM filmy_adda
      WHERE id NOT IN (SELECT id FROM deleted_records)
      ORDER BY timestamp DESC
    `).all();
    const items = (rows.results || []).map((r) => serializeItem(r, 'filmy_adda'));
    return c.json({ success: true, total: items.length, data: items });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

app.get('/api/updates/bizz-world', async (c) => {
  try {
    const db = getDb(c);
    const rows = await db.prepare(`
      SELECT * FROM bizz_world
      WHERE id NOT IN (SELECT id FROM deleted_records)
      ORDER BY timestamp DESC
    `).all();
    const items = (rows.results || []).map((r) => serializeItem(r, 'bizz_world'));
    return c.json({ success: true, total: items.length, data: items });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

app.get('/api/updates/women-inspiration', async (c) => {
  try {
    const db = getDb(c);
    const rows = await db.prepare(`
      SELECT * FROM women_inspiration
      WHERE id NOT IN (SELECT id FROM deleted_records)
      ORDER BY timestamp DESC
    `).all();
    const items = (rows.results || []).map((r) => serializeItem(r, 'women_inspiration'));
    return c.json({ success: true, total: items.length, data: items });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

app.get('/api/updates/fashion-lifestyle', async (c) => {
  try {
    const db = getDb(c);
    const rows = await db.prepare(`
      SELECT * FROM fashion_lifestyle
      WHERE id NOT IN (SELECT id FROM deleted_records)
      ORDER BY timestamp DESC
    `).all();
    const items = (rows.results || []).map((r) => serializeItem(r, 'fashion_lifestyle'));
    return c.json({ success: true, total: items.length, data: items });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// GET /api/updates - Aggregates Filmy Adda, Bizz World, Women of Inspiration, Fashion & Lifestyle
app.get('/api/updates', async (c) => {
  try {
    const db = getDb(c);
    const categoryFilter = c.req.query('category') || c.req.query('section');

    if (categoryFilter === 'filmy_adda' || categoryFilter === 'filmy-adda') {
      const rows = await db.prepare('SELECT * FROM filmy_adda WHERE id NOT IN (SELECT id FROM deleted_records) ORDER BY timestamp DESC').all();
      const items = (rows.results || []).map((r) => serializeItem(r, 'filmy_adda'));
      return c.json({ success: true, total: items.length, data: items });
    }
    if (categoryFilter === 'bizz_world' || categoryFilter === 'bizz-world') {
      const rows = await db.prepare('SELECT * FROM bizz_world WHERE id NOT IN (SELECT id FROM deleted_records) ORDER BY timestamp DESC').all();
      const items = (rows.results || []).map((r) => serializeItem(r, 'bizz_world'));
      return c.json({ success: true, total: items.length, data: items });
    }
    if (categoryFilter === 'women_inspiration' || categoryFilter === 'women-inspiration') {
      const rows = await db.prepare('SELECT * FROM women_inspiration WHERE id NOT IN (SELECT id FROM deleted_records) ORDER BY timestamp DESC').all();
      const items = (rows.results || []).map((r) => serializeItem(r, 'women_inspiration'));
      return c.json({ success: true, total: items.length, data: items });
    }
    if (categoryFilter === 'fashion_lifestyle' || categoryFilter === 'fashion-lifestyle') {
      const rows = await db.prepare('SELECT * FROM fashion_lifestyle WHERE id NOT IN (SELECT id FROM deleted_records) ORDER BY timestamp DESC').all();
      const items = (rows.results || []).map((r) => serializeItem(r, 'fashion_lifestyle'));
      return c.json({ success: true, total: items.length, data: items });
    }

    // Default: Aggregate all 4 updates category tables
    const [filmyRows, bizzRows, womenRows, fashionRows] = await Promise.all([
      db.prepare('SELECT * FROM filmy_adda WHERE id NOT IN (SELECT id FROM deleted_records)').all(),
      db.prepare('SELECT * FROM bizz_world WHERE id NOT IN (SELECT id FROM deleted_records)').all(),
      db.prepare('SELECT * FROM women_inspiration WHERE id NOT IN (SELECT id FROM deleted_records)').all(),
      db.prepare('SELECT * FROM fashion_lifestyle WHERE id NOT IN (SELECT id FROM deleted_records)').all()
    ]);

    const allUpdates = [
      ...(filmyRows.results || []).map((r) => serializeItem(r, 'filmy_adda')),
      ...(bizzRows.results || []).map((r) => serializeItem(r, 'bizz_world')),
      ...(womenRows.results || []).map((r) => serializeItem(r, 'women_inspiration')),
      ...(fashionRows.results || []).map((r) => serializeItem(r, 'fashion_lifestyle'))
    ];

    allUpdates.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    return c.json({
      success: true,
      total: allUpdates.length,
      data: allUpdates
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// ==========================================
// 4. PHOTO GALLERY (STRICTLY /photos ONLY)
// Never displayed on homepage or anywhere else
// ==========================================

app.get('/api/photos', async (c) => {
  try {
    const db = getDb(c);
    const rows = await db.prepare(`
      SELECT * FROM gallery_photos
      WHERE id NOT IN (SELECT id FROM deleted_records)
      ORDER BY timestamp DESC
    `).all();

    const items = (rows.results || []).map((r) => serializeItem(r, 'photos'));
    return c.json({
      success: true,
      total: items.length,
      data: items
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// ==========================================
// 5. EDITORIALS & PODCASTS
// ==========================================

app.get('/api/editorials', async (c) => {
  try {
    const db = getDb(c);
    const rows = await db.prepare(`
      SELECT * FROM editorials
      WHERE id NOT IN (SELECT id FROM deleted_records)
      ORDER BY timestamp DESC
    `).all();

    const items = (rows.results || []).map((r) => serializeItem(r, 'editorials'));
    return c.json({
      success: true,
      total: items.length,
      data: items
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

app.get('/api/podcast', async (c) => {
  try {
    const db = getDb(c);
    const rows = await db.prepare(`
      SELECT * FROM podcasts
      WHERE id NOT IN (SELECT id FROM deleted_records)
      ORDER BY timestamp DESC
    `).all();

    const items = (rows.results || []).map((r) => serializeItem(r, 'podcast'));
    return c.json({
      success: true,
      total: items.length,
      data: items
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// ==========================================
// 6. MAGAZINE COVERS (HOMEPAGE HERO SLIDESHOW)
// Section: "Exploring the Diverse World of Women"
// ==========================================

const getMagazineCoversHandler = async (c) => {
  try {
    const db = getDb(c);
    const rows = await db.prepare(`
      SELECT * FROM magazine_covers
      WHERE id NOT IN (SELECT id FROM deleted_records)
      ORDER BY timestamp DESC
    `).all();

    const items = (rows.results || []).map((r) => serializeItem(r, 'magazine_covers'));
    return c.json({
      success: true,
      total: items.length,
      data: items
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
};

app.get('/api/magazine-covers', getMagazineCoversHandler);
app.get('/api/magazine-editions', getMagazineCoversHandler);

// ==========================================
// 7. MAGAZINE SETTINGS & ORDERS
// ==========================================

app.get('/api/magazine', async (c) => {
  try {
    const db = getDb(c);
    const row = await db.prepare('SELECT * FROM magazine_settings WHERE id = ?').bind('current').first();
    const data = rowToMagazine(row);
    // If coverImage is empty or default, look up the latest cover from magazine_covers
    if (!data.coverImage || data.coverImage.includes('/assets/images/')) {
      const latestCover = await db.prepare('SELECT photo, title, price FROM magazine_covers WHERE id NOT IN (SELECT id FROM deleted_records) ORDER BY timestamp DESC LIMIT 1').first();
      if (latestCover && latestCover.photo) {
        data.coverImage = latestCover.photo;
        if (latestCover.title) data.activeIssue = latestCover.title;
        if (latestCover.price) data.price = latestCover.price;
      }
    }
    return c.json({
      success: true,
      data
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

app.post('/api/magazine', async (c) => {
  try {
    const body = await c.req.json();
    const { settings, adminPin } = body;

    if (!(await verifyAdminPin(c, adminPin))) {
      return c.json({ error: 'Unauthorized: Invalid Administrator Passcode' }, 401);
    }

    const db = getDb(c);
    const existingRow = await db.prepare('SELECT * FROM magazine_settings WHERE id = ?').bind('current').first();
    const current = rowToMagazine(existingRow);
    const m = { ...current, ...settings };

    await db.prepare(`
      INSERT OR REPLACE INTO magazine_settings (
        id, active_issue, cover_image, page2_image, price, currency, headline, subtitle, popup_badge, popup_message, home_delivery, available_issues, updated_at
      ) VALUES ('current', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      m.activeIssue || m.edition || 'Latest Edition',
      m.coverImage || 'https://ik.imagekit.io/acooladescreenlady/assets/images/magazine-cover-latest.jpg',
      m.page2Image || 'https://ik.imagekit.io/acooladescreenlady/assets/images/magazine-page2-feature.jpg',
      m.price || 220,
      m.currency || 'INR',
      m.headline || 'THE ARCHITECTS OF MODERN INFLUENCE',
      m.subtitle || 'Celebrating Trailblazing Women Behind the Screen & Across Boardrooms',
      m.popupBadge || 'Screenlady Print Magazine',
      m.popupMessage || "Collector's Print Edition Now Available • Insured Doorstep Courier Across India",
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

app.put('/api/orders/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { paymentStatus, dispatchStatus, status, adminPin } = body;

    if (!(await verifyAdminPin(c, adminPin))) {
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

app.delete('/api/orders/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const adminPin = c.req.query('adminPin') || c.req.header('X-Admin-PIN');

    if (!(await verifyAdminPin(c, adminPin))) {
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
// 7. ADMIN CRUD PUBLISHING & DELETION (SEPARATE TABLES)
// ==========================================

app.post('/api/publish', async (c) => {
  try {
    const body = await c.req.json();
    const { section, item, adminPin } = body;

    if (!(await verifyAdminPin(c, adminPin))) {
      return c.json({ error: 'Unauthorized: Invalid Administrator Passcode' }, 401);
    }

    if (!section || !item) {
      return c.json({ error: 'Section and item payload are required' }, 400);
    }

    const db = getDb(c);
    const id = item.id || `item_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();
    const timestamp = item.timestamp || Date.now();
    const date = item.date || now.split('T')[0];
    const displayDate = item.displayDate || date;
    const photo = item.photo || item.image || '';
    const summary = item.summary || item.infoSummary || item.description || '';
    const fullBody = item.fullBody || item.fullInfo || item.fullContent || summary;
    const headline = item.headline || item.title || item.brandName || '';
    const title = item.title || item.headline || item.brandName || '';
    const category = item.category || section;
    const categoryBadge = item.categoryBadge || (item.category ? `✦ ${item.category}` : '');

    // Map section to corresponding table
    if (section === 'realtime_updates' || section === 'news') {
      await db.prepare(`
        INSERT OR REPLACE INTO realtime_updates (
          id, title, headline, category, category_badge, summary, full_body, photo, author, date, display_date, timestamp, created_at, extra_data
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id, title, headline, category || 'Real-Time News', categoryBadge || '✦ Real-Time News',
        summary, fullBody, photo, item.author || 'Screenlady News Desk', date, displayDate, timestamp, item.createdAt || now, null
      ).run();
    } else if (section === 'business_ads' || section === 'ads' || section === 'brand_showcase' || section === 'home_photos') {
      const brandName = item.brandName || item.title || 'Brand Partner';
      const tagline = item.tagline || item.headline || '';
      const destUrl = item.destinationUrl || item.link || item.website || '';
      await db.prepare(`
        INSERT OR REPLACE INTO business_ads (
          id, brand_name, headline, tagline, summary, photo, destination_url, category, category_badge, date, display_date, timestamp, created_at, extra_data
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id, brandName, headline, tagline, summary, photo, destUrl,
        category || 'Enterprise', categoryBadge || 'Brand Spotlight', date, displayDate, timestamp, item.createdAt || now, null
      ).run();
    } else if (section === 'filmy_adda') {
      await db.prepare(`
        INSERT OR REPLACE INTO filmy_adda (
          id, title, headline, category, category_badge, summary, full_body, photo, venue, date, display_date, timestamp, created_at, extra_data
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id, title, headline, 'Filmy Adda', 'Filmy Adda',
        summary, fullBody, photo, item.venue || '', date, displayDate, timestamp, item.createdAt || now, null
      ).run();
    } else if (section === 'bizz_world') {
      await db.prepare(`
        INSERT OR REPLACE INTO bizz_world (
          id, title, headline, category, category_badge, summary, full_body, photo, venue, date, display_date, timestamp, created_at, extra_data
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id, title, headline, 'Bizz World', 'Bizz World',
        summary, fullBody, photo, item.venue || '', date, displayDate, timestamp, item.createdAt || now, null
      ).run();
    } else if (section === 'women_inspiration') {
      await db.prepare(`
        INSERT OR REPLACE INTO women_inspiration (
          id, title, woman_name, headline, category, category_badge, summary, full_body, photo, venue, date, display_date, timestamp, created_at, extra_data
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id, title, item.womanName || item.name || '', headline, 'Women of Inspiration', 'Women of Inspiration',
        summary, fullBody, photo, item.venue || '', date, displayDate, timestamp, item.createdAt || now, null
      ).run();
    } else if (section === 'fashion_lifestyle') {
      await db.prepare(`
        INSERT OR REPLACE INTO fashion_lifestyle (
          id, title, headline, category, category_badge, summary, full_body, photo, venue, date, display_date, timestamp, created_at, extra_data
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id, title, headline, 'Fashion & Lifestyle', 'Fashion & Lifestyle',
        summary, fullBody, photo, item.venue || '', date, displayDate, timestamp, item.createdAt || now, null
      ).run();
    } else if (section === 'photos' || section === 'gallery_photos') {
      // STRICTLY for Gallery section /photos ONLY
      await db.prepare(`
        INSERT OR REPLACE INTO gallery_photos (
          id, title, photo, venue, category, category_badge, caption, credit, date, display_date, timestamp, created_at, extra_data
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id, title, photo, item.venue || '', category || 'Gallery', categoryBadge || 'Photo Archive',
        summary, item.credit || 'Studio Accolade', date, displayDate, timestamp, item.createdAt || now, null
      ).run();
    } else if (section === 'editorials') {
      await db.prepare(`
        INSERT OR REPLACE INTO editorials (
          id, title, author, author_designation, read_time, pull_quote, summary, full_body, photo, category, category_badge, date, display_date, timestamp, created_at, extra_data
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id, title, item.author || 'Screenlady Editorial Board', item.authorDesignation || 'Senior Columnist',
        item.readTime || '5 Min Read', item.pullQuote || '', summary, fullBody, photo,
        category || 'Editorial', categoryBadge || 'Editorial Column', date, displayDate, timestamp, item.createdAt || now, null
      ).run();
    } else if (section === 'podcast') {
      await db.prepare(`
        INSERT OR REPLACE INTO podcasts (
          id, title, host, guest, duration, social_link, audio_url, summary, photo, category, category_badge, date, display_date, timestamp, created_at, extra_data
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id, title, item.host || 'Screenlady Studio', item.guest || '',
        item.duration || '35 Mins', item.socialLink || 'https://youtube.com', item.audioUrl || '',
        summary, photo, category || 'Podcast', categoryBadge || 'Audio Dispatch', date, displayDate, timestamp, item.createdAt || now, null
      ).run();
    } else if (section === 'magazine_covers' || section === 'magazine_editions') {
      const monthYear = item.monthYear || item.month || date;
      const price = parseFloat(item.price) || 220;
      const orderLink = item.orderLink || '';
      const displayOrder = parseInt(item.displayOrder, 10) || 0;
      await db.prepare(`
        INSERT OR REPLACE INTO magazine_covers (
          id, title, month_year, photo, price, headline, description, order_link, display_order, date, display_date, timestamp, created_at, extra_data
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id, title, monthYear, photo, price, headline, summary, orderLink, displayOrder, date, displayDate, timestamp, item.createdAt || now, null
      ).run();
    } else {
      return c.json({ error: `Unknown section: ${section}` }, 400);
    }

    // Clean from deleted_records if previously deleted
    await db.prepare('DELETE FROM deleted_records WHERE id = ?').bind(id).run();

    return c.json({
      success: true,
      section,
      item: { id, ...item, timestamp, date, displayDate },
      message: `Successfully published entry to ${section} table.`
    }, 201);
  } catch (err) {
    return c.json({ error: err.message || 'Failed to publish entry' }, 500);
  }
});

// POST /api/delete - Delete entry from respective table
app.post('/api/delete', async (c) => {
  try {
    const body = await c.req.json();
    const { section, id, adminPin } = body;

    if (!(await verifyAdminPin(c, adminPin))) {
      return c.json({ error: 'Unauthorized: Invalid Administrator Passcode' }, 401);
    }

    if (!id) {
      return c.json({ error: 'Item id is required' }, 400);
    }

    const db = getDb(c);
    const tableMap = {
      'realtime_updates': 'realtime_updates',
      'news': 'realtime_updates',
      'business_ads': 'business_ads',
      'ads': 'business_ads',
      'brand_showcase': 'business_ads',
      'home_photos': 'business_ads',
      'filmy_adda': 'filmy_adda',
      'bizz_world': 'bizz_world',
      'women_inspiration': 'women_inspiration',
      'fashion_lifestyle': 'fashion_lifestyle',
      'photos': 'gallery_photos',
      'gallery_photos': 'gallery_photos',
      'editorials': 'editorials',
      'podcast': 'podcasts',
      'podcasts': 'podcasts',
      'magazine_covers': 'magazine_covers',
      'magazine_editions': 'magazine_covers'
    };

    const targetTable = section ? tableMap[section] : null;

    if (targetTable) {
      await db.prepare(`DELETE FROM ${targetTable} WHERE id = ?`).bind(id).run();
    } else {
      // If table not specified, attempt deletion across all category tables
      const allTables = [
        'realtime_updates', 'business_ads', 'filmy_adda', 'bizz_world',
        'women_inspiration', 'fashion_lifestyle', 'gallery_photos', 'editorials', 'podcasts', 'magazine_covers'
      ];
      for (const t of allTables) {
        await db.prepare(`DELETE FROM ${t} WHERE id = ?`).bind(id).run();
      }
    }

    // Record in deleted_records
    await db.prepare('INSERT OR REPLACE INTO deleted_records (id, table_name, deleted_at) VALUES (?, ?, ?)').bind(
      id, targetTable || 'unknown', new Date().toISOString()
    ).run();

    const rows = await db.prepare('SELECT id FROM deleted_records').all();
    const deletedIds = (rows.results || []).map((r) => r.id);

    return c.json({
      success: true,
      id,
      deletedIds,
      message: `Item ${id} deleted successfully.`
    });
  } catch (err) {
    return c.json({ error: err.message || 'Failed to delete entry' }, 500);
  }
});

// ==========================================
// 8. IMAGEKIT MEDIA UPLOAD & CDN ENDPOINTS
// ==========================================

app.get('/api/imagekit/auth', async (c) => {
  const privateKey = c.env?.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) {
    return c.json({ error: 'IMAGEKIT_PRIVATE_KEY is not configured.' }, 400);
  }
  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 1800;
  const dataToSign = `${token}${expire}`;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(privateKey), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']
  );
  const sigBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(dataToSign));
  const signature = Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, '0')).join('');

  return c.json({
    token, expire, signature,
    publicKey: c.env?.IMAGEKIT_PUBLIC_KEY || '',
    urlEndpoint: c.env?.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/accoladescreenlady'
  });
});

app.get('/api/media/*', async (c) => {
  const path = c.req.path.replace(/^\/api\/media\/?/, '');
  if (!path) return c.text('Media path is required.', 400);
  const urlEndpoint = (c.env?.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/accoladescreenlady').replace(/\/+$/, '');
  return c.redirect(`${urlEndpoint}/${path.replace(/^\/+/, '')}`, 302);
});

app.post('/api/media/upload', async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body['file'];
    const customKey = body['key'] || body['fileName'];
    const folder = body['folder'] || '/screenlady/uploads';

    if (!file || typeof file === 'string') {
      return c.json({ error: 'Valid file is required (key: "file")' }, 400);
    }

    const sanitizedName = file.name ? file.name.replace(/\s+/g, '_') : `file_${Date.now()}`;
    const fileName = customKey
      ? customKey.includes('/') ? customKey.split('/').pop() : customKey
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
        headers: { Authorization: authHeader },
        body: imagekitFormData
      });

      const ikJson = await ikRes.json();
      if (!ikRes.ok) throw new Error(ikJson.message || `ImageKit upload failed: HTTP ${ikRes.status}`);

      return c.json({
        success: true,
        provider: 'imagekit',
        fileId: ikJson.fileId,
        name: ikJson.name,
        url: ikJson.url,
        thumbnailUrl: ikJson.thumbnailUrl || ikJson.url,
        filePath: ikJson.filePath,
        size: ikJson.size
      }, 201);
    }

    // Dev preview fallback
    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);
    let binary = '';
    const len = Math.min(uint8.byteLength, 1024 * 1024);
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8[i]);
    }
    const dataUrl = `data:${file.type || 'image/jpeg'};base64,${btoa(binary)}`;
    return c.json({
      success: true,
      provider: 'imagekit_dev_preview',
      url: dataUrl,
      thumbnailUrl: dataUrl,
      fileName
    }, 201);
  } catch (err) {
    return c.json({ error: err.message || 'ImageKit upload failed' }, 500);
  }
});

// ==========================================
// 9. RAZORPAY PAYMENT GATEWAY
// ==========================================

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
        keyId: keyId || 'rzp_test_placeholder'
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

app.post('/api/razorpay/verify', async (c) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await c.req.json();
    const keySecret = c.env?.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return c.json({ verified: true, mock: true });
    }
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw', enc.encode(keySecret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(text));
    const generatedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, '0')).join('');

    const isMatch = generatedSignature === razorpay_signature;
    return c.json({ verified: isMatch, orderId: razorpay_order_id, paymentId: razorpay_payment_id }, isMatch ? 200 : 400);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// 404 & Error Handlers
app.notFound((c) => c.json({ error: 'Endpoint Not Found', path: c.req.path }, 404));
app.onError((err, c) => {
  console.error('Unhandled Worker error:', err);
  return c.json({ error: err.message || 'Internal Server Error' }, 500);
});

export default app;
