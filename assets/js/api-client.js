/**
 * ACCOLADE SCREENLADY - API CLIENT
 * Connects the Frontend & Admin Portal to Cloudflare Worker Backend & ImageKit CDN
 */

const SCREENLADY_API_BASE = (function() {
  if (typeof window !== 'undefined') {
    if (window.SCREENLADY_API_URL) return window.SCREENLADY_API_URL;
    const stored = localStorage.getItem('screenlady_api_url');
    if (stored) return stored;
    // When running locally on localhost, default to local wrangler dev server if port 8787 is used
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      if (window.location.search.includes('api=remote')) {
        return 'https://api.accoladescreenlady.com';
      }
      if (window.location.search.includes('api=local')) {
        return 'http://localhost:8787';
      }
    }
  }
  return 'https://api.accoladescreenlady.com';
})();

// Request deduplication & short-TTL cache (prevents duplicate bursts to backend)
const _requestCache = new Map();

function cachedGet(endpoint, ttlMs = 20000) {
  const now = Date.now();
  if (_requestCache.has(endpoint)) {
    const entry = _requestCache.get(endpoint);
    if (now - entry.time < ttlMs) {
      return entry.promise;
    }
  }
  const promise = (async () => {
    const res = await fetch(`${SCREENLADY_API_BASE}${endpoint}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  })().catch(err => {
    _requestCache.delete(endpoint);
    throw err;
  });

  _requestCache.set(endpoint, { time: now, promise });
  return promise;
}

function clearApiCache() {
  _requestCache.clear();
}

window.ScreenladyAPI = {
  baseUrl: SCREENLADY_API_BASE,
  clearCache: clearApiCache,

  // Fetch real-time live news and updates
  async getUpdates() {
    try {
      const json = await cachedGet('/api/updates');
      return json.data || [];
    } catch (err) {
      console.warn('[Screenlady API] Notice fetching updates:', err.message);
      return [];
    }
  },

  // Fetch dedicated real-time homepage news
  async getNews() {
    try {
      const json = await cachedGet('/api/news');
      return json.data || [];
    } catch (err) {
      return this.getUpdates();
    }
  },

  // Fetch Homepage Brand Spotlights / Business Showcase (NO 'ads' word in frontend)
  async getBusinessAds() {
    try {
      const json = await cachedGet('/api/business-ads');
      return json.data || [];
    } catch (err) {
      console.warn('[Screenlady API] Notice fetching business spotlight:', err.message);
      return [];
    }
  },
  async getBusinessShowcase() {
    return this.getBusinessAds();
  },

  // Fetch Magazine Covers (Homepage Hero Slideshow - "Exploring the Diverse World of Women")
  async getMagazineCovers() {
    try {
      const json = await cachedGet('/api/magazine-covers');
      return (json && json.data) ? json.data : [];
    } catch (err) {
      console.warn('[Screenlady API] Notice fetching magazine covers:', err.message);
      return [];
    }
  },

  // Fetch globally deleted item IDs
  async getDeletedIds() {
    try {
      const json = await cachedGet('/api/deleted-ids');
      return json.deletedIds || [];
    } catch (err) {
      return [];
    }
  },

  // Fetch in-depth editorial writings
  async getEditorials() {
    try {
      const json = await cachedGet('/api/editorials');
      return json.data || [];
    } catch (err) {
      console.warn('[Screenlady API] Notice fetching editorials:', err.message);
      return [];
    }
  },

  // Fetch event photo gallery
  async getPhotos() {
    try {
      const json = await cachedGet('/api/photos');
      return json.data || [];
    } catch (err) {
      console.warn('[Screenlady API] Notice fetching photos:', err.message);
      return [];
    }
  },

  // Fetch podcast episodes
  async getPodcasts() {
    try {
      const json = await cachedGet('/api/podcast');
      return json.data || [];
    } catch (err) {
      console.warn('[Screenlady API] Notice fetching podcast:', err.message);
      return [];
    }
  },

  // Fetch active magazine issue settings & spreads
  async getMagazineSettings() {
    try {
      const json = await cachedGet('/api/magazine');
      return json.data || null;
    } catch (err) {
      console.warn('[Screenlady API] Notice fetching magazine settings:', err.message);
      return null;
    }
  },

  // Place print edition or digital magazine order
  async placeOrder(orderPayload) {
    try {
      const res = await fetch(`${SCREENLADY_API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      return await res.json();
    } catch (err) {
      console.error('[Screenlady API] Order submission failed:', err);
      throw err;
    }
  },

  // Razorpay order creation
  async createRazorpayOrder(amount, currency = 'INR') {
    try {
      const res = await fetch(`${SCREENLADY_API_BASE}/api/razorpay/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency })
      });
      return await res.json();
    } catch (err) {
      console.error('[Screenlady API] Razorpay order initiation failed:', err);
      throw err;
    }
  },

  // Razorpay payment verification
  async verifyRazorpayPayment(verificationPayload) {
    try {
      const res = await fetch(`${SCREENLADY_API_BASE}/api/razorpay/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verificationPayload)
      });
      return await res.json();
    } catch (err) {
      console.error('[Screenlady API] Payment verification failed:', err);
      throw err;
    }
  },

  // ==========================================
  // ADMIN PORTAL BACKEND INTEGRATION METHODS
  // ==========================================

  // Publish or edit item across sections (Editorials, Updates, News, Photos, Podcast)
  async publishItem(section, item, adminPin) {
    clearApiCache();
    const pin = adminPin || (typeof getSavedPin === 'function' ? getSavedPin() : localStorage.getItem('screenlady_admin_pin')) || 'screenlady2026';
    try {
      const res = await fetch(`${SCREENLADY_API_BASE}/api/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-PIN': pin
        },
        body: JSON.stringify({ section, item, adminPin: pin })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      return data;
    } catch (err) {
      console.warn('[Screenlady API] Backend publish warning:', err.message);
      return { success: false, fallback: true, error: err.message };
    }
  },

  // Delete item from backend feed
  async deleteItem(section, id, adminPin) {
    clearApiCache();
    const pin = adminPin || (typeof getSavedPin === 'function' ? getSavedPin() : localStorage.getItem('screenlady_admin_pin')) || 'screenlady2026';
    try {
      const res = await fetch(`${SCREENLADY_API_BASE}/api/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-PIN': pin
        },
        body: JSON.stringify({ section, id, adminPin: pin })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      return data;
    } catch (err) {
      console.warn('[Screenlady API] Backend delete warning:', err.message);
      return { success: false, fallback: true, error: err.message };
    }
  },

  // Upload image/media directly to ImageKit CDN via backend
  async uploadMedia(file, customKey, folder) {
    const formData = new FormData();
    formData.append('file', file);
    if (customKey) formData.append('key', customKey);
    if (folder) formData.append('folder', folder);

    const res = await fetch(`${SCREENLADY_API_BASE}/api/media/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Upload HTTP ${res.status}`);
    return data;
  },

  // Retrieve ImageKit authentication parameters for client-side uploads
  async getImageKitAuth() {
    try {
      const res = await fetch(`${SCREENLADY_API_BASE}/api/imagekit/auth`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[Screenlady API] ImageKit auth notice:', err.message);
      return null;
    }
  },

  // Fetch all orders for Admin Desk
  async getOrders() {
    try {
      const res = await fetch(`${SCREENLADY_API_BASE}/api/orders`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json.orders || [];
    } catch (err) {
      console.warn('[Screenlady API] Orders fetch fallback:', err.message);
      return null;
    }
  },

  // Update order status in backend
  async updateOrderStatus(orderId, updateData, adminPin) {
    const pin = adminPin || (typeof getSavedPin === 'function' ? getSavedPin() : localStorage.getItem('screenlady_admin_pin')) || 'screenlady2026';
    try {
      const res = await fetch(`${SCREENLADY_API_BASE}/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-PIN': pin
        },
        body: JSON.stringify({ ...updateData, adminPin: pin })
      });
      return await res.json();
    } catch (err) {
      console.warn('[Screenlady API] Order status update fallback:', err.message);
      return { success: false, error: err.message };
    }
  },

  // Delete order in backend
  async deleteOrder(orderId, adminPin) {
    const pin = adminPin || (typeof getSavedPin === 'function' ? getSavedPin() : localStorage.getItem('screenlady_admin_pin')) || 'screenlady2026';
    try {
      const res = await fetch(`${SCREENLADY_API_BASE}/api/orders/${encodeURIComponent(orderId)}?adminPin=${encodeURIComponent(pin)}`, {
        method: 'DELETE',
        headers: { 'X-Admin-PIN': pin }
      });
      return await res.json();
    } catch (err) {
      console.warn('[Screenlady API] Delete order fallback:', err.message);
      return { success: false, error: err.message };
    }
  },

  // Fetch live stats counters from backend
  async getStats() {
    try {
      const res = await fetch(`${SCREENLADY_API_BASE}/api/stats`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json.stats || null;
    } catch (err) {
      return null;
    }
  },

  // Update magazine issue settings in backend
  async updateMagazineSettings(settings, adminPin) {
    const pin = adminPin || (typeof getSavedPin === 'function' ? getSavedPin() : localStorage.getItem('screenlady_admin_pin')) || 'screenlady2026';
    try {
      const res = await fetch(`${SCREENLADY_API_BASE}/api/magazine`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-PIN': pin
        },
        body: JSON.stringify({ settings, adminPin: pin })
      });
      return await res.json();
    } catch (err) {
      console.warn('[Screenlady API] Magazine update fallback:', err.message);
      return { success: false, error: err.message };
    }
  }
};
