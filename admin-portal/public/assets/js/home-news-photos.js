/**
 * ACCOLADE SCREENLADY - HOMEPAGE HERO SPLIT CONTROLLER
 * Left Column: 4 Latest News Running in Horizontal Cards with Photos + 1,2,3 Slider for Previous News
 * Right Column: Curated High-Resolution Photo Gallery & News Visual Slideshow
 * 
 * Features:
 * - Dynamic data integration with Admin Desk (localStorage custom updates & photos)
 * - Page Slider (1: Latest News, 2: Previous News, 3: Earlier News) with smooth slide transition
 * - Auto-advancing news cycle with progress bar and pause-on-hover
 * - Synchronized visual highlight: hovering/activating a news card connects directly with the right-side photo showcase
 * - Smooth auto-playing photo slideshow with crossfade, touch swipe, prev/next, and dot controls
 */

(function () {
  'use strict';

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
     1. DATA REGISTRIES (Loaded dynamically from Cloudflare D1 Database)
     ========================================================================== */
  const DEFAULT_LATEST_NEWS = [];
  const DEFAULT_SLIDESHOW_PHOTOS = [];

  /* ==========================================================================
     2. RETRIEVE ALL SORTED NEWS (Screenlady Updates Left Column)
     ========================================================================== */
  function isCuratedSubSection(item) {
    if (!item) return false;
    return item.curatedSection === 'filmy_adda' ||
           item.curatedSection === 'bizz_world' ||
           item.curatedSection === 'women_inspiration' ||
           item.curatedSection === 'fashion_lifestyle';
  }

  function getAllNews() {
    try {
      const localDeleted = (() => { try { const r = localStorage.getItem('screenlady_deleted_ids'); return r ? JSON.parse(r) : []; } catch(e){ return []; } })();
      const backendDeleted = window.backendDeletedIds || [];
      const deletedIds = Array.from(new Set([...localDeleted, ...backendDeleted]));

      // Dedicated homepage live news from Editorial Desk
      let customNews = [];
      const rawNews = localStorage.getItem('screenlady_custom_news');
      if (rawNews) {
        customNews = JSON.parse(rawNews);
      }

      // Live backend worker news (news and updates not reserved for curated showcases)
      const backendNews = (window.backendLiveNews || []).filter(n => n && !isCuratedSubSection(n));

      // Deduplicate strictly by ID
      const seenIds = new Set();
      const dedupedNews = [];

      // 1st Priority: Custom user news from admin desk
      for (const item of customNews) {
        if (item && item.id && !seenIds.has(item.id) && !deletedIds.includes(item.id)) {
          seenIds.add(item.id);
          dedupedNews.push({ ...item, isCustom: true });
        }
      }

      // 2nd Priority: Live backend worker news
      for (const item of backendNews) {
        if (item && item.id && !seenIds.has(item.id) && !deletedIds.includes(item.id)) {
          seenIds.add(item.id);
          const isCustom = Boolean(item.isCustom || (item.id && (item.id.includes('custom') || item.id.startsWith('news-'))));
          dedupedNews.push({ ...item, isCustom });
        }
      }

      // 3rd Priority: Default seed news (only if not already added)
      for (const item of DEFAULT_LATEST_NEWS) {
        if (item && item.id && !seenIds.has(item.id) && !deletedIds.includes(item.id)) {
          seenIds.add(item.id);
          dedupedNews.push(item);
        }
      }

      // Strictly sort: newly published custom items ALWAYS lead at #1, sorted latest first
      dedupedNews.sort((a, b) => {
        const isCustomA = Boolean(a.isCustom || (a.id && (a.id.includes('custom') || a.id.startsWith('news-'))));
        const isCustomB = Boolean(b.isCustom || (b.id && (b.id.includes('custom') || b.id.startsWith('news-'))));
        if (isCustomA && !isCustomB) return -1;
        if (!isCustomA && isCustomB) return 1;

        const timeA = Number(a.timestamp) || new Date(a.date || a.displayDate || 0).getTime() || 0;
        const timeB = Number(b.timestamp) || new Date(b.date || b.displayDate || 0).getTime() || 0;
        return timeB - timeA;
      });

      return dedupedNews.map(item => ({
        id: item.id,
        category: item.category || 'Updates',
        categoryBadge: item.categoryBadge || (item.category ? `✦ ${item.category}` : '✦ News'),
        date: item.displayDate || item.date || 'Recent',
        title: item.title || item.headline || 'Screenlady Update',
        summary: item.summary || item.infoSummary || 'Latest dispatch from Accolade Screenlady leadership and editorial council.',
        fullInfo: item.fullInfo || item.fullBody || item.summary || '',
        fullBody: item.fullBody || item.fullInfo || item.summary || '',
        photo: item.photo || 'https://ik.imagekit.io/acooladescreenlady/screenlady/news/ramayana_MHoDF4dFm.jpeg',
        link: 'javascript:void(0)',
        isHomepageNews: true,
        isCustom: item.isCustom,
        timestamp: item.timestamp
      }));
    } catch (e) {
      console.warn('Error loading news list:', e);
      return DEFAULT_LATEST_NEWS;
    }
  }

  /* ==========================================================================
     3. RETRIEVE HOMEPAGE BRAND SPOTLIGHT / BUSINESS SHOWCASE (NO 'ads' word)
     (Loaded from business_ads table & admin portal - completely separate from Gallery!)
     ========================================================================== */
  const DEFAULT_BUSINESS_SPOTLIGHT = [];

  function getBusinessShowcase() {
    try {
      const deletedIds = (typeof window.getScreenladyDeletedIds === 'function') 
        ? window.getScreenladyDeletedIds() 
        : (() => { try { const r = localStorage.getItem('screenlady_deleted_ids'); return r ? JSON.parse(r) : []; } catch(e){ return []; } })();

      let customAds = [];
      try {
        const rawAds = localStorage.getItem('screenlady_custom_business_ads') || localStorage.getItem('screenlady_custom_home_photos');
        if (rawAds) customAds = JSON.parse(rawAds);
      } catch (e) { customAds = []; }

      const backendAds = window.backendLiveBusinessAds || [];

      // Combine ONLY business showcase items — strictly separate from Gallery Photography!
      const combined = [
        ...customAds,
        ...backendAds,
        ...DEFAULT_BUSINESS_SPOTLIGHT
      ].filter(item => item && (item.photo || item.image) && !deletedIds.includes(item.id));

      const seen = new Set();
      const deduped = [];
      for (const p of combined) {
        const photoUrl = p.photo || p.image;
        if (!photoUrl) continue;
        const key = p.id || photoUrl;
        if (!seen.has(key)) {
          seen.add(key);
          deduped.push({
            id: p.id || 'brand-' + deduped.length,
            brandName: p.brandName || p.title || 'Executive Partner',
            headline: p.headline || p.tagline || p.title || 'Brand Spotlight',
            tagline: p.tagline || p.headline || '',
            summary: p.summary || p.infoSummary || p.description || '',
            category: p.category || 'Featured Partner',
            badge: p.categoryBadge || p.badge || 'Brand Spotlight',
            destinationUrl: p.destinationUrl || p.link || '',
            photo: photoUrl,
            date: p.displayDate || p.date || 'Active'
          });
        }
      }

      return deduped.slice(0, 12);
    } catch (e) {
      console.warn('Error loading brand spotlights:', e);
      return DEFAULT_BUSINESS_SPOTLIGHT;
    }
  }

  function getSlideshowPhotos() {
    return getBusinessShowcase();
  }

  /* ==========================================================================
     4. RENDER & SLIDER (PAGINATION 1, 2, 3) FOR NEWS (LEFT COLUMN)
     ========================================================================== */
  const NEWS_PER_PAGE = 4;
  let currentNewsPage = 1;
  let activeNewsCardIndex = 0;
  let newsCycleTimer = null;
  let newsIsPaused = false;
  const NEWS_CYCLE_DURATION = 4200; // 4.2 seconds per card

  function renderNewsPage(page) {
    const listContainer = document.getElementById('homeLatestNewsList');
    if (!listContainer) return;

    const allNews = getAllNews();
    if (allNews.length === 0) return;

    const totalPages = Math.max(1, Math.ceil(allNews.length / NEWS_PER_PAGE));
    currentNewsPage = Math.min(Math.max(1, page), totalPages);

    const startIndex = (currentNewsPage - 1) * NEWS_PER_PAGE;
    const pageItems = allNews.slice(startIndex, startIndex + NEWS_PER_PAGE);

    // Apply smooth page transition class
    listContainer.classList.remove('page-transition');
    void listContainer.offsetWidth; // Trigger reflow
    listContainer.classList.add('page-transition');

    // Render cards
    listContainer.innerHTML = pageItems.map((item, index) => {
      const overallIndex = startIndex + index + 1;
      const isActive = index === 0 ? 'active' : '';
      return `
        <a href="javascript:void(0)" class="home-news-h-card ${isActive}" data-page-idx="${index}" data-photo="${item.photo}" data-news-id="${item.id}" id="homeNewsCard-${index}" title="${escapeHtml(item.title)}" onclick="if(window.openHomeNewsReader){ window.openHomeNewsReader('${item.id}'); return false; }">
          <div class="home-news-h-thumb-wrap">
            <img src="${item.photo}" alt="${escapeHtml(item.title)}" class="home-news-h-thumb" loading="lazy">
            <div class="home-news-h-badge-overlay">${overallIndex}</div>
          </div>
          <div class="home-news-h-content">
            <div class="home-news-h-meta">
              <span class="home-news-h-cat">${escapeHtml(item.categoryBadge || item.category)}</span>
              <span class="home-news-h-date">${escapeHtml(item.date)}</span>
            </div>
            <h3 class="home-news-h-title">${escapeHtml(item.title)}</h3>
            <p class="home-news-h-desc">${escapeHtml(item.summary)}</p>
          </div>
          <div class="home-news-h-progress" id="homeNewsProgress-${index}"></div>
        </a>
      `;
    }).join('');

    // Attach card event listeners
    const cards = listContainer.querySelectorAll('.home-news-h-card');
    cards.forEach((card, idx) => {
      card.addEventListener('mouseenter', () => {
        newsIsPaused = true;
        setHighlightedNewsCard(idx);
      });
      card.addEventListener('mouseleave', () => {
        newsIsPaused = false;
      });
      card.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.openHomeNewsReader) {
          window.openHomeNewsReader(pageItems[idx].id);
        }
      });
    });

    renderNewsPaginationControls(totalPages);
    activeNewsCardIndex = 0;
    setHighlightedNewsCard(0);
    startNewsCycleTimer(pageItems.length);
  }

  function renderNewsPaginationControls(totalPages) {
    let paginationWrap = document.getElementById('homeNewsPagination');
    if (!paginationWrap) {
      // Find parent column and create pagination container if not already in markup
      const newsCol = document.querySelector('.home-split-news-col');
      if (!newsCol) return;
      paginationWrap = document.createElement('div');
      paginationWrap.id = 'homeNewsPagination';
      paginationWrap.className = 'home-news-pagination';
      newsCol.appendChild(paginationWrap);
    }

    const badgeLabels = {
      1: "Page 1 • Latest News",
      2: "Page 2 • Previous News",
      3: "Page 3 • Older Chronicles"
    };

    const currentBadge = badgeLabels[currentNewsPage] || `Page ${currentNewsPage} of ${totalPages}`;

    let pageBtnsHtml = '';
    for (let p = 1; p <= totalPages; p++) {
      const activeClass = p === currentNewsPage ? 'active' : '';
      pageBtnsHtml += `<button type="button" class="home-news-num-btn ${activeClass}" data-page="${p}" aria-label="Go to Page ${p}">${p}</button>`;
    }

    paginationWrap.innerHTML = `
      <div class="home-news-page-info">
        <span class="home-news-page-badge" id="homeNewsPageBadge">
          <span class="page-status-dot"></span> ${currentBadge}
        </span>
      </div>
      <div class="home-news-slider-controls">
        <button type="button" class="home-news-page-arrow prev" id="homeNewsPrevPageBtn" ${currentNewsPage === 1 ? 'disabled' : ''} aria-label="Previous News Batch">‹</button>
        <div class="home-news-page-dots" id="homeNewsPageBtns">${pageBtnsHtml}</div>
        <button type="button" class="home-news-page-arrow next" id="homeNewsNextPageBtn" ${currentNewsPage === totalPages ? 'disabled' : ''} aria-label="Next News Batch">›</button>
      </div>
    `;

    // Event listeners for page buttons
    const numBtns = paginationWrap.querySelectorAll('.home-news-num-btn');
    numBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = parseInt(btn.getAttribute('data-page'), 10);
        if (targetPage !== currentNewsPage) {
          renderNewsPage(targetPage);
        }
      });
    });

    const prevBtn = document.getElementById('homeNewsPrevPageBtn');
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentNewsPage > 1) {
          renderNewsPage(currentNewsPage - 1);
        }
      });
    }

    const nextBtn = document.getElementById('homeNewsNextPageBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentNewsPage < totalPages) {
          renderNewsPage(currentNewsPage + 1);
        }
      });
    }
  }

  function setHighlightedNewsCard(index) {
    activeNewsCardIndex = index;
    const cards = document.querySelectorAll('.home-news-h-card');
    cards.forEach((c, i) => {
      if (i === activeNewsCardIndex) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
        const prog = document.getElementById(`homeNewsProgress-${i}`);
        if (prog) prog.style.width = '0%';
      }
    });
  }

  function startNewsCycleTimer(itemsOnPage) {
    if (newsCycleTimer) clearInterval(newsCycleTimer);
    if (itemsOnPage <= 1) return;

    let elapsed = 0;
    const tick = 40;

    newsCycleTimer = setInterval(() => {
      if (newsIsPaused) return;

      elapsed += tick;
      const pct = Math.min((elapsed / NEWS_CYCLE_DURATION) * 100, 100);

      const activeProg = document.getElementById(`homeNewsProgress-${activeNewsCardIndex}`);
      if (activeProg) activeProg.style.width = `${pct}%`;

      if (elapsed >= NEWS_CYCLE_DURATION) {
        elapsed = 0;
        if (activeProg) activeProg.style.width = '0%';
        activeNewsCardIndex = (activeNewsCardIndex + 1) % itemsOnPage;
        setHighlightedNewsCard(activeNewsCardIndex);
      }
    }, tick);
  }

  /* ==========================================================================
     5. RENDER & CONTROL PHOTO SLIDESHOW (RIGHT COLUMN)
     ========================================================================== */
  let currentPhotoIndex = 0;
  let photoSlideshowTimer = null;
  let photoIsPaused = false;
  const PHOTO_SLIDE_DURATION = 4500; // 4.5 seconds per slide
  let activePhotosList = [];

  function renderPhotoSlideshow() {
    const stage = document.getElementById('homePhotoSlidesStage');
    const theaterWrap = document.getElementById('homePhotoSlideshowWrap');
    if (!stage || !theaterWrap) return;

    activePhotosList = getBusinessShowcase();
    if (activePhotosList.length === 0) {
      stage.innerHTML = `
        <div class="home-photo-slide active" style="position:relative;display:flex;align-items:center;justify-content:center;height:100%;min-height:440px;background:#0d0c0a;text-align:center;padding:2.5rem 1.5rem;">
          <div>
            <h3 style="font-family:var(--font-serif,'Cinzel',serif);font-size:1.3rem;color:var(--gold-bright,#FFE894);margin-bottom:0.5rem;letter-spacing:0.04em;">Executive Brand Spotlight</h3>
            <p style="font-size:0.85rem;color:var(--text-muted,#A3A09A);max-width:320px;margin:0 auto 1.25rem;line-height:1.6;">Featured business partners and enterprise spotlights published from the Editorial Desk are displayed here.</p>
          </div>
        </div>
      `;
      return;
    }

    // Render Brand Spotlight Slides (Corporate & Enterprise - NO 'ads' word)
    stage.innerHTML = activePhotosList.map((item, index) => {
      const isActive = index === 0 ? 'active' : '';

      return `
        <div class="home-photo-slide ${isActive}" data-slide-index="${index}" id="homePhotoSlide-${index}" title="${escapeHtml(item.brandName || item.headline)}">
          <img src="${escapeHtml(item.photo)}" alt="${escapeHtml(item.brandName || item.headline)}" class="home-photo-slide-img" loading="lazy">
          <div class="home-photo-slide-kicker">${escapeHtml(item.badge || 'Brand Spotlight')}</div>
          <div class="home-photo-caption-bar">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.2rem;">
              <span style="font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--gold-light, #D4AF37); font-weight: 700;">
                ${escapeHtml(item.brandName)}
              </span>
              <span style="font-size: 0.70rem; color: #9CA3AF; letter-spacing: 0.05em;">
                ${escapeHtml(item.category || 'Featured Partner')}
              </span>
            </div>
            <h3 class="home-photo-caption-title" style="font-size: 1.05rem; margin-bottom: 0.35rem; line-height: 1.35;">
              ${escapeHtml(item.headline || item.brandName)}
            </h3>
            ${item.summary ? `<p style="font-size: 0.80rem; color: #D1D5DB; margin: 0 0 0.5rem 0; line-height: 1.45; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${escapeHtml(item.summary)}</p>` : ''}
            ${item.destinationUrl && item.destinationUrl !== '#' && item.destinationUrl !== 'javascript:void(0)' ? `
              <div style="margin-top: 0.35rem;">
                <a href="${escapeHtml(item.destinationUrl)}" target="_blank" rel="noopener noreferrer" class="btn-editorial-gold" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.3rem 0.85rem; font-size: 0.72rem; text-decoration: none; border-radius: 3px;" onclick="event.stopPropagation();">
                  <span>Explore Partner</span>
                  <span>→</span>
                </a>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    // Event Listeners for Nav Arrows
    const prevBtn = document.getElementById('homePhotoPrevBtn');
    const nextBtn = document.getElementById('homePhotoNextBtn');

    if (prevBtn) {
      prevBtn.onclick = (e) => {
        e.preventDefault();
        changePhotoSlide(currentPhotoIndex - 1);
      };
    }

    if (nextBtn) {
      nextBtn.onclick = (e) => {
        e.preventDefault();
        changePhotoSlide(currentPhotoIndex + 1);
      };
    }

    // Pause on Hover
    theaterWrap.addEventListener('mouseenter', () => { photoIsPaused = true; });
    theaterWrap.addEventListener('mouseleave', () => { photoIsPaused = false; });

    // Touch Swipe Support for Phones
    let touchStartX = 0;
    theaterWrap.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    theaterWrap.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) {
          changePhotoSlide(currentPhotoIndex + 1);
        } else {
          changePhotoSlide(currentPhotoIndex - 1);
        }
      }
    }, { passive: true });

    startPhotoSlideshowTimer();
  }

  function changePhotoSlide(targetIndex) {
    const totalSlides = activePhotosList.length;
    if (totalSlides <= 1) return;

    if (targetIndex < 0) targetIndex = totalSlides - 1;
    if (targetIndex >= totalSlides) targetIndex = 0;

    currentPhotoIndex = targetIndex;

    const slides = document.querySelectorAll('.home-photo-slide');

    slides.forEach((slide, i) => {
      if (i === currentPhotoIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  }

  // The photo gallery slideshow is completely independent from Live News.
  // News items never inject into or overwrite the right-side Gallery Showcase.
  function syncSlideshowWithNewsPhoto() {}
  function syncSlideshowWithNewsItem() {}
  function syncSlideshowWithPhotoUrl() {}

  function startPhotoSlideshowTimer() {
    if (photoSlideshowTimer) clearInterval(photoSlideshowTimer);
    if (activePhotosList.length <= 1) return;

    photoSlideshowTimer = setInterval(() => {
      if (photoIsPaused) return;
      changePhotoSlide(currentPhotoIndex + 1);
    }, PHOTO_SLIDE_DURATION);
  }

  /* ==========================================================================
     6. INITIALIZATION & STORAGE REACTION
     ========================================================================== */
  async function syncFromBackend() {
    if (!window.ScreenladyAPI) return;
    try {
      const [liveNews, liveBusinessAds, liveUpdates] = await Promise.all([
        typeof window.ScreenladyAPI.getNews === 'function' ? window.ScreenladyAPI.getNews() : Promise.resolve([]),
        typeof window.ScreenladyAPI.getBusinessAds === 'function' ? window.ScreenladyAPI.getBusinessAds() : Promise.resolve([]),
        typeof window.ScreenladyAPI.getUpdates === 'function' ? window.ScreenladyAPI.getUpdates() : Promise.resolve([])
      ]);

      if (liveNews && Array.isArray(liveNews)) {
        window.backendLiveNews = liveNews;
      }
      if (liveUpdates && Array.isArray(liveUpdates)) {
        window.backendLiveUpdates = liveUpdates;
      }
      if (liveBusinessAds && Array.isArray(liveBusinessAds) && liveBusinessAds.length > 0) {
        window.backendLiveBusinessAds = liveBusinessAds;
        renderPhotoSlideshow();
      }

      renderNewsPage(currentNewsPage);
      renderCuratedSections();
    } catch (e) {
      console.warn('[Screenlady Home] Backend fetch notice:', e.message);
    }
  }

  function init() {
    renderNewsPage(1);
    renderPhotoSlideshow();
    renderCuratedSections();

    // Fetch once on page load
    syncFromBackend();

    // Re-render when Editorial Desk publishes or modifies news, updates, fashion, or business spotlight
    window.addEventListener('storage', (e) => {
      if (e.key === 'screenlady_custom_news' || e.key === 'screenlady_custom_updates' || e.key === 'screenlady_custom_fashion' || e.key === 'screenlady_last_updated') {
        renderNewsPage(currentNewsPage);
        renderCuratedSections();
      }
      if (e.key === 'screenlady_custom_business_ads' || e.key === 'screenlady_custom_home_photos') {
        renderPhotoSlideshow();
      }
    });
  }

  /* ==========================================================================
     7. HOMEPAGE CURATED SECTIONS DYNAMIC RENDERER
     (Filmy Adda, Bizz World, Women of Inspiration, Fashion and Lifestyle)
     ========================================================================== */
  function renderCuratedSections() {
    const filmyGrid = document.getElementById('filmyAddaPhotosGrid');
    const bizzGrid = document.getElementById('bizzWorldPhotosGrid');
    const inspireGrid = document.getElementById('womenInspirationGrid');
    const fashionGrid = document.getElementById('fashionLifestyleGrid');

    if (!filmyGrid && !bizzGrid && !inspireGrid && !fashionGrid) return;

    const deletedIds = (typeof window.getScreenladyDeletedIds === 'function') 
      ? window.getScreenladyDeletedIds() 
      : (() => { try { const r = localStorage.getItem('screenlady_deleted_ids'); return r ? JSON.parse(r) : []; } catch(e){ return []; } })();

    let customFilmy = [];
    try {
      const rawFi = localStorage.getItem('screenlady_custom_filmy');
      if (rawFi) customFilmy = JSON.parse(rawFi);
    } catch (e) { customFilmy = []; }

    let customBizz = [];
    try {
      const rawB = localStorage.getItem('screenlady_custom_bizz');
      if (rawB) customBizz = JSON.parse(rawB);
    } catch (e) { customBizz = []; }

    let customInspire = [];
    try {
      const rawI = localStorage.getItem('screenlady_custom_inspiration');
      if (rawI) customInspire = JSON.parse(rawI);
    } catch (e) { customInspire = []; }

    let customFashion = [];
    try {
      const rawF = localStorage.getItem('screenlady_custom_fashion');
      if (rawF) customFashion = JSON.parse(rawF);
    } catch (e) { customFashion = []; }

    // Backend updates dedicated to curated sections (strictly excluding news items)
    const backendCurated = (window.backendLiveUpdates || []).filter(u => 
      u && !deletedIds.includes(u.id) && !u.isHomepageNews && u.curatedSection !== 'news' && u.type !== 'news' && !(u.id && u.id.startsWith('news-'))
    );

    // 1. FILMY ADDA: Only items explicitly published to filmy_adda
    if (filmyGrid) {
      const filmyItems = [
        ...customFilmy.filter(i => i && !deletedIds.includes(i.id)),
        ...backendCurated.filter(i => i && i.curatedSection === 'filmy_adda')
      ];

      filmyItems.sort((a, b) => {
        const aIsCustom = Boolean(a.isCustom || (a.id && (a.id.startsWith('curated-') || a.id.includes('-custom-'))));
        const bIsCustom = Boolean(b.isCustom || (b.id && (b.id.startsWith('curated-') || b.id.includes('-custom-'))));
        if (aIsCustom && !bIsCustom) return -1;
        if (!aIsCustom && bIsCustom) return 1;
        const timeA = (a.timestamp || 0) || new Date(a.date || 0).getTime() || 0;
        const timeB = (b.timestamp || 0) || new Date(b.date || 0).getTime() || 0;
        return timeB - timeA;
      });

      const uniqueFilmy = [];
      const seen = new Set();
      for (const item of filmyItems) {
        const key = item.id || item.photo;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueFilmy.push(item);
        }
        if (uniqueFilmy.length >= 4) break;
      }

      filmyGrid.innerHTML = uniqueFilmy.slice(0, 4).map(item => `
        <div class="curated-photo-card" onclick="if(window.openCuratedCardModal) window.openCuratedCardModal('${item.id}', 'filmy_adda'); else if(window.openUpdateModal) window.openUpdateModal('${item.id}');" title="${escapeHtml(item.title || item.headline || 'Cinema Feature')}">
          <img src="${item.photo}" alt="${escapeHtml(item.title || item.headline || 'Film Photo')}" loading="lazy">
          <div class="curated-photo-overlay">
            <span class="curated-photo-badge">${escapeHtml(item.categoryBadge || item.category || 'Cinema')}</span>
            <div>
              <h4 class="curated-photo-title">${escapeHtml(item.title || item.headline)}</h4>
              <div class="curated-photo-action">
                <span>View Details & Photo</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    // 2. BIZZ WORLD: Only items explicitly published to bizz_world
    if (bizzGrid) {
      const bizzItems = [
        ...customBizz.filter(i => i && !deletedIds.includes(i.id)),
        ...backendCurated.filter(i => i && i.curatedSection === 'bizz_world')
      ];

      bizzItems.sort((a, b) => {
        const aIsCustom = Boolean(a.isCustom || (a.id && (a.id.startsWith('curated-') || a.id.includes('-custom-'))));
        const bIsCustom = Boolean(b.isCustom || (b.id && (b.id.startsWith('curated-') || b.id.includes('-custom-'))));
        if (aIsCustom && !bIsCustom) return -1;
        if (!aIsCustom && bIsCustom) return 1;
        const timeA = (a.timestamp || 0) || new Date(a.date || 0).getTime() || 0;
        const timeB = (b.timestamp || 0) || new Date(b.date || 0).getTime() || 0;
        return timeB - timeA;
      });

      const uniqueBizz = [];
      const seen = new Set();
      for (const item of bizzItems) {
        const key = item.id || item.photo;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueBizz.push(item);
        }
        if (uniqueBizz.length >= 4) break;
      }

      bizzGrid.innerHTML = uniqueBizz.slice(0, 4).map(item => `
        <div class="curated-photo-card" onclick="if(window.openCuratedCardModal) window.openCuratedCardModal('${item.id}', 'bizz_world'); else if(window.openUpdateModal) window.openUpdateModal('${item.id}');" title="${escapeHtml(item.title || item.headline || 'Business Feature')}">
          <img src="${item.photo}" alt="${escapeHtml(item.title || item.headline || 'Business Photo')}" loading="lazy">
          <div class="curated-photo-overlay">
            <span class="curated-photo-badge">${escapeHtml(item.categoryBadge || item.category || 'Business')}</span>
            <div>
              <h4 class="curated-photo-title">${escapeHtml(item.title || item.headline)}</h4>
              <div class="curated-photo-action">
                <span>View Details & Photo</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    // 3. WOMEN OF INSPIRATION: Only items explicitly published to women_inspiration
    if (inspireGrid) {
      const inspireItems = [
        ...customInspire.filter(i => i && !deletedIds.includes(i.id)),
        ...backendCurated.filter(i => i && i.curatedSection === 'women_inspiration')
      ];

      inspireItems.sort((a, b) => {
        const aIsCustom = Boolean(a.isCustom || (a.id && (a.id.startsWith('curated-') || a.id.includes('-custom-'))));
        const bIsCustom = Boolean(b.isCustom || (b.id && (b.id.startsWith('curated-') || b.id.includes('-custom-'))));
        if (aIsCustom && !bIsCustom) return -1;
        if (!aIsCustom && bIsCustom) return 1;
        const timeA = (a.timestamp || 0) || new Date(a.date || 0).getTime() || 0;
        const timeB = (b.timestamp || 0) || new Date(b.date || 0).getTime() || 0;
        return timeB - timeA;
      });

      const uniqueInspire = [];
      const seen = new Set();
      for (const item of inspireItems) {
        const key = item.id || item.photo;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueInspire.push(item);
        }
        if (uniqueInspire.length >= 4) break;
      }

      inspireGrid.innerHTML = uniqueInspire.slice(0, 4).map(item => {
        const honoreeName = item.womanName || item.title || item.headline || 'Honoree Profile';
        return `
        <div class="curated-showcase-card" onclick="if(window.openCuratedCardModal) window.openCuratedCardModal('${item.id}', 'women_inspiration'); else if(window.openUpdateModal) window.openUpdateModal('${item.id}');" title="${escapeHtml(honoreeName)}">
          <div class="curated-showcase-img-wrap">
            <img src="${item.photo}" alt="${escapeHtml(honoreeName)}" class="curated-showcase-img" loading="lazy">
          </div>
          <div class="curated-showcase-minimal-footer">
            <h3 class="curated-showcase-name">${escapeHtml(honoreeName)}</h3>
          </div>
        </div>
      `;
      }).join('');
    }

    // 4. FASHION AND LIFESTYLE: Only items explicitly published to fashion_lifestyle
    if (fashionGrid) {
      const fashionItems = [
        ...customFashion.filter(i => i && !deletedIds.includes(i.id)),
        ...backendCurated.filter(i => i && i.curatedSection === 'fashion_lifestyle')
      ];

      fashionItems.sort((a, b) => {
        const aIsCustom = Boolean(a.isCustom || (a.id && (a.id.startsWith('curated-') || a.id.includes('-custom-'))));
        const bIsCustom = Boolean(b.isCustom || (b.id && (b.id.startsWith('curated-') || b.id.includes('-custom-'))));
        if (aIsCustom && !bIsCustom) return -1;
        if (!aIsCustom && bIsCustom) return 1;
        const timeA = (a.timestamp || 0) || new Date(a.date || 0).getTime() || 0;
        const timeB = (b.timestamp || 0) || new Date(b.date || 0).getTime() || 0;
        return timeB - timeA;
      });

      const uniqueFashion = [];
      const seen = new Set();
      for (const item of fashionItems) {
        const key = item.id || item.photo;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueFashion.push(item);
        }
        if (uniqueFashion.length >= 4) break;
      }

      fashionGrid.innerHTML = uniqueFashion.slice(0, 4).map(item => {
        const lineDesc = item.title || item.headline || 'Fashion & Lifestyle';
        const safeDesc = escapeHtml(lineDesc);
        return `
        <div class="curated-showcase-card" onclick="if(window.openCuratedCardModal) window.openCuratedCardModal('${item.id}', 'fashion_lifestyle'); else if(window.openUpdateModal) window.openUpdateModal('${item.id}');" title="${safeDesc}">
          <div class="curated-showcase-img-wrap">
            <img src="${item.photo}" alt="${safeDesc}" class="curated-showcase-img" loading="lazy">
          </div>
          <div class="curated-showcase-minimal-footer">
            <p class="curated-showcase-oneline">${safeDesc}</p>
          </div>
        </div>
      `;
      }).join('');
    }
  }

/**
   * Universal Interactive Modal for Curated Section Cards (Bizz World, Filmy Adda, Women of Inspiration, Fashion & Lifestyle)
   * Displays the complete, uncropped photo and full information text without redirecting to updates or external pages.
   */
  window.openCuratedCardModal = function(id, sectionName) {
    let item = null;

    // 1. Check live D1 backend updates, news, and photos
    if (window.backendLiveUpdates) {
      item = window.backendLiveUpdates.find(u => u && (u.id === id || String(u.id) === String(id)));
    }
    if (!item && window.backendLiveNews) {
      item = window.backendLiveNews.find(u => u && (u.id === id || String(u.id) === String(id)));
    }
    if (!item && window.backendLivePhotos) {
      item = window.backendLivePhotos.find(p => p && (p.id === id || String(p.id) === String(id)));
    }

    // 2. Look in custom section storage
    if (!item) {
      try {
        const pool = [
          ...JSON.parse(localStorage.getItem('screenlady_custom_bizz') || '[]'),
          ...JSON.parse(localStorage.getItem('screenlady_custom_filmy') || '[]'),
          ...JSON.parse(localStorage.getItem('screenlady_custom_inspiration') || '[]'),
          ...JSON.parse(localStorage.getItem('screenlady_custom_fashion') || '[]'),
          ...JSON.parse(localStorage.getItem('screenlady_custom_updates') || '[]'),
          ...JSON.parse(localStorage.getItem('screenlady_custom_news') || '[]')
        ];
        item = pool.find(u => u && (u.id === id || String(u.id) === String(id)));
      } catch(e) {}
    }

    // 3. Look in updates or news lists
    if (!item && typeof window.getAllUpdates === 'function') {
      item = window.getAllUpdates().find(u => u && u.id === id);
    }
    if (!item && typeof getAllNews === 'function') {
      item = getAllNews().find(u => u && u.id === id);
    }

    // Fallback if not found
    if (!item) {
      item = {
        title: "Accolade Screenlady Feature",
        categoryBadge: sectionName ? sectionName.toUpperCase() : "Special Feature",
        photo: "https://ik.imagekit.io/acooladescreenlady/screenlady/magazine-photos/4.1__HQ0nEUET8.jpg",
        date: "Special Editorial Edition",
        fullInfo: "Detailed information for this featured story is curated by the Accolade Screenlady editorial desk. Check back for expanded interviews and photo archives in our print edition."
      };
    }

    const title = item.title || item.headline || item.womanName || "Accolade Screenlady Feature";
    let badge = item.categoryBadge || item.category || "";
    if (!badge) {
      if (sectionName === 'bizz_world' || item.curatedSection === 'bizz_world') badge = "Bizz World";
      else if (sectionName === 'filmy_adda' || item.curatedSection === 'filmy_adda') badge = "Filmy Adda";
      else if (sectionName === 'women_inspiration' || item.curatedSection === 'women_inspiration') badge = "Women of Inspiration";
      else if (sectionName === 'fashion_lifestyle' || item.curatedSection === 'fashion_lifestyle') badge = "Fashion & Lifestyle";
      else badge = "Special Feature";
    }

    const dateStr = item.date || item.displayDate || "Editorial Feature";
    let rawText = item.fullInfo || item.infoSummary || item.summary || item.fullBody || item.content || item.description || "";
    if (!rawText.includes('<p>') && !rawText.includes('<div>')) {
      rawText = rawText.split(/\r?\n\s*\r?\n/).map(p => `<p style="margin-bottom: 1.25rem; line-height: 1.85;">${escapeHtml(p.trim()).replace(/\r?\n/g, '<br>')}</p>`).join('');
    }

    const photoSrc = item.photo || item.image || item.coverSrc || 'https://ik.imagekit.io/acooladescreenlady/screenlady/magazine-photos/4.1__HQ0nEUET8.jpg';

    const contentHtml = `
      <div class="curated-modal-view" style="display: flex; flex-direction: column; font-family: var(--font-sans, sans-serif); color: var(--text-ivory-soft);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.25rem; border-bottom: 1px solid var(--gold-border); padding-bottom: 0.75rem;">
          <span class="badge-gold" style="background: rgba(197,160,89,0.12); border: 1px solid var(--gold-primary); color: var(--gold-bright); font-family: var(--font-display); font-size: 0.72rem; font-weight: 700; text-transform: uppercase; padding: 4px 12px; border-radius: var(--radius-xs); letter-spacing: 0.12em;">
            ${escapeHtml(badge)}
          </span>
          <span style="font-size: 0.78rem; color: var(--text-muted);">${escapeHtml(dateStr)}</span>
        </div>

        <div style="width: 100%; max-height: 520px; background: #080705; border-radius: var(--radius-xs); border: 1px solid var(--gold-border-bright); box-shadow: var(--shadow-modal); overflow: hidden; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; padding: 0.75rem;">
          <img src="${escapeHtml(photoSrc)}" alt="${escapeHtml(title)}" style="max-height: 490px; max-width: 100%; width: auto; height: auto; object-fit: contain; display: block; margin: 0 auto; border-radius: 2px;" />
        </div>

        <h2 style="font-family: var(--font-serif, serif); font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 500; color: var(--text-ivory); line-height: 1.25; margin: 0 0 1.25rem;">
          ${escapeHtml(title)}
        </h2>

        <div style="font-size: 1.02rem; line-height: 1.85; color: var(--text-secondary); margin-bottom: 2rem;">
          ${rawText}
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 1rem; border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
          <button type="button" class="btn-editorial-gold" onclick="if(window.closeModal) window.closeModal();" style="padding: 0.65rem 1.75rem; font-size: 0.82rem; cursor: pointer;">
            <span>Close Story</span>
          </button>
        </div>
      </div>
    `;

    if (typeof window.openModal === 'function') {
      window.openModal(title, contentHtml);
    } else {
      const modalOverlay = document.getElementById('globalModal');
      const modalBody = document.getElementById('modalBody');
      const modalTitle = document.getElementById('modalTitle');
      if (modalTitle) modalTitle.innerHTML = title;
      if (modalBody) modalBody.innerHTML = contentHtml;
      if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  };

  // Export functions to global scope for Editorial Desk Admin access
  
  /**
   * Dedicated Full-Fidelity Reader Modal for Real-Time News (Screenlady Updates Left Column)
   * Opens right on the Homepage without navigating to /updates
   */
  window.openHomeNewsReader = function(id) {
    let item = null;

    // 1. Look in getAllNews()
    const allNews = (typeof getAllNews === 'function') ? getAllNews() : [];
    item = allNews.find(n => n && (n.id === id || String(n.id) === String(id)));

    // 2. Look in custom news storage
    if (!item) {
      try {
        const raw = localStorage.getItem('screenlady_custom_news');
        if (raw) {
          const list = JSON.parse(raw);
          item = list.find(n => n && (n.id === id || String(n.id) === String(id)));
        }
      } catch(e) {}
    }

    // 3. Look in backend news
    if (!item && window.backendLiveNews) {
      item = window.backendLiveNews.find(n => n && (n.id === id || String(n.id) === String(id)));
    }

    // 4. Look in default news
    if (!item) {
      item = DEFAULT_LATEST_NEWS.find(n => n && (n.id === id || String(n.id) === String(id)));
    }

    // Fallback if not found
    if (!item) {
      item = {
        id: id,
        title: "Screenlady Live Dispatch",
        category: "Live News",
        categoryBadge: "Live News",
        date: "Recent Update",
        photo: "https://ik.imagekit.io/acooladescreenlady/screenlady/news/ramayana_MHoDF4dFm.jpeg",
        summary: "Latest real-time bulletin from Accolade Screenlady.",
        fullBody: "Full journalistic details for this breaking dispatch are being processed by the Accolade Screenlady newsroom."
      };
    }

    const title = item.title || item.headline || "Screenlady Live Update";
    const badge = item.categoryBadge || item.category || "Live News";
    const dateStr = item.date || item.displayDate || "Recent";
    const photoSrc = item.photo || 'https://ik.imagekit.io/acooladescreenlady/screenlady/news/ramayana_MHoDF4dFm.jpeg';

    let rawBody = item.fullBody || item.fullInfo || item.summary || item.infoSummary || "";
    if (!rawBody.includes('<p>') && !rawBody.includes('<div>')) {
      rawBody = rawBody.split(/\r?\n\s*\r?\n/).map(p => 
        `<p style="margin-bottom: 1.25rem; line-height: 1.85; font-size: 1.05rem; color: #E0DDD5;">${escapeHtml(p.trim()).replace(/\r?\n/g, '<br>')}</p>`
      ).join('');
    }

    const modalHtml = `
      <div class="home-news-reader-view" style="display: flex; flex-direction: column; font-family: var(--font-sans, sans-serif); color: var(--text-ivory-soft);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.25rem; border-bottom: 1px solid var(--gold-border); padding-bottom: 0.75rem;">
          <span class="badge-gold" style="background: rgba(197,160,89,0.12); border: 1px solid var(--gold-primary); color: var(--gold-bright); font-family: var(--font-display); font-size: 0.72rem; font-weight: 700; text-transform: uppercase; padding: 4px 12px; border-radius: var(--radius-xs); letter-spacing: 0.12em;">
            ${escapeHtml(badge)}
          </span>
          <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 500;">${escapeHtml(dateStr)}</span>
        </div>

        <div style="width: 100%; max-height: 520px; background: #080705; border-radius: var(--radius-xs); border: 1px solid var(--gold-border-bright); box-shadow: var(--shadow-modal); overflow: hidden; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; padding: 0.75rem;">
          <img src="${escapeHtml(photoSrc)}" alt="${escapeHtml(title)}" style="max-height: 490px; max-width: 100%; width: auto; height: auto; object-fit: contain; display: block; margin: 0 auto; border-radius: 2px;" />
        </div>

        <h2 style="font-family: var(--font-serif, serif); font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 500; color: var(--text-ivory); line-height: 1.25; margin: 0 0 1.25rem;">
          ${escapeHtml(title)}
        </h2>

        ${item.summary && item.summary !== title ? `
          <div style="font-family: var(--font-serif); font-size: 1.15rem; line-height: 1.6; color: var(--gold-light); font-style: italic; margin-bottom: 1.5rem; padding-left: 1.25rem; border-left: 2px solid var(--gold-primary);">
            ${escapeHtml(item.summary)}
          </div>
        ` : ''}

        <div style="font-size: 1.02rem; line-height: 1.85; color: var(--text-secondary); margin-bottom: 2rem;">
          ${rawBody}
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 1rem; border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
          <button type="button" class="btn-editorial-gold" onclick="if(window.closeModal) window.closeModal();" style="padding: 0.65rem 1.75rem; font-size: 0.82rem; cursor: pointer;">
            <span>Close Article</span>
          </button>
        </div>
      </div>
    `;

    if (typeof window.openModal === 'function') {
      window.openModal(title, modalHtml);
    } else {
      const modalOverlay = document.getElementById('globalModal');
      const modalBody = document.getElementById('modalBody');
      const modalTitle = document.getElementById('modalTitle');
      if (modalTitle) modalTitle.innerHTML = escapeHtml(title);
      if (modalBody) modalBody.innerHTML = modalHtml;
      if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  };

  window.openHomeNewsReader = window.openHomeNewsReader;
  window.getAllHomeNews = getAllNews;
  window.getAllHomePhotos = getSlideshowPhotos;
  window.renderCuratedSections = renderCuratedSections;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
