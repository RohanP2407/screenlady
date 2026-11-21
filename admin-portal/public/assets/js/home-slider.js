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

  function renderSlideshow(availableIssues) {
    const stage = document.getElementById('slidesStage');
    const theater = document.getElementById('slideshowTheater');
    const timelineTrack = document.getElementById('timelineTrack') || document.querySelector('.pure-timeline-track');

    if (!stage || !theater || !Array.isArray(availableIssues) || availableIssues.length === 0) return;

    // 1. Render Slides
    stage.innerHTML = availableIssues.map((issue, i) => `
      <div class="pure-slide ${i === 0 ? 'active' : ''}" data-index="${i}">
        <div class="pure-cover-frame">
          <img src="${issue.cover}" alt="${issue.title || 'Screenlady Magazine Cover'}" class="pure-cover-image" />
        </div>
      </div>
    `).join('');

    // 2. Render Timeline Steps
    if (timelineTrack) {
      timelineTrack.innerHTML = availableIssues.map((issue, i) => {
        const monthMatch = (issue.title || '').match(/^(January|February|March|April|May|June|July|August|September|October|November|December)/i);
        const fullLabel = monthMatch ? monthMatch[1] : (issue.title ? issue.title.split(' ')[0] : `Issue ${i + 1}`);
        const shortLabel = fullLabel.length > 4 ? fullLabel.substring(0, 3) : fullLabel;
        return `
          <button type="button" class="pure-timeline-step ${i === 0 ? 'active' : ''}" data-index="${i}" title="${issue.title || ''}">
            <div class="pure-step-indicator">
              <span class="pure-step-dot"></span>
              <span class="pure-step-bar"><span class="pure-step-fill"></span></span>
            </div>
            <span class="pure-step-label">
              <span class="label-desktop">${fullLabel}</span>
              <span class="label-mobile">${shortLabel}</span>
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
    try {
      if (window.ScreenladyAPI && typeof window.ScreenladyAPI.getMagazineSettings === 'function') {
        const magSettings = await window.ScreenladyAPI.getMagazineSettings();
        if (magSettings && Array.isArray(magSettings.availableIssues) && magSettings.availableIssues.length > 0) {
          renderSlideshow(magSettings.availableIssues);
          return;
        }
      }
    } catch (e) {
      console.warn('[Home Slider] Notice fetching magazine covers from database:', e.message);
    }

    // Secondary fallback to existing DOM slides if already rendered
    const stage = document.getElementById('slidesStage');
    const theater = document.getElementById('slideshowTheater');
    if (stage && theater) {
      slides = Array.from(stage.querySelectorAll('.pure-slide'));
      steps = Array.from(document.querySelectorAll('.pure-timeline-step'));
      if (slides.length > 0) {
        setupControls(theater);
        showSlide(0);
        startTimer();
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadMagazineCovers);
  } else {
    loadMagazineCovers();
  }
})();
