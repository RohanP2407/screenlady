/**
 * ACCOLADE SCREENLADY - PURE MAGAZINE COVER SLIDESHOW & TIMELINE
 * Dynamically loaded from Cloudflare D1 Database via ScreenladyAPI
 * Each cover photo displays for exactly 5 seconds, followed by smooth transition to the next.
 */

(function () {
  'use strict';

  const DURATION = 5000; // Exactly 5 seconds per photo
  const TICK_INTERVAL = 30; // 30ms timer tick for ultra-smooth progress animation

  let currentIndex = 0;
  let timer = null;
  let elapsed = 0;
  let isHovered = false;
  let slides = [];
  let steps = [];

  function showSlide(index) {
    const total = slides.length;
    if (total === 0) return;

    if (index < 0) index = total - 1;
    if (index >= total) index = 0;

    currentIndex = index;

    // Update Slides
    slides.forEach((slide, i) => {
      if (i === currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update Timeline Steps
    steps.forEach((step, i) => {
      const fill = step.querySelector('.pure-step-fill');
      if (i === currentIndex) {
        step.classList.add('active');
        if (fill) fill.style.width = '0%';
      } else {
        step.classList.remove('active');
        if (fill) fill.style.width = i < currentIndex ? '100%' : '0%';
      }
    });

    // Reset 5-second countdown
    elapsed = 0;
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  function startTimer() {
    if (timer) clearInterval(timer);
    elapsed = 0;

    timer = setInterval(() => {
      if (isHovered) return; // Pause while hovering

      elapsed += TICK_INTERVAL;
      const progressPercent = Math.min((elapsed / DURATION) * 100, 100);

      const activeStep = steps[currentIndex];
      if (activeStep) {
        const fill = activeStep.querySelector('.pure-step-fill');
        if (fill) fill.style.width = `${progressPercent}%`;
      }

      if (elapsed >= DURATION) {
        nextSlide();
      }
    }, TICK_INTERVAL);
  }

  function setupControls(theater) {
    const prevBtn = document.getElementById('slidePrevBtn');
    const nextBtn = document.getElementById('slideNextBtn');

    if (prevBtn) {
      prevBtn.onclick = (e) => {
        e.stopPropagation();
        prevSlide();
      };
    }

    if (nextBtn) {
      nextBtn.onclick = (e) => {
        e.stopPropagation();
        nextSlide();
      };
    }

    theater.onmouseenter = () => { isHovered = true; };
    theater.onmouseleave = () => { isHovered = false; };

    // Mobile touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    theater.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    theater.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX - 40) {
        nextSlide();
      } else if (touchEndX > touchStartX + 40) {
        prevSlide();
      }
    }, { passive: true });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      else if (e.key === 'ArrowRight') nextSlide();
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderSlideshow(availableIssues) {
    const stage = document.getElementById('slidesStage');
    const theater = document.getElementById('slideshowTheater');
    const timelineTrack = document.getElementById('timelineTrack') || document.querySelector('.pure-timeline-track');

    if (!stage || !theater) return;

    if (!Array.isArray(availableIssues) || availableIssues.length === 0) {
      stage.innerHTML = `
        <div class="pure-slide active" data-index="0" style="display:flex;align-items:center;justify-content:center;height:100%;min-height:360px;background:#0d0c0a;text-align:center;padding:2rem;">
          <div>
            <div style="font-family:var(--font-serif,'Cinzel',serif);color:var(--gold-bright,#FFE894);font-size:1.15rem;font-weight:600;margin-bottom:0.4rem;letter-spacing:0.04em;">Magazine Edition Showcase</div>
            <p style="color:var(--text-muted,#A3A09A);font-size:0.85rem;max-width:280px;margin:0 auto;line-height:1.5;">Monthly magazine editions updated from the Admin Desk will appear here.</p>
          </div>
        </div>
      `;
      if (timelineTrack) timelineTrack.innerHTML = '';
      return;
    }

    // 1. Render Slides
    stage.innerHTML = availableIssues.map((issue, i) => {
      const coverUrl = issue.photo || issue.cover || issue.image || '';
      const title = issue.title || issue.monthYear || 'Screenlady Magazine Cover';
      return `
        <div class="pure-slide ${i === 0 ? 'active' : ''}" data-index="${i}" onclick="if(window.openMagazineOrderModal) window.openMagazineOrderModal('${escapeHtml(title)}');" style="cursor: pointer;" title="Click to view & order ${escapeHtml(title)}">
          <div class="pure-cover-frame">
            <img src="${escapeHtml(coverUrl)}" alt="${escapeHtml(title)}" class="pure-cover-image" />
          </div>
        </div>
      `;
    }).join('');

    // 2. Render Timeline Steps
    if (timelineTrack) {
      timelineTrack.innerHTML = availableIssues.map((issue, i) => {
        const fullLabel = issue.monthYear || (issue.title ? issue.title.split('—')[0].trim().split(' ')[0] : `Issue ${i + 1}`);
        const shortLabel = fullLabel.length > 4 ? fullLabel.substring(0, 3) : fullLabel;
        return `
          <button type="button" class="pure-timeline-step ${i === 0 ? 'active' : ''}" data-index="${i}" title="${escapeHtml(issue.title || '')}">
            <div class="pure-step-indicator">
              <span class="pure-step-dot"></span>
              <span class="pure-step-bar"><span class="pure-step-fill"></span></span>
            </div>
            <span class="pure-step-label">
              <span class="label-desktop">${escapeHtml(fullLabel)}</span>
              <span class="label-mobile">${escapeHtml(shortLabel)}</span>
            </span>
          </button>
        `;
      }).join('');
    }

    slides = Array.from(stage.querySelectorAll('.pure-slide'));
    steps = timelineTrack ? Array.from(timelineTrack.querySelectorAll('.pure-timeline-step')) : [];

    steps.forEach((step, idx) => {
      step.onclick = () => showSlide(idx);
    });

    setupControls(theater);
    showSlide(0);
    startTimer();
  }

  async function loadMagazineCovers() {
    let covers = [];

    // 1. Custom magazine covers from Admin Desk in localStorage
    try {
      const raw = localStorage.getItem('screenlady_custom_magazine_covers');
      if (raw) covers = JSON.parse(raw);
    } catch (e) { covers = []; }

    // 2. Fetch live magazine covers from Cloudflare D1 magazine_covers table
    try {
      if (window.ScreenladyAPI && typeof window.ScreenladyAPI.getMagazineCovers === 'function') {
        const backendCovers = await window.ScreenladyAPI.getMagazineCovers();
        if (backendCovers && Array.isArray(backendCovers) && backendCovers.length > 0) {
          const seen = new Set(covers.map(c => c.id));
          backendCovers.forEach(bc => {
            if (!seen.has(bc.id)) {
              seen.add(bc.id);
              covers.push(bc);
            }
          });
        }
      }
    } catch (e) {
      console.warn('[Home Slider] Notice fetching magazine covers from backend:', e.message);
    }

    // 3. Fallback to magazine_settings.availableIssues if magazine_covers table is empty
    if (covers.length === 0) {
      try {
        if (window.ScreenladyAPI && typeof window.ScreenladyAPI.getMagazineSettings === 'function') {
          const magSettings = await window.ScreenladyAPI.getMagazineSettings();
          if (magSettings && Array.isArray(magSettings.availableIssues) && magSettings.availableIssues.length > 0) {
            covers = magSettings.availableIssues;
          }
        }
      } catch (e) {}
    }

    // Filter deleted IDs
    const deletedIds = (typeof window.getScreenladyDeletedIds === 'function')
      ? window.getScreenladyDeletedIds()
      : (() => { try { const r = localStorage.getItem('screenlady_deleted_ids'); return r ? JSON.parse(r) : []; } catch(e){ return []; } })();

    covers = covers.filter(c => c && (c.photo || c.cover || c.image) && !deletedIds.includes(c.id));

    // Sort: Latest first
    covers.sort((a, b) => {
      const timeA = Number(a.timestamp) || new Date(a.date || 0).getTime() || 0;
      const timeB = Number(b.timestamp) || new Date(b.date || 0).getTime() || 0;
      return timeB - timeA;
    });

    renderSlideshow(covers);
  }

  // Listen for Admin publishing events in real-time
  window.addEventListener('storage', (e) => {
    if (e.key === 'screenlady_custom_magazine_covers' || e.key === 'screenlady_magazine_settings' || e.key === 'screenlady_last_updated') {
      loadMagazineCovers();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadMagazineCovers);
  } else {
    loadMagazineCovers();
  }
})();
