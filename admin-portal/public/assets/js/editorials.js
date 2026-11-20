/**
 * ACCOLADE SCREENLADY - EDITORIALS & ESSAYS CONTROLLER
 * Side-by-side magazine cards with 10-15 line excerpts and full-screen distraction-free reader mode.
 */

// Official Magazine Editorial Articles: Fetched dynamically from Cloudflare D1 Backend
const DEFAULT_SCREENLADY_EDITORIALS = [];

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function purgeLegacyMockEditorials() {
  try {
    const raw = localStorage.getItem('screenlady_custom_editorials');
    if (raw) {
      const list = JSON.parse(raw);
      const cleaned = list.filter(item => 
        item && item.id && !item.id.startsWith('editorial-default-')
      );
      if (cleaned.length !== list.length) {
        localStorage.setItem('screenlady_custom_editorials', JSON.stringify(cleaned));
      }
    }

    const delRaw = localStorage.getItem('screenlady_deleted_ids');
    if (delRaw) {
      const deleted = JSON.parse(delRaw).filter(id => 
        id && !id.startsWith('editorial-default-') && id !== 'article-1' && id !== 'article-2'
      );
      localStorage.setItem('screenlady_deleted_ids', JSON.stringify(deleted));
    }
  } catch (e) {
    console.error('Error purging legacy mock data:', e);
  }
}

function getCustomEditorials() {
  try {
    const raw = localStorage.getItem('screenlady_custom_editorials');
    if (raw) return JSON.parse(raw);
    return [];
  } catch (e) {
    console.error('Error reading custom editorials:', e);
    return [];
  }
}

function normalizeEditorial(item) {
  if (!item) return null;
  const id = item.id;
  const title = item.title || item.headline || 'Accolade Screenlady Feature Editorial';
  const headline = item.headline || title;
  const author = item.author || 'Accolade Screenlady Editorial Desk';
  const authorRole = item.authorRole || item.authorDesignation || 'Editorial Feature';
  const authorDesignation = authorRole;
  const date = item.date || '2026-11-18';
  const displayDate = item.displayDate || date;
  const category = item.category || 'Special Feature';
  const categoryBadge = item.categoryBadge || `✦ ${category}`;
  const readTime = item.readTime || '5 Min Read';
  const photo = item.photo || 'assets/images/articles/article-1.jpg';
  const photoCaption = item.photoCaption || title;
  const summary = item.summary || item.pullQuote || '';
  const pullQuote = item.pullQuote || summary;

  let fullContent = item.fullContent || item.fullBody || item.content || '';
  if (!fullContent) {
    fullContent = `<p>${summary || title}</p>`;
  }

  let previewExcerptHtml = item.previewExcerptHtml;
  if (!previewExcerptHtml) {
    previewExcerptHtml = `
      <div class="editorial-lead-box" style="margin-bottom: 0.95rem; padding: 0.85rem 1.1rem; font-size: 0.92rem;">
        <strong>(Accolade Screenlady, Mumbai)</strong> ${summary || title}
      </div>
      ${fullContent}
    `;
  }

  return {
    ...item,
    id,
    title,
    headline,
    author,
    authorRole,
    authorDesignation,
    date,
    displayDate,
    category,
    categoryBadge,
    readTime,
    photo,
    photoCaption,
    summary,
    pullQuote,
    fullContent,
    fullBody: fullContent,
    content: fullContent,
    previewExcerptHtml
  };
}

function getAllEditorials() {
  const custom = getCustomEditorials();
  const deletedIds = (typeof window.getScreenladyDeletedIds === 'function') 
    ? window.getScreenladyDeletedIds() 
    : (() => { try { const r = localStorage.getItem('screenlady_deleted_ids'); return r ? JSON.parse(r) : []; } catch(e){ return []; } })();

  const backendItems = window.backendLiveEditorials || [];
  // Filter out default items that are overridden by custom items with same ID
  const defaults = DEFAULT_SCREENLADY_EDITORIALS.filter(d => !custom.some(c => c && c.id === d.id) && !backendItems.some(b => b && b.id === d.id));
  const combined = [...custom, ...backendItems, ...defaults]
    .map(normalizeEditorial)
    .filter(item => item && !deletedIds.includes(item.id));

  // Sort: custom/newest first, then by sortOrder if available
  combined.sort((a, b) => {
    if (a.sortOrder && b.sortOrder && !a.id.startsWith('editorial-custom-') && !b.id.startsWith('editorial-custom-')) {
      return a.sortOrder - b.sortOrder;
    }
    const dateA = new Date(a.date).getTime() || a.timestamp || 0;
    const dateB = new Date(b.date).getTime() || b.timestamp || 0;
    return dateB - dateA;
  });

  return combined;
}

/**
 * Renders Side-by-Side Editorial Cards with 10-15 line excerpts and "Read Full Article" triggers
 */
function renderEditorials(filter = 'all') {
  const container = document.getElementById('editorialsFeedContainer');
  const countBadge = document.getElementById('editorialsTotalCount');
  if (!container) return;

  const editorials = getAllEditorials();

  let filtered = editorials;
  if (filter !== 'all') {
    const filterLower = filter.toLowerCase();
    filtered = editorials.filter(item => {
      const cat = (item.category || '').toLowerCase();
      return cat.includes(filterLower);
    });
  }

  if (countBadge) {
    countBadge.textContent = `${filtered.length} ${filtered.length === 1 ? 'Article' : 'Articles'} Published`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: rgba(255,255,255,0.02); border: 1px dashed rgba(212,175,55,0.3); border-radius: var(--radius-md);">
        <p style="font-family: var(--font-serif-display); font-size: 1.5rem; color: var(--gold-light); margin-bottom: 0.5rem;">No Articles Found in This Category</p>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">Select "All Editorials" to view published articles.</p>
        <button class="btn btn-gold btn-sm" onclick="renderEditorials('all')">Show All Articles</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((item) => {
    return `
      <article class="editorial-side-card" id="${item.id}">
        
        <div>
          <!-- 1. The Name of Article & Metadata on Top -->
          <header class="editorial-card-header">
            <div class="editorial-card-meta-row">
              <span class="editorial-kicker-pill">${item.categoryBadge || item.category || 'Special Feature'}</span>
              <span class="editorial-meta-date">📅 ${item.displayDate || item.date} • ⏱️ ${item.readTime || '6 Min Read'}</span>
            </div>
            
            <h2 class="editorial-card-title">${item.title}</h2>
            
            <div class="editorial-card-author-line">
              <div class="editorial-avatar-circle">✍️</div>
              <div>
                <span class="editorial-byline-name">${item.author || 'Accolade Screenlady Desk'}</span>
                <span class="editorial-byline-role">${item.authorRole || 'Editorial Feature'}</span>
              </div>
            </div>
          </header>

          <!-- 2. The Photo Fitted in Frame -->
          <div class="editorial-card-photo-box" onclick="openFullScreenReader('${item.id}')" title="Click to Read Full Article">
            <img src="${item.photo}" alt="${item.title}" class="editorial-card-photo-img" loading="lazy">
            <div class="editorial-card-photo-badge">✦ Feature Photo</div>
          </div>

          <!-- 3. Showcase Complete Writings / Expandable Below Photo -->
          <div class="editorial-card-excerpt-wrap" id="editorialExcerptWrap-${item.id}">
            <div class="editorial-card-excerpt" id="editorialExcerptContent-${item.id}">
              ${item.fullContent || item.previewExcerptHtml || `<p>${item.summary}</p>`}
            </div>
            <div class="editorial-card-fade-overlay" id="editorialFadeOverlay-${item.id}"></div>
          </div>
        </div>

        <!-- 4. Read Options: Inline Expand Below Photo & Full Screen Reader -->
        <div class="editorial-card-action-bar" style="display: flex; gap: 0.65rem; flex-wrap: wrap;">
          <button type="button" class="btn btn-gold editorial-read-btn" id="editorialInlineToggleBtn-${item.id}" onclick="toggleInlineEditorial('${item.id}')" title="Read Complete Article Below Photo">
            <span id="editorialToggleText-${item.id}">📖 Read Full Article Below Photo ↓</span>
          </button>
          <button type="button" class="btn btn-outline-gold" onclick="openFullScreenReader('${item.id}')" title="Read In Full-Screen Reader Mode" style="font-size: 0.88rem; padding: 0.65rem 1.15rem;">
            <span>⛶ Full-Screen Reader</span>
          </button>
        </div>

      </article>
    `;
  }).join('');

  renderQuickJumpBar();
}

/**
 * Open Full Screen Reader for a Specific Article
 */
window.openFullScreenReader = function(id) {
  const editorials = getAllEditorials();
  const item = editorials.find(e => e.id === id);
  if (!item) return;

  const readerModal = document.getElementById('editorialFullScreenReader');
  const readerBody = document.getElementById('readerBodyContainer');
  const whatsappBtn = document.getElementById('readerWhatsappBtn');
  const copyBtn = document.getElementById('readerCopyBtn');
  const progressFill = document.getElementById('readerProgressFill');

  if (!readerModal || !readerBody) {
    if (window.openModal) {
      window.openModal(item.title, `
        <div style="padding: 1rem 0.5rem;">
          <div style="margin-bottom: 1.5rem; text-align: center;">
            <img src="${item.photo}" alt="${item.title}" style="max-height: 480px; width: 100%; object-fit: contain; border-radius: 8px;">
          </div>
          <h2 style="font-family: var(--font-serif-display); color: var(--gold-light); margin-bottom: 1rem;">${item.title}</h2>
          <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem;">By ${item.author} • ${item.displayDate || item.date}</div>
          <div class="editorial-feature-prose" style="line-height: 1.8;">${item.fullContent}</div>
        </div>
      `);
    }
    return;
  }

  const shareUrl = encodeURIComponent(window.location.origin + window.location.pathname + '#' + item.id);
  const shareTitle = encodeURIComponent(item.title);

  // Update top actions
  if (whatsappBtn) {
    whatsappBtn.href = `https://wa.me/?text=${shareTitle}%20${shareUrl}`;
  }
  if (copyBtn) {
    copyBtn.onclick = () => window.copyArticleLink(item.id);
  }
  if (progressFill) {
    progressFill.style.width = '0%';
  }

  // Find other article for quick switch at the bottom
  const otherItem = editorials.find(e => e.id !== id);

  readerBody.innerHTML = `
    <article class="reader-full-article" id="reader-view-${item.id}">
      
      <!-- Article Header Meta & Title -->
      <header style="margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.85rem; margin-bottom: 1.25rem;">
          <span class="editorial-kicker-pill">${item.categoryBadge || item.category || 'Special Feature'}</span>
          <span style="font-size: 0.9rem; color: var(--gold-light, #F3E5AB); font-weight: 600;">
            📅 ${item.displayDate || item.date} • ⏱️ ${item.readTime || '6 Min Read'}
          </span>
        </div>

        <h1 style="font-family: var(--font-serif-display, 'Cinzel', serif); font-size: clamp(1.85rem, 3.8vw, 2.85rem); line-height: 1.28; color: #FFFFFF; margin-bottom: 1.5rem; text-shadow: 0 2px 10px rgba(0,0,0,0.85);">
          ${item.title}
        </h1>

        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; padding: 1.1rem 1.4rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(212,175,55,0.25); border-radius: 12px;">
          <div style="display: flex; align-items: center; gap: 0.9rem;">
            <div class="editorial-avatar-circle" style="width: 44px; height: 44px; font-size: 1.2rem;">✍️</div>
            <div>
              <div style="font-family: var(--font-serif-display, 'Cinzel', serif); font-size: 1rem; font-weight: 700; color: #FFFFFF;">${item.author}</div>
              <div style="color: var(--gold-light, #F3E5AB); font-size: 0.82rem;">${item.authorRole}</div>
            </div>
          </div>
          <div style="display: flex; gap: 0.6rem; align-items: center;">
            <a href="https://wa.me/?text=${shareTitle}%20${shareUrl}" target="_blank" rel="noopener" class="reader-btn" style="font-size: 0.78rem;">
              💬 Share WhatsApp
            </a>
            <button type="button" class="reader-btn" onclick="window.copyArticleLink('${item.id}')" style="font-size: 0.78rem;">
              🔗 Copy Link
            </button>
          </div>
        </div>
      </header>

      <!-- The Featured Photo on Top of Full Text -->
      <div class="reader-full-photo-wrap">
        <img src="${item.photo}" alt="${item.title}" class="reader-full-photo-img">
        <div class="editorial-photo-caption">
          <span>✦ ${item.photoCaption || 'Accolade Screenlady Official Editorial Publication • Feature Photo'}</span>
        </div>
      </div>

      <!-- The Complete Formatted Article Content -->
      <div class="editorial-feature-prose" style="font-size: 1.14rem; line-height: 1.9; color: #EDE8DE;">
        ${item.fullContent}
      </div>

      <!-- Footer Navigation & Reader Controls -->
      <footer class="reader-footer-nav">
        <div>
          ${otherItem ? `
            <button type="button" class="btn btn-outline-gold" onclick="openFullScreenReader('${otherItem.id}')" style="font-size: 0.9rem; padding: 0.75rem 1.4rem;">
              <span>Next Column: ${escapeHtml(otherItem.title.length > 38 ? otherItem.title.substring(0, 35) + '...' : otherItem.title)} →</span>
            </button>
          ` : ''}
        </div>

        <div style="display: flex; gap: 0.85rem; align-items: center;">
          <button type="button" class="btn btn-gold btn-sm" onclick="document.getElementById('editorialFullScreenReader').scrollTo({ top: 0, behavior: 'smooth' })">
            ↑ Back to Top
          </button>
          <button type="button" class="btn btn-outline-gold btn-sm" onclick="closeFullScreenReader()">
            ✕ Close Reader
          </button>
        </div>
      </footer>

      <!-- Publication Seal -->
      <div style="margin-top: 3.5rem; text-align: center; font-size: 0.85rem; color: #BBB6AD; border-top: 1px solid rgba(212,175,55,0.2); padding-top: 2rem;">
        Published in <strong>Accolade Screenlady Magazine</strong> • Conceptualizer, Publisher & Editor: <strong>Mr. Prashant Chandrakant Sagvekar</strong>
      </div>

    </article>
  `;

  // Display full-screen reader modal
  readerModal.style.display = 'block';
  readerModal.scrollTop = 0;
  document.body.style.overflow = 'hidden';

  // Attach scroll progress listener
  readerModal.onscroll = () => {
    const scrollTop = readerModal.scrollTop;
    const scrollHeight = readerModal.scrollHeight - readerModal.clientHeight;
    const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    const fill = document.getElementById('readerProgressFill');
    if (fill) fill.style.width = Math.min(100, Math.max(0, percent)) + '%';
  };
};

/**
 * Close Full Screen Reader
 */
window.closeFullScreenReader = function() {
  const readerModal = document.getElementById('editorialFullScreenReader');
  if (readerModal) {
    readerModal.style.display = 'none';
  }
  document.body.style.overflow = '';
};

/**
 * Copy article deep-link to clipboard
 */
window.copyArticleLink = function(id) {
  const url = window.location.origin + window.location.pathname + '#' + id;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      alert('✓ Article link copied to clipboard!\n' + url);
    }).catch(() => {
      prompt('Copy article link:', url);
    });
  } else {
    prompt('Copy article link:', url);
  }
};

function renderQuickJumpBar() {
  const container = document.querySelector('.editorial-quick-jump-bar');
  if (!container) return;
  const editorials = getAllEditorials();
  container.innerHTML = `
    <span class="jump-bar-label">✦ Read Full Screen:</span>
    ${editorials.map((e, idx) => `
      <button type="button" class="jump-pill" onclick="openFullScreenReader('${e.id}')" style="cursor: pointer; border: none;" title="${e.title}">
        <span>${idx === 0 ? '💎' : idx === 1 ? '📱' : '✒️'} ${e.title.length > 34 ? e.title.substring(0, 31) + '...' : e.title}</span>
      </button>
    `).join('')}
  `;
}

/**
 * Toggle Inline Editorial Full Article Below Photo
 */
window.toggleInlineEditorial = function(id) {
  const content = document.getElementById(`editorialExcerptContent-${id}`);
  const fade = document.getElementById(`editorialFadeOverlay-${id}`);
  const textSpan = document.getElementById(`editorialToggleText-${id}`);
  if (!content) return;

  const isExpanded = content.classList.contains('expanded');
  if (isExpanded) {
    content.classList.remove('expanded');
    content.style.maxHeight = '250px';
    if (fade) fade.style.display = 'block';
    if (textSpan) textSpan.textContent = '📖 Read Full Article Below Photo ↓';
  } else {
    content.classList.add('expanded');
    content.style.maxHeight = 'none';
    if (fade) fade.style.display = 'none';
    if (textSpan) textSpan.textContent = '↑ Collapse to Excerpt';
  }
};

/**
 * Initialize Editorials Page
 */
async function syncEditorialsFromBackend() {
  if (!window.ScreenladyAPI) return;
  try {
    const [liveData, deletedIds] = await Promise.all([
      typeof window.ScreenladyAPI.getEditorials === 'function' ? window.ScreenladyAPI.getEditorials() : Promise.resolve([]),
      typeof window.ScreenladyAPI.getDeletedIds === 'function' ? window.ScreenladyAPI.getDeletedIds() : Promise.resolve([])
    ]);

    if (deletedIds && Array.isArray(deletedIds)) {
      window.backendDeletedIds = deletedIds;
    }
    if (Array.isArray(liveData)) {
      window.backendLiveEditorials = liveData;
      renderEditorials('all');
      renderQuickJumpBar();
    }
  } catch (err) {
    console.warn('[Screenlady Editorials] Backend sync notice:', err.message);
  }
}

function initEditorialsPage() {
  purgeLegacyMockEditorials();
  renderEditorials('all');
  renderQuickJumpBar();

  // Async sync with Cloudflare Worker Backend:
  syncEditorialsFromBackend();
  setInterval(syncEditorialsFromBackend, 8000);

  window.addEventListener('focus', () => {
    syncEditorialsFromBackend();
  });

  // Filter Buttons
  const filterBtns = document.querySelectorAll('.editorials-filter-btn, .editorial-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter') || 'all';
      renderEditorials(cat);
    });
  });

  // Keyboard shortcut: Escape closes reader
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeFullScreenReader();
    }
  });

  // Check URL Hash for deep link and open full-screen reader automatically
  if (window.location.hash) {
    const targetId = window.location.hash.substring(1);
    const exists = getAllEditorials().some(e => e.id === targetId);
    if (exists) {
      setTimeout(() => {
        window.openFullScreenReader(targetId);
      }, 350);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initEditorialsPage();
});
