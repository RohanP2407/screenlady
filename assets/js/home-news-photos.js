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
     1. DEFAULT DATA REGISTRIES (All News & Chronicles in Strict Chronological Order)
     ========================================================================== */
  const DEFAULT_LATEST_NEWS = [
    // --- PAGE 1: LATEST NEWS (Current Dispatches) ---
    {
      id: "update-ramayana-1",
      category: "Movie Talk",
      categoryBadge: "🎬 Movie Talk",
      date: "November 15, 2026",
      title: "Ramayana Makes a Strong Mark at the Box Office! Audiences Give an Enthusiastic Response",
      summary: "Director Nitesh Tiwari’s epic spectacle with Ranbir Kapoor, Sai Pallavi, and Yash crosses ₹819.50 Cr India net in its opening week.",
      photo: "assets/images/news/ramayana.jpeg",
      link: "updates.html#update-ramayana-1"
    },
    {
      id: "update-sindhutai-1",
      category: "Tribute",
      categoryBadge: "👑 Tribute",
      date: "November 14, 2026",
      title: "Birth Anniversary of Sindhutai Sapkal, the Mother of Orphans – A Loving Shelter for Thousands of Children!",
      summary: "Remembering Padma Shri Sindhutai Sapkal ('Mai'), who overcame boundless hardships to give shelter, love, and education to thousands.",
      photo: "assets/images/news/sindhutai-sapkal.jpeg",
      link: "updates.html#update-sindhutai-1"
    },
    {
      id: "update-boxoffice-1",
      category: "Entertainment",
      categoryBadge: "🍿 Entertainment",
      date: "November 13, 2026",
      title: "A Treat for Movie Lovers! Big-Budget Films Set to Hit the Box Office in the Second Half of November",
      summary: "Exciting box-office clashes slated for November 20 & 27 starring Amitabh Bachchan, Jackie Shroff, Ayushmann Khurrana, Sharvari, and Rashmika Mandanna.",
      photo: "assets/images/news/films-box-office.jpeg",
      link: "updates.html#update-boxoffice-1"
    },
    {
      id: "update-jalsa-threat-1",
      category: "City Alert",
      categoryBadge: "🚨 City Alert",
      date: "November 12, 2026",
      title: "Bomb Threat Once Again Targets Amitabh Bachchan’s Jalsa Bungalow; Security Agencies on High Alert in Mumbai!",
      summary: "Mumbai Police and security agencies reinforce round-the-clock surveillance around Jalsa and key transit nodes following a fresh email threat.",
      photo: "assets/images/news/amitabh-bachchan.jpeg",
      link: "updates.html#update-jalsa-threat-1"
    },

    // --- PAGE 2: PREVIOUS NEWS (Earlier Chronicles) ---
    {
      id: "update-meeting-1",
      category: "Meetings",
      categoryBadge: "🤝 Meetings",
      date: "November 6, 2026",
      title: "Executive Editorial & Publishing Board Meeting Led by Founder Mr. Prashant Sagvekar",
      summary: "Strategic conclave on statewide print circulation, reader outreach across Maharashtra, and upcoming commissions.",
      photo: "assets/images/team/prashant-sagvekar.jpeg",
      link: "updates.html#update-meeting-1"
    },
    {
      id: "update-awards-1",
      category: "Awards",
      categoryBadge: "🏆 Awards",
      date: "November 4, 2026",
      title: "Accolade Screenlady 'Women of Distinction' Annual Honors Announced",
      summary: "Official guidelines and jury nominations unveiled honoring courage, leadership, and grassroots impact across 12 categories.",
      photo: "assets/images/magazine-photos/4.2.jpg",
      link: "updates.html#update-awards-1"
    },
    {
      id: "update-movietalk-1",
      category: "Movie Talk",
      categoryBadge: "🎬 Movie Talk",
      date: "November 1, 2026",
      title: "Cinema Exclusive: Behind-the-Scenes Photo Session & Dialogue with Actresses",
      summary: "Candid discussions on authentic acting journeys and women-led storytelling in contemporary Marathi cinema.",
      photo: "assets/images/magazine-photos/3.1.jpg",
      link: "updates.html#update-movietalk-1"
    },
    {
      id: "update-meetgreet-1",
      category: "Meet & Greet",
      categoryBadge: "👥 Meet & Greet",
      date: "October 28, 2026",
      title: "Screenlady Reader & Women Entrepreneurs Meet & Greet Conclave in Pune",
      summary: "Interactive dialogue at JW Marriott on enterprise resilience, small-business growth, and women's self-reliance.",
      photo: "assets/images/magazine-photos/4.1.jpg",
      link: "updates.html#update-meetgreet-1"
    },

    // --- PAGE 3: OLDER ARCHIVES ---
    {
      id: "update-events-1",
      category: "Events",
      categoryBadge: "🌟 Events",
      date: "October 20, 2026",
      title: "Official Launch of Tantuh Handcrafted Jewellery Strategic Brand Partnership",
      summary: "Grand celebration of indigenous artisanal craftsmanship and luxury publishing partnership at The St. Regis.",
      photo: "assets/images/articles/article-1.jpg",
      link: "updates.html#update-events-1"
    },
    {
      id: "update-bodyshaming-1",
      category: "Special Report",
      categoryBadge: "✒️ Special Report",
      date: "October 12, 2026",
      title: "Body Shaming and Women: A Mindset Needing Urgent Change — Special Investigation",
      summary: "An in-depth investigative feature addressing toxic aesthetic standards and reclaiming dignity and self-worth.",
      photo: "assets/images/articles/article-2.jpg",
      link: "editorials.html#editorial-bodyshaming-1"
    },
    {
      id: "update-literature-1",
      category: "Culture",
      categoryBadge: "📚 Culture",
      date: "October 5, 2026",
      title: "Women in Marathi Literature: Voices of Courage, Reform & Poetic Expression",
      summary: "A tribute to pioneering female Marathi authors who shaped feminist literary traditions and social reform.",
      photo: "assets/images/magazine-photos/2.1.jpg",
      link: "updates.html#update-literature-1"
    },
    {
      id: "update-convention-1",
      category: "Summits",
      categoryBadge: "🏛️ Summits",
      date: "September 28, 2026",
      title: "Maharashtra Women Cultural Guild Annual Convention Convenes in Mumbai",
      summary: "Over 500 women leaders, artists, and educators deliberate on grassroots cultural preservation and media.",
      photo: "assets/images/magazine-photos/1.1.jpg",
      link: "updates.html#update-convention-1"
    }
  ];

  const DEFAULT_SLIDESHOW_PHOTOS = [
    {
      id: "photo-ramayana-1",
      category: "Cinema & Box Office",
      badge: "🎬 Blockbuster News",
      title: "Ramayana: Rise of a Legend — Monumental Box Office Triumph",
      location: "Nationwide Theatres, India",
      date: "November 15, 2026",
      photo: "assets/images/news/ramayana.jpeg",
      link: "updates.html#update-ramayana-1"
    },
    {
      id: "photo-sindhutai-1",
      category: "Tribute & Inspiration",
      badge: "👑 Mother of Orphans",
      title: "Birth Anniversary of Padma Shri Sindhutai Sapkal ('Mai')",
      location: "Navi Mumbai, Maharashtra",
      date: "November 14, 2026",
      photo: "assets/images/news/sindhutai-sapkal.jpeg",
      link: "updates.html#update-sindhutai-1"
    },
    {
      id: "photo-boxoffice-1",
      category: "Cinema & Entertainment",
      badge: "🍿 November Clashes",
      title: "Big-Budget Films Set to Hit Box Office in Late November",
      location: "Bollywood Bureau, Mumbai",
      date: "November 13, 2026",
      photo: "assets/images/news/films-box-office.jpeg",
      link: "updates.html#update-boxoffice-1"
    },
    {
      id: "photo-jalsa-1",
      category: "City & National Dispatch",
      badge: "🚨 Mumbai Alert",
      title: "High Alert Around Amitabh Bachchan's Jalsa Residence",
      location: "Juhu, Mumbai",
      date: "November 12, 2026",
      photo: "assets/images/news/amitabh-bachchan.jpeg",
      link: "updates.html#update-jalsa-threat-1"
    },
    {
      id: "photo-tantuh-1",
      category: "Heritage & Craftsmanship",
      badge: "🏛️ Heritage",
      title: "Tantuh: Celebrating Indian Heritage Through Handcrafted Jewellery",
      location: "Screenlady Studios, Mumbai",
      date: "October 15, 2026",
      photo: "assets/images/articles/article-1.jpg",
      link: "photos.html#photo-tantuh-1"
    },
    {
      id: "photo-cinema-1",
      category: "Cinema & Studio",
      badge: "🎬 Cinema & Studio",
      title: "Exclusive Studio Photo Session with Marathi Film Actresses",
      location: "Film City Studios, Mumbai",
      date: "November 1, 2026",
      photo: "assets/images/magazine-photos/3.1.jpg",
      link: "photos.html#photo-cinema-1"
    },
    {
      id: "photo-meetgreet-1",
      category: "Meet & Greet",
      badge: "👥 Meet & Greet",
      title: "Screenlady Reader & Women Entrepreneurs Conclave in Pune",
      location: "JW Marriott, Pune",
      date: "October 28, 2026",
      photo: "assets/images/magazine-photos/4.1.jpg",
      link: "photos.html#photo-meetgreet-1"
    },
    {
      id: "photo-awards-1",
      category: "Awards & Honors",
      badge: "🏆 Annual Honors",
      title: "Accolade Screenlady Women of Distinction Honors Announced",
      location: "Cultural Foundation, Mumbai",
      date: "November 4, 2026",
      photo: "assets/images/magazine-photos/4.2.jpg",
      link: "photos.html#photo-awards-1"
    },
    {
      id: "photo-bodyshaming-1",
      category: "Social Commentary",
      badge: "✒️ Special Investigation",
      title: "Body Shaming and Women: A Mindset Needing Urgent Change",
      location: "Screenlady Editorial Bureau, Mumbai",
      date: "November 5, 2026",
      photo: "assets/images/articles/article-2.jpg",
      link: "photos.html#photo-bodyshaming-1"
    },
    {
      id: "photo-board-1",
      category: "Executive Leadership",
      badge: "👑 Leadership Board",
      title: "Executive Editorial & Publishing Board Meeting Led by Founder Mr. Prashant Sagvekar",
      location: "Publishing Headquarters, Mumbai",
      date: "November 6, 2026",
      photo: "assets/images/team/prashant-sagvekar.jpeg",
      link: "updates.html#update-meeting-1"
    }
  ];

  /* ==========================================================================
     2. RETRIEVE ALL SORTED NEWS (Only News Displays on Homepage Screenlady Updates)
     ========================================================================== */
  function getAllNews() {
    try {
      const deletedIds = (typeof window.getScreenladyDeletedIds === 'function') 
        ? window.getScreenladyDeletedIds() 
        : (() => { try { const r = localStorage.getItem('screenlady_deleted_ids'); return r ? JSON.parse(r) : []; } catch(e){ return []; } })();

      // Dedicated homepage live news from Editorial Desk
      let customNews = [];
      const rawNews = localStorage.getItem('screenlady_custom_news');
      if (rawNews) {
        customNews = JSON.parse(rawNews);
      }

      // Also support news posted via updates marked as type 'news'
      const rawUpdates = localStorage.getItem('screenlady_custom_updates');
      if (rawUpdates) {
        try {
          const parsed = JSON.parse(rawUpdates);
          const taggedNews = parsed.filter(u => u && (u.type === 'news' || u.isHomepageNews));
          for (const item of taggedNews) {
            if (!customNews.some(n => n.id === item.id)) {
              customNews.push(item);
            }
          }
        } catch(e) {}
      }

      // Combine custom news and default news (Filtered by deletedIds)
      const combined = [...customNews, ...DEFAULT_LATEST_NEWS].filter(item => item && !deletedIds.includes(item.id));

      // Strictly sort descending by date / timestamp
      combined.sort((a, b) => {
        const dateA = new Date(a.date || a.displayDate || 0).getTime() || a.timestamp || 0;
        const dateB = new Date(b.date || b.displayDate || 0).getTime() || b.timestamp || 0;
        return dateB - dateA;
      });

      return combined.map(item => ({
        id: item.id,
        category: item.category || 'Updates',
        categoryBadge: item.categoryBadge || (item.category ? `✦ ${item.category}` : '✦ News'),
        date: item.displayDate || item.date || 'Recent',
        title: item.title || item.headline || 'Screenlady Update',
        summary: item.summary || item.infoSummary || 'Latest dispatch from Accolade Screenlady leadership and editorial council.',
        photo: item.photo || 'assets/images/news/ramayana.jpeg',
        link: item.link || `updates.html#${item.id}`
      }));
    } catch (e) {
      console.warn('Error loading news list:', e);
      return DEFAULT_LATEST_NEWS;
    }
  }

  /* ==========================================================================
     3. RETRIEVE CURATED HOMEPAGE SLIDESHOW PHOTOS (Independent from Photos Section)
     ========================================================================== */
  function getSlideshowPhotos() {
    try {
      const deletedIds = (typeof window.getScreenladyDeletedIds === 'function') 
        ? window.getScreenladyDeletedIds() 
        : (() => { try { const r = localStorage.getItem('screenlady_deleted_ids'); return r ? JSON.parse(r) : []; } catch(e){ return []; } })();

      // Dedicated Homepage Photos from Editorial Desk
      let customHomePhotos = [];
      const rawHomePhotos = localStorage.getItem('screenlady_custom_home_photos');
      if (rawHomePhotos) {
        customHomePhotos = JSON.parse(rawHomePhotos);
      }

      const combined = [...customHomePhotos, ...DEFAULT_SLIDESHOW_PHOTOS].filter(item => item && !deletedIds.includes(item.id));

      // Dedup by photo src
      const seen = new Set();
      const deduped = [];
      for (const p of combined) {
        if (!p.photo) continue;
        if (!seen.has(p.photo)) {
          seen.add(p.photo);
          deduped.push({
            id: p.id || 'photo-' + deduped.length,
            category: p.category || 'Gallery',
            badge: p.badge || `✦ ${p.category || 'Featured'}`,
            title: p.title || p.caption || 'Accolade Screenlady Photograph',
            location: p.venue || p.location || 'Mumbai, India',
            date: p.displayDate || p.date || '2026',
            photo: p.photo,
            link: p.link || `photos.html#${p.id || ''}`
          });
        }
      }

      return deduped.length > 0 ? deduped.slice(0, 12) : DEFAULT_SLIDESHOW_PHOTOS;
    } catch (e) {
      console.warn('Error loading slideshow photos:', e);
      return DEFAULT_SLIDESHOW_PHOTOS;
    }
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
        <a href="${item.link}" class="home-news-h-card ${isActive}" data-page-idx="${index}" data-photo="${item.photo}" id="homeNewsCard-${index}" title="${item.title}">
          <div class="home-news-h-thumb-wrap">
            <img src="${item.photo}" alt="${item.title}" class="home-news-h-thumb" loading="lazy">
            <div class="home-news-h-badge-overlay">${overallIndex}</div>
          </div>
          <div class="home-news-h-content">
            <div class="home-news-h-meta">
              <span class="home-news-h-cat">${item.categoryBadge || item.category}</span>
              <span class="home-news-h-date">📅 ${item.date}</span>
            </div>
            <h3 class="home-news-h-title">${item.title}</h3>
            <p class="home-news-h-desc">${item.summary}</p>
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
        syncSlideshowWithNewsPhoto(pageItems[idx]);
      });
      card.addEventListener('mouseleave', () => {
        newsIsPaused = false;
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

        // Also sync slideshow
        const cards = document.querySelectorAll('.home-news-h-card');
        if (cards[activeNewsCardIndex]) {
          const photoUrl = cards[activeNewsCardIndex].getAttribute('data-photo');
          if (photoUrl) syncSlideshowWithPhotoUrl(photoUrl);
        }
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
    const dotsContainer = document.getElementById('homePhotoDots');
    const theaterWrap = document.getElementById('homePhotoSlideshowWrap');
    if (!stage || !dotsContainer || !theaterWrap) return;

    activePhotosList = getSlideshowPhotos();
    if (activePhotosList.length === 0) return;

    // Render Slides
    stage.innerHTML = activePhotosList.map((item, index) => {
      const isActive = index === 0 ? 'active' : '';
      return `
        <a href="${item.link || 'photos.html'}" class="home-photo-slide ${isActive}" data-slide-index="${index}" id="homePhotoSlide-${index}" title="${item.title}">
          <img src="${item.photo}" alt="${item.title}" class="home-photo-slide-img" loading="lazy">
          <div class="home-photo-slide-kicker">${item.badge || item.category}</div>
          <div class="home-photo-caption-bar">
            <h3 class="home-photo-caption-title">${item.title}</h3>
            <div class="home-photo-caption-meta">
              <span>📍 ${item.location}</span>
              <span>•</span>
              <span>📅 ${item.date}</span>
            </div>
          </div>
        </a>
      `;
    }).join('');

    // Render Dots
    dotsContainer.innerHTML = activePhotosList.map((_, index) => {
      const isActive = index === 0 ? 'active' : '';
      return `<button type="button" class="home-photo-dot ${isActive}" data-dot-index="${index}" aria-label="Go to slide ${index + 1}"></button>`;
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

    // Dot Clicks
    const dots = dotsContainer.querySelectorAll('.home-photo-dot');
    dots.forEach((dot, idx) => {
      dot.onclick = () => changePhotoSlide(idx);
    });

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
    const dots = document.querySelectorAll('.home-photo-dot');

    slides.forEach((slide, i) => {
      if (i === currentPhotoIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, i) => {
      if (i === currentPhotoIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function syncSlideshowWithNewsPhoto(newsItem) {
    if (!newsItem || !newsItem.photo) return;
    syncSlideshowWithPhotoUrl(newsItem.photo);
  }

  function syncSlideshowWithPhotoUrl(photoUrl) {
    if (!activePhotosList || activePhotosList.length === 0) return;
    const matchIdx = activePhotosList.findIndex(p => p.photo === photoUrl);
    if (matchIdx !== -1 && matchIdx !== currentPhotoIndex) {
      changePhotoSlide(matchIdx);
    }
  }

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
  function init() {
    renderNewsPage(1);
    renderPhotoSlideshow();
    renderCuratedSections();

    // Re-render when Editorial Desk publishes or modifies news, updates, fashion, or home photos
    window.addEventListener('storage', (e) => {
      if (e.key === 'screenlady_custom_news' || e.key === 'screenlady_custom_updates' || e.key === 'screenlady_custom_fashion' || e.key === 'screenlady_last_updated') {
        renderNewsPage(currentNewsPage);
        renderCuratedSections();
      }
      if (e.key === 'screenlady_custom_home_photos') {
        renderPhotoSlideshow();
      }
    });

    // Also re-render immediately when the user switches tabs back to the homepage
    window.addEventListener('focus', () => {
      renderCuratedSections();
      renderNewsPage(currentNewsPage);
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

    let updates = [];
    if (typeof window.getAllUpdates === 'function') {
      try {
        updates = window.getAllUpdates();
      } catch (e) {
        updates = [];
      }
    } else {
      try {
        const raw = localStorage.getItem('screenlady_custom_updates');
        if (raw) updates = JSON.parse(raw);
      } catch (e) {
        updates = [];
      }
    }

    let customFashion = [];
    try {
      const rawF = localStorage.getItem('screenlady_custom_fashion');
      if (rawF) customFashion = JSON.parse(rawF);
    } catch (e) {
      customFashion = [];
    }

    const allPool = [...customFashion, ...updates, ...getAllNews()];

    // 1. Filmy Adda: 4 items related to cinema, movies, Bollywood, film
    if (filmyGrid) {
      const filmyItems = allPool.filter(item => {
        if (item.curatedSection) return item.curatedSection === 'filmy_adda';
        const cat = (item.category || '').toLowerCase();
        const title = (item.title || item.headline || '').toLowerCase();
        const tags = (item.tags || []).join(' ').toLowerCase();
        return cat.includes('film') || cat.includes('movie') || cat.includes('cinema') || cat.includes('box office') ||
               tags.includes('film') || tags.includes('movie') || tags.includes('cinema') || tags.includes('bollywood') ||
               title.includes('ramayana') || title.includes('box office') || title.includes('jalsa');
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

      const defaultFilmSeeds = [
        { id: "update-ramayana-1", categoryBadge: "🎬 Box Office", title: "Ramayana: Rise of a Legend", photo: "assets/images/news/ramayana.jpeg" },
        { id: "update-boxoffice-1", categoryBadge: "🍿 Cinema", title: "November Box Office Battles", photo: "assets/images/news/films-box-office.jpeg" },
        { id: "update-movietalk-1", categoryBadge: "🎥 Behind The Screen", title: "Behind-the-Scenes Photo Session", photo: "assets/images/magazine-photos/3.1.jpg" },
        { id: "update-jalsa-threat-1", categoryBadge: "🚨 Industry Alert", title: "Amitabh Bachchan Jalsa Alert", photo: "assets/images/news/amitabh-bachchan.jpeg" }
      ];
      for (const seed of defaultFilmSeeds) {
        if (uniqueFilmy.length >= 4) break;
        if (!seen.has(seed.id)) {
          seen.add(seed.id);
          uniqueFilmy.push(seed);
        }
      }

      filmyGrid.innerHTML = uniqueFilmy.slice(0, 4).map(item => `
        <div class="curated-photo-card" onclick="if(window.openUpdateModal) window.openUpdateModal('${item.id}'); else window.location.href='updates.html#${item.id}';" title="${item.title || item.headline}">
          <img src="${item.photo}" alt="${item.title || item.headline || 'Film Photo'}" loading="lazy">
          <div class="curated-photo-overlay">
            <span class="curated-photo-badge">${item.categoryBadge || item.category || '🎬 Cinema'}</span>
            <div>
              <h4 class="curated-photo-title">${item.title || item.headline}</h4>
              <div class="curated-photo-action">
                <span>Read Story in Updates</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    // 2. Bizz World: 4 items related to business, corporate, leadership, startups
    if (bizzGrid) {
      const bizzItems = allPool.filter(item => {
        if (item.curatedSection) return item.curatedSection === 'bizz_world';
        const cat = (item.category || '').toLowerCase();
        const title = (item.title || item.headline || '').toLowerCase();
        const tags = (item.tags || []).join(' ').toLowerCase();
        return cat.includes('bizz') || cat.includes('business') || cat.includes('meeting') || cat.includes('enterprise') || cat.includes('corporate') ||
               tags.includes('business') || tags.includes('meeting') || tags.includes('enterprise') || tags.includes('leadership') || tags.includes('entrepreneur') ||
               title.includes('meeting') || title.includes('entrepreneur') || title.includes('leadership') || title.includes('partner');
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

      const defaultBizzSeeds = [
        { id: "update-meeting-1", categoryBadge: "💼 Leadership", title: "Executive Publishing Conclave", photo: "assets/images/team/prashant-sagvekar.jpeg" },
        { id: "update-meetgreet-1", categoryBadge: "🤝 Entrepreneurs", title: "Women Entrepreneurs Conclave", photo: "assets/images/magazine-photos/4.1.jpg" },
        { id: "update-events-1", categoryBadge: "✨ Brand Partnership", title: "Tantuh Jewellery Partnership", photo: "assets/images/articles/article-1.jpg" },
        { id: "update-awards-1", categoryBadge: "🏆 Corporate Honors", title: "Women of Distinction Honors", photo: "assets/images/magazine-photos/4.2.jpg" }
      ];
      for (const seed of defaultBizzSeeds) {
        if (uniqueBizz.length >= 4) break;
        if (!seen.has(seed.id)) {
          seen.add(seed.id);
          uniqueBizz.push(seed);
        }
      }

      bizzGrid.innerHTML = uniqueBizz.slice(0, 4).map(item => `
        <div class="curated-photo-card" onclick="if(window.openUpdateModal) window.openUpdateModal('${item.id}'); else window.location.href='updates.html#${item.id}';" title="${item.title || item.headline}">
          <img src="${item.photo}" alt="${item.title || item.headline || 'Business Photo'}" loading="lazy">
          <div class="curated-photo-overlay">
            <span class="curated-photo-badge">${item.categoryBadge || item.category || '💼 Business'}</span>
            <div>
              <h4 class="curated-photo-title">${item.title || item.headline}</h4>
              <div class="curated-photo-action">
                <span>Read Story in Updates</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    // 3. Women of Inspiration: 4 struggle to success items
    if (inspireGrid) {
      const inspireItems = allPool.filter(item => {
        if (item.curatedSection) return item.curatedSection === 'women_inspiration';
        const cat = (item.category || '').toLowerCase();
        const title = (item.title || item.headline || '').toLowerCase();
        const tags = (item.tags || []).join(' ').toLowerCase();
        return cat.includes('inspiration') || cat.includes('struggle') || cat.includes('tribute') || cat.includes('award') ||
               tags.includes('inspiration') || tags.includes('struggle') || tags.includes('sindhutai') || tags.includes('mai') ||
               title.includes('sindhutai') || title.includes('distinction') || title.includes('tribute');
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

      const defaultInspireSeeds = [
        { id: "update-sindhutai-1", categoryBadge: "👑 Mai — Mother of Orphans", title: "Birth Anniversary of Sindhutai Sapkal", summary: "A loving shelter and maternal care for thousands of orphaned children across Maharashtra.", photo: "assets/images/news/sindhutai-sapkal.jpeg" },
        { id: "update-awards-1", categoryBadge: "🏆 Annual Honors", title: "Accolade Screenlady Distinction Honors", summary: "Official nomination platform celebrating trailblazers in healthcare, aviation, and reforms.", photo: "assets/images/magazine-photos/4.2.jpg" },
        { id: "update-meetgreet-1", categoryBadge: "💡 Self-Reliance", title: "Grassroots Women Building Enterprises", summary: "Women entrepreneurs sharing memoirs of overcoming hardship to build self-sustaining businesses.", photo: "assets/images/magazine-photos/4.1.jpg" },
        { id: "update-meeting-1", categoryBadge: "🖋️ Editorial Vision", title: "The Unyielding Voice of Resilience", summary: "Founder Mr. Prashant Sagvekar’s vision to bring women's triumphs into the statewide spotlight.", photo: "assets/images/team/prashant-sagvekar.jpeg" }
      ];
      for (const seed of defaultInspireSeeds) {
        if (uniqueInspire.length >= 4) break;
        if (!seen.has(seed.id)) {
          seen.add(seed.id);
          uniqueInspire.push(seed);
        }
      }

      inspireGrid.innerHTML = uniqueInspire.slice(0, 4).map(item => {
        const honoreeName = item.womanName || item.title || item.headline || 'Honoree Profile';
        return `
        <div class="curated-showcase-card" onclick="if(window.openUpdateModal) window.openUpdateModal('${item.id}'); else window.location.href='updates.html#${item.id}';" title="${honoreeName}">
          <div class="curated-showcase-img-wrap">
            <img src="${item.photo}" alt="${honoreeName}" class="curated-showcase-img" loading="lazy">
          </div>
          <div class="curated-showcase-minimal-footer">
            <h3 class="curated-showcase-name">${honoreeName}</h3>
          </div>
        </div>
      `;
      }).join('');
    }

    // 4. Fashion and Lifestyle: 4 couture, jewellery & lifestyle items
    if (fashionGrid) {
      const fashionItems = allPool.filter(item => {
        if (!item) return false;
        if (item.curatedSection) return item.curatedSection === 'fashion_lifestyle';
        const cat = (item.category || '').toLowerCase();
        const title = (item.title || item.headline || '').toLowerCase();
        const tags = (item.tags || []).join(' ').toLowerCase();
        return cat.includes('fashion') || cat.includes('lifestyle') || cat.includes('jewellery') || cat.includes('couture') ||
               tags.includes('fashion') || tags.includes('lifestyle') || tags.includes('jewellery') || tags.includes('beauty') ||
               title.includes('fashion') || title.includes('jewellery') || title.includes('tantuh');
      });

      // Custom user-published items from Editorial Desk ALWAYS take precedence over default seeds
      fashionItems.sort((a, b) => {
        const aIsCustom = a.isCustom || (a.id && (a.id.startsWith('curated-') || a.id.includes('-custom-')));
        const bIsCustom = b.isCustom || (b.id && (b.id.startsWith('curated-') || b.id.includes('-custom-')));
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

      const defaultFashionSeeds = [
        { id: "update-events-1", categoryBadge: "💎 Heritage Jewellery", title: "Tantuh Artisanal Handcrafted Jewellery", summary: "Celebrating indigenous craftsmanship, contemporary brass couture, and bridal adornment.", photo: "assets/images/articles/article-1.jpg" },
        { id: "fashion-spread-1", categoryBadge: "👗 High Fashion Spread", title: "Contemporary Silhouettes & Ethnic Grace", summary: "Exclusive designer wear and high-gloss fashion spreads from our published magazine pages.", photo: "assets/images/magazine-photos/5.1.jpg" },
        { id: "fashion-jewel-2", categoryBadge: "✨ Royal Adornments", title: "Timeless Jewellery for the Modern Era", summary: "Intricate patterns and festive adornments that highlight the timeless beauty of Indian traditions.", photo: "assets/images/magazine-photos/5.2.jpg" },
        { id: "fashion-well-3", categoryBadge: "🌿 Wellness & Living", title: "Holistic Wellness & Modern Balance", summary: "Navigating lifestyle, mental well-being, financial independence, and personal growth.", photo: "assets/images/magazine-photos/5.3.jpg" }
      ];
      for (const seed of defaultFashionSeeds) {
        if (uniqueFashion.length >= 4) break;
        if (!seen.has(seed.id)) {
          seen.add(seed.id);
          uniqueFashion.push(seed);
        }
      }

      fashionGrid.innerHTML = uniqueFashion.slice(0, 4).map(item => {
        const lineDesc = item.title || item.headline || 'Fashion & Lifestyle';
        const safeDesc = escapeHtml(lineDesc);
        return `
        <div class="curated-showcase-card" onclick="if(window.openUpdateModal) window.openUpdateModal('${item.id}'); else window.location.href='updates.html#${item.id}';" title="${safeDesc}">
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

  // Export functions to global scope for Editorial Desk Admin access
  window.getAllHomeNews = getAllNews;
  window.getAllHomePhotos = getSlideshowPhotos;
  window.renderCuratedSections = renderCuratedSections;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
