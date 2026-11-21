/**
 * Global Screenlady Deleted Items Registry
 * Allows permanent removal of any item (custom or default) across all website sections
 */
window.getScreenladyDeletedIds = function() {
  try {
    const raw = localStorage.getItem('screenlady_deleted_ids');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

window.addScreenladyDeletedId = function(id) {
  const ids = window.getScreenladyDeletedIds();
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem('screenlady_deleted_ids', JSON.stringify(ids));
  }
};

window.removeScreenladyDeletedId = function(id) {
  const ids = window.getScreenladyDeletedIds().filter(i => i !== id);
  localStorage.setItem('screenlady_deleted_ids', JSON.stringify(ids));
};

window.clearAllScreenladyDeletedIds = function() {
  localStorage.removeItem('screenlady_deleted_ids');
};

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initBackToTop();
  initModals();
  initFilters();
  initPodcastPlayer();
  initNewsletterToast();
  initSearchModal();
  initGoogleAuth();
  initContactDropdown();
});

/* -------------------------------------------------------------
   Header Scroll Behavior
------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* -------------------------------------------------------------
   Mobile Navigation Drawer
------------------------------------------------------------- */
function initMobileNav() {
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const backdrop = document.getElementById('mobileNavBackdrop');
  const closeBtn = document.getElementById('mobileNavClose');

  if (!hamburger || !mobileNav) return;

  window.openMobileNav = () => {
    hamburger.classList.add('open');
    mobileNav.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeMobileNav = () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (mobileNav.classList.contains('open')) {
      window.closeMobileNav();
    } else {
      window.openMobileNav();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.closeMobileNav();
    });
  }
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      e.preventDefault();
      window.closeMobileNav();
    });
  }

  // Close drawer when a link is clicked
  const mobileLinks = mobileNav.querySelectorAll('a');
  mobileLinks.forEach(link => link.addEventListener('click', () => window.closeMobileNav()));
}

/* -------------------------------------------------------------
   Back to Top Button
------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* -------------------------------------------------------------
   Filterable Grids (Updates, Podcasts, Social)
------------------------------------------------------------- */
function initFilters() {
  const filterContainers = document.querySelectorAll('[data-filter-group]');

  filterContainers.forEach(container => {
    const buttons = container.querySelectorAll('.filter-btn');
    const targetSelector = container.getAttribute('data-target');
    const items = document.querySelectorAll(targetSelector);

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        items.forEach(item => {
          const itemCategory = item.getAttribute('data-category') || '';
          if (filterValue === 'all' || itemCategory.includes(filterValue)) {
            item.style.display = '';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 20);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(15px)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  });
}

/* -------------------------------------------------------------
   Global Modal System
------------------------------------------------------------- */
function initModals() {
  const modalOverlay = document.getElementById('globalModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalCloseBtn');

  if (!modalOverlay) return;

  window.openModal = function(title, contentHtml) {
    if (modalTitle) modalTitle.innerHTML = title;
    if (modalBody) modalBody.innerHTML = contentHtml;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Attach quick view triggers
  document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const type = trigger.getAttribute('data-modal-type');
      const title = trigger.getAttribute('data-modal-title') || 'Accolade Screenlady Feature';

      if (type === 'magazine-preview') {
        const issue = trigger.getAttribute('data-issue') || 'Current Issue';
        const coverSrc = trigger.getAttribute('data-cover') || 'assets/images/featured-icon-saree.jpg';
        showMagazineModal(issue, coverSrc);
      } else if (type === 'article') {
        const author = trigger.getAttribute('data-author') || 'Screenlady Editorial Board';
        const date = trigger.getAttribute('data-date') || 'Latest Edition';
        showArticleModal(title, author, date);
      } else if (type === 'podcast-play') {
        const guest = trigger.getAttribute('data-guest') || 'Special Guest';
        const epNum = trigger.getAttribute('data-ep') || 'Episode';
        showPodcastModal(title, guest, epNum);
      }
    });
  });
}

/* -------------------------------------------------------------
   Modal Content Generators
------------------------------------------------------------- */
window.currentMagPage = 1;

window.switchMagazinePage = function(pageNum) {
  window.currentMagPage = pageNum;
  for (let i = 1; i <= 3; i++) {
    const tab = document.getElementById(`magTab${i}`);
    const page = document.getElementById(`magPage${i}`);
    if (tab) {
      if (i === pageNum) {
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      } else {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      }
    }
    if (page) {
      if (i === pageNum) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    }
  }
};

window.nextMagazinePage = function() {
  const next = window.currentMagPage >= 3 ? 1 : window.currentMagPage + 1;
  window.switchMagazinePage(next);
};

window.prevMagazinePage = function() {
  const prev = window.currentMagPage <= 1 ? 3 : window.currentMagPage - 1;
  window.switchMagazinePage(prev);
};

function showMagazineModal(issue, coverSrc) {
  // Delegate to the comprehensive Magazine Showcase & Order Engine
  if (typeof window.showMagazineModal === 'function' && window.showMagazineModal !== showMagazineModal) {
    window.showMagazineModal(issue);
    return;
  }
  if (typeof openMagazineOrderModal === 'function') {
    openMagazineOrderModal();
    return;
  }
}

function showArticleModal(title, author, date) {
  const content = `
    <div style="max-width: 720px; margin: 0 auto;">
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; color: var(--text-muted); font-size: 0.85rem;">
        <span>By <strong style="color: var(--gold-primary);">${author}</strong></span>
        <span>•</span>
        <span>${date}</span>
        <span>•</span>
        <span class="badge-gold" style="font-size: 0.68rem;">Exclusive Editorial</span>
      </div>
      <h2 style="font-family: var(--font-serif-display); font-size: 2rem; color: var(--text-ivory); line-height: 1.25; margin-bottom: 1.5rem;">${title}</h2>
      <div style="font-family: var(--font-serif-editorial); font-size: 1.25rem; line-height: 1.85; color: var(--text-ivory-soft);">
        <p style="margin-bottom: 1.4rem;">
          <span style="float: left; font-size: 3.5rem; line-height: 0.8; font-family: var(--font-serif-display); color: var(--gold-primary); padding-right: 0.6rem; padding-top: 0.2rem;">T</span>
          hroughout the evolving tapestry of modern media, the narrative of leadership has transitioned from quiet perseverance to audacious command. In every corridor of power—from boardroom chambers to the cinematic stage—women are dismantling archaic definitions of influence and forging a legacy rooted in conviction.
        </p>
        <blockquote style="margin: 2rem 0; padding: 1.5rem 2rem; border-left: 3px solid var(--gold-primary); background: rgba(212, 175, 55, 0.05); font-style: italic; color: var(--gold-light);">
          "True leadership is not granted by appointment; it is claimed through authentic courage and relentless excellence."
        </blockquote>
        <p style="margin-bottom: 1.4rem;">
          Accolade Screenlady stands as both chronicler and catalyst to this awakening. Under the conceptual vision of Mr. Prashant Chandrakant Sagvekar, our editorial mission remains steadfast: to present women not merely as subjects of admiration, but as architectonic forces transforming culture, governance, and creative expression.
        </p>
      </div>
      <div style="border-top: 1px solid rgba(212, 175, 55, 0.2); padding-top: 1.5rem; margin-top: 2rem; display: flex; align-items: center; justify-content: space-between;">
        <span style="color: var(--text-muted); font-size: 0.85rem;">Share this perspective:</span>
        <div class="social-icon-row">
          <button class="social-icon-btn" onclick="showToast('Link copied to clipboard!')" title="Copy Link" aria-label="Copy Link"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></button>
          <button class="social-icon-btn" onclick="showToast('Shared to Twitter/X')" title="Share to X" aria-label="Share to X"><span style="font-weight: 700; font-size: 0.9rem;">X</span></button>
          <button class="social-icon-btn" onclick="showToast('Shared via WhatsApp')" title="Share via WhatsApp" aria-label="Share via WhatsApp"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></button>
        </div>
      </div>
    </div>
  `;
  openModal('Editorial Perspective', content);
}

function showPodcastModal(title, guest, epNum) {
  const content = `
    <div style="text-align: center;">
      <span class="badge-gold" style="margin-bottom: 1rem;">${epNum} • The Screenlady Conversations</span>
      <h3 style="font-family: var(--font-serif-display); font-size: 1.9rem; color: var(--text-ivory); margin-bottom: 0.5rem;">${title}</h3>
      <p style="color: var(--gold-primary); font-size: 1.1rem; margin-bottom: 2rem;">Guest Spotlight: <strong>${guest}</strong></p>
      
      <!-- Video / Audio Player Frame Simulation without images -->
      <div style="position: relative; aspect-ratio: 16/9; background: #0A0A0E; border-radius: 12px; overflow: hidden; border: 1px solid var(--border-gold-bright); margin-bottom: 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 15px 40px rgba(0,0,0,0.9); padding: 2rem;">
        <div style="width: 72px; height: 72px; border-radius: 50%; background: var(--gold-gradient); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; color: #000; margin: 0 auto 1rem; box-shadow: var(--gold-glow-strong); cursor: pointer;" onclick="showToast('Streaming episode audio & video...')">
          ▶
        </div>
        <p style="font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-ivory);">[ Video & Audio Broadcast Stream Player ]</p>
        <p style="font-size: 0.75rem; color: var(--gold-light); margin-top: 0.4rem;">4K High-Fidelity Studio Production</p>
      </div>

      <div class="mini-player-bar" style="margin-bottom: 1.5rem;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div class="waveform-container">
            <div class="wave-bar" style="height: 12px;"></div>
            <div class="wave-bar" style="height: 24px;"></div>
            <div class="wave-bar" style="height: 18px;"></div>
            <div class="wave-bar" style="height: 28px;"></div>
            <div class="wave-bar" style="height: 15px;"></div>
          </div>
          <div style="text-align: left;">
            <p style="font-size: 0.85rem; color: var(--text-ivory); font-weight: 600;">Full Audio Track</p>
            <p style="font-size: 0.75rem; color: var(--text-muted);">48:22 • High Fidelity Master</p>
          </div>
        </div>
        <button class="btn btn-gold btn-sm" onclick="showToast('Audio playing now')">Play Audio</button>
      </div>

      <p style="color: var(--text-muted); font-size: 0.88rem;">Available on Spotify, Apple Podcasts, and YouTube.</p>
    </div>
  `;
  openModal('Podcast Broadcast', content);
}

/* -------------------------------------------------------------
   Podcast Player Controller Simulation
------------------------------------------------------------- */
function initPodcastPlayer() {
  const playBtns = document.querySelectorAll('.player-ctrl-btn');
  const waveforms = document.querySelectorAll('.waveform-container');

  playBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isPlaying = btn.classList.contains('playing');
      if (isPlaying) {
        btn.classList.remove('playing');
        btn.innerHTML = '▶';
        waveforms.forEach(w => w.style.opacity = '0.4');
        showToast('Playback paused');
      } else {
        playBtns.forEach(b => {
          b.classList.remove('playing');
          b.innerHTML = '▶';
        });
        btn.classList.add('playing');
        btn.innerHTML = '❚❚';
        waveforms.forEach(w => w.style.opacity = '1');
        showToast('Now Playing: Accolade Screenlady Exclusive Podcast');
      }
    });
  });
}

/* -------------------------------------------------------------
   Newsletter & Feedback Toast System
------------------------------------------------------------- */
function initNewsletterToast() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        showToast(`Thank you! Welcome to the Accolade Screenlady Circle (${input.value})`);
        input.value = '';
      }
    });
  });
}

window.showToast = function(msg) {
  let toast = document.getElementById('toastMsg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastMsg';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span style="color: var(--gold-primary);">✦</span> <span>${msg}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
};

/* -------------------------------------------------------------
   Search Modal Trigger
------------------------------------------------------------- */
function initSearchModal() {
  const searchTriggers = document.querySelectorAll('.search-trigger');
  searchTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const content = `
        <div style="padding: 1rem 0;">
          <h3 style="font-family: var(--font-serif-display); font-size: 1.5rem; color: var(--text-ivory); margin-bottom: 1rem;">Search Accolade Screenlady</h3>
          <div style="position: relative; margin-bottom: 1.5rem;">
            <input type="text" id="siteSearchInput" placeholder="Search editorials, interviews, personalities, issues..." style="width: 100%; background: #0A0A0E; border: 1px solid var(--gold-primary); padding: 1rem 1.25rem; border-radius: 4px; color: #fff; font-size: 1rem; outline: none; box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);">
          </div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2rem;">
            <span style="font-size: 0.78rem; color: var(--text-muted); align-self: center; margin-right: 0.5rem;">Popular Tags:</span>
            <button class="badge-gold" style="cursor: pointer;" onclick="document.getElementById('siteSearchInput').value='Leadership';">Leadership</button>
            <button class="badge-gold" style="cursor: pointer;" onclick="document.getElementById('siteSearchInput').value='Cinema & Arts';">Cinema & Arts</button>
            <button class="badge-gold" style="cursor: pointer;" onclick="document.getElementById('siteSearchInput').value='Prashant Sagvekar';">Prashant Sagvekar</button>
            <button class="badge-gold" style="cursor: pointer;" onclick="document.getElementById('siteSearchInput').value='Power Issue';">Power Issue</button>
            <button class="badge-gold" style="cursor: pointer;" onclick="document.getElementById('siteSearchInput').value='Podcasts';">Podcasts</button>
          </div>
          <div id="searchResultsList" style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1rem; color: var(--text-muted); font-size: 0.9rem;">
            Type a query to explore articles, updates, and episodes across all 6 sections.
          </div>
        </div>
      `;
      openModal('Search Publications', content);

      setTimeout(() => {
        const input = document.getElementById('siteSearchInput');
        if (input) {
          input.focus();
          input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const results = document.getElementById('searchResultsList');
            if (!results) return;

            if (query.length === 0) {
              results.innerHTML = 'Type a query to explore articles, updates, and episodes across all 6 sections.';
              return;
            }

            results.innerHTML = `
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                <div style="background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 6px; border-left: 2px solid var(--gold-primary);">
                  <span class="badge-gold" style="font-size: 0.65rem; margin-bottom: 0.3rem;">Editorial Feature</span>
                  <h4 style="color: var(--text-ivory); margin-bottom: 0.3rem;"><a href="editorials.html" style="color: var(--gold-light);">Trailblazers & Cultural Icons in Modern Media</a></h4>
                  <p style="font-size: 0.82rem; color: var(--text-muted);">Matches query "${query}" • By Editorial Desk</p>
                </div>
                <div style="background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 6px; border-left: 2px solid var(--gold-primary);">
                  <span class="badge-gold" style="font-size: 0.65rem; margin-bottom: 0.3rem;">About Accolade Screenlady</span>
                  <h4 style="color: var(--text-ivory); margin-bottom: 0.3rem;"><a href="about-us.html" style="color: var(--gold-light);">Vision & Leadership of Mr. Prashant Chandrakant Sagvekar</a></h4>
                  <p style="font-size: 0.82rem; color: var(--text-muted);">Conceptual creator and producer profile</p>
                </div>
              </div>
            `;
          });
        }
      }, 100);
    });
  });
}

/* -------------------------------------------------------------
   Real Google Authentication Handler (GSI)
------------------------------------------------------------- */
function initGoogleAuth() {
  const authBtn = document.getElementById('googleAuthBtn');
  const userProfileBadge = document.getElementById('userProfileBadge');
  const userAvatar = document.getElementById('userAvatar');
  const userName = document.getElementById('userName');
  const signoutBtn = document.getElementById('googleSignoutBtn');

  // Check saved session in localStorage
  const savedUser = localStorage.getItem('screenlady_google_user');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      renderSignedIn(user);
    } catch (e) {
      localStorage.removeItem('screenlady_google_user');
    }
  }

  function renderSignedIn(user) {
    if (authBtn) authBtn.style.display = 'none';
    if (userProfileBadge) {
      userProfileBadge.style.display = 'inline-flex';
      if (userAvatar) userAvatar.src = user.picture || 'assets/images/logo-2.png';
      if (userName) userName.textContent = user.name ? user.name.split(' ')[0] : 'Member';
    }
  }

  function renderSignedOut() {
    if (authBtn) authBtn.style.display = 'inline-flex';
    if (userProfileBadge) userProfileBadge.style.display = 'none';
  }

  if (signoutBtn) {
    signoutBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      localStorage.removeItem('screenlady_google_user');
      if (window.google && google.accounts && google.accounts.id) {
        google.accounts.id.disableAutoSelect();
      }
      renderSignedOut();
      showToast('Signed out of Google account.');
    });
  }

  // Global handler for Google OAuth Credential
  window.handleGoogleCredentialResponse = (response) => {
    try {
      // Decode JWT base64 payload
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const profile = JSON.parse(jsonPayload);
      const userObj = {
        name: profile.name,
        email: profile.email,
        picture: profile.picture,
        sub: profile.sub
      };

      localStorage.setItem('screenlady_google_user', JSON.stringify(userObj));
      renderSignedIn(userObj);
      closeModal();
      showToast(`Welcome, ${profile.name || 'Member'}! Signed in with Google.`);
    } catch (err) {
      console.error('Error processing Google credentials:', err);
      showToast('Could not complete Google sign-in.');
    }
  };

  // Google Identity Services setup
  const CLIENT_ID = '941656885375-google-screenlady.apps.googleusercontent.com';

  const setupGsi = () => {
    if (window.google && google.accounts && google.accounts.id) {
      try {
        google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: window.handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });

        // Prompt Google One Tap if not already signed in
        if (!localStorage.getItem('screenlady_google_user')) {
          google.accounts.id.prompt();
        }
      } catch (err) {
        console.warn('GSI notice:', err);
      }
    }
  };

  if (window.google && google.accounts) {
    setupGsi();
  } else {
    window.addEventListener('load', () => {
      setTimeout(setupGsi, 600);
    });
  }

  // Direct trigger when clicking "Sign In / Sign Up" button:
  if (authBtn) {
    authBtn.addEventListener('click', () => {
      const modalHtml = `
        <div style="text-align: center; padding: 1.5rem 0.5rem;">
          <img src="assets/images/logo-2.png" alt="Accolade Queen" style="height: 48px; margin-bottom: 1rem; filter: drop-shadow(0 0 14px rgba(212,175,55,0.7));">
          <h3 style="font-family: var(--font-serif-display); font-size: 1.35rem; color: var(--text-ivory); margin-bottom: 0.5rem;">Accolade Screenlady Member Access</h3>
          <p style="color: var(--text-muted); font-size: 0.84rem; max-width: 380px; margin: 0 auto 1.5rem;">
            Authenticate with your verified Google Account for exclusive editorial privileges, digital magazine access, and subscriber benefits.
          </p>

          <div style="display: flex; justify-content: center; margin-bottom: 1.5rem; min-height: 44px;" id="modalGoogleBtnContainer">
            <!-- Native Google button will mount here -->
          </div>

          <div style="font-size: 0.72rem; color: var(--text-faint); margin-top: 1rem;">
            Secured via Google Identity Services (OAuth 2.0)
          </div>
        </div>
      `;

      openModal('Sign In with Google', modalHtml);

      // Render the official Google Sign-In button inside the modal
      setTimeout(() => {
        const container = document.getElementById('modalGoogleBtnContainer');
        if (container && window.google && google.accounts && google.accounts.id) {
          try {
            google.accounts.id.renderButton(container, {
              theme: 'filled_black',
              size: 'large',
              shape: 'pill',
              text: 'continue_with',
              logo_alignment: 'left',
              width: 280
            });
          } catch (e) {
            console.error('Google button render error:', e);
          }
        }
      }, 120);
    });
  }
}

/* -------------------------------------------------------------
   Contact Us Dropdown Controller
------------------------------------------------------------- */
function initContactDropdown() {
  const dropdownWraps = document.querySelectorAll('.top-contact-dropdown');

  dropdownWraps.forEach(wrap => {
    const trigger = wrap.querySelector('.top-contact-btn');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = wrap.classList.contains('open');
      dropdownWraps.forEach(w => {
        w.classList.remove('open');
        const btn = w.querySelector('.top-contact-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        wrap.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.top-contact-dropdown')) {
      dropdownWraps.forEach(w => {
        w.classList.remove('open');
        const btn = w.querySelector('.top-contact-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Close dropdown on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdownWraps.forEach(w => {
        w.classList.remove('open');
        const btn = w.querySelector('.top-contact-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

