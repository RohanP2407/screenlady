/**
 * ACCOLADE SCREENLADY - EVENT PHOTOS & GALLERY SYSTEM
 * Displays event photographs of Accolade Screenlady arranged chronologically by date.
 * Features:
 * - Chronological Sorting: The most recent event photo always displays first at the top
 * - Event metadata: Event title, date, venue/location, category, caption, and photographer credit
 * - Interactive Lightbox modal viewer for high-resolution photo exploration
 * - Seamless real-time sync with Admin Editorial Desk via localStorage (`screenlady_custom_photos`)
 */

// Official Screenlady Photography: Fetched dynamically from Cloudflare D1 Backend
const DEFAULT_SCREENLADY_PHOTOS = [];

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  purgeLegacyMockPhotos();
  initPhotosFeed();
  initPhotosFilters();

  // Listen for real-time updates from other tabs (Admin Desk)
  window.addEventListener('storage', (e) => {
    if (e.key === 'screenlady_custom_photos') {
      renderPhotosFeed();
    }
  });
});

function purgeLegacyMockPhotos() {
  try {
    const raw = localStorage.getItem('screenlady_custom_photos');
    if (raw) {
      const list = JSON.parse(raw);
      const clean = list.filter(item => 
        item && 
        !['photo-board-collab', 'photo-event-1', 'photo-event-2', 'photo-event-3', 'photo-event-4'].includes(item.id) &&
        (!item.photo || !item.photo.includes('screenlady-board-collab'))
      );
      if (clean.length !== list.length) {
        localStorage.setItem('screenlady_custom_photos', JSON.stringify(clean));
      }
    }
    const rawDel = localStorage.getItem('screenlady_deleted_ids');
    if (rawDel) {
      const delList = JSON.parse(rawDel);
      const cleanDel = delList.filter(id => !['photo-tantuh-1', 'photo-bodyshaming-1', 'photo-cinema-1', 'photo-awards-1'].includes(id));
      if (cleanDel.length !== delList.length) {
        localStorage.setItem('screenlady_deleted_ids', JSON.stringify(cleanDel));
      }
    }
  } catch(e) {}
}

/**
 * Retrieve all photos (combines custom localStorage with defaults)
 * Strictly sorted descending so the latest date appears first
 */
function getCustomPhotos() {
  try {
    const raw = localStorage.getItem('screenlady_custom_photos');
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error loading custom photos:', err);
    return [];
  }
}

function getAllPhotos() {
  const customList = getCustomPhotos();
  const deletedIds = (typeof window.getScreenladyDeletedIds === 'function') 
    ? window.getScreenladyDeletedIds() 
    : (() => { try { const r = localStorage.getItem('screenlady_deleted_ids'); return r ? JSON.parse(r) : []; } catch(e){ return []; } })();

  const backendItems = window.backendLivePhotos || [];
  const seenIds = new Set();
  const merged = [];

  for (const item of [...customList, ...backendItems, ...DEFAULT_SCREENLADY_PHOTOS]) {
    if (item && item.id && !seenIds.has(item.id) && !deletedIds.includes(item.id)) {
      seenIds.add(item.id);
      merged.push(item);
    }
  }

  // Sort strictly descending by date & timestamp (Latest First)
  return merged.sort((a, b) => {
    const dateA = new Date(a.date || a.displayDate || 0).getTime();
    const dateB = new Date(b.date || b.displayDate || 0).getTime();
    if (dateB !== dateA) return dateB - dateA;
    return (b.timestamp || 0) - (a.timestamp || 0);
  });
}

let activePhotoFilter = 'all';

function initPhotosFeed() {
  renderPhotosFeed();

  // Async sync with Cloudflare Worker Backend once on load:
  if (window.ScreenladyAPI && typeof window.ScreenladyAPI.getPhotos === 'function') {
    window.ScreenladyAPI.getPhotos().then(liveData => {
      if (Array.isArray(liveData)) {
        window.backendLivePhotos = liveData;
        renderPhotosFeed();
      }
    }).catch(() => {});
  }
}

function initPhotosFilters() {
  const filterBtns = document.querySelectorAll('.photos-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activePhotoFilter = btn.getAttribute('data-filter') || 'all';
      renderPhotosFeed();
    });
  });
}

function renderPhotosFeed() {
  const container = document.getElementById('photosFeedContainer');
  if (!container) return;

  const countBadge = document.getElementById('photosTotalCount');
  const photos = getAllPhotos();

  // Apply active category filter
  const filtered = photos.filter(p => {
    if (activePhotoFilter === 'all') return true;
    const cat = (p.category || '').toLowerCase();
    const filter = activePhotoFilter.toLowerCase();
    return cat.includes(filter) || (p.tags && p.tags.some(t => t.toLowerCase().includes(filter)));
  });

  if (countBadge) {
    countBadge.textContent = `${photos.length} Photograph${photos.length === 1 ? '' : 's'} Published`;
  }

  if (filtered.length === 0) {
    const isTotalEmpty = photos.length === 0;
    container.innerHTML = `
      <div class="editorial-empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-crest">
          <img src="/assets/images/logo-2.png" alt="Accolade Screenlady" style="height: 48px; width: auto; opacity: 0.85; margin-bottom: 1.25rem;">
        </div>
        <span class="editorial-kicker-pill" style="margin-bottom: 0.75rem;">Visual Archives</span>
        <h3 style="font-family: var(--font-serif); font-size: clamp(1.4rem, 2.5vw, 1.85rem); color: var(--gold-light); margin-bottom: 0.6rem;">
          ${isTotalEmpty ? 'Visual Spreads Forthcoming' : 'No Photographs in This Collection'}
        </h3>
        <p style="color: var(--text-secondary); font-size: 0.92rem; max-width: 520px; margin: 0 auto 1.5rem; line-height: 1.6;">
          ${isTotalEmpty 
            ? 'New studio portraits, ceremonial felicitations, and high-fashion spreads are currently in curation.' 
            : 'No photographs match the chosen category. View all published photo galleries.'}
        </p>
        <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
          ${!isTotalEmpty ? `<button type="button" class="btn btn-gold btn-sm" onclick="resetPhotoFilters()"><span>View All Photographs</span></button>` : ''}
          <a href="/updates" class="btn-editorial-gold"><span>Read Updates</span></a>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((photo) => {
    const safeTitle = escapeHtml(photo.title || photo.caption || 'Accolade Screenlady Photograph');
    const safeDate = escapeHtml(photo.displayDate || photo.date || 'Recent');
    const imgSrc = photo.photo || 'assets/images/articles/article-1.jpg';

    return `
      <article class="photo-event-card photo-gallery-grid-card" id="${photo.id}">
        <div class="photo-event-img-wrap" onclick="openPhotoLightbox('${photo.id}')" title="Click to view full photo: ${safeTitle}">
          <img src="${imgSrc}" alt="${safeTitle}" class="photo-event-img" loading="lazy">
          <div class="photo-event-overlay">
            <span class="photo-zoom-hint">Expand Photo</span>
          </div>
        </div>

        <div class="photo-gallery-clean-footer">
          <h3 class="photo-gallery-card-name" onclick="openPhotoLightbox('${photo.id}')" title="${safeTitle}">
            ${safeTitle}
          </h3>
          <div class="photo-gallery-card-date">
            <span>${safeDate}</span>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

window.resetPhotoFilters = function() {
  activePhotoFilter = 'all';
  document.querySelectorAll('.photos-filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-filter') === 'all');
  });
  renderPhotosFeed();
};

/**
 * Open high-resolution photo in the global modal (guaranteed full uncropped photo display)
 */
window.openPhotoLightbox = function(photoId) {
  const photo = getAllPhotos().find(p => p.id === photoId);
  if (!photo) return;

  const modal = document.getElementById('globalModal');
  const modalBody = document.getElementById('modalBody');
  if (!modal || !modalBody) return;

  const imgSrc = photo.photo || 'assets/images/featured-icon-saree.jpg';
  const safeTitle = escapeHtml(photo.title || 'Event Photograph');
  const safeVenue = escapeHtml(photo.venue || photo.location || 'Screenlady Event Venue');
  const safeCaption = escapeHtml(photo.caption || '');
  const safeCredit = escapeHtml(photo.credit || 'Official Screenlady Photography');
  const safeDate = escapeHtml(photo.displayDate || photo.date || 'Recent Event');
  const safeCategory = escapeHtml(photo.category || 'Event Archive');

  modalBody.innerHTML = `
    <div class="photo-lightbox-content" style="display: flex; flex-direction: column; gap: 1.5rem;">
      <div class="lightbox-img-container" style="width: 100%; max-height: 540px; background: #07070B radial-gradient(circle, #161622 0%, #07070B 100%); border-radius: var(--radius-md); border: 1.5px solid var(--border-gold-bright); box-shadow: 0 16px 45px rgba(0,0,0,0.95); overflow: hidden; display: flex; align-items: center; justify-content: center; padding: 0.75rem;">
        <img src="${imgSrc}" alt="${safeTitle}" style="max-height: 510px; max-width: 100%; width: auto; height: auto; object-fit: contain; display: block; margin: 0 auto; border-radius: 4px;">
      </div>

      <div class="lightbox-details-panel">
        <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.75rem;">
          <span class="event-date-pill">${safeDate}</span>
          <span class="badge-gold">${safeCategory}</span>
        </div>

        <h2 style="font-family: var(--font-serif-display); font-size: 1.85rem; color: var(--gold-light); margin: 0 0 0.65rem; line-height: 1.3;">
          ${safeTitle}
        </h2>

        ${safeVenue ? `
        <div class="event-venue-tag" style="margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem; color: var(--text-ivory); font-size: 0.9rem;">
          <span>${safeVenue}</span>
        </div>` : ''}

        ${safeCaption && safeCaption !== safeTitle ? `
        <div style="color: var(--text-light); font-size: 0.95rem; line-height: 1.7; margin-bottom: 1.25rem; border-left: 2px solid var(--gold-primary); padding-left: 1rem; background: rgba(212,175,55,0.04); border-radius: 0 var(--radius-sm) var(--radius-sm) 0; padding-top: 0.5rem; padding-bottom: 0.5rem;">
          ${safeCaption}
        </div>` : ''}

        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid var(--border-gold-subtle); flex-wrap: wrap; gap: 1rem;">
          <span style="font-size: 0.8rem; color: var(--text-muted);">
            Photographer: <strong style="color: var(--gold-light);">${safeCredit}</strong>
          </span>

          <div style="display: flex; gap: 0.5rem;">
            <a href="${imgSrc}" target="_blank" download class="btn btn-outline-gold btn-sm" style="display: inline-flex; align-items: center; gap: 0.35rem;">
              <span>Full View</span>
            </a>
            <button class="btn btn-gold btn-sm" onclick="closePhotoModal()">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closePhotoModal = function() {
  const modal = document.getElementById('globalModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
};

// Safe HTML Escape
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
