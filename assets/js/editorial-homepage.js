/**
 * ACCOLADE SCREENLADY - EDITORIAL HOMEPAGE INTERACTIVE ENGINE
 * Handles:
 * - Category filtering for Magazine Highlights
 * - Full-screen responsive Lightbox viewer for all magazine photographs
 * - Horizontal carousel navigation with touch drag & arrow controls
 * - Smooth anchor scrolling & modal integrations
 */

(function () {
  'use strict';

  // Master Registry of all Magazine Photos for Lightbox
  const MAGAZINE_GALLERY = [
    { src: 'assets/images/magazine-photos/1.jpg', title: 'A Celebration of Sovereign Grace', theme: 'Hero Portrait' },
    { src: 'assets/images/magazine-photos/random2.jpg', title: 'Chronicles of Distinction', theme: 'Editorial Spread' },
    { src: 'assets/images/magazine-photos/3.1.jpg', title: 'Celluloid Glamour & Stardom', theme: 'Glamour & Entertainment' },
    { src: 'assets/images/magazine-photos/3.2.jpg', title: 'Women of Cultural Distinction', theme: 'Women Who Inspire' },
    { src: 'assets/images/magazine-photos/3.3.jpg', title: 'Unfiltered Memoirs Beyond the Lens', theme: 'Stories Beyond the Spotlight' },
    { src: 'assets/images/magazine-photos/3.4.jpg', title: 'Executive Eminence & Enterprise', theme: 'Business & Lifestyle' },
    { src: 'assets/images/magazine-photos/random.jpg', title: 'Haute Aesthetics & Red Carpet', theme: 'Glamour & Entertainment' },
    { src: 'assets/images/magazine-photos/random1.jpg', title: 'Pioneering Voices of India', theme: 'Women Who Inspire' },
    { src: 'assets/images/magazine-photos/random4.jpg', title: 'Leadership Across Boardrooms', theme: 'Business & Lifestyle' },
    { src: 'assets/images/magazine-photos/random5.jpg', title: 'Cinematic Majesty & Art', theme: 'Glamour & Entertainment' },
    { src: 'assets/images/magazine-photos/4.1.jpg', title: 'The Unyielding Genesis', theme: 'Her Journey' },
    { src: 'assets/images/magazine-photos/4.2.jpg', title: 'Architect of Lasting Impact', theme: 'Her Achievements' },
    { src: 'assets/images/magazine-photos/4.3.jpg', title: 'Lighting the Sovereign Torch', theme: 'Her Inspiration' },
    { src: 'assets/images/magazine-photos/4.4.jpg', title: 'The Triumph of Courage', theme: 'Stories Beyond the Spotlight' },
    { src: 'assets/images/magazine-photos/5.1.jpg', title: 'Haute Couture & Fine Tailoring', theme: 'Fashion & Glamour' },
    { src: 'assets/images/magazine-photos/5.2.jpg', title: 'Royal Heritage Jewellery', theme: 'Luxury Lifestyle' },
    { src: 'assets/images/magazine-photos/5.3.jpg', title: 'Contemporary Elegance Spread', theme: 'Beauty & Couture' },
    { src: 'assets/images/magazine-photos/6.1.jpg', title: 'Corporate Brand Collaboration', theme: 'Brand Platform' },
    { src: 'assets/images/magazine-photos/6.2.jpg', title: 'Executive Brand Feature', theme: 'Brand Platform' },
    { src: 'assets/images/magazine-photos/6.3.jpg', title: 'Prestige Media Showcase', theme: 'Brand Platform' },
    { src: 'assets/images/magazine-photos/6.4.jpg', title: 'Luxury Brand Partnership', theme: 'Brand Platform' },
    { src: 'assets/images/magazine-photos/7.1.jpg', title: 'Editorial Leadership & Vision', theme: 'Visionary Spread' },
    { src: 'assets/images/team/prashant-sagvekar.jpeg', title: 'Mr. Prashant Sagvekar - Founder & Publisher', theme: 'Executive Leadership' },
    { src: 'assets/images/team/amruta-rao.jpeg', title: 'Mrs. Amruta Rao - Editor In Chief', theme: 'Editorial Board' },
    { src: 'assets/images/team/mansi-ingle.jpeg', title: 'Mrs. Manasi Ingle - Board Member', theme: 'Board of Directors' },
    { src: 'assets/images/team/supriya-vinod.jpeg', title: 'Mrs. Supriya Vinod - Board Member', theme: 'Board of Directors' },
    { src: 'assets/images/team/sakshi-sagvekar.jpeg', title: 'Mrs. Sakshi Sagvekar - Managing Director', theme: 'Executive Leadership' },
    { src: 'assets/images/team/vedang-sagvekar.jpeg', title: 'Mr. Vedang Sagvekar - Marketing Director', theme: 'Executive Leadership' }
  ];

  let activePhotoIndex = 0;

  function init() {
    initThemeFilters();
    initCarousel();
    initLightbox();
    initSmoothScroll();
  }

  /* -------------------------------------------------------------
     Section 3: Category Filtering for Magazine Highlights
  ------------------------------------------------------------- */
  function initThemeFilters() {
    const filterBtns = document.querySelectorAll('.highlight-filter-btn');
    const items = document.querySelectorAll('.collage-item');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const theme = btn.getAttribute('data-theme');

        items.forEach(item => {
          const itemTheme = item.getAttribute('data-theme');
          if (theme === 'all' || itemTheme === theme) {
            item.style.display = '';
            item.style.animation = 'fadeInUp 0.4s ease forwards';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* -------------------------------------------------------------
     Section 5: Horizontal Carousel Scroll Controls
  ------------------------------------------------------------- */
  function initCarousel() {
    const trackWrapper = document.getElementById('lifestyleCarouselTrack');
    const prevBtn = document.getElementById('carouselPrevBtn');
    const nextBtn = document.getElementById('carouselNextBtn');

    if (!trackWrapper) return;

    const scrollAmount = 350;

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        trackWrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        trackWrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });
    }
  }

  /* -------------------------------------------------------------
     Global Editorial Lightbox Preview
  ------------------------------------------------------------- */
  function initLightbox() {
    let modal = document.getElementById('editorialLightboxModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'editorialLightboxModal';
      modal.className = 'editorial-lightbox-modal';
      modal.innerHTML = `
        <div class="lightbox-content-box">
          <button class="lightbox-close-btn" id="lightboxCloseBtn" aria-label="Close Preview">✕</button>
          <button class="lightbox-nav-btn prev" id="lightboxPrevBtn" aria-label="Previous Photo">‹</button>
          <img id="lightboxMainImg" class="lightbox-img" src="" alt="Magazine Photograph High Resolution Preview">
          <button class="lightbox-nav-btn next" id="lightboxNextBtn" aria-label="Next Photo">›</button>
          <div class="lightbox-caption-bar">
            <div class="lightbox-caption-theme" id="lightboxCaptionTheme"></div>
            <div class="lightbox-caption-title" id="lightboxCaptionTitle"></div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const closeBtn = document.getElementById('lightboxCloseBtn');
    const prevBtn = document.getElementById('lightboxPrevBtn');
    const nextBtn = document.getElementById('lightboxNextBtn');

    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        changeLightboxPhoto(-1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        changeLightboxPhoto(1);
      });
    }

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('active')) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') changeLightboxPhoto(-1);
      if (e.key === 'ArrowRight') changeLightboxPhoto(1);
    });

    // Attach click listeners to all elements with data-lightbox-src
    document.querySelectorAll('[data-lightbox-src]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const src = el.getAttribute('data-lightbox-src');
        const foundIdx = MAGAZINE_GALLERY.findIndex(item => item.src === src);
        openLightbox(foundIdx, src, el.getAttribute('data-lightbox-title'), el.getAttribute('data-lightbox-theme'));
      });
    });
  }

  function openLightbox(index, fallbackSrc, fallbackTitle, fallbackTheme) {
    const modal = document.getElementById('editorialLightboxModal');
    const img = document.getElementById('lightboxMainImg');
    const title = document.getElementById('lightboxCaptionTitle');
    const theme = document.getElementById('lightboxCaptionTheme');

    if (!modal || !img) return;

    if (index >= 0 && MAGAZINE_GALLERY[index]) {
      activePhotoIndex = index;
      const item = MAGAZINE_GALLERY[activePhotoIndex];
      img.src = item.src;
      img.alt = item.title;
      if (title) title.textContent = item.title;
      if (theme) theme.textContent = item.theme;
    } else {
      activePhotoIndex = 0;
      img.src = fallbackSrc || '';
      img.alt = fallbackTitle || 'Accolade Screenlady Feature';
      if (title) title.textContent = fallbackTitle || 'Magazine Inside Page';
      if (theme) theme.textContent = fallbackTheme || 'Accolade Screenlady';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function changeLightboxPhoto(direction) {
    activePhotoIndex += direction;
    if (activePhotoIndex < 0) activePhotoIndex = MAGAZINE_GALLERY.length - 1;
    if (activePhotoIndex >= MAGAZINE_GALLERY.length) activePhotoIndex = 0;

    const item = MAGAZINE_GALLERY[activePhotoIndex];
    const img = document.getElementById('lightboxMainImg');
    const title = document.getElementById('lightboxCaptionTitle');
    const theme = document.getElementById('lightboxCaptionTheme');

    if (img) img.src = item.src;
    if (title) title.textContent = item.title;
    if (theme) theme.textContent = item.theme;
  }

  /* -------------------------------------------------------------
     Smooth Scroll & Interactive Actions
  ------------------------------------------------------------- */
  function initSmoothScroll() {
    const storyBtn = document.getElementById('heroDiscoverStoryBtn');
    if (storyBtn) {
      storyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const aboutSection = document.getElementById('aboutAccoladeSection');
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    const exploreMagBtn = document.getElementById('heroExploreMagazineBtn');
    if (exploreMagBtn) {
      exploreMagBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof window.showMagazineModal === 'function') {
          window.showMagazineModal();
        } else {
          const highlights = document.getElementById('magazineHighlightsSection');
          if (highlights) highlights.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Brands action buttons
    const advBtn = document.getElementById('brandsAdvertiseBtn');
    if (advBtn && advBtn.tagName === 'BUTTON') {
      advBtn.addEventListener('click', () => {
        window.open('https://wa.me/919665035503?text=Hello%20Accolade%20Screenlady%20Team%2C%20I%20am%20interested%20in%20Advertising%20and%20Brand%20Promotions%20with%20your%20magazine.', '_blank');
      });
    }

    const collabBtn = document.getElementById('brandsCollabBtn');
    if (collabBtn && collabBtn.tagName === 'BUTTON') {
      collabBtn.addEventListener('click', () => {
        window.location.href = 'mailto:editor@accoladescreenlady.com?cc=AccoladeScreenlady@gmail.com&subject=Brand%20Advertising%20%26%20Promotions%20Inquiry%20-%20Accolade%20Screenlady';
      });
    }
  }

  // Auto init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

