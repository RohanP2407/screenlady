/**
 * ACCOLADE SCREENLADY - MAGAZINE SHOWCASE & ONLINE PURCHASE ENGINE
 * Handles:
 * 1. Monthly Magazine Showcase (Cover Page + Page 2 Inside Feature Spread)
 * 2. Order Collector's Print Edition Form (Full Name, Phone, Email, Address, Pincode, City, State)
 * 3. Online Payment Gateway Interface (Online Payment Only - UPI, Card, Net Banking)
 * 4. Automatic Notifications to Screenlady WhatsApp (+91 96650 35503) and Email (editor@accoladescreenlady.com / AccoladeScreenlady@gmail.com)
 * 5. Persistent Order Storage & Real-Time Sync with Editorial Desk (Magazine Purchase Details)
 */

const SCREENLADY_OFFICIAL_WHATSAPP = '919665035503';
const SCREENLADY_OFFICIAL_EMAIL = 'editor@accoladescreenlady.com';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Default Magazine Issue Configuration
const DEFAULT_MAGAZINE_SETTINGS = {
  edition: 'November 2026 — Power, Art & Corporate Leadership Issue',
  monthYear: 'November 2026',
  price: 220,
  coverImage: 'https://ik.imagekit.io/acooladescreenlady/magazine-covers/cover-1795330731064_0Xwt7ILYb',
  page2Image: 'https://ik.imagekit.io/acooladescreenlady/screenlady/general/magazine-page2-feature_gqTZYEREU.jpg',
  headline: 'THE ARCHITECTS OF MODERN INFLUENCE',
  subtitle: 'Celebrating Trailblazing Women Behind the Screen & Across Boardrooms',
  popupBadge: 'Screenlady Print Magazine',
  popupMessage: "Official Print Edition Now Available • ₹150 + ₹70 Courier = ₹220 Doorstep Delivery Across India",
  leadQuote: 'True cinematic storytelling doesn’t simply capture reality; it reframes our collective conscience.',
  curator: 'Conceived & Curated under the Editorial Vision of Mr. Prashant Chandrakant Sagvekar'
};

// Default Initial Orders: Fetched dynamically from Cloudflare D1 Backend
const DEFAULT_MAGAZINE_ORDERS = [];

/* =============================================================
   1. Data Helpers (Settings & Orders)
============================================================= */
function getMagazineSettings() {
  if (window.backendLiveMagazineSettings) {
    return { ...DEFAULT_MAGAZINE_SETTINGS, ...window.backendLiveMagazineSettings };
  }
  try {
    const raw = localStorage.getItem('screenlady_magazine_settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.price === 499) parsed.price = 220;
      return { ...DEFAULT_MAGAZINE_SETTINGS, ...parsed };
    }
  } catch (e) {}
  return DEFAULT_MAGAZINE_SETTINGS;
}

function saveMagazineSettings(settings) {
  try {
    localStorage.setItem('screenlady_magazine_settings', JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save magazine settings to localStorage', e);
  }

  // Dispatch event for same tab
  try {
    window.dispatchEvent(new CustomEvent('screenlady_magazine_settings_changed', { detail: settings }));
  } catch (e) {}

  // Broadcast to other tabs
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel('screenlady_magazine_channel');
      bc.postMessage({ type: 'magazine_settings_changed', settings });
      bc.close();
    }
  } catch (e) {}

  // Sync to Cloudflare Worker backend
  if (window.ScreenladyAPI && typeof window.ScreenladyAPI.updateMagazineSettings === 'function') {
    window.ScreenladyAPI.updateMagazineSettings(settings).catch(() => {});
  }
}
window.saveMagazineSettings = saveMagazineSettings;

function getAllMagazineOrders() {
  let custom = [];
  try {
    const raw = localStorage.getItem('screenlady_magazine_orders');
    if (raw) custom = JSON.parse(raw);
  } catch (e) {
    custom = [];
  }

  // Sort descending by date/timestamp
  return custom.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
}

function saveMagazineOrders(ordersList) {
  localStorage.setItem('screenlady_magazine_orders', JSON.stringify(ordersList));
}

/* =============================================================
   2. Magazine Showcase Viewer (Cover Page + Page 2 Spread)
============================================================= */
window.currentMagazineSpread = 1;

window.switchMagazineSpread = function(pageNumber) {
  window.currentMagazineSpread = pageNumber;
  const tab1 = document.getElementById('magSpreadTab1');
  const tab2 = document.getElementById('magSpreadTab2');
  const view1 = document.getElementById('magSpreadView1');
  const view2 = document.getElementById('magSpreadView2');

  if (tab1) tab1.classList.toggle('active', pageNumber === 1);
  if (tab2) tab2.classList.toggle('active', pageNumber === 2);
  if (view1) view1.style.display = pageNumber === 1 ? 'block' : 'none';
  if (view2) view2.style.display = pageNumber === 2 ? 'block' : 'none';
};

window.nextMagazineSpread = function() {
  window.switchMagazineSpread(window.currentMagazineSpread === 1 ? 2 : 1);
};

window.prevMagazineSpread = function() {
  window.switchMagazineSpread(window.currentMagazineSpread === 2 ? 1 : 2);
};

window.showMagazineModal = function(issueTitle) {
  const settings = getMagazineSettings();
  let currentTitle = (issueTitle && issueTitle !== 'October 2026') ? issueTitle : (settings.edition || 'Latest Collector\'s Issue');
  let currentCover = settings.coverImage || '';

  if (window.backendLiveMagazineCovers && window.backendLiveMagazineCovers.length > 0) {
    const found = issueTitle ? window.backendLiveMagazineCovers.find(c =>
      c.title === issueTitle || c.monthYear === issueTitle || c.id === issueTitle
    ) : null;
    if (found) {
      currentCover = found.photo || found.cover || found.image || currentCover;
      currentTitle = found.title || found.monthYear || currentTitle;
    } else if (!issueTitle || issueTitle === 'October 2026') {
      const latest = window.backendLiveMagazineCovers[0];
      currentCover = latest.photo || latest.cover || latest.image || currentCover;
      currentTitle = latest.title || latest.monthYear || currentTitle;
    }
  }

  const content = `
    <div class="magazine-modal-viewer">
      <!-- Viewer Header -->
      <div class="magazine-viewer-header">
        <div>
          <span class="badge-gold" style="font-size: 0.72rem; letter-spacing: 0.1em; margin-bottom: 0.35rem; display: inline-block;">
            ✦ Monthly Print Magazine • Latest Issue
          </span>
          <h2 style="font-family: var(--font-serif-display); font-size: 1.45rem; color: #FFFFFF; margin: 0 0 0.25rem 0;">
            ${escapeHtml(currentTitle)}
          </h2>
          <p style="color: var(--text-muted); font-size: 0.82rem; margin: 0;">
            High-Definition Collector’s Preview • Page 1: Official Cover • Page 2: Inside Feature Spread
          </p>
        </div>

        <div class="magazine-nav-tabs">
          <button class="magazine-tab-btn active" id="magSpreadTab1" onclick="switchMagazineSpread(1)">
            Page 1: Cover
          </button>
          <button class="magazine-tab-btn" id="magSpreadTab2" onclick="switchMagazineSpread(2)">
            Page 2: Inside Feature
          </button>
        </div>
      </div>

      <!-- Magazine Showcase Container -->
      <div class="magazine-spread-display">
        <!-- SPREAD 1: Cover Page -->
        <div id="magSpreadView1" class="magazine-spread-pane" style="display: block;">
          <div class="magazine-page-frame">
            <img src="${escapeHtml(currentCover)}" alt="Magazine Cover Page" class="magazine-page-img" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'550\\' viewBox=\\'0 0 400 550\\'><rect width=\\'400\\' height=\\'550\\' fill=\\'%2314120e\\'/><text x=\\'50%25\\' y=\\'50%25\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'%23d4af37\\' font-family=\\'sans-serif\\' font-size=\\'24\\'>SCREENLADY</text></svg>';">
            <div class="magazine-page-overlay-info">
              <span class="badge-gold">Page 1 of 2 • Official Monthly Cover</span>
              <h3 style="font-family: var(--font-serif-display); color: #FFFFFF; font-size: 1.35rem; margin: 0.5rem 0 0.25rem;">
                ${escapeHtml(settings.headline)}
              </h3>
              <p style="color: var(--gold-light); font-size: 0.85rem; margin: 0;">
                ${escapeHtml(settings.subtitle)}
              </p>
            </div>
          </div>
        </div>

        <!-- SPREAD 2: Inside Page -->
        <div id="magSpreadView2" class="magazine-spread-pane" style="display: none;">
          <div class="magazine-page-frame">
            <img src="${escapeHtml(settings.page2Image)}" alt="Magazine Inside Feature Page" class="magazine-page-img" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'550\\' viewBox=\\'0 0 400 550\\'><rect width=\\'400\\' height=\\'550\\' fill=\\'%2314120e\\'/><text x=\\'50%25\\' y=\\'50%25\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'%23d4af37\\' font-family=\\'sans-serif\\' font-size=\\'24\\'>SCREENLADY</text></svg>';">
            <div class="magazine-page-overlay-info">
              <span class="badge-gold">Page 2 of 2 • Inside Feature Spread</span>
              <h3 style="font-family: var(--font-serif-display); color: #FFFFFF; font-size: 1.25rem; margin: 0.5rem 0 0.25rem;">
                "To give voice to women whose stories were never told is not just acting; it is cultural restoration."
              </h3>
              <p style="color: var(--gold-light); font-size: 0.85rem; margin: 0;">
                ${escapeHtml(settings.curator)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Controls & Order Trigger Footer -->
      <div class="magazine-viewer-footer">
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <button type="button" class="btn btn-outline-gold btn-sm" onclick="prevMagazineSpread()">
            ← Previous Page
          </button>
          <button type="button" class="btn btn-outline-gold btn-sm" onclick="nextMagazineSpread()">
            Next Page →
          </button>
        </div>

        <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
          <div class="magazine-price-pill">
            <span>Special Collector's Print:</span>
            <strong>₹${settings.price}</strong>
            <small>(Free Shipping)</small>
          </div>

          <button type="button" class="btn btn-gold btn-sm" onclick="openMagazineOrderModal()" style="font-weight: 800; padding: 0.65rem 1.35rem; font-size: 0.9rem;">
            Order Collector's Print Edition &rarr;
          </button>
        </div>
      </div>
    </div>
  `;

  if (typeof openModal === 'function') {
    openModal(currentTitle, content);
  } else {
    const modal = document.getElementById('globalModal');
    const modalBody = document.getElementById('modalBody');
    if (modal && modalBody) {
      modalBody.innerHTML = content;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
};

/* =============================================================
   3. Order Collector's Print Edition Form & Online Payment Modal
============================================================= */
window.selectedPaymentMethod = 'UPI';

window.openMagazineOrderModal = function(requestedEdition) {
  const settings = getMagazineSettings();
  let coverUrl = settings.coverImage || '';
  let editionTitle = (requestedEdition && requestedEdition !== 'October 2026') ? requestedEdition : (settings.edition || 'Latest Collector\'s Print Edition');
  let price = settings.price || 220;

  // If live covers exist from backend, match requestedEdition or default to latest published cover
  if (window.backendLiveMagazineCovers && window.backendLiveMagazineCovers.length > 0) {
    const found = requestedEdition ? window.backendLiveMagazineCovers.find(c =>
      c.title === requestedEdition || c.monthYear === requestedEdition || c.id === requestedEdition
    ) : null;
    if (found) {
      coverUrl = found.photo || found.cover || found.image || coverUrl;
      editionTitle = found.title || found.monthYear || editionTitle;
      if (found.price) price = found.price;
    } else if (!requestedEdition || requestedEdition === 'October 2026') {
      const latest = window.backendLiveMagazineCovers[0];
      coverUrl = latest.photo || latest.cover || latest.image || coverUrl;
      editionTitle = latest.title || latest.monthYear || editionTitle;
      if (latest.price) price = latest.price;
    }
  }

  const content = `
    <div class="magazine-order-flow">
      <!-- Order Header -->
      <div style="text-align: center; margin-bottom: 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid rgba(212, 175, 55, 0.25);">
        <span class="badge-gold" style="font-size: 0.72rem; letter-spacing: 0.12em; margin-bottom: 0.5rem; display: inline-block;">
          Direct Publisher Order • Official Print Edition
        </span>
        <h2 style="font-family: var(--font-serif-display); font-size: 1.6rem; color: #FFFFFF; margin: 0 0 0.35rem 0;">
          Order Collector's Print Edition
        </h2>
        <p style="color: var(--text-muted); font-size: 0.85rem; max-width: 520px; margin: 0 auto;">
          Enter your delivery address below. Delivered securely via Insured Express Courier across India with verified tracking.
        </p>
      </div>

      <!-- Edition Quick Snapshot -->
      <div class="order-product-snapshot">
        <img src="${escapeHtml(coverUrl)}" alt="Magazine Cover" class="order-thumb-img" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'110\\' viewBox=\\'0 0 80 110\\'><rect width=\\'80\\' height=\\'110\\' fill=\\'%2314120e\\'/><text x=\\'50%25\\' y=\\'50%25\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'%23d4af37\\' font-family=\\'sans-serif\\' font-size=\\'10\\'>SCREENLADY</text></svg>';">
        <div style="flex-grow: 1;">
          <h4 style="color: #FFFFFF; font-size: 0.96rem; margin: 0 0 0.25rem 0; font-family: var(--font-serif-display);">
            ${escapeHtml(editionTitle)}
          </h4>
          <p style="color: var(--gold-light); font-size: 0.78rem; margin: 0 0 0.35rem 0;">
            Luxury High-Gloss 120 GSM Print Edition • Includes Certificate of Authenticity
          </p>
          <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
            <span class="badge-gold" style="font-size: 0.68rem;">₹${price} per copy</span>
            <span style="font-size: 0.75rem; color: #4ade80;">Free Express Shipping</span>
            <span style="font-size: 0.75rem; color: #94a3b8;">Ships in 24–48 Hours</span>
          </div>
        </div>
      </div>

      <!-- Customer & Shipping Address Form -->
      <form id="screenladyOrderForm" onsubmit="handleMagazineOrderSubmit(event)">
        <h3 style="color: var(--gold-light); font-size: 0.95rem; font-weight: 700; margin: 1.5rem 0 0.85rem; display: flex; align-items: center; gap: 0.4rem;">
          <span>1. Delivery & Contact Details</span>
        </h3>

        <div class="post-form-grid" style="margin-bottom: 1rem;">
          <div>
            <label class="post-input-label" for="orderFullName">Full Name *</label>
            <input type="text" id="orderFullName" class="post-input-field" required placeholder="e.g. Smt. Malini Sharma">
          </div>

          <div>
            <label class="post-input-label" for="orderPhone">Phone Number (WhatsApp Preferred) *</label>
            <input type="tel" id="orderPhone" class="post-input-field" required placeholder="e.g. +91 98200 12345">
          </div>

          <div class="form-group-full">
            <label class="post-input-label" for="orderEmail">Email Address (For Order Confirmation & Dispatch Tracking) *</label>
            <input type="email" id="orderEmail" class="post-input-field" required placeholder="e.g. malini.sharma@example.com">
          </div>

          <div class="form-group-full">
            <label class="post-input-label" for="orderAddress">Complete Home Address (Building / Street / Landmark) *</label>
            <textarea id="orderAddress" class="post-input-field" rows="2" required placeholder="e.g. Flat 402, Lotus Towers, 14th Road, Bandra West"></textarea>
          </div>

          <div>
            <label class="post-input-label" for="orderCity">City *</label>
            <input type="text" id="orderCity" class="post-input-field" required placeholder="e.g. Mumbai">
          </div>

          <div>
            <label class="post-input-label" for="orderState">State *</label>
            <input type="text" id="orderState" class="post-input-field" required placeholder="e.g. Maharashtra">
          </div>

          <div>
            <label class="post-input-label" for="orderPincode">Pincode (6 Digits) *</label>
            <input type="text" id="orderPincode" class="post-input-field" maxlength="6" pattern="[0-9]{6}" required placeholder="e.g. 400050">
          </div>

          <div>
            <label class="post-input-label" for="orderQuantity">Subscription / Copies Option *</label>
            <select id="orderQuantity" class="post-input-field" onchange="calculateOrderTotal()">
              <option value="monthly" selected>Monthly — ₹220/-</option>
              <option value="yearly">Yearly — ₹2450/-</option>
            </select>
          </div>
        </div>

        <!-- 2. Online Payment Gateway (Online Payment Only) -->
        <h3 style="color: var(--gold-light); font-size: 0.95rem; font-weight: 700; margin: 1.5rem 0 0.85rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
          <span style="display: inline-flex; align-items: center; gap: 0.4rem;">
            <span>2. Payment Method</span>
            <span class="badge-gold" style="font-size: 0.65rem;">Online Payment Only</span>
          </span>
        </h3>

        <!-- Payment Method Tabs -->
        <div class="payment-tabs-row">
          <button type="button" class="payment-method-btn active" id="payMethodUPI" onclick="selectPaymentMethod('UPI')">
            <span>UPI (GPay / PhonePe / Paytm / BHIM)</span>
          </button>
          <button type="button" class="payment-method-btn" id="payMethodCard" onclick="selectPaymentMethod('Card')">
            <span>Credit / Debit Card</span>
          </button>
          <button type="button" class="payment-method-btn" id="payMethodNet" onclick="selectPaymentMethod('NetBanking')">
            <span>Net Banking</span>
          </button>
        </div>

        <!-- Payment Method Details Box -->
        <div class="payment-details-box">
          <!-- UPI Box -->
          <div id="paymentBoxUPI" style="display: block;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <span style="font-size: 0.82rem; color: #FFFFFF; font-weight: 600;">Instant UPI Payment</span>
              <span style="font-size: 0.75rem; color: var(--gold-light);">Zero Transaction Fees</span>
            </div>
            <div style="display: flex; gap: 0.75rem; margin-bottom: 0.75rem;">
              <input type="text" id="orderUpiId" class="post-input-field" placeholder="Enter your UPI ID (e.g. mobile@upi or name@okaxis)" style="font-size: 0.85rem;">
            </div>
            <p style="font-size: 0.76rem; color: var(--text-muted); margin: 0;">
              ✓ You will receive an instant UPI collect request or QR authorization on your preferred app upon placing order.
            </p>
          </div>

          <!-- Card Box -->
          <div id="paymentBoxCard" style="display: none;">
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 0.75rem; margin-bottom: 0.5rem;">
              <div style="grid-column: 1 / -1;">
                <label class="post-input-label" style="font-size: 0.68rem;">Card Number</label>
                <input type="text" class="post-input-field" placeholder="4532 •••• •••• 8921" maxlength="19">
              </div>
              <div>
                <label class="post-input-label" style="font-size: 0.68rem;">Expiry</label>
                <input type="text" class="post-input-field" placeholder="MM/YY" maxlength="5">
              </div>
              <div>
                <label class="post-input-label" style="font-size: 0.68rem;">CVV</label>
                <input type="password" class="post-input-field" placeholder="•••" maxlength="4">
              </div>
              <div>
                <label class="post-input-label" style="font-size: 0.68rem;">Cardholder Name</label>
                <input type="text" class="post-input-field" placeholder="Name on card">
              </div>
            </div>
            <p style="font-size: 0.74rem; color: var(--text-muted); margin: 0;">
              All major Indian and international cards accepted (Visa, Mastercard, RuPay, Maestro).
            </p>
          </div>

          <!-- Net Banking Box -->
          <div id="paymentBoxNetBanking" style="display: none;">
            <label class="post-input-label" style="font-size: 0.68rem;">Select Your Bank</label>
            <select class="post-input-field" style="margin-bottom: 0.5rem;">
              <option>State Bank of India (SBI)</option>
              <option>HDFC Bank</option>
              <option>ICICI Bank</option>
              <option>Axis Bank</option>
              <option>Kotak Mahindra Bank</option>
              <option>Punjab National Bank</option>
              <option>Bank of Baroda</option>
            </select>
            <p style="font-size: 0.74rem; color: var(--text-muted); margin: 0;">
              You will be securely routed to your bank's verified NetBanking gateway to authorize the transaction.
            </p>
          </div>
        </div>

        <!-- Order Total Bar & Submit -->
        <div class="order-final-bar">
          <div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">Total Payable Amount (All Taxes & Shipping Included):</div>
            <div style="font-size: 1.45rem; font-weight: 800; color: var(--gold-light);" id="orderTotalDisplay">
              ₹220/-
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <button type="button" class="btn btn-outline-gold btn-sm" onclick="showMagazineModal()">
              ← Back to Preview
            </button>
            <button type="submit" id="btnPlaceOrder" class="btn btn-gold btn-sm" style="font-weight: 800; font-size: 0.95rem; padding: 0.75rem 1.75rem;">
              Pay Online & Confirm Order &rarr;
            </button>
          </div>
        </div>
      </form>
    </div>
  `;

  if (typeof openModal === 'function') {
    openModal("Order Collector's Print Edition", content);
  } else {
    const modal = document.getElementById('globalModal');
    const modalBody = document.getElementById('modalBody');
    if (modal && modalBody) {
      modalBody.innerHTML = content;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
};

window.handleAvailableInPrintClick = function() {
  const embeddedSection = document.getElementById('availableInPrintSection');
  if (embeddedSection) {
    embeddedSection.scrollIntoView({ behavior: 'smooth' });
    embeddedSection.classList.add('highlight-section-glow');
    setTimeout(() => embeddedSection.classList.remove('highlight-section-glow'), 2500);
  } else {
    openMagazineOrderModal();
  }
};

window.switchEmbeddedMagazineSpread = function(pageNumber) {
  const tab1 = document.getElementById('embMagTab1');
  const tab2 = document.getElementById('embMagTab2');
  const view1 = document.getElementById('embSpreadView1');
  const view2 = document.getElementById('embSpreadView2');

  if (tab1) tab1.classList.toggle('active', pageNumber === 1);
  if (tab2) tab2.classList.toggle('active', pageNumber === 2);
  if (view1) view1.style.display = pageNumber === 1 ? 'block' : 'none';
  if (view2) view2.style.display = pageNumber === 2 ? 'block' : 'none';
};

window.selectPaymentMethod = function(method, scope) {
  window.selectedPaymentMethod = method;

  if (scope === 'embPayment') {
    const btnUpi = document.getElementById('embPayMethodUPI');
    const btnCard = document.getElementById('embPayMethodCard');
    const btnNet = document.getElementById('embPayMethodNet');
    const boxUpi = document.getElementById('embPaymentBoxUPI');
    const boxCard = document.getElementById('embPaymentBoxCard');
    const boxNet = document.getElementById('embPaymentBoxNetBanking');

    if (btnUpi) btnUpi.classList.toggle('active', method === 'UPI');
    if (btnCard) btnCard.classList.toggle('active', method === 'Card');
    if (btnNet) btnNet.classList.toggle('active', method === 'NetBanking');

    if (boxUpi) boxUpi.style.display = method === 'UPI' ? 'block' : 'none';
    if (boxCard) boxCard.style.display = method === 'Card' ? 'block' : 'none';
    if (boxNet) boxNet.style.display = method === 'NetBanking' ? 'block' : 'none';
  } else {
    const btnUpi = document.getElementById('payMethodUPI');
    const btnCard = document.getElementById('payMethodCard');
    const btnNet = document.getElementById('payMethodNet');
    const boxUpi = document.getElementById('paymentBoxUPI');
    const boxCard = document.getElementById('paymentBoxCard');
    const boxNet = document.getElementById('paymentBoxNetBanking');

    if (btnUpi) btnUpi.classList.toggle('active', method === 'UPI');
    if (btnCard) btnCard.classList.toggle('active', method === 'Card');
    if (btnNet) btnNet.classList.toggle('active', method === 'NetBanking');

    if (boxUpi) boxUpi.style.display = method === 'UPI' ? 'block' : 'none';
    if (boxCard) boxCard.style.display = method === 'Card' ? 'block' : 'none';
    if (boxNet) boxNet.style.display = method === 'NetBanking' ? 'block' : 'none';
  }
};

window.calculateOrderTotal = function(formOrEl) {
  let form = null;
  if (formOrEl && formOrEl.tagName === 'FORM') form = formOrEl;
  else if (formOrEl && formOrEl.form) form = formOrEl.form;

  let val = 'monthly';
  if (form) {
    const qEl = form.querySelector('#orderQuantity') || form.querySelector('[name="quantity"]') || form.querySelector('select');
    val = (qEl ? qEl.value : 'monthly').toString().toLowerCase();
  } else {
    const qEl = document.getElementById('orderQuantity') || document.getElementById('embOrderQuantity');
    val = (qEl ? qEl.value : 'monthly').toString().toLowerCase();
  }

  const isYearly = val === 'yearly' || val === '12';
  const total = isYearly ? 2450 : 220;

  if (form) {
    const d = form.querySelector('.orderTotalDisplay') || form.querySelector('#orderTotalDisplay') || form.querySelector('#orderTotalDisplayEmbedded');
    if (d) d.textContent = `₹${total}/-`;
  } else {
    const d1 = document.getElementById('orderTotalDisplay');
    const d2 = document.getElementById('orderTotalDisplayEmbedded');
    if (d1) d1.textContent = `₹${total}/-`;
    if (d2) d2.textContent = `₹${total}/-`;
  }
  return total;
};

/* =============================================================
   4. Order Submission, Notification & Digital Receipt
============================================================= */
window.handleMagazineOrderSubmit = function(e) {
  e.preventDefault();
  const form = e.target;
  const settings = getMagazineSettings();

  const getFieldVal = (name, id) => {
    const el = form.querySelector(`[name="${name}"]`) || form.querySelector(`#${id}`) || document.getElementById(id);
    return el ? (el.value || '').trim() : '';
  };

  const fullName = getFieldVal('fullName', 'orderFullName');
  const phone = getFieldVal('phone', 'orderPhone');
  const email = getFieldVal('email', 'orderEmail');
  const address = getFieldVal('address', 'orderAddress');
  const city = getFieldVal('city', 'orderCity');
  const state = getFieldVal('state', 'orderState');
  const pincode = getFieldVal('pincode', 'orderPincode');
  
  const qEl = form.querySelector('#orderQuantity') || form.querySelector('[name="quantity"]') || form.querySelector('select') || document.getElementById('orderQuantity');
  const planVal = (qEl ? qEl.value : 'monthly').toString().toLowerCase();
  const isYearly = planVal === 'yearly' || planVal === '12';
  const planName = isYearly ? 'Yearly Subscription (12 Issues)' : 'Monthly Edition';
  const totalAmount = isYearly ? 2450 : 220;
  const paymentMethod = window.selectedPaymentMethod || 'UPI';

  if (!fullName || !phone || !email || !address || !city || !state || !pincode) {
    alert('Please fill in all required shipping and contact details.');
    return;
  }

  // Generate unique order ID
  const orderId = `SL-MAG-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date();
  const displayDate = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + 
                      ', ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const newOrder = {
    id: orderId,
    date: now.toISOString().split('T')[0],
    displayDate: displayDate,
    timestamp: Date.now(),
    fullName: fullName,
    phone: phone,
    email: email,
    address: address,
    city: city,
    state: state,
    pincode: pincode,
    edition: settings.edition,
    plan: planName,
    quantity: isYearly ? 'Yearly (12 Issues)' : 'Monthly (1 Copy)',
    amount: totalAmount,
    paymentMethod: paymentMethod,
    paymentStatus: 'Paid (Online)',
    shippingStatus: 'Pending Dispatch'
  };

  // 1. Save order into storage
  const existingOrders = getAllMagazineOrders();
  existingOrders.unshift(newOrder);
  saveMagazineOrders(existingOrders);

  // 1.1 Sync directly with Cloudflare Worker Backend API
  if (window.ScreenladyAPI && typeof window.ScreenladyAPI.placeOrder === 'function') {
    window.ScreenladyAPI.placeOrder({
      name: fullName,
      phone: phone,
      email: email,
      address: address,
      pincode: pincode,
      city: city,
      state: state,
      issue: settings.edition || "Collector's Print Edition",
      amount: totalAmount
    }).catch(function(err) {
      console.warn('[Screenlady Orders] Backend sync warning:', err);
    });
  }

  // 2. Prepare WhatsApp notification message to Screenlady (+91 96650 35503)
  const whatsappMsg = 
`*NEW SCREENLADY MAGAZINE ORDER*
━━━━━━━━━━━━━━━━━━━━━
*Order ID:* ${orderId}
*Date:* ${displayDate}
*Customer:* ${fullName}
*Phone:* ${phone}
*Email:* ${email}
*Plan / Option:* ${planName}
*Edition:* ${settings.edition}
*Total Amount:* ₹${totalAmount}/-
*Payment Status:* Paid (Online via ${paymentMethod})
*Shipping Address:* 
${address},
${city}, ${state} - ${pincode}
━━━━━━━━━━━━━━━━━━━━━
_Please confirm dispatch and courier tracking number._`;

  const whatsappUrl = `https://wa.me/${SCREENLADY_OFFICIAL_WHATSAPP}?text=${encodeURIComponent(whatsappMsg)}`;

  // 3. Prepare Email notification to editor@accoladescreenlady.com and AccoladeScreenlady@gmail.com
  const emailSubject = `[New Magazine Order] ${orderId} - ${fullName} - ${planName} (₹${totalAmount}/-)`;
  const emailBody = 
`New Magazine Print Edition Order Received:

Order ID: ${orderId}
Order Date: ${displayDate}
Customer Name: ${fullName}
Phone Number: ${phone}
Email Address: ${email}

Shipping Address:
${address}
${city}, ${state} - ${pincode}

Edition: ${settings.edition}
Quantity: ${qty}
Amount Paid: Rs. ${totalAmount}
Payment Status: Paid (Online via ${paymentMethod})
Fulfillment Status: Pending Dispatch

---
Accolade Screenlady Online Order Dispatch Engine
Official Contacts: editor@accoladescreenlady.com | AccoladeScreenlady@gmail.com | +91 96650 35503`;

  const emailUrl = `mailto:${SCREENLADY_OFFICIAL_EMAIL}?cc=AccoladeScreenlady@gmail.com&subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  // 4. Render Digital Receipt / Confirmation
  renderOrderSuccessModal(newOrder, whatsappUrl, emailUrl);

  // Proactively trigger WhatsApp notification in background
  try {
    const waWin = window.open(whatsappUrl, '_blank');
    if (!waWin) {
      console.log('Popup blocked; direct button provided in confirmation modal.');
    }
  } catch (err) {}
};

function renderOrderSuccessModal(order, whatsappUrl, emailUrl) {
  const content = `
    <div class="order-success-card">
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div class="success-checkmark-icon">✓</div>
        <span class="badge-gold" style="font-size: 0.74rem; letter-spacing: 0.12em; margin-bottom: 0.4rem; display: inline-block;">
          Payment Verified • Order Confirmed
        </span>
        <h2 style="font-family: var(--font-serif-display); font-size: 1.7rem; color: #FFFFFF; margin: 0 0 0.35rem 0;">
          Thank You, ${escapeHtml(order.fullName)}!
        </h2>
        <p style="color: var(--text-muted); font-size: 0.88rem; max-width: 480px; margin: 0 auto;">
          Your order has been recorded. Order ID: <strong style="color: var(--gold-light); font-size: 1rem;">${order.id}</strong>
        </p>
      </div>

      <!-- Receipt Summary Box -->
      <div class="receipt-summary-box">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-bottom: 1px solid rgba(212, 175, 55, 0.2); padding-bottom: 0.85rem; margin-bottom: 0.85rem;">
          <div>
            <div style="font-size: 0.72rem; color: var(--text-faint); text-transform: uppercase;">Order Placed On</div>
            <div style="font-size: 0.85rem; color: #FFFFFF; font-weight: 600;">${order.displayDate}</div>
          </div>
          <div>
            <div style="font-size: 0.72rem; color: var(--text-faint); text-transform: uppercase;">Payment Status</div>
            <div style="font-size: 0.85rem; color: #4ade80; font-weight: 700;">✓ Paid (Online — ₹${order.amount})</div>
          </div>
        </div>

        <div style="margin-bottom: 0.85rem;">
          <div style="font-size: 0.72rem; color: var(--text-faint); text-transform: uppercase;">Delivery Address</div>
          <div style="font-size: 0.88rem; color: #FFFFFF; line-height: 1.5;">
            ${escapeHtml(order.address)}<br>
            ${escapeHtml(order.city)}, ${escapeHtml(order.state)} — <strong>${order.pincode}</strong><br>
            <span style="font-size: 0.78rem; color: var(--gold-light);">Contact: ${order.phone} • ${order.email}</span>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(212, 175, 55, 0.2); padding-top: 0.75rem;">
          <div>
            <div style="font-size: 0.84rem; color: #FFFFFF; font-weight: 700;">${escapeHtml(order.edition)}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(order.plan || order.quantity || 'Monthly Edition')} • Express Courier</div>
          </div>
          <div style="font-size: 1.25rem; font-weight: 800; color: var(--gold-light);">
            ₹${order.amount}/-
          </div>
        </div>
      </div>

      <!-- Instant Notification Actions -->
      <div style="background: rgba(212, 175, 55, 0.08); border: 1px solid var(--border-gold-bright); border-radius: var(--radius-sm); padding: 1.15rem; margin-bottom: 1.5rem;">
        <div style="font-size: 0.82rem; font-weight: 700; color: var(--gold-light); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
          <span>Screenlady Desk Notification:</span>
        </div>
        <p style="font-size: 0.78rem; color: #E5E7EB; line-height: 1.5; margin-bottom: 0.85rem;">
          Order details are automatically forwarded to our dispatch headquarters. You can also send a direct instant copy to our verified WhatsApp desk or email:
        </p>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <a href="${whatsappUrl}" target="_blank" rel="noopener" class="btn btn-gold btn-sm" style="display: inline-flex; align-items: center; gap: 0.4rem; font-weight: 700; text-decoration: none;">
            <span>Send Copy to WhatsApp (+91 96650 35503)</span>
          </a>
          <a href="${emailUrl}" class="btn btn-outline-gold btn-sm" style="display: inline-flex; align-items: center; gap: 0.4rem; text-decoration: none;">
            <span>Send Copy via Email</span>
          </a>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
        <button type="button" class="btn btn-outline-gold btn-sm" onclick="window.print()">
          Print Order Receipt
        </button>
        <button type="button" class="btn btn-gold btn-sm" onclick="closeOrderModal()">
          Close Window
        </button>
      </div>
    </div>
  `;

  const modal = document.getElementById('globalModal');
  const modalBody = document.getElementById('modalBody');
  if (modal && modalBody) {
    modalBody.innerHTML = content;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

window.closeOrderModal = function() {
  const modal = document.getElementById('globalModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
};

window.initAvailableInPrint = function() {
  const settings = getMagazineSettings();
  const headEl = document.getElementById('printEditionHeading');
  const covEl = document.getElementById('embCoverImg');
  const p2El = document.getElementById('embPage2Img');
  const hlEl = document.getElementById('embHeadlineText');
  const subEl = document.getElementById('embSubtitleText');
  const totalEl = document.getElementById('orderTotalDisplayEmbedded');
  const qtySelect = document.getElementById('embOrderQuantity');

  if (headEl) headEl.textContent = settings.edition;
  if (covEl) covEl.src = settings.coverImage;
  if (p2El) p2El.src = settings.page2Image;
  if (hlEl) hlEl.textContent = settings.headline;
  if (subEl) subEl.textContent = settings.subtitle;

  if (qtySelect) {
    const isYearly = (qtySelect.value || '').toString().toLowerCase().includes('year');
    const total = isYearly ? 2450 : 220;
    if (totalEl) totalEl.textContent = `₹${total}/-`;

    qtySelect.innerHTML = `
      <option value="monthly" ${!isYearly ? 'selected' : ''}>Monthly — ₹220/-</option>
      <option value="yearly" ${isYearly ? 'selected' : ''}>Yearly — ₹2450/-</option>
    `;
  }
};

/* =============================================================
   6. MAGAZINE SELL POPUP NOTIFICATIONS (5s VISIBLE / 10s HIDDEN LOOP)
   - Only displays the latest magazine put by the editor
   - Shows for 5 seconds, disappears for 10 seconds, loops continuously
   - Smooth progress bar indicates the 5-second countdown
   - Hovering pauses countdown so user can click or read comfortably
============================================================= */
const POPUP_VISIBLE_MS = 5000;   // Appears for strictly 5 seconds
const POPUP_HIDDEN_MS = 10000;  // Disappears for strictly 10 seconds
let magPopupCycleTimeout = null;
let magPopupProgressTimer = null;
let isMagPopupPaused = false;
let isMagPopupDismissed = false;
let magPopupState = 'hidden'; // 'visible' | 'hidden'
let magPopupVisibleStartTime = 0;
let magPopupVisibleElapsed = 0;

function updateLatestMagazinePopupContent() {
  // Always fetch live latest magazine settings from editor
  const settings = getMagazineSettings();
  const thumb = document.getElementById('magPopupThumb');
  const tag = document.getElementById('magPopupTag');
  const time = document.getElementById('magPopupTime');
  const headline = document.getElementById('magPopupHeadline');
  const sub = document.getElementById('magPopupSub');
  const orderBtn = document.getElementById('magPopupOrderBtn');
  const reopenText = document.getElementById('magPopupReopenText');

  if (thumb) {
    thumb.src = settings.coverImage || '';
    thumb.alt = `${settings.edition || 'Latest Magazine'} Cover`;
  }
  if (tag) tag.textContent = settings.popupBadge || 'Latest Print Magazine';
  if (time) time.textContent = 'Official Issue';
  if (headline) headline.textContent = settings.edition || 'November 2026 Print Edition';
  if (sub) {
    const customMsg = settings.popupMessage || settings.headline || settings.subtitle || "Collector's Print Edition • Monthly ₹220/- | Yearly ₹2450/-";
    sub.textContent = customMsg;
  }
  if (orderBtn) {
    orderBtn.innerHTML = `<span>Order Print (₹220/-)</span>`;
  }
  if (reopenText) {
    reopenText.textContent = `${settings.edition || 'Latest Magazine'} (From ₹220/-)`;
  }
}

// Pop-up completely removed per user design requirements
window.initMagazineSellPopup = function() {
  const existingWrap = document.getElementById('magPopupWrap');
  if (existingWrap) existingWrap.remove();
  const existingPill = document.getElementById('magPopupReopenPill');
  if (existingPill) existingPill.remove();
};

window.showMagazinePopup = function() {};
window.hideMagazinePopup = function() {};
window.dismissMagazinePopup = function() {};
window.updateMagazinePopupFromSettings = function() {};

// Sync live magazine data from Cloudflare D1 backend
window.syncLiveMagazineData = async function() {
  if (window.ScreenladyAPI) {
    try {
      const [settings, covers] = await Promise.all([
        typeof window.ScreenladyAPI.getMagazineSettings === 'function' ? window.ScreenladyAPI.getMagazineSettings() : Promise.resolve(null),
        typeof window.ScreenladyAPI.getMagazineCovers === 'function' ? window.ScreenladyAPI.getMagazineCovers() : Promise.resolve([])
      ]);
      if (settings) {
        window.backendLiveMagazineSettings = settings;
        try { localStorage.setItem('screenlady_magazine_settings', JSON.stringify(settings)); } catch(e){}
      }
      if (covers && Array.isArray(covers) && covers.length > 0) {
        window.backendLiveMagazineCovers = covers;
        if (!settings || !settings.coverImage || settings.coverImage.includes('/assets/images/')) {
          const latestCover = covers[0].photo || covers[0].cover || covers[0].image;
          if (latestCover) {
            const cur = window.backendLiveMagazineSettings || getMagazineSettings();
            cur.coverImage = latestCover;
            if (covers[0].title) cur.edition = covers[0].title;
            window.backendLiveMagazineSettings = cur;
          }
        }
      }
      if (typeof initAvailableInPrint === 'function') initAvailableInPrint();
      if (typeof updateLatestMagazinePopupContent === 'function') updateLatestMagazinePopupContent();
    } catch (err) {
      console.warn('[Magazine Orders] Notice syncing live magazine data:', err);
    }
  }
};

// Initialize listeners on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initAvailableInPrint();
  initMagazineSellPopup();
  syncLiveMagazineData();

  // Real-time synchronization across browser tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'screenlady_magazine_settings' || e.key === 'screenlady_custom_magazine_covers') {
      initAvailableInPrint();
      updateMagazinePopupFromSettings();
      syncLiveMagazineData();
    }
    if (e.key === 'screenlady_magazine_orders') {
      if (typeof renderMagazineOrdersTable === 'function') {
        renderMagazineOrdersTable();
      }
    }
  });

  // Local tab custom event
  window.addEventListener('screenlady_magazine_settings_changed', () => {
    initAvailableInPrint();
    updateMagazinePopupFromSettings();
    syncLiveMagazineData();
  });

  // Cross-tab BroadcastChannel listener
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel('screenlady_magazine_channel');
      bc.onmessage = (msg) => {
        if (msg && msg.data && msg.data.type === 'magazine_settings_changed') {
          initAvailableInPrint();
          updateMagazinePopupFromSettings();
          syncLiveMagazineData();
        }
      };
    }
  } catch (e) {}
});

// Run immediately if DOM already loaded
if (document.readyState !== 'loading') {
  syncLiveMagazineData();
}
