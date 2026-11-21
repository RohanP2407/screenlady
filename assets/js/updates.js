/**
 * ACCOLADE SCREENLADY - UPDATES FEED CONTROLLER
 * Manages chronological feed for diverse update formats:
 * 1. Photos with Information (Honoree spotlights & milestone chronicles)
 * 2. Articles & Stories (In-depth editorial articles & columns)
 * 3. Photos Only (Visual gallery showcases & event captures)
 *
 * Strictly sorts by date/timestamp descending:
 * The latest update ALWAYS displays first at the top,
 * and previous updates shift down automatically.
 */

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ==========================================================================
   Category & Curated Section Classification Helpers
   ========================================================================== */
function isFilmyAddaUpdate(item) {
  if (!item) return false;
  if (item.curatedSection === 'filmy_adda') return true;
  if (item.curatedSection && item.curatedSection !== 'filmy_adda') return false;
  const cat = (item.category || '').toLowerCase();
  const title = (item.title || item.headline || '').toLowerCase();
  const tags = (item.tags || []).join(' ').toLowerCase();
  return cat.includes('film') || cat.includes('movie') || cat.includes('cinema') || cat.includes('box office') ||
         tags.includes('film') || tags.includes('movie') || tags.includes('cinema') || tags.includes('bollywood') ||
         title.includes('ramayana') || title.includes('box office') || title.includes('jalsa');
}

function isBizzWorldUpdate(item) {
  if (!item) return false;
  if (item.curatedSection === 'bizz_world') return true;
  if (item.curatedSection && item.curatedSection !== 'bizz_world') return false;
  const cat = (item.category || '').toLowerCase();
  const title = (item.title || item.headline || '').toLowerCase();
  const tags = (item.tags || []).join(' ').toLowerCase();
  return cat.includes('bizz') || cat.includes('business') || cat.includes('meeting') || cat.includes('enterprise') || cat.includes('corporate') ||
         tags.includes('business') || tags.includes('meeting') || tags.includes('enterprise') || tags.includes('leadership') || tags.includes('entrepreneur') ||
         title.includes('meeting') || title.includes('entrepreneur') || title.includes('leadership') || title.includes('partner');
}

function isInspirationUpdate(item) {
  if (!item) return false;
  if (item.curatedSection === 'women_inspiration') return true;
  if (item.curatedSection && item.curatedSection !== 'women_inspiration') return false;
  const cat = (item.category || '').toLowerCase();
  const title = (item.title || item.headline || '').toLowerCase();
  const tags = (item.tags || []).join(' ').toLowerCase();
  return cat.includes('inspiration') || cat.includes('struggle') || cat.includes('tribute') || cat.includes('award') ||
         tags.includes('inspiration') || tags.includes('struggle') || tags.includes('sindhutai') || tags.includes('mai') ||
         title.includes('sindhutai') || title.includes('distinction') || title.includes('tribute');
}

function isFashionUpdate(item) {
  if (!item) return false;
  if (item.curatedSection === 'fashion_lifestyle') return true;
  if (item.curatedSection && item.curatedSection !== 'fashion_lifestyle') return false;
  if (item.id && (item.id.startsWith('fashion-') || item.id === 'update-events-1')) return true;
  const cat = (item.category || '').toLowerCase();
  const title = (item.title || item.headline || '').toLowerCase();
  const tags = (item.tags || []).join(' ').toLowerCase();
  return cat.includes('fashion') || cat.includes('lifestyle') || cat.includes('jewellery') || cat.includes('couture') ||
         tags.includes('fashion') || tags.includes('lifestyle') || tags.includes('jewellery') || tags.includes('beauty') ||
         title.includes('fashion') || title.includes('jewellery') || title.includes('tantuh');
}

function isNewsUpdate(item) {
  if (!item) return false;
  if (item.curatedSection === 'news' || item._section === 'news' || item.type === 'news') return true;
  if (item.id && item.id.startsWith('news-')) return true;
  const cat = (item.category || '').toLowerCase();
  const title = (item.title || item.headline || '').toLowerCase();
  const tags = (item.tags || []).join(' ').toLowerCase();
  return cat.includes('news') || cat.includes('alert') || cat.includes('tribute') || cat.includes('movie talk') ||
         tags.includes('news') || tags.includes('press') || tags.includes('alert') ||
         title.includes('ramayana') || title.includes('bomb threat') || title.includes('sindhutai') || title.includes('box office');
}

window.isFilmyAddaUpdate = isFilmyAddaUpdate;
window.isBizzWorldUpdate = isBizzWorldUpdate;
window.isInspirationUpdate = isInspirationUpdate;
window.isFashionUpdate = isFashionUpdate;
window.isNewsUpdate = isNewsUpdate;

// Official Screenlady Team Updates: Fetched dynamically from Cloudflare D1 Backend
const DEFAULT_SCREENLADY_UPDATES = [];

// Photo Presets for quick selection across team members and events
const PHOTO_PRESETS = [
  { label: 'Ramayana Movie Release', path: 'assets/images/news/ramayana.jpeg' },
  { label: 'Sindhutai Sapkal (Mai)', path: 'assets/images/news/sindhutai-sapkal.jpeg' },
  { label: 'November Box Office Releases', path: 'assets/images/news/films-box-office.jpeg' },
  { label: 'Amitabh Bachchan (Jalsa)', path: 'assets/images/news/amitabh-bachchan.jpeg' },
  { label: 'Mr. Prashant Sagvekar (Founder)', path: 'assets/images/team/prashant-sagvekar.jpeg' },
  { label: 'Mrs. Amruta Rao (Editor-in-Chief)', path: 'assets/images/team/amruta-rao.jpeg' },
  { label: 'Mrs. Sakshi Sagvekar (Managing Director)', path: 'assets/images/team/sakshi-sagvekar.jpeg' },
  { label: 'Mr. Vedang Sagvekar (Marketing Director)', path: 'assets/images/team/vedang-sagvekar.jpeg' },
  { label: 'Mrs. Manasi Ingle (Board Member)', path: 'assets/images/team/mansi-ingle.jpeg' },
  { label: 'Mrs. Supriya Vinod (Board Member)', path: 'assets/images/team/supriya-vinod.jpeg' },
  { label: 'Movie Talk & Shoots', path: 'assets/images/magazine-photos/3.1.jpg' },
  { label: 'Awards & Honors', path: 'assets/images/magazine-photos/4.2.jpg' },
  { label: 'Meet & Greet', path: 'assets/images/magazine-photos/4.1.jpg' },
  { label: 'Brand Event (Tantuh)', path: 'assets/images/articles/article-1.jpg' }
];

function purgeLegacyMockUpdates() {
  try {
    const raw = localStorage.getItem('screenlady_custom_updates');
    if (raw) {
      const list = JSON.parse(raw);
      const cleaned = list.filter(item => item && item.id && !item.id.startsWith('update-trial-'));
      if (cleaned.length !== list.length) {
        localStorage.setItem('screenlady_custom_updates', JSON.stringify(cleaned));
      }
    }
    const delRaw = localStorage.getItem('screenlady_deleted_ids');
    if (delRaw) {
      const deleted = JSON.parse(delRaw).filter(id => id && !id.startsWith('update-trial-'));
      localStorage.setItem('screenlady_deleted_ids', JSON.stringify(deleted));
    }
  } catch (e) {
    console.error('Error purging legacy mock updates:', e);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initUpdatesManager();
  });
} else {
  initUpdatesManager();
}

function initUpdatesManager() {
  purgeLegacyMockUpdates();
  const container = document.getElementById('updatesFeedContainer');
  if (!container) return;

  initUpdatesToolbar();

  // Show loading state while fetching from API
  container.innerHTML = `
    <div style="text-align: center; padding: 4.5rem 1rem;">
      <p style="color: var(--gold-light); font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase;">Loading Updates...</p>
    </div>
  `;

  // Fetch API when updates page loads
  async function fetchUpdatesFromBackend() {
    if (window.ScreenladyAPI && typeof window.ScreenladyAPI.getUpdates === 'function') {
      try {
        const liveData = await window.ScreenladyAPI.getUpdates();
        if (Array.isArray(liveData)) {
          window.backendLiveUpdates = liveData;
        }
      } catch (e) {
        console.warn('[Screenlady Updates] Backend sync notice:', e.message);
      }
    }
    renderUpdates(window.activeUpdatesFilter || 'all');
  }

  fetchUpdatesFromBackend();

  // If a hash exists in URL, scroll to it and open the reader modal
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (typeof window.openUpdateModal === 'function') {
        window.openUpdateModal(hash);
      }
    }, 350);
  }
}

/**
 * Normalizes an update item to ensure full compatibility across
 * Photo+Info, Article, and Photo formats.
 */
function normalizeUpdateItem(item) {
  const type = item.type || (item.womanName ? 'photo-info' : 'article');
  const title = item.title || item.headline || item.womanName || 'Screenlady Update';
  const headline = item.headline || item.title || '';
  const photo = item.photo || 'assets/images/featured-icon-saree.jpg';
  const date = item.date || new Date().toISOString().split('T')[0];
  const displayDate = item.displayDate || date;
  const category = item.category || 'Spotlight';
  const summary = item.infoSummary || item.summary || item.photoCaption || '';
  const fullText = item.fullInfo || item.fullArticle || item.bodyText || summary;
  const tags = item.tags || [category];
  const timestamp = item.timestamp || (new Date(date).getTime()) || 0;

  return {
    ...item,
    type,
    title,
    headline,
    photo,
    date,
    displayDate,
    category,
    infoSummary: summary,
    fullInfo: fullText,
    tags,
    timestamp
  };
}

/**
 * Retrieves merged updates list (custom user updates + defaults),
 * sorted strictly by date/timestamp descending.
 */
function getAllUpdates() {
  let custom = [];
  try {
    const raw = localStorage.getItem('screenlady_custom_updates');
    if (raw) custom = JSON.parse(raw);
  } catch (e) {
    console.error('Error loading custom updates:', e);
  }

  let customNews = [];
  try {
    const rawNews = localStorage.getItem('screenlady_custom_news');
    if (rawNews) customNews = JSON.parse(rawNews);
  } catch (e) {}

  let customFashion = [];
  try {
    const rawFashion = localStorage.getItem('screenlady_custom_fashion');
    if (rawFashion) customFashion = JSON.parse(rawFashion);
  } catch (e) {}

  let customFilmy = [];
  try {
    const rawFilmy = localStorage.getItem('screenlady_custom_filmy');
    if (rawFilmy) customFilmy = JSON.parse(rawFilmy);
  } catch (e) {}

  let customBizz = [];
  try {
    const rawBizz = localStorage.getItem('screenlady_custom_bizz');
    if (rawBizz) customBizz = JSON.parse(rawBizz);
  } catch (e) {}

  let customInspiration = [];
  try {
    const rawInspiration = localStorage.getItem('screenlady_custom_inspiration');
    if (rawInspiration) customInspiration = JSON.parse(rawInspiration);
  } catch (e) {}

  const deletedIds = (typeof window.getScreenladyDeletedIds === 'function') 
    ? window.getScreenladyDeletedIds() 
    : (() => { try { const r = localStorage.getItem('screenlady_deleted_ids'); return r ? JSON.parse(r) : []; } catch(e){ return []; } })();

  const backendItems = window.backendLiveUpdates || [];
  const seenIds = new Set();
  const deduped = [];
  for (const item of [...custom, ...customNews, ...customFashion, ...customFilmy, ...customBizz, ...customInspiration, ...backendItems, ...DEFAULT_SCREENLADY_UPDATES]) {
    if (item && item.id && !seenIds.has(item.id)) {
      seenIds.add(item.id);
      deduped.push(item);
    }
  }

  const combined = deduped
    .map(normalizeUpdateItem)
    .filter(item => !deletedIds.includes(item.id));

  // Custom user-published items from Editorial Desk always lead at the top
  const customIds = new Set([
    ...custom.map(c => c.id),
    ...customNews.map(c => c.id),
    ...customFashion.map(c => c.id)
  ]);

  combined.sort((a, b) => {
    const aIsCustom = customIds.has(a.id) || a.isCustom;
    const bIsCustom = customIds.has(b.id) || b.isCustom;
    if (aIsCustom && !bIsCustom) return -1;
    if (!aIsCustom && bIsCustom) return 1;

    // Among custom items, sort newest timestamp first
    if (aIsCustom && bIsCustom) {
      const stampA = (a.timestamp || 0) || new Date(a.date || 0).getTime() || 0;
      const stampB = (b.timestamp || 0) || new Date(b.date || 0).getTime() || 0;
      if (stampB !== stampA) return stampB - stampA;
    }

    const dateA = new Date(a.date).getTime() || a.timestamp || 0;
    const dateB = new Date(b.date).getTime() || b.timestamp || 0;
    return dateB - dateA;
  });

  return combined;
}

// Expose getAllUpdates to window for homepage integration
window.getAllUpdates = getAllUpdates;

/**
 * Renders the updates stream. The first item in the list automatically receives
 * the 'latest-highlight' badge and styling.
 */
function renderUpdates(filter = 'all') {
  const container = document.getElementById('updatesFeedContainer');
  const countBadge = document.getElementById('updatesTotalCount');
  if (!container) return;

  const updates = getAllUpdates();

  let filtered = updates;
  if (filter !== 'all') {
    if (filter === 'filmy_adda') {
      filtered = updates.filter(isFilmyAddaUpdate);
    } else if (filter === 'bizz_world') {
      filtered = updates.filter(isBizzWorldUpdate);
    } else if (filter === 'women_inspiration') {
      filtered = updates.filter(isInspirationUpdate);
    } else if (filter === 'fashion_lifestyle') {
      filtered = updates.filter(isFashionUpdate);
    } else if (filter === 'news') {
      filtered = updates.filter(isNewsUpdate);
    } else if (filter === 'meetings') {
      filtered = updates.filter(u => {
        const cat = (u.category || '').toLowerCase();
        const tags = (u.tags || []).join(' ').toLowerCase();
        return cat.includes('meeting') || tags.includes('meeting');
      });
    } else if (filter === 'awards') {
      filtered = updates.filter(u => {
        const cat = (u.category || '').toLowerCase();
        const tags = (u.tags || []).join(' ').toLowerCase();
        return cat.includes('award') || cat.includes('honor') || tags.includes('award') || tags.includes('honor');
      });
    } else {
      const filterLower = filter.toLowerCase();
      filtered = updates.filter(u => {
        const typeLower = (u.type || '').toLowerCase();
        const catLower = (u.category || '').toLowerCase();
        return typeLower === filterLower || catLower.includes(filterLower) || filterLower.includes(catLower);
      });
    }
  }

  if (countBadge) {
    countBadge.textContent = `${filtered.length} Updates Published`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="editorial-empty-state" style="text-align: center; padding: 4rem 1rem;">
        <p style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--gold-light); margin-bottom: 0.5rem;">No Updates</p>
        <p style="color: var(--text-secondary); font-size: 0.88rem;">There are currently no updates found in this section.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((item, index) => {
    const isFirst = index === 0;
    const highlightClass = isFirst ? 'update-card latest-highlight' : 'update-card';
    const latestRibbon = isFirst ? `<div class="latest-ribbon">✦ LATEST UPDATE</div>` : '';

    if (item.type === 'article') {
      return renderArticleCard(item, highlightClass, latestRibbon);
    } else if (item.type === 'photo') {
      return renderPhotoCard(item, highlightClass, latestRibbon);
    } else {
      return renderPhotoInfoCard(item, highlightClass, latestRibbon);
    }
  }).join('');
}

/**
 * 1. Renders "Photo with Information" (Spotlight / Honoree profile)
 */
function renderPhotoInfoCard(item, highlightClass, latestRibbon) {
  const tagsHtml = (item.tags || []).slice(0, 2).map(t => `<span class="update-tag">#${escapeHtml(t)}</span>`).join('');
  const womanName = item.womanName || item.title;

  let badgeLabel = 'Photo & Story';
  let badgeClass = 'type-photo-info';
  if (item.curatedSection === 'filmy_adda' || isFilmyAddaUpdate(item)) {
    badgeLabel = 'Filmy Adda';
  } else if (item.curatedSection === 'bizz_world' || isBizzWorldUpdate(item)) {
    badgeLabel = 'Bizz World';
  } else if (item.curatedSection === 'women_inspiration' || isInspirationUpdate(item)) {
    badgeLabel = 'Inspiration';
  } else if (item.curatedSection === 'fashion_lifestyle' || isFashionUpdate(item)) {
    badgeLabel = 'Fashion';
  } else if (item.curatedSection === 'news' || item._section === 'news' || item.type === 'news') {
    badgeLabel = 'Live News';
  }

  return `
    <article class="${highlightClass} type-photo-info" id="${item.id}" data-type="photo-info" data-category="${escapeHtml(item.category)}">
      ${latestRibbon}
      <div class="update-photo-wrap" onclick="openUpdateModal('${item.id}')" style="cursor: pointer;" title="Click to read full profile">
        <img src="${item.photo}" alt="${escapeHtml(womanName)}" class="update-photo" loading="lazy">
        <div class="update-photo-overlay"></div>
      </div>

      <div class="update-details-wrap">
        <div>
          <div class="update-meta-top">
            <span class="update-type-pill ${badgeClass}">${badgeLabel}</span>
            <span class="update-date-text">${escapeHtml(item.displayDate || item.date)}</span>
          </div>

          <h3 class="update-honoree-name" onclick="openUpdateModal('${item.id}')" style="cursor: pointer;">
            <span class="name-highlight">${escapeHtml(womanName)}</span>
          </h3>

          <h4 class="update-headline" onclick="openUpdateModal('${item.id}')" style="cursor: pointer;">${escapeHtml(item.headline || item.title)}</h4>

          <p class="update-info-summary">
            ${escapeHtml(item.infoSummary)}
          </p>

          <div class="update-tags-row">
            <span class="update-category-pill">${escapeHtml(item.category)}</span>
            ${tagsHtml}
          </div>
        </div>

        <div class="update-footer-actions">
          <button class="btn-read-update" onclick="openUpdateModal('${item.id}')">
            <span>Read Story</span>
            <span>→</span>
          </button>
          <button class="update-share-btn" onclick="shareUpdate('${escapeHtml(womanName)}')" title="Share update">
            <span>Share</span>
          </button>
        </div>
      </div>
    </article>
  `;
}

/**
 * 2. Renders "Article / Story" (Editorial piece / Column)
 */
function renderArticleCard(item, highlightClass, latestRibbon) {
  const tagsHtml = (item.tags || []).slice(0, 2).map(t => `<span class="update-tag">#${t}</span>`).join('');
  const author = item.author || 'Screenlady Editorial Desk';

  return `
    <article class="${highlightClass} type-article" id="${item.id}" data-type="article" data-category="${item.category}">
      ${latestRibbon}
      <div class="update-photo-wrap" onclick="openUpdateModal('${item.id}')" style="cursor: pointer;" title="Click to read article">
        <img src="${item.photo}" alt="${item.title}" class="update-photo" loading="lazy">
        <div class="update-photo-overlay"></div>
      </div>

      <div class="update-details-wrap">
        <div>
          <div class="update-meta-top">
            <span class="update-type-pill type-article">Article</span>
            <span class="update-date-text">${item.displayDate || item.date}</span>
          </div>

          <h3 class="update-headline" onclick="openUpdateModal('${item.id}')" style="cursor: pointer;">
            ${item.title}
          </h3>

          <div class="update-byline-bar">
            <span>By <span class="author-name">${author}</span></span>
            ${item.readTime ? `<span>• ${item.readTime}</span>` : ''}
          </div>

          <p class="article-excerpt-text">
            ${item.infoSummary}
          </p>

          <div class="update-tags-row">
            <span class="update-category-pill">${item.category}</span>
            ${tagsHtml}
          </div>
        </div>

        <div class="update-footer-actions">
          <button class="btn-read-update" onclick="openUpdateModal('${item.id}')">
            <span>Read Article</span>
            <span>→</span>
          </button>
          <button class="update-share-btn" onclick="shareUpdate('${item.title}')" title="Share article">
            <span>Share</span>
          </button>
        </div>
      </div>
    </article>
  `;
}

/**
 * 3. Renders "Photo Only / Visual Showcase"
 */
function renderPhotoCard(item, highlightClass, latestRibbon) {
  const safeTitle = escapeHtml(item.title || item.headline || 'Screenlady Event Photograph');
  const safeDate = escapeHtml(item.displayDate || item.date || 'Recent');
  const safeLocation = escapeHtml(item.venue || item.location || 'The Grand Ballroom, Mumbai');
  const safeDesc = escapeHtml(item.photoCaption || item.infoSummary || '');

  return `
    <article class="${highlightClass} type-photo" id="${item.id}" data-type="photo" data-category="${item.category}">
      ${latestRibbon}
      <div class="update-photo-wrap" style="cursor: pointer;" onclick="openUpdateModal('${item.id}')" title="Click to view full photo">
        <img src="${item.photo}" alt="${safeTitle}" class="update-photo" loading="lazy">
      </div>

      <div class="photo-event-details">
        <div class="photo-card-date">${safeDate}</div>
        <h3 class="photo-card-name" onclick="openUpdateModal('${item.id}')" style="cursor: pointer;">
          ${safeTitle}
        </h3>
        <div class="photo-card-location">${safeLocation}</div>
        <p class="photo-card-desc">
          ${safeDesc}
        </p>
      </div>
    </article>
  `;
}

/**
 * Filter toolbar click handling
 */
window.resetUpdateFilters = function() {
  const filterBtns = document.querySelectorAll('.update-filter-btn');
  filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-filter') === 'all');
  });
  renderUpdates('all');
};

function initUpdatesToolbar() {
  const filterBtns = document.querySelectorAll('.update-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter') || 'all';
      window.activeUpdatesFilter = filter;
      renderUpdates(filter);
    });
  });

  const resetBtn = document.getElementById('resetUpdatesBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetTrialUpdates);
  }
}

/**
 * Open Full Update Story in Global Modal
 * Guaranteed Full Photo Display: Uncropped hero container with object-fit: contain
 */
window.openUpdateModal = function(updateId) {
  const updates = getAllUpdates();
  let item = updates.find(u => u.id === updateId);
  if (!item && typeof window.getAllHomeNews === 'function') {
    item = window.getAllHomeNews().find(u => u.id === updateId);
  }
  if (!item) {
    try {
      const allCustom = [
        ...JSON.parse(localStorage.getItem('screenlady_custom_updates') || '[]'),
        ...JSON.parse(localStorage.getItem('screenlady_custom_news') || '[]'),
        ...JSON.parse(localStorage.getItem('screenlady_custom_fashion') || '[]')
      ];
      item = allCustom.find(u => u && u.id === updateId);
    } catch(e) {}
  }
  if (!item) return;

  const tags = (item.tags || []).map(t => `<span class="badge-gold">#${escapeHtml(t)}</span>`).join(' ');

  let formattedFullInfo = item.fullInfo || item.infoSummary || item.summary || item.fullBody || '';
  if (formattedFullInfo && !formattedFullInfo.includes('<p>') && !formattedFullInfo.includes('<div>')) {
    formattedFullInfo = formattedFullInfo.split(/\r?\n\s*\r?\n/).map(p => `<p>${p.trim().replace(/\r?\n/g, '<br>')}</p>`).join('\n\n');
  }

  const womanName = item.womanName || item.title || item.headline || 'Accolade Screenlady Feature';
  const displayTitle = item.title || item.headline || womanName;
  const headline = item.headline || item.title || '';
  const dateStr = item.displayDate || item.date || '';

  // Determine section badge
  let sectionBadge = 'Spotlight';
  if (item.curatedSection === 'filmy_adda' || isFilmyAddaUpdate(item)) {
    sectionBadge = 'Filmy Adda';
  } else if (item.curatedSection === 'bizz_world' || isBizzWorldUpdate(item)) {
    sectionBadge = 'Bizz World';
  } else if (item.curatedSection === 'women_inspiration' || isInspirationUpdate(item)) {
    sectionBadge = 'Women of Inspiration';
  } else if (item.curatedSection === 'fashion_lifestyle' || isFashionUpdate(item)) {
    sectionBadge = 'Fashion & Lifestyle';
  } else if (item.curatedSection === 'news' || item._section === 'news' || item.type === 'news') {
    sectionBadge = 'Real-Time News';
  } else if (item.type === 'article') {
    sectionBadge = 'Article';
  }

  // Full photo stage: guarantees complete, uncropped photo display inside the reader
  const photoHtml = item.photo ? `
    <div class="reader-modal-hero-photo-wrap" style="width: 100%; max-height: 540px; background: #07070B radial-gradient(circle, #161622 0%, #07070B 100%); border-radius: var(--radius-md); border: 1px solid var(--border-gold-bright); box-shadow: 0 16px 45px rgba(0,0,0,0.95); overflow: hidden; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; padding: 0.75rem;">
      <img src="${item.photo}" alt="${escapeHtml(displayTitle)}" style="max-height: 510px; max-width: 100%; width: auto; height: auto; object-fit: contain; display: block; margin: 0 auto; border-radius: 4px; box-shadow: 0 8px 30px rgba(0,0,0,0.8);">
    </div>
  ` : '';

  const modalBodyHtml = `
    <div style="display: flex; flex-direction: column;">
      ${photoHtml}

      <div>
        <div style="display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.75rem;">
          <span class="update-type-pill type-photo-info" style="font-weight: 700;">${sectionBadge}</span>
          ${item.category ? `<span class="update-category-pill">${escapeHtml(item.category)}</span>` : ''}
          ${dateStr ? `<span style="font-size: 0.82rem; color: var(--gold-light); font-weight: 600;">• ${escapeHtml(dateStr)}</span>` : ''}
          ${item.venue ? `<span style="font-size: 0.82rem; color: var(--text-muted);">• ${escapeHtml(item.venue)}</span>` : ''}
        </div>

        <h2 style="font-family: var(--font-serif-display); font-size: 2.15rem; color: var(--gold-light); margin-bottom: 0.6rem; line-height: 1.25; font-weight: 700;">
          ${escapeHtml(displayTitle)}
        </h2>

        ${(headline && headline !== displayTitle) ? `
          <h4 style="font-size: 1.05rem; color: var(--text-ivory); font-weight: 600; line-height: 1.45; margin-bottom: 1.15rem;">
            ${escapeHtml(headline)}
          </h4>
        ` : ''}

        ${item.author ? `
          <div style="font-size: 0.88rem; color: var(--text-ivory); font-style: italic; margin-bottom: 1rem;">
            By <strong>${escapeHtml(item.author)}</strong>
          </div>
        ` : ''}

        ${tags ? `<div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem;">${tags}</div>` : ''}
      </div>

      <div class="reader-story-content" style="border-top: 1px solid rgba(212, 175, 55, 0.25); padding-top: 1.75rem; margin-top: 0.5rem;">
        ${formattedFullInfo}
      </div>

      <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 1.25rem; margin-top: 1.75rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <span style="font-size: 0.8rem; color: var(--text-faint);">Accolade Screenlady Editorial Desk • Curated by Mr. Prashant Chandrakant Sagvekar</span>
        <button class="btn btn-gold btn-sm" onclick="shareUpdate('${escapeHtml(displayTitle)}')">Share Story</button>
      </div>
    </div>
  `;

  if (window.openModal) {
    window.openModal(displayTitle, modalBodyHtml);
  }
};

/**
 * Share Toast Trigger
 */
window.shareUpdate = function(name) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href);
  }
  if (window.showToast) {
    window.showToast(`Link for "${name}" copied to clipboard!`);
  }
};

/**
 * Reset to initial trial updates
 */
window.resetTrialUpdates = function() {
  if (confirm('Reset updates feed back to the initial trial base updates?')) {
    localStorage.removeItem('screenlady_custom_updates');
    renderUpdates('all');
    if (window.showToast) {
      window.showToast('Reset to initial trial updates successfully.');
    }
  }
};
