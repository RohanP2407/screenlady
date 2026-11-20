/**
 * ACCOLADE SCREENLADY - PURE MAGAZINE COVER SLIDESHOW & TIMELINE
 * Each cover photo displays for exactly 5 seconds, followed by smooth transition to the next.
 * Clean, focused slideshow with monthly timeline (June to October).
 */

(function () {
  'use strict';

  const DURATION = 5000; // Exactly 5 seconds per photo
  const TICK_INTERVAL = 30; // 30ms timer tick for ultra-smooth progress animation

  let currentIndex = 0;
  let timer = null;
  let elapsed = 0;
  let isHovered = false;

  function init() {
    const stage = document.getElementById('slidesStage');
    const theater = document.getElementById('slideshowTheater');
    if (!stage || !theater) return;

    const slides = Array.from(document.querySelectorAll('.pure-slide'));
    const steps = Array.from(document.querySelectorAll('.pure-timeline-step'));
    const total = slides.length;
    if (total === 0) return;

    const prevBtn = document.getElementById('slidePrevBtn');
    const nextBtn = document.getElementById('slideNextBtn');

    function showSlide(index) {
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

    // Timer loop for 5-second duration
    function startTimer() {
      if (timer) clearInterval(timer);
      elapsed = 0;

      timer = setInterval(() => {
        if (isHovered) return; // Pause while hovering

        elapsed += TICK_INTERVAL;
        const progressPercent = Math.min((elapsed / DURATION) * 100, 100);

        // Update active step's progress fill
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

    // Attach click listeners to timeline steps
    steps.forEach((step, idx) => {
      step.addEventListener('click', () => {
        showSlide(idx);
      });
    });

    // Arrow navigation
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextSlide();
      });
    }

    // Pause on hover so viewer can inspect photo
    theater.addEventListener('mouseenter', () => {
      isHovered = true;
    });

    theater.addEventListener('mouseleave', () => {
      isHovered = false;
    });

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

    // Keyboard navigation (Left / Right arrow keys)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    });

    // Initialize first slide (June) and start 5-second timer
    showSlide(0);
    startTimer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
