/**
 * ACCOLADE SCREENLADY - MULTI-SECTION EDITORIAL DESK CONTROLLER
 * Supports direct publishing and management for:
 * 1. 🖋️ Editorials (Writings, Articles, Deep Analyses & Information)
 * 2. 🎙️ Podcast (Episodes, Social Media Streaming Links, 10s Playback Preview)
 * 3. 📷 Event Photos (Screenlady Events Arranged Chronologically by Date)
 * 4. 🗞️ Updates Feed (Women of Distinction Bulletin & Milestones)
 *
 * All published items are timestamped and strictly sorted reverse-chronologically
 * so the newest entry automatically displays first at the top of the live page.
 */

const DEFAULT_ADMIN_PIN = 'screenlady2026';

let currentSection = 'editorials'; // 'editorials' | 'podcast' | 'photos' | 'updates'
let currentUpdateType = 'photo-info'; // for updates section: 'photo-info' | 'article' | 'photo'
let editingItem = null; // { id, section }
let activeManageFilter = 'all';

// Preset categories per section
const SECTION_CATEGORIES = {
  news: [
    'Filmy Adda',
    'Bizz World',
    'Women of Inspiration',
    'Fashion & Lifestyle',
    'Movie Talk',
    'Tribute',
    'Box Office',
    'City Alert',
    'Entertainment',
    'National News',
    'Social Commentary',
    'Culture & Arts',
    'Breaking News'
  ],
  filmy_adda: [
    'Filmy Adda',
    'Movie Talk',
    'Box Office',
    'Behind the Screen',
    'Cinema Exclusive',
    'Upcoming Releases',
    'Celebrity Spotlight',
    'Entertainment'
  ],
  bizz_world: [
    'Bizz World',
    'Corporate Leadership',
    'Women Entrepreneurs',
    'Startup Conclave',
    'Brand Partnership',
    'Executive Conclave',
    'Industry Milestone',
    'Business & Finance'
  ],
  women_inspiration: [
    'Women of Inspiration',
    'Struggles to Success',
    'Mai — Mother of Orphans',
    'Distinction Honors',
    'Grassroots Leadership',
    'Courage & Reform',
    'Social Impact',
    'Healthcare Pioneer'
  ],
  fashion_lifestyle: [
    'Fashion & Lifestyle',
    'Heritage Jewellery',
    'Haute Couture Spread',
    'Traditional Elegance',
    'Holistic Wellness',
    'Royal Adornments',
    'Modern Living',
    'Contemporary Style'
  ],
  home_photos: [
    'Blockbuster News',
    'Mother of Orphans',
    'November Clashes',
    'Mumbai Alert',
    'Heritage & Craftsmanship',
    'Cinema & Studio',
    'Meet & Greet',
    'Annual Honors',
    'Executive Leadership',
    'Special Investigation'
  ],
  editorials: [
    'Heritage & Craftsmanship',
    'Social Commentary',
    'Cinema & Arts',
    'Corporate Leadership',
    'Literature & Culture',
    'Founder’s Vision'
  ],
  podcast: [
    'Cinema & Arts',
    'Corporate Leadership',
    'Cultural Dialogue',
    'Industry Spotlight',
    'Behind the Screen'
  ],
  photos: [
    'Screenlady Assembly',
    'Team & Board Meetings',
    'Awards & Honors',
    'Movie Talk & Shoots',
    'Meet & Greet',
    'Brand Events'
  ],
  updates: [
    'Filmy Adda (Cinema & Movies)',
    'Bizz World (Business & Enterprise)',
    'Women of Inspiration (Struggles to Success)',
    'Fashion & Lifestyle',
    'Meetings',
    'Awards',
    'Movie Talk',
    'Meet & Greet',
    'Events',
    'Team Milestones'
  ]
};

// Ready-to-use photography presets including Screenlady leadership & event archives (ImageKit CDN)
const ADMIN_PHOTO_PRESETS = [
  { label: 'Ramayana Movie Release', path: 'https://ik.imagekit.io/acooladescreenlady/assets/images/news/ramayana.jpeg' },
  { label: 'Sindhutai Sapkal (Mai)', path: 'https://ik.imagekit.io/acooladescreenlady/assets/images/news/sindhutai-sapkal.jpeg' },
  { label: 'November Box Office Releases', path: 'https://ik.imagekit.io/acooladescreenlady/assets/images/news/films-box-office.jpeg' },
  { label: 'Amitabh Bachchan (Jalsa)', path: 'https://ik.imagekit.io/acooladescreenlady/assets/images/news/amitabh-bachchan.jpeg' },
  { label: 'Mr. Prashant Sagvekar (Founder)', path: 'https://ik.imagekit.io/acooladescreenlady/assets/images/team/prashant-sagvekar.jpeg' },
  { label: 'Mrs. Amruta Rao (Editor-in-Chief)', path: 'https://ik.imagekit.io/acooladescreenlady/assets/images/team/amruta-rao.jpeg' },
  { label: 'Mrs. Sakshi Sagvekar (Managing Director)', path: 'https://ik.imagekit.io/acooladescreenlady/assets/images/team/sakshi-sagvekar.jpeg' },
  { label: 'Mr. Vedang Sagvekar (Marketing Director)', path: 'https://ik.imagekit.io/acooladescreenlady/assets/images/team/vedang-sagvekar.jpeg' },
  { label: 'Mrs. Supriya Vinod (Board Member)', path: 'https://ik.imagekit.io/acooladescreenlady/assets/images/team/supriya-vinod.jpeg' },
  { label: 'Mrs. Manasi Ingle (Board Member)', path: 'https://ik.imagekit.io/acooladescreenlady/assets/images/team/mansi-ingle.jpeg' },
  { label: 'Movie Talk & Shoots', path: 'https://ik.imagekit.io/acooladescreenlady/assets/images/magazine-photos/3.1.jpg' },
  { label: 'Awards & Honors', path: 'https://ik.imagekit.io/acooladescreenlady/assets/images/magazine-photos/4.2.jpg' },
  { label: 'Meet & Greet Conclave', path: 'https://ik.imagekit.io/acooladescreenlady/assets/images/magazine-photos/4.1.jpg' },
  { label: 'Brand Event (Tantuh)', path: 'https://ik.imagekit.io/acooladescreenlady/assets/images/articles/article-1.jpg' },
  { label: 'Body Shaming & Self-Love', path: 'https://ik.imagekit.io/acooladescreenlady/assets/images/articles/article-2.jpg' }
];

document.addEventListener('DOMContentLoaded', () => {
  initAdminAuth();
  initFormControls();
});

/* =============================================================
   1. Admin Authentication & Security
============================================================= */
function initAdminAuth() {
  const isAuth = sessionStorage.getItem('screenlady_admin_auth') === 'true';
  const overlay = document.getElementById('adminAuthOverlay');
  const dashboard = document.getElementById('adminDashboard');

  if (isAuth) {
    if (overlay) overlay.style.display = 'none';
    if (dashboard) dashboard.style.display = 'flex';
    loadAdminDashboard();
  } else {
    if (overlay) overlay.style.display = 'flex';
    if (dashboard) dashboard.style.display = 'none';
  }

  const authForm = document.getElementById('adminAuthForm');
  if (authForm) authForm.addEventListener('submit', handleAdminLogin);

  const logoutBtn = document.getElementById('adminLogoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', handleAdminLogout);

  if (typeof renderMediaPresets === 'function') {
    renderMediaPresets();
  }
}

function getSavedPin() {
  return localStorage.getItem('screenlady_admin_pin') || DEFAULT_ADMIN_PIN;
}

function handleAdminLogin(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  const pinInput = document.getElementById('adminPinInput');
  const errEl = document.getElementById('adminAuthErr');
  const enteredPin = (pinInput ? pinInput.value : '').trim();
  const savedPin = (getSavedPin() || '').trim();

  // Allow default pin, saved pin, and case-insensitive matches
  const isValid = 
    enteredPin === savedPin ||
    enteredPin.toLowerCase() === DEFAULT_ADMIN_PIN.toLowerCase() ||
    enteredPin.toLowerCase() === savedPin.toLowerCase();

  if (isValid) {
    sessionStorage.setItem('screenlady_admin_auth', 'true');
    if (errEl) errEl.style.display = 'none';
    const overlay = document.getElementById('adminAuthOverlay');
    const dashboard = document.getElementById('adminDashboard');
    if (overlay) overlay.style.display = 'none';
    if (dashboard) dashboard.style.display = 'flex';
    loadAdminDashboard();
    showToast('Admin access granted. Welcome to Screenlady Editorial Desk.');
  } else {
    if (errEl) {
      errEl.textContent = 'Incorrect Admin Passcode. Default is: screenlady2026';
      errEl.style.display = 'block';
    }
    if (pinInput) {
      pinInput.value = '';
      pinInput.focus();
    }
  }
}
window.handleAdminLogin = handleAdminLogin;

function handleAdminLogout() {
  sessionStorage.removeItem('screenlady_admin_auth');
  window.location.reload();
}

window.changeAdminPin = function() {
  const currentPin = getSavedPin();
  const inputOld = prompt('Enter Current Passcode:');
  if (inputOld !== currentPin) {
    if (inputOld !== null) alert('Incorrect current passcode.');
    return;
  }

  const newPin = prompt('Enter New Passcode (min 6 characters):');
  if (!newPin || newPin.trim().length < 6) {
    alert('Passcode must be at least 6 characters long.');
    return;
  }

  localStorage.setItem('screenlady_admin_pin', newPin.trim());
  showToast('Admin passcode successfully updated.');
};

/* =============================================================
   App Navigation & Standard View Switching (No Modals)
============================================================= */
window.switchAdminView = function(viewId, targetFilter = null) {
  const panels = document.querySelectorAll('.admin-view-panel');
  panels.forEach(p => p.classList.remove('active'));

  const target = document.getElementById(viewId);
  if (target) target.classList.add('active');

  const navItems = document.querySelectorAll('.admin-nav-item');
  navItems.forEach(n => {
    const navView = n.getAttribute('data-view');
    const navFilter = n.getAttribute('data-filter');
    if (navView === viewId) {
      if (viewId === 'panel-content') {
        n.classList.toggle('active', navFilter === (targetFilter || activeManageFilter));
      } else {
        n.classList.add('active');
      }
    } else {
      n.classList.remove('active');
    }
  });

  const breadcrumbCurrent = document.getElementById('adminBreadcrumbCurrent');
  const viewTitles = {
    'panel-dashboard': 'Dashboard Overview',
    'panel-compose': 'Content Publishing Studio',
    'panel-content': 'Content Management Archive',
    'panel-orders': 'Customer Purchase Orders',
    'panel-magazine': 'Monthly Magazine Issue & Settings',
    'panel-media': 'ImageKit Global Media CDN',
    'panel-business-ads': 'Homepage Business Showcase',
    'panel-magazine-covers': 'Magazine Covers (Hero Slideshow)'
  };
  const sectionTitles = {
    all: 'All Content Archive',
    news: 'Live News (Home)',
    filmy_adda: 'Filmy Adda',
    bizz_world: 'Bizz World',
    women_inspiration: 'Women of Inspiration',
    fashion_lifestyle: 'Fashion & Lifestyle',
    editorials: 'Editorials & Articles',
    podcast: 'Podcast Studio',
    photos: 'Screenlady Gallery',
    updates: 'Updates Archive',
    home_photos: 'Homepage Photos'
  };

  if (breadcrumbCurrent) {
    if (viewId === 'panel-content') {
      const f = targetFilter || activeManageFilter || 'all';
      breadcrumbCurrent.textContent = sectionTitles[f] || viewTitles[viewId];
    } else if (viewTitles[viewId]) {
      breadcrumbCurrent.textContent = viewTitles[viewId];
    }
  }

  const sidebar = document.getElementById('adminSidebar');
  const overlay = document.getElementById('adminMobileOverlay');
  if (sidebar && sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    if (overlay) overlay.style.display = 'none';
  }

  if (viewId === 'panel-business-ads') {
    if (typeof renderBusinessAdsPanel === 'function') renderBusinessAdsPanel();
  } else if (viewId === 'panel-magazine') {
    if (typeof renderMagazineEditionsList === 'function') renderMagazineEditionsList();
  } else if (viewId === 'panel-magazine-covers') {
    if (typeof renderMagazineCoversPanel === 'function') renderMagazineCoversPanel();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.navigateToComposer = function(section) {
  switchAdminView('panel-compose');
  const targetSection = section || (activeManageFilter && activeManageFilter !== 'all' ? activeManageFilter : 'news');
  const select = document.getElementById('postSectionSelect');
  if (select) {
    select.value = targetSection;
    handleSectionChange(targetSection);
  }
  const postCard = document.getElementById('adminPostCard');
  if (postCard) {
    postCard.scrollIntoView({ behavior: 'smooth' });
  }
};

// Aliases for compatibility
window.openAdminComposer = window.navigateToComposer;
window.closeAdminComposer = function() {
  switchAdminView('panel-content');
};

window.toggleAdminSidebar = function() {
  const sidebar = document.getElementById('adminSidebar');
  const overlay = document.getElementById('adminMobileOverlay');
  if (sidebar) {
    const isOpen = sidebar.classList.toggle('open');
    if (overlay) overlay.style.display = isOpen ? 'block' : 'none';
  }
};

window.handleContentSearch = function(query) {
  const term = (query || '').toLowerCase().trim();
  const rows = document.querySelectorAll('#adminUpdatesTableBody tr');
  rows.forEach(r => {
    const text = r.textContent.toLowerCase();
    r.style.display = (!term || text.includes(term)) ? '' : 'none';
  });
};

window.handleMediaPanelUpload = async function(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const statusEl = document.getElementById('mediaUploadStatus');
  const urlInput = document.getElementById('mediaUploadedUrl');
  const previewImg = document.getElementById('mediaUploadPreview');
  if (statusEl) {
    statusEl.textContent = `Uploading ${file.name} to ImageKit CDN...`;
    statusEl.style.color = 'var(--admin-gold-light)';
  }

  try {
    if (window.ScreenladyAPI && typeof window.ScreenladyAPI.uploadMedia === 'function') {
      const res = await window.ScreenladyAPI.uploadMedia(file, '', 'editorial-media');
      const cdnUrl = res.url || res.fileUrl || (res.data && res.data.url);
      if (cdnUrl) {
        if (statusEl) {
          statusEl.textContent = `Upload Successful: ${file.name}`;
          statusEl.style.color = '#34D399';
        }
        if (urlInput) urlInput.value = cdnUrl;
        if (previewImg) {
          previewImg.src = cdnUrl;
          previewImg.style.display = 'block';
        }
        showToast('Image uploaded to ImageKit CDN successfully.');
      } else {
        throw new Error('No URL returned from CDN');
      }
    }
  } catch (err) {
    if (statusEl) {
      statusEl.textContent = `Upload Error: ${err.message}`;
      statusEl.style.color = '#F87171';
    }
  }
};

function renderMediaPresets() {
  const grid = document.getElementById('mediaLibraryPresetsGrid');
  if (!grid) return;
  grid.innerHTML = ADMIN_PHOTO_PRESETS.map(p => `
    <div class="photo-preset-choice" onclick="navigator.clipboard.writeText('${p.path}'); showToast('CDN URL copied: ${escapeHtml(p.label)}');" title="${p.label}" style="display: flex; align-items: center; gap: 0.65rem; padding: 0.5rem; background: rgba(14, 18, 25, 0.7); border: 1px solid var(--admin-border); border-radius: var(--admin-radius-sm); cursor: pointer; text-align: left; width: 100%;">
      <img src="${p.path}" alt="${p.label}" style="width: 44px; height: 44px; border-radius: 4px; object-fit: cover; flex-shrink: 0;">
      <div style="flex: 1; min-width: 0;">
        <div style="font-size: 0.82rem; font-weight: 600; color: #FFFFFF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(p.label)}</div>
        <div style="font-size: 0.72rem; color: var(--admin-gold-light);">Click to copy URL</div>
      </div>
    </div>
  `).join('');
}

/* =============================================================
   2. Form Controls & Dynamic Section Switcher
============================================================= */
function initFormControls() {
  const dateInput = document.getElementById('postDate');
  if (dateInput && !dateInput.value) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }

  // Setup photo preset grid
  renderPresetButtons();

  // File upload input listener
  const fileInput = document.getElementById('adminFileInput');
  if (fileInput) fileInput.addEventListener('change', handleFileUpload);

  // Direct photo path listener
  const photoInput = document.getElementById('postPhotoInput');
  if (photoInput) {
    photoInput.addEventListener('input', () => updatePhotoPreview(photoInput.value));
  }

  // Post form submit
  const form = document.getElementById('adminPostForm');
  if (form) form.addEventListener('submit', handlePostSubmit);

  // Magazine Cover Drag & Drop area listener
  const dropArea = document.getElementById('magCoverDropArea');
  if (dropArea) {
    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropArea.style.borderColor = 'var(--admin-gold)';
        dropArea.style.background = 'rgba(212,175,55,0.12)';
      }, false);
    });
    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropArea.style.borderColor = 'rgba(212,175,55,0.45)';
        dropArea.style.background = 'rgba(212,175,55,0.03)';
      }, false);
    });
    dropArea.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      if (dt && dt.files && dt.files.length > 0) {
        handleMagCoverPhotoUpload(e);
      }
    }, false);
  }

  // Set initial section UI
  const sectionSelect = document.getElementById('postSectionSelect');
  if (sectionSelect && sectionSelect.value) {
    currentSection = sectionSelect.value;
  }
  handleSectionChange(currentSection);
}

window.handleSectionChange = function(section) {
  currentSection = section;

  const badge = document.getElementById('sectionNoticeBadge');
  const submitBtn = document.getElementById('adminSubmitBtn');
  const formTitle = document.getElementById('formCardTitle');

  // Fields Containers
  const fEditorials = document.getElementById('sectionFieldsEditorials');
  const fPodcast = document.getElementById('sectionFieldsPodcast');
  const fPhotos = document.getElementById('sectionFieldsPhotos');
  const fUpdates = document.getElementById('sectionFieldsUpdates');
  const fBrandAds = document.getElementById('sectionFieldsBrandAds');
  const updatesSubtypes = document.getElementById('updatesTypeSelectorRow');
  const photoLabel = document.getElementById('photoPickerLabel');
  const dateLabel = document.getElementById('dateInputLabel');

  const groupCategory = document.getElementById('groupCommonCategory');
  const groupTags = document.getElementById('groupCommonTags');
  if (groupCategory) groupCategory.style.display = (section === 'photos') ? 'none' : 'block';
  if (groupTags) groupTags.style.display = (section === 'photos' || section === 'business_ads' || section === 'home_photos') ? 'none' : 'block';

  const isCuratedHomepageSection = ['filmy_adda', 'bizz_world', 'women_inspiration', 'fashion_lifestyle'].includes(section);
  if (fEditorials) fEditorials.style.display = section === 'editorials' ? 'block' : 'none';
  if (fPodcast) fPodcast.style.display = section === 'podcast' ? 'block' : 'none';
  if (fPhotos) fPhotos.style.display = (section === 'photos') ? 'block' : 'none';
  if (fBrandAds) fBrandAds.style.display = (section === 'business_ads' || section === 'home_photos') ? 'block' : 'none';
  if (fUpdates) fUpdates.style.display = (section === 'updates' || section === 'news' || isCuratedHomepageSection) ? 'block' : 'none';
  if (updatesSubtypes) updatesSubtypes.style.display = (section === 'updates' || section === 'news') ? 'block' : 'none';

  // Populate relevant categories
  populateCategorySelect(section);

  if (section === 'news') {
    if (badge) {
      badge.textContent = 'Publishing to Live News (Homepage Screenlady Updates)';
      badge.className = 'section-pill-badge badge-updates';
    }
    if (submitBtn && !editingItem) submitBtn.textContent = '✦ Publish Live News (Displays 1st on Homepage Screenlady Updates)';
    if (formTitle && !editingItem) formTitle.textContent = 'Publish Daily Live News (Homepage Screenlady Updates)';
    if (photoLabel) photoLabel.textContent = 'News Thumbnail / Featured Visual (Displayed on Left of Card)';
    if (dateLabel) dateLabel.textContent = 'News Release Date';
    switchUpdateSubtype('news');
  } else if (section === 'filmy_adda') {
    if (badge) {
      badge.textContent = 'Publishing to Filmy Adda (Homepage 4-Photo Showcase + Updates)';
      badge.className = 'section-pill-badge badge-updates';
    }
    if (submitBtn && !editingItem) submitBtn.textContent = '✦ Publish Filmy Adda Feature (Displays 1st on Homepage)';
    if (formTitle && !editingItem) formTitle.textContent = 'Publish Filmy Adda Feature (Film Photo & Information)';
    if (photoLabel) photoLabel.textContent = 'Film Still / Cinema Photo / Celebrity Visual (Displays in 4-Photo Grid)';
    if (dateLabel) dateLabel.textContent = 'Film Release / Event Date';

    const groupWomanName = document.getElementById('groupWomanName');
    const groupHeadline = document.getElementById('groupHeadline');
    const groupArticleTitle = document.getElementById('groupArticleTitle');
    const groupAuthor = document.getElementById('groupAuthor');
    const groupPhotoTitle = document.getElementById('groupPhotoTitle');
    const groupCredit = document.getElementById('groupCredit');
    const groupSummary = document.getElementById('groupSummary');
    const groupFullBody = document.getElementById('groupFullBody');
    const summaryLabel = document.getElementById('summaryLabel');

    if (groupWomanName) groupWomanName.style.display = 'none';
    if (groupHeadline) {
      groupHeadline.style.display = 'block';
      const lbl = groupHeadline.querySelector('label');
      if (lbl) lbl.textContent = 'Film Title / Celebrity Headline';
    }
    if (groupArticleTitle) groupArticleTitle.style.display = 'none';
    if (groupAuthor) groupAuthor.style.display = 'none';
    if (groupPhotoTitle) groupPhotoTitle.style.display = 'none';
    if (groupCredit) groupCredit.style.display = 'none';
    if (groupSummary) {
      groupSummary.style.display = 'block';
      if (summaryLabel) summaryLabel.textContent = '1-Line Catchphrase / Key Highlight (Displayed on Photo Hover)';
    }
    if (groupFullBody) {
      groupFullBody.style.display = 'block';
      const lbl = groupFullBody.querySelector('label');
      if (lbl) lbl.textContent = 'Full Film Information & Story (Readable in Updates Section)';
    }
  } else if (section === 'bizz_world') {
    if (badge) {
      badge.textContent = 'Publishing to Bizz World (Homepage 4-Photo Showcase + Updates)';
      badge.className = 'section-pill-badge badge-updates';
    }
    if (submitBtn && !editingItem) submitBtn.textContent = '✦ Publish Bizz World Feature (Displays 1st on Homepage)';
    if (formTitle && !editingItem) formTitle.textContent = 'Publish Bizz World Feature (Business Photo & Information)';
    if (photoLabel) photoLabel.textContent = 'Business / Entrepreneur Visual (Displays in 4-Photo Grid)';
    if (dateLabel) dateLabel.textContent = 'Business / Conclave Date';

    const groupWomanName = document.getElementById('groupWomanName');
    const groupHeadline = document.getElementById('groupHeadline');
    const groupArticleTitle = document.getElementById('groupArticleTitle');
    const groupAuthor = document.getElementById('groupAuthor');
    const groupPhotoTitle = document.getElementById('groupPhotoTitle');
    const groupCredit = document.getElementById('groupCredit');
    const groupSummary = document.getElementById('groupSummary');
    const groupFullBody = document.getElementById('groupFullBody');
    const summaryLabel = document.getElementById('summaryLabel');

    if (groupWomanName) groupWomanName.style.display = 'none';
    if (groupHeadline) {
      groupHeadline.style.display = 'block';
      const lbl = groupHeadline.querySelector('label');
      if (lbl) lbl.textContent = 'Business Headline / Company / Venture Title';
    }
    if (groupArticleTitle) groupArticleTitle.style.display = 'none';
    if (groupAuthor) groupAuthor.style.display = 'none';
    if (groupPhotoTitle) groupPhotoTitle.style.display = 'none';
    if (groupCredit) groupCredit.style.display = 'none';
    if (groupSummary) {
      groupSummary.style.display = 'block';
      if (summaryLabel) summaryLabel.textContent = '1-Line Business Highlight / Milestone (Displayed on Photo Hover)';
    }
    if (groupFullBody) {
      groupFullBody.style.display = 'block';
      const lbl = groupFullBody.querySelector('label');
      if (lbl) lbl.textContent = 'Full Business Journey & Enterprise Story (Readable in Updates Section)';
    }
  } else if (section === 'women_inspiration') {
    if (badge) {
      badge.textContent = 'Publishing to Women of Inspiration (Homepage Showcase + Updates)';
      badge.className = 'section-pill-badge badge-updates';
    }
    if (submitBtn && !editingItem) submitBtn.textContent = '✦ Publish Honoree Profile (Displays 1st on Homepage)';
    if (formTitle && !editingItem) formTitle.textContent = 'Publish Women of Inspiration (Honoree Photo, Name & Struggle Story)';
    if (photoLabel) photoLabel.textContent = 'Honoree Photograph (Displays in Homepage Showcase Frame)';
    if (dateLabel) dateLabel.textContent = 'Honors / Milestone Date';

    const groupWomanName = document.getElementById('groupWomanName');
    const groupHeadline = document.getElementById('groupHeadline');
    const groupArticleTitle = document.getElementById('groupArticleTitle');
    const groupAuthor = document.getElementById('groupAuthor');
    const groupPhotoTitle = document.getElementById('groupPhotoTitle');
    const groupCredit = document.getElementById('groupCredit');
    const groupSummary = document.getElementById('groupSummary');
    const groupFullBody = document.getElementById('groupFullBody');
    const summaryLabel = document.getElementById('summaryLabel');

    if (groupWomanName) {
      groupWomanName.style.display = 'block';
      const lbl = groupWomanName.querySelector('label');
      if (lbl) lbl.textContent = 'Honoree Name (Displayed Directly Under Photo on Homepage)';
    }
    if (groupHeadline) {
      groupHeadline.style.display = 'block';
      const lbl = groupHeadline.querySelector('label');
      if (lbl) lbl.textContent = 'Achievement Title / Honors Kicker';
    }
    if (groupArticleTitle) groupArticleTitle.style.display = 'none';
    if (groupAuthor) groupAuthor.style.display = 'none';
    if (groupPhotoTitle) groupPhotoTitle.style.display = 'none';
    if (groupCredit) groupCredit.style.display = 'none';
    if (groupSummary) {
      groupSummary.style.display = 'block';
      if (summaryLabel) summaryLabel.textContent = '1-Line Struggle to Success Highlight';
    }
    if (groupFullBody) {
      groupFullBody.style.display = 'block';
      const lbl = groupFullBody.querySelector('label');
      if (lbl) lbl.textContent = 'Full Struggle-to-Success Biography & Story (Readable in Updates Section)';
    }
  } else if (section === 'fashion_lifestyle') {
    if (badge) {
      badge.textContent = 'Publishing to Fashion and Lifestyle (Homepage Showcase + Updates)';
      badge.className = 'section-pill-badge badge-updates';
    }
    if (submitBtn && !editingItem) submitBtn.textContent = '✦ Publish Fashion & Lifestyle Feature (Displays 1st on Homepage)';
    if (formTitle && !editingItem) formTitle.textContent = 'Publish Fashion & Lifestyle (Photo & 1-Line Description)';
    if (photoLabel) photoLabel.textContent = 'Fashion / Jewellery / Lifestyle Photo (Displays in Homepage Frame)';
    if (dateLabel) dateLabel.textContent = 'Feature Date';

    const groupWomanName = document.getElementById('groupWomanName');
    const groupHeadline = document.getElementById('groupHeadline');
    const groupArticleTitle = document.getElementById('groupArticleTitle');
    const groupAuthor = document.getElementById('groupAuthor');
    const groupPhotoTitle = document.getElementById('groupPhotoTitle');
    const groupCredit = document.getElementById('groupCredit');
    const groupSummary = document.getElementById('groupSummary');
    const groupFullBody = document.getElementById('groupFullBody');
    const summaryLabel = document.getElementById('summaryLabel');

    if (groupWomanName) groupWomanName.style.display = 'none';
    if (groupHeadline) {
      groupHeadline.style.display = 'block';
      const lbl = groupHeadline.querySelector('label');
      if (lbl) lbl.textContent = '1-Line Description (Displayed Directly Under Photo on Homepage)';
      const input = document.getElementById('postHeadline');
      if (input) input.placeholder = 'e.g. Contemporary Silhouettes & Ethnic Grace (or any 1-line style title)';
    }
    if (groupArticleTitle) groupArticleTitle.style.display = 'none';
    if (groupAuthor) groupAuthor.style.display = 'none';
    if (groupPhotoTitle) groupPhotoTitle.style.display = 'none';
    if (groupCredit) groupCredit.style.display = 'none';
    if (groupSummary) {
      groupSummary.style.display = 'block';
      if (summaryLabel) summaryLabel.textContent = 'Trend Summary / Style Highlight';
      const summaryInput = document.getElementById('postSummary');
      if (summaryInput) summaryInput.placeholder = 'Brief summary of the fashion collection, designer background, or style trends...';
    }
    if (groupFullBody) {
      groupFullBody.style.display = 'block';
      const lbl = groupFullBody.querySelector('label');
      if (lbl) lbl.textContent = 'Full Fashion & Lifestyle Story (Readable in Updates Section)';
      const fullInput = document.getElementById('postFullBody');
      if (fullInput) fullInput.placeholder = 'Write full feature story, artisanal details, and extended fashion chronicle...';
    }
  } else if (section === 'business_ads' || section === 'home_photos') {
    if (badge) {
      badge.textContent = 'Publishing to Brand Spotlight (Homepage Right Column - business_ads table)';
      badge.className = 'section-pill-badge badge-photos';
    }
    if (submitBtn && !editingItem) submitBtn.textContent = '✦ Publish Brand Spotlight Showcase';
    if (formTitle && !editingItem) formTitle.textContent = 'Publish Brand Partner Spotlight (Homepage)';
    if (photoLabel) photoLabel.textContent = 'Brand Banner / Product Showcase Visual (ImageKit CDN)';
    if (dateLabel) dateLabel.textContent = 'Spotlight Release Date';
  } else if (section === 'photos') {
    if (badge) {
      badge.textContent = 'Publishing to Photo Gallery (Strictly /photos Page - gallery_photos table)';
      badge.className = 'section-pill-badge badge-photos';
    }
    if (submitBtn && !editingItem) submitBtn.textContent = '✦ Publish Gallery Photograph';
    if (formTitle && !editingItem) formTitle.textContent = 'Publish Visual Gallery Photograph (/photos only)';
    if (photoLabel) photoLabel.textContent = 'Event / Studio Photograph (ImageKit CDN)';
    if (dateLabel) dateLabel.textContent = 'Photo Date';
  } else if (section === 'editorials') {
    if (badge) {
      badge.textContent = 'Publishing to Editorials Page (editorials.html)';
      badge.className = 'section-pill-badge badge-editorials';
    }
    if (submitBtn && !editingItem) submitBtn.textContent = '✦ Publish Editorial (Displays 1st on Editorials Page)';
    if (formTitle && !editingItem) formTitle.textContent = 'Write New Editorial Article & Column';
    if (photoLabel) photoLabel.textContent = 'Article Header / Cover Image';
    if (dateLabel) dateLabel.textContent = 'Article Publication Date';
  } else if (section === 'podcast') {
    if (badge) {
      badge.textContent = 'Publishing to Podcast Page (podcast.html)';
      badge.className = 'section-pill-badge badge-podcast';
    }
    if (submitBtn && !editingItem) submitBtn.textContent = '✦ Publish Podcast Episode (Displays 1st with 10s Preview)';
    if (formTitle && !editingItem) formTitle.textContent = 'Broadcast New Podcast Episode';
    if (photoLabel) photoLabel.textContent = 'Podcast Episode Cover Image';
    if (dateLabel) dateLabel.textContent = 'Episode Broadcast Date';
  } else if (section === 'photos') {
    if (badge) {
      badge.textContent = 'Publishing to Accolade Screenlady Gallery (photos.html)';
      badge.className = 'section-pill-badge badge-photos';
    }
    if (submitBtn && !editingItem) submitBtn.textContent = '✦ Publish Photo (Displays 1st in Accolade Screenlady Gallery)';
    if (formTitle && !editingItem) formTitle.textContent = 'Upload / Publish Gallery Photograph';
    if (photoLabel) photoLabel.textContent = 'Upload Photo / Select Image';
    if (dateLabel) dateLabel.textContent = 'Photograph Date';
  } else {
    // updates
    if (badge) {
      badge.textContent = 'Publishing to Screenlady Updates (updates.html)';
      badge.className = 'section-pill-badge badge-updates';
    }
    if (submitBtn && !editingItem) submitBtn.textContent = '✦ Publish Update (Displays 1st on Screenlady Updates)';
    if (formTitle && !editingItem) formTitle.textContent = 'Publish Screenlady Update';
    if (photoLabel) photoLabel.textContent = 'Update Photo / Visual';
    if (dateLabel) dateLabel.textContent = 'Event / Update Date';
    switchUpdateSubtype(currentUpdateType === 'news' ? 'photo-info' : currentUpdateType);
  }
};

function populateCategorySelect(section) {
  const select = document.getElementById('postCategory');
  if (!select) return;
  const categories = SECTION_CATEGORIES[section] || SECTION_CATEGORIES.editorials;
  select.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

window.switchUpdateSubtype = function(type) {
  currentUpdateType = type;
  document.querySelectorAll('#updatesTypeSelectorRow .admin-type-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-type') === type);
  });

  const groupWomanName = document.getElementById('groupWomanName');
  const groupHeadline = document.getElementById('groupHeadline');
  const groupArticleTitle = document.getElementById('groupArticleTitle');
  const groupAuthor = document.getElementById('groupAuthor');
  const groupPhotoTitle = document.getElementById('groupPhotoTitle');
  const groupCredit = document.getElementById('groupCredit');
  const groupSummary = document.getElementById('groupSummary');
  const groupFullBody = document.getElementById('groupFullBody');
  const summaryLabel = document.getElementById('summaryLabel');

  if (type === 'news') {
    if (groupWomanName) groupWomanName.style.display = 'none';
    if (groupHeadline) {
      groupHeadline.style.display = 'block';
      const lbl = groupHeadline.querySelector('label');
      if (lbl) lbl.textContent = 'Live News Headline / Title';
    }
    if (groupArticleTitle) groupArticleTitle.style.display = 'none';
    if (groupAuthor) groupAuthor.style.display = 'none';
    if (groupPhotoTitle) groupPhotoTitle.style.display = 'none';
    if (groupCredit) groupCredit.style.display = 'none';
    if (groupSummary) {
      groupSummary.style.display = 'block';
      if (summaryLabel) summaryLabel.textContent = 'News Summary / 1-Line Key Highlights (Displayed on Homepage)';
    }
    if (groupFullBody) groupFullBody.style.display = 'block';
  } else if (type === 'article') {
    if (groupWomanName) groupWomanName.style.display = 'none';
    if (groupHeadline) groupHeadline.style.display = 'none';
    if (groupArticleTitle) groupArticleTitle.style.display = 'block';
    if (groupAuthor) groupAuthor.style.display = 'block';
    if (groupPhotoTitle) groupPhotoTitle.style.display = 'none';
    if (groupCredit) groupCredit.style.display = 'none';
    if (groupSummary) groupSummary.style.display = 'block';
    if (groupFullBody) groupFullBody.style.display = 'block';
    if (summaryLabel) summaryLabel.textContent = 'Story Abstract / 1-Line Highlight';
  } else if (type === 'photo') {
    if (groupWomanName) groupWomanName.style.display = 'none';
    if (groupHeadline) groupHeadline.style.display = 'none';
    if (groupArticleTitle) groupArticleTitle.style.display = 'none';
    if (groupAuthor) groupAuthor.style.display = 'none';
    if (groupPhotoTitle) groupPhotoTitle.style.display = 'block';
    if (groupCredit) groupCredit.style.display = 'block';
    if (groupSummary) groupSummary.style.display = 'block';
    if (groupFullBody) groupFullBody.style.display = 'none';
    if (summaryLabel) summaryLabel.textContent = 'Photo Caption / 1-Line Description';
  } else {
    // photo-info
    if (groupWomanName) groupWomanName.style.display = 'block';
    if (groupHeadline) groupHeadline.style.display = 'block';
    if (groupArticleTitle) groupArticleTitle.style.display = 'none';
    if (groupAuthor) groupAuthor.style.display = 'none';
    if (groupPhotoTitle) groupPhotoTitle.style.display = 'none';
    if (groupCredit) groupCredit.style.display = 'none';
    if (groupSummary) groupSummary.style.display = 'block';
    if (groupFullBody) groupFullBody.style.display = 'block';
    if (summaryLabel) summaryLabel.textContent = 'Milestone Summary / 1-Line Highlight';
  }
};

/* =============================================================
   3. Image Picker, Local File Uploader & Preview
============================================================= */
function renderPresetButtons() {
  const container = document.getElementById('adminPresetGrid');
  if (!container) return;

  container.innerHTML = ADMIN_PHOTO_PRESETS.map((p, idx) => `
    <div class="photo-preset-choice ${idx === 0 ? 'active' : ''}" onclick="selectAdminPreset('${p.path}', this)" title="${p.label}">
      <img src="${p.path}" alt="${p.label}">
    </div>
  `).join('');
}

window.selectAdminPreset = function(path, el) {
  document.querySelectorAll('#adminPresetGrid .photo-preset-choice').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
  const input = document.getElementById('postPhotoInput');
  if (input) input.value = path;
  updatePhotoPreview(path);
};

function updatePhotoPreview(src) {
  const preview = document.getElementById('adminPhotoPreview');
  if (preview) preview.src = src;
}

function handleFileUpload(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const statusEl = document.getElementById('uploadFileStatus');
  if (statusEl) {
    statusEl.textContent = `Optimizing ${file.name} for web display...`;
    statusEl.style.color = 'var(--gold-light)';
  }

  const reader = new FileReader();
  reader.onload = function(evt) {
    const rawDataUrl = evt.target.result;

    // Use HTML5 Canvas to resize and compress photos, ensuring they fit within storage quotas
    const img = new Image();
    img.onload = function() {
      const maxDim = 1200;
      let width = img.width;
      let height = img.height;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Compress to high-efficiency web JPEG
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);

      const photoInput = document.getElementById('postPhotoInput');
      if (photoInput) photoInput.value = compressedDataUrl;
      updatePhotoPreview(compressedDataUrl);

      document.querySelectorAll('#adminPresetGrid .photo-preset-choice').forEach(c => c.classList.remove('active'));

      if (window.ScreenladyAPI && typeof window.ScreenladyAPI.uploadMedia === 'function') {
        if (statusEl) {
          statusEl.textContent = `Uploading ${file.name} to ImageKit CDN...`;
          statusEl.style.color = 'var(--gold-light)';
        }
        window.ScreenladyAPI.uploadMedia(file)
          .then(res => {
            if (res && res.url) {
              if (photoInput) photoInput.value = res.url;
              updatePhotoPreview(res.url);
              if (statusEl) {
                const isLive = res.url.startsWith('http');
                statusEl.textContent = `✓ ImageKit CDN Ready: ${res.name || file.name} (${isLive ? 'Live CDN URL' : 'Optimized'})`;
                statusEl.style.color = '#4ade80';
              }
            }
          })
          .catch(err => {
            console.warn('[Screenlady Admin] ImageKit upload fallback notice:', err.message);
            if (statusEl) {
              statusEl.textContent = `✓ Photo Ready: ${file.name} (Optimized for Web)`;
              statusEl.style.color = '#4ade80';
            }
          });
      } else {
        if (statusEl) {
          const origSizeKb = Math.round(file.size / 1024);
          const newSizeKb = Math.round(compressedDataUrl.length * 0.75 / 1024);
          statusEl.textContent = `✓ Photo Ready: ${file.name} (${origSizeKb}KB → ${newSizeKb}KB, optimized for Homepage)`;
          statusEl.style.color = '#4ade80';
        }
      }
    };

    img.onerror = function() {
      // Direct fallback if canvas fails
      const photoInput = document.getElementById('postPhotoInput');
      if (photoInput) photoInput.value = rawDataUrl;
      updatePhotoPreview(rawDataUrl);
      if (statusEl) {
        statusEl.textContent = `✓ Uploaded: ${file.name} (Ready to publish)`;
        statusEl.style.color = '#4ade80';
      }
    };

    img.src = rawDataUrl;
  };
  reader.readAsDataURL(file);
}

/* =============================================================
   4. Save, Edit & Publish Handler (Per Selected Section)
============================================================= */
function handlePostSubmit(e) {
  e.preventDefault();

  const section = currentSection;
  const dateStr = document.getElementById('postDate').value || new Date().toISOString().split('T')[0];
  const category = document.getElementById('postCategory').value.trim() || 'General';
  const photo = document.getElementById('postPhotoInput').value.trim() || 'https://ik.imagekit.io/acooladescreenlady/assets/images/featured-icon-saree.jpg';
  const rawTags = document.getElementById('postTags').value.trim();
  const tags = rawTags ? rawTags.split(',').map(t => t.trim()).filter(Boolean) : [category];

  const dateObj = new Date(dateStr);
  const displayDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // -------------------------------------------------------------
  // SECTION: EDITORIALS
  // -------------------------------------------------------------
  if (section === 'editorials') {
    const title = (document.getElementById('postEditorialTitle')?.value || '').trim() || 'Accolade Screenlady Feature Editorial';
    const author = (document.getElementById('postEditorialAuthor')?.value || '').trim() || 'Accolade Screenlady Desk';
    const designation = (document.getElementById('postEditorialDesignation')?.value || '').trim() || 'Guest Columnist';
    const readTime = (document.getElementById('postEditorialReadTime')?.value || '').trim() || '5 Min Read';
    const pullQuote = (document.getElementById('postEditorialQuote')?.value || '').trim();
    const rawBody = (document.getElementById('postEditorialBody')?.value || '').trim();

    const formattedContent = formatParagraphs(rawBody);
    const firstLineBody = rawBody ? (rawBody.split(/\n+/).filter(Boolean)[0] || '') : '';
    const editorialSummary = pullQuote || (firstLineBody.length > 160 ? firstLineBody.substring(0, 157) + '...' : firstLineBody) || title;
    const finalFullContent = formattedContent || `<p>${escapeHtml(editorialSummary)}</p>`;

    const newEditorial = {
      id: (editingItem && editingItem.section === 'editorials') ? editingItem.id : `editorial-custom-${Date.now()}`,
      title: title,
      headline: title,
      author: author,
      authorRole: designation,
      authorDesignation: designation,
      readTime: readTime,
      pullQuote: pullQuote || editorialSummary,
      summary: editorialSummary,
      fullBody: finalFullContent,
      content: finalFullContent,
      fullContent: finalFullContent,
      previewExcerptHtml: `<div class="editorial-lead-box" style="margin-bottom: 0.95rem; padding: 0.85rem 1.1rem; font-size: 0.92rem;"><strong>(Accolade Screenlady Editorial)</strong> ${escapeHtml(editorialSummary)}</div>${finalFullContent.split(/<\/p>/i).slice(0, 3).map(p => p.trim() ? p + '</p>' : '').join('\n')}`,
      date: dateStr,
      displayDate: displayDate,
      category: category,
      categoryBadge: `✦ ${category}`,
      photo: photo,
      photoCaption: title,
      tags: tags,
      timestamp: Date.now()
    };

    saveCustomItem('screenlady_custom_editorials', newEditorial);
    showToast('✦ Editorial saved successfully! It is live on the Editorials page.');
  }

  // -------------------------------------------------------------
  // SECTION: PODCAST
  // -------------------------------------------------------------
  else if (section === 'podcast') {
    const title = (document.getElementById('postPodcastTitle')?.value || '').trim() || 'Accolade Screenlady Podcast Episode';
    const host = (document.getElementById('postPodcastHost')?.value || '').trim() || 'Accolade Screenlady Desk';
    const guest = (document.getElementById('postPodcastGuest')?.value || '').trim() || 'Distinguished Guest';
    const duration = (document.getElementById('postPodcastDuration')?.value || '').trim() || '38 Mins';
    const socialLink = (document.getElementById('postPodcastSocialLink')?.value || '').trim() || 'https://youtube.com';
    const audioUrl = (document.getElementById('postPodcastAudioUrl')?.value || '').trim();
    const showNotes = (document.getElementById('postPodcastShowNotes')?.value || '').trim();

    const cleanNotes = showNotes ? showNotes.split(/\n+/).filter(Boolean) : [];
    const firstLineNotes = cleanNotes.length > 0 ? cleanNotes[0] : '';
    const podcastSummary = firstLineNotes.length > 160 ? firstLineNotes.substring(0, 157) + '...' : (firstLineNotes || title);
    const fullShowNotes = showNotes || title;

    const newPodcast = {
      id: (editingItem && editingItem.section === 'podcast') ? editingItem.id : `podcast-custom-${Date.now()}`,
      title: title,
      host: host,
      guest: guest,
      duration: duration,
      socialLink: socialLink,
      audioUrl: audioUrl || '',
      summary: podcastSummary,
      showNotes: formatParagraphs(fullShowNotes),
      date: dateStr,
      displayDate: displayDate,
      category: category,
      photo: photo,
      tags: tags,
      timestamp: Date.now()
    };

    saveCustomItem('screenlady_custom_podcasts', newPodcast);
    showToast('✦ Podcast episode published! It now appears 1st with a 10s preview on the Podcast page.');
  }

  // -------------------------------------------------------------
  // SECTION: LIVE NEWS (HOMEPAGE SCREENLADY UPDATES)
  // -------------------------------------------------------------
  else if (section === 'news' || (section === 'updates' && currentUpdateType === 'news')) {
    const headline = (document.getElementById('postHeadline')?.value || '').trim() || 'Screenlady Live News Update';
    const summary = (document.getElementById('postSummary')?.value || '').trim() || headline;
    const fullBody = (document.getElementById('postFullBody')?.value || '').trim() || summary;

    const newNews = {
      id: (editingItem && (editingItem.section === 'news' || editingItem.section === 'updates')) ? editingItem.id : `news-custom-${Date.now()}`,
      type: 'news',
      curatedSection: 'news',
      isHomepageNews: true,
      category: category,
      categoryBadge: `✦ ${category}`,
      date: dateStr,
      displayDate: displayDate,
      title: headline,
      headline: headline,
      summary: summary,
      infoSummary: summary,
      fullBody: formatParagraphs(fullBody),
      fullInfo: formatParagraphs(fullBody),
      photo: photo,
      tags: tags,
      link: 'javascript:void(0)',
      timestamp: Date.now()
    };

    saveCustomItem('screenlady_custom_news', newNews);
    showToast('✦ Live News published! It now appears 1st on the Homepage under Screenlady Updates.');
  }

  // -------------------------------------------------------------
  // SECTION: BUSINESS ADS / BRAND SPOTLIGHT (HOMEPAGE RIGHT COLUMN - business_ads table)
  // -------------------------------------------------------------
  else if (section === 'business_ads' || section === 'home_photos') {
    const brandName = (document.getElementById('postBrandName')?.value || document.getElementById('postHeadline')?.value || '').trim() || 'Featured Brand Partner';
    const headline = (document.getElementById('postBrandHeadline')?.value || document.getElementById('postHeadline')?.value || '').trim() || brandName;
    const tagline = (document.getElementById('postBrandTagline')?.value || '').trim();
    const summary = (document.getElementById('postBrandSummary')?.value || document.getElementById('postSummary')?.value || '').trim();
    const destUrl = (document.getElementById('postBrandDestUrl')?.value || '').trim() || 'https://instagram.com';
    const brandCat = (document.getElementById('postBrandCategory')?.value || category || 'Enterprise').trim();

    const newAd = {
      id: (editingItem && (editingItem.section === 'business_ads' || editingItem.section === 'home_photos')) ? editingItem.id : `ad-custom-${Date.now()}`,
      section: 'business_ads',
      brandName: brandName,
      title: headline,
      headline: headline,
      tagline: tagline,
      summary: summary,
      infoSummary: summary,
      category: brandCat,
      categoryBadge: 'Brand Spotlight',
      photo: photo,
      image: photo,
      destinationUrl: destUrl,
      link: destUrl,
      date: dateStr,
      displayDate: displayDate,
      timestamp: Date.now()
    };

    saveCustomItem('screenlady_custom_business_ads', newAd, 'business_ads');
    showToast('✦ Brand Spotlight published! It now displays in the Homepage Brand Spotlight showcase.');
  }

  // -------------------------------------------------------------
  // SECTION: PHOTOS (ACCOLADE SCREENLADY GALLERY)
  // -------------------------------------------------------------
  else if (section === 'photos') {
    const photoTitle = (document.getElementById('postPhotoTitle')?.value || '').trim() ||
                       (document.getElementById('postPhotoCaption')?.value || '').trim() ||
                       'Accolade Screenlady Gallery Photograph';
    const venue = (document.getElementById('postPhotoVenue')?.value || '').trim() || 'Screenlady Studios, Mumbai';
    const caption = (document.getElementById('postPhotoCaption')?.value || '').trim() || photoTitle;

    const newPhoto = {
      id: (editingItem && editingItem.section === 'photos') ? editingItem.id : `photo-custom-${Date.now()}`,
      title: photoTitle,
      venue: venue,
      location: venue,
      caption: caption,
      description: caption,
      summary: caption,
      date: dateStr,
      displayDate: displayDate,
      category: category || 'Gallery',
      photo: photo,
      credit: 'Official Screenlady Photography Archive',
      tags: tags || ['Gallery'],
      timestamp: Date.now()
    };

    saveCustomItem('screenlady_custom_photos', newPhoto);
    showToast('✦ Photo published! It now displays 1st in Accolade Screenlady Gallery.');
  }

  // -------------------------------------------------------------
  // SECTIONS: FILMY ADDA, BIZZ WORLD, WOMEN OF INSPIRATION, FASHION & LIFESTYLE
  // -------------------------------------------------------------
  else if (['filmy_adda', 'bizz_world', 'women_inspiration', 'fashion_lifestyle'].includes(section)) {
    const womanName = (document.getElementById('postWomanName')?.value || '').trim();
    const headline = (document.getElementById('postHeadline')?.value || '').trim();
    const summary = (document.getElementById('postSummary')?.value || '').trim();
    const fullBody = (document.getElementById('postFullBody')?.value || '').trim() || summary || headline;

    let displayTitle = headline;
    if (section === 'women_inspiration') {
      displayTitle = womanName || headline || 'Inspirational Honoree';
    } else if (!displayTitle) {
      displayTitle = (section === 'filmy_adda' ? 'Filmy Adda Cinema Feature' :
                     section === 'bizz_world' ? 'Bizz World Enterprise Feature' :
                     'Fashion & Lifestyle Collection');
    }

    const defaultBadges = {
      filmy_adda: '🎬 Cinema',
      bizz_world: '💼 Business',
      women_inspiration: '👑 Inspiration',
      fashion_lifestyle: '✨ Fashion & Style'
    };

    const targetItemId = (editingItem && editingItem.section === section) ? editingItem.id : `curated-${section}-${Date.now()}`;

    const sectionTargetUrls = {
      filmy_adda: 'http://localhost:4321/#filmyAddaSection',
      bizz_world: 'http://localhost:4321/#bizzWorldSection',
      women_inspiration: 'http://localhost:4321/#womenInspirationSection',
      fashion_lifestyle: 'http://localhost:4321/#fashionLifestyleSection'
    };

    const newCuratedItem = {
      id: targetItemId,
      curatedSection: section,
      type: 'photo-info',
      isHomepageNews: false,
      category: category,
      categoryBadge: `✦ ${category || defaultBadges[section]}`,
      date: dateStr,
      displayDate: displayDate,
      title: displayTitle,
      headline: headline || displayTitle,
      womanName: womanName || displayTitle,
      summary: summary || displayTitle,
      infoSummary: summary || displayTitle,
      fullBody: formatParagraphs(fullBody),
      fullInfo: formatParagraphs(fullBody),
      photo: photo,
      tags: tags,
      link: sectionTargetUrls[section] || 'http://localhost:4321/',
      timestamp: Date.now()
    };

    const targetStorageKey = section === 'filmy_adda' ? 'screenlady_custom_filmy' :
                             section === 'bizz_world' ? 'screenlady_custom_bizz' :
                             section === 'women_inspiration' ? 'screenlady_custom_inspiration' :
                             'screenlady_custom_fashion';

    saveCustomItem(targetStorageKey, newCuratedItem, section);

    const sectionLabels = {
      filmy_adda: 'Filmy Adda',
      bizz_world: 'Bizz World',
      women_inspiration: 'Women of Inspiration',
      fashion_lifestyle: 'Fashion & Lifestyle'
    };
    showToast(`✦ ${sectionLabels[section]} published! It now leads 1st on the Homepage under ${sectionLabels[section]}.`);
  }

  // -------------------------------------------------------------
  // SECTION: SCREENLADY UPDATES
  // -------------------------------------------------------------
  else {
    const type = currentUpdateType;
    const venue = (document.getElementById('postUpdateVenue')?.value || '').trim() || 'Screenlady Headquarters, Mumbai';
    const womanName = (document.getElementById('postWomanName')?.value || '').trim() || 'Accolade Screenlady Team';
    const headline = (document.getElementById('postHeadline')?.value || '').trim() || womanName || 'Screenlady Milestone Update';
    const summary = (document.getElementById('postSummary')?.value || '').trim() || headline;
    const fullBody = (document.getElementById('postFullBody')?.value || '').trim() || summary;

    let newUpdate = {
      id: (editingItem && editingItem.section === 'updates') ? editingItem.id : `update-custom-${Date.now()}`,
      type: type,
      date: dateStr,
      displayDate: displayDate,
      category: category,
      photo: photo,
      venue: venue,
      location: venue,
      womanName: womanName,
      teamMembers: womanName,
      tags: tags,
      timestamp: Date.now()
    };

    if (type === 'article') {
      const articleTitle = (document.getElementById('postArticleTitle')?.value || '').trim() || headline;
      const author = (document.getElementById('postAuthor')?.value || '').trim() || 'Accolade Screenlady Desk';

      newUpdate.title = articleTitle;
      newUpdate.headline = articleTitle;
      newUpdate.author = author;
      newUpdate.infoSummary = summary;
      newUpdate.summary = summary;
      newUpdate.fullInfo = formatParagraphs(fullBody);
      newUpdate.readTime = '4 Min Read';
    } else if (type === 'photo') {
      const photoTitle = (document.getElementById('postPhotoTitle')?.value || '').trim() || headline;
      const credit = (document.getElementById('postCredit')?.value || '').trim() || 'Screenlady Official Archives';
      const caption = summary;

      newUpdate.title = photoTitle;
      newUpdate.headline = photoTitle;
      newUpdate.photoCaption = caption;
      newUpdate.infoSummary = caption;
      newUpdate.summary = caption;
      newUpdate.credit = credit;
      newUpdate.fullInfo = `<p>${caption}</p>`;
    } else {
      // photo-info (Meetings, Awards, Movie Talk, Meet & Greet, Events)
      newUpdate.title = headline || womanName;
      newUpdate.headline = headline || womanName;
      newUpdate.infoSummary = summary;
      newUpdate.summary = summary;
      newUpdate.fullInfo = formatParagraphs(fullBody);
    }

    saveCustomItem('screenlady_custom_updates', newUpdate);
    showToast('✦ Update published! It now displays 1st on Screenlady Updates.');
  }

  resetForm();
  loadAdminDashboard();
  if (typeof switchAdminView === 'function') switchAdminView('panel-content');
}

/**
 * Save an item to the specified localStorage key (handles insert or update)
 * and dispatches live update to the Cloudflare Worker Backend API
 */
function saveCustomItem(storageKey, item, sectionOverride) {
  let list = [];
  try {
    const raw = localStorage.getItem(storageKey);
    list = raw ? JSON.parse(raw) : [];
  } catch (err) {
    list = [];
  }

  // Ensure item has custom tag and valid timestamp
  item.isCustom = true;
  if (!item.timestamp) item.timestamp = Date.now();

  const existingIndex = list.findIndex(i => i.id === item.id);
  if (existingIndex >= 0) {
    list[existingIndex] = item;
  } else {
    // Insert new item at the top (Latest first)
    list.unshift(item);
  }

  try {
    localStorage.setItem(storageKey, JSON.stringify(list));
    localStorage.setItem('screenlady_last_updated', Date.now().toString());
  } catch (err) {
    console.warn('LocalStorage quota limit reached, trimming older entries:', err);
    // Prune oldest custom items if storage is near quota
    while (list.length > 8) {
      list.pop();
      try {
        localStorage.setItem(storageKey, JSON.stringify(list));
        break;
      } catch (e) {}
    }
  }

  // Live Backend Cloudflare Worker Synchronization
  if (window.ScreenladyAPI && typeof window.ScreenladyAPI.publishItem === 'function') {
    let targetSection = sectionOverride || currentSection || 'updates';
    if (storageKey === 'screenlady_custom_editorials') targetSection = 'editorials';
    else if (storageKey === 'screenlady_custom_podcasts') targetSection = 'podcast';
    else if (storageKey === 'screenlady_custom_photos' || storageKey === 'screenlady_custom_home_photos') targetSection = 'photos';
    else if (storageKey === 'screenlady_custom_filmy') targetSection = 'filmy_adda';
    else if (storageKey === 'screenlady_custom_bizz') targetSection = 'bizz_world';
    else if (storageKey === 'screenlady_custom_inspiration') targetSection = 'women_inspiration';
    else if (storageKey === 'screenlady_custom_fashion') targetSection = 'fashion_lifestyle';
    else if (storageKey === 'screenlady_custom_news') targetSection = 'news';
    else if (storageKey === 'screenlady_custom_updates') targetSection = 'updates';

    window.ScreenladyAPI.publishItem(targetSection, item)
      .then(res => {
        if (res && res.success) {
          console.log(`[Screenlady Desk] Synced live to backend (${targetSection}):`, item.id);
        }
      })
      .catch(err => {
        console.warn(`[Screenlady Desk] Backend sync fallback notice:`, err.message);
      });
  }
}

/* =============================================================
   5. Dashboard Statistics & Table Management
============================================================= */
function isFilmyAddaItem(item) {
  if (!item) return false;
  if (item.isHomepageNews || item.curatedSection === 'news' || item.type === 'news' || (item.id && item.id.startsWith('news-'))) return false;
  if (item.curatedSection === 'filmy_adda') return true;
  if (item.curatedSection && item.curatedSection !== 'filmy_adda') return false;
  return false;
}

function isBizzWorldItem(item) {
  if (!item) return false;
  if (item.isHomepageNews || item.curatedSection === 'news' || item.type === 'news' || (item.id && item.id.startsWith('news-'))) return false;
  if (item.curatedSection === 'bizz_world') return true;
  if (item.curatedSection && item.curatedSection !== 'bizz_world') return false;
  return false;
}

function isInspirationItem(item) {
  if (!item) return false;
  if (item.isHomepageNews || item.curatedSection === 'news' || item.type === 'news' || (item.id && item.id.startsWith('news-'))) return false;
  if (item.curatedSection === 'women_inspiration') return true;
  if (item.curatedSection && item.curatedSection !== 'women_inspiration') return false;
  return false;
}

function isFashionItem(item) {
  if (!item) return false;
  if (item.isHomepageNews || item.curatedSection === 'news' || item.type === 'news' || (item.id && item.id.startsWith('news-'))) return false;
  if (item.curatedSection === 'fashion_lifestyle') return true;
  if (item.curatedSection && item.curatedSection !== 'fashion_lifestyle') return false;
  return false;
}

async function loadAdminDashboard() {
  updateStatCounters();
  renderManageTable();
  if (typeof renderMagazineOrdersTable === 'function') {
    renderMagazineOrdersTable();
  }
  if (typeof populateMagazineSettingsForm === 'function') {
    populateMagazineSettingsForm();
  }

  // Live Backend Synchronization across ALL content feeds
  if (window.ScreenladyAPI) {
    try {
      const [backendUpdates, backendNews, backendAds, backendEditorials, backendPhotos, backendPodcasts, backendOrders, deletedIds, backendMagazine, backendMagCovers] = await Promise.all([
        typeof window.ScreenladyAPI.getUpdates === 'function' ? window.ScreenladyAPI.getUpdates() : Promise.resolve([]),
        typeof window.ScreenladyAPI.getNews === 'function' ? window.ScreenladyAPI.getNews() : Promise.resolve([]),
        typeof window.ScreenladyAPI.getBusinessAds === 'function' ? window.ScreenladyAPI.getBusinessAds() : Promise.resolve([]),
        typeof window.ScreenladyAPI.getEditorials === 'function' ? window.ScreenladyAPI.getEditorials() : Promise.resolve([]),
        typeof window.ScreenladyAPI.getPhotos === 'function' ? window.ScreenladyAPI.getPhotos() : Promise.resolve([]),
        typeof window.ScreenladyAPI.getPodcasts === 'function' ? window.ScreenladyAPI.getPodcasts() : Promise.resolve([]),
        typeof window.ScreenladyAPI.getOrders === 'function' ? window.ScreenladyAPI.getOrders() : Promise.resolve([]),
        typeof window.ScreenladyAPI.getDeletedIds === 'function' ? window.ScreenladyAPI.getDeletedIds() : Promise.resolve([]),
        typeof window.ScreenladyAPI.getMagazineSettings === 'function' ? window.ScreenladyAPI.getMagazineSettings() : Promise.resolve(null),
        typeof window.ScreenladyAPI.getMagazineCovers === 'function' ? window.ScreenladyAPI.getMagazineCovers() : Promise.resolve([])
      ]);

      if (backendMagCovers && Array.isArray(backendMagCovers)) {
        window.backendLiveMagazineCovers = backendMagCovers;
        if (typeof renderMagazineCoversPanel === 'function') renderMagazineCoversPanel();
      }

      if (backendAds && Array.isArray(backendAds)) {
        window.backendLiveBusinessAds = backendAds;
      }

      if (backendMagazine) {
        if (typeof populateMagazineSettingsForm === 'function') {
          populateMagazineSettingsForm(backendMagazine);
        }
      }

      if (deletedIds && Array.isArray(deletedIds)) {
        window.backendDeletedIds = deletedIds;
      }
      if (backendUpdates && Array.isArray(backendUpdates)) {
        window.backendLiveUpdates = backendUpdates;
      }
      if (backendNews && Array.isArray(backendNews) && backendNews.length > 0) {
        window.backendLiveNews = backendNews;
      } else if (backendUpdates && Array.isArray(backendUpdates)) {
        window.backendLiveNews = backendUpdates;
      }
      if (backendEditorials && Array.isArray(backendEditorials)) {
        window.backendLiveEditorials = backendEditorials;
      }
      if (backendPhotos && Array.isArray(backendPhotos)) {
        window.backendLivePhotos = backendPhotos;
      }
      if (backendPodcasts && Array.isArray(backendPodcasts)) {
        window.backendLivePodcasts = backendPodcasts;
      }

      if (backendOrders && Array.isArray(backendOrders) && backendOrders.length > 0) {
        const localOrders = (typeof getAllMagazineOrders === 'function') ? getAllMagazineOrders() : [];
        const orderIds = new Set(localOrders.map(o => o.id || o.orderId));
        let updated = false;
        backendOrders.forEach(bo => {
          const id = bo.id || bo.orderId;
          if (!orderIds.has(id)) {
            localOrders.unshift(bo);
            updated = true;
          }
        });
        if (updated && typeof saveMagazineOrders === 'function') {
          saveMagazineOrders(localOrders);
          if (typeof renderMagazineOrdersTable === 'function') renderMagazineOrdersTable();
        }
      }

      updateStatCounters();
      renderManageTable();
    } catch (err) {
      console.warn('[Screenlady Admin] Live sync notice:', err.message);
    }
  }
}

function updateStatCounters() {
  const elNews = document.getElementById('statTotalNews');
  const elFilmy = document.getElementById('statTotalFilmyAdda');
  const elBizz = document.getElementById('statTotalBizzWorld');
  const elInspiration = document.getElementById('statTotalInspiration');
  const elFashion = document.getElementById('statTotalFashion');
  const elHomePhotos = document.getElementById('statTotalBusinessAds') || document.getElementById('statTotalHomePhotos');
  const elEditorials = document.getElementById('statTotalEditorials');
  const elPodcasts = document.getElementById('statTotalPodcasts');
  const elPhotos = document.getElementById('statTotalPhotos');
  const elUpdates = document.getElementById('statTotalUpdates');
  const elMagazineOrders = document.getElementById('statTotalMagazineOrders');
  const elMagCovers = document.getElementById('statTotalMagCovers');

  const navNews = document.getElementById('navStatNews');
  const navFilmy = document.getElementById('navStatFilmy');
  const navBizz = document.getElementById('navStatBizz');
  const navInspiration = document.getElementById('navStatInspiration');
  const navFashion = document.getElementById('navStatFashion');
  const navEditorials = document.getElementById('navStatEditorials');
  const navPodcasts = document.getElementById('navStatPodcasts');
  const navPhotos = document.getElementById('navStatPhotos');
  const navMagCovers = document.getElementById('navStatMagCovers');

  const newsItems = (typeof getAllHomeNews === 'function') ? getAllHomeNews() : [];
  const homePhotos = (typeof getAllHomePhotos === 'function') ? getAllHomePhotos() : [];
  const editorials = (typeof getAllEditorials === 'function') ? getAllEditorials() : [];
  const podcasts = (typeof getAllPodcasts === 'function') ? getAllPodcasts() : [];
  const photos = (typeof getAllPhotos === 'function') ? getAllPhotos() : [];
  const updates = (typeof getAllUpdates === 'function') ? getAllUpdates() : [];
  const magazineOrders = (typeof getAllMagazineOrders === 'function') ? getAllMagazineOrders() : [];
  const magCovers = (typeof getAllMagazineCovers === 'function') ? getAllMagazineCovers() : (window.backendLiveMagazineCovers || []);

  const filmyItems = updates.filter(isFilmyAddaItem);
  const bizzItems = updates.filter(isBizzWorldItem);
  const inspirationItems = updates.filter(isInspirationItem);
  const fashionItems = updates.filter(isFashionItem);

  if (elNews) elNews.textContent = newsItems.length;
  if (elFilmy) elFilmy.textContent = filmyItems.length;
  if (elBizz) elBizz.textContent = bizzItems.length;
  if (elInspiration) elInspiration.textContent = inspirationItems.length;
  if (elFashion) elFashion.textContent = fashionItems.length;
  if (elHomePhotos) elHomePhotos.textContent = homePhotos.length;
  if (elEditorials) elEditorials.textContent = editorials.length;
  if (elPodcasts) elPodcasts.textContent = podcasts.length;
  if (elPhotos) elPhotos.textContent = photos.length;
  if (elUpdates) elUpdates.textContent = updates.length;
  if (elMagazineOrders) elMagazineOrders.textContent = magazineOrders.length;
  if (elMagCovers) elMagCovers.textContent = magCovers.length;

  if (navNews) navNews.textContent = newsItems.length;
  if (navFilmy) navFilmy.textContent = filmyItems.length;
  if (navBizz) navBizz.textContent = bizzItems.length;
  if (navInspiration) navInspiration.textContent = inspirationItems.length;
  if (navFashion) navFashion.textContent = fashionItems.length;
  if (navEditorials) navEditorials.textContent = editorials.length;
  if (navPodcasts) navPodcasts.textContent = podcasts.length;
  if (navPhotos) navPhotos.textContent = photos.length;
  if (navMagCovers) navMagCovers.textContent = magCovers.length;
}

window.setManageFilter = function(filter) {
  activeManageFilter = filter;
  document.querySelectorAll('[data-manage-filter]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-manage-filter') === filter);
  });
  renderManageTable();
};

window.filterManageSection = function(section) {
  if (typeof switchAdminView === 'function') switchAdminView('panel-content');
  setManageFilter(section);
};

function renderManageTable() {
  const tbody = document.getElementById('adminUpdatesTableBody');
  if (!tbody) return;

  const newsItems = (typeof getAllHomeNews === 'function') ? getAllHomeNews() : [];
  const homePhotos = (typeof getAllHomePhotos === 'function') ? getAllHomePhotos() : [];
  const editorials = (typeof getAllEditorials === 'function') ? getAllEditorials() : [];
  const podcasts = (typeof getAllPodcasts === 'function') ? getAllPodcasts() : [];
  const photos = (typeof getAllPhotos === 'function') ? getAllPhotos() : [];
  const updates = (typeof getAllUpdates === 'function') ? getAllUpdates() : [];

  // Tag items with their section and target live URL
  const taggedNews = newsItems.map(i => ({ ...i, _section: 'news', _targetUrl: 'http://localhost:4321/#homeHeroSplitSection', _storageKey: 'screenlady_custom_news' }));
  const taggedHomePhotos = homePhotos.map(i => ({ ...i, _section: 'business_ads', _targetUrl: 'http://localhost:4321/#homePhotoSlideshowWrap', _storageKey: 'screenlady_custom_business_ads' }));
  const taggedEditorials = editorials.map(i => ({ ...i, _section: 'editorials', _targetUrl: `http://localhost:4321/editorials#${i.id}`, _storageKey: 'screenlady_custom_editorials' }));
  const taggedPodcasts = podcasts.map(i => ({ ...i, _section: 'podcast', _targetUrl: `http://localhost:4321/podcast#${i.id}`, _storageKey: 'screenlady_custom_podcasts' }));
  const taggedPhotos = photos.map(i => ({ ...i, _section: 'photos', _targetUrl: `http://localhost:4321/photos#${i.id}`, _storageKey: 'screenlady_custom_photos' }));
  const taggedUpdates = updates
    .filter(i => i && !i.isHomepageNews && i.curatedSection !== 'news' && i.type !== 'news' && !(i.id && i.id.startsWith('news-')))
    .map(i => {
    let sec = 'updates';
    let target = `http://localhost:4321/updates#${i.id}`;
    let storeKey = 'screenlady_custom_updates';

    if (i.curatedSection === 'filmy_adda' || isFilmyAddaItem(i)) {
      sec = 'filmy_adda';
      target = 'http://localhost:4321/#filmyAddaSection';
      storeKey = 'screenlady_custom_filmy';
    } else if (i.curatedSection === 'bizz_world' || isBizzWorldItem(i)) {
      sec = 'bizz_world';
      target = 'http://localhost:4321/#bizzWorldSection';
      storeKey = 'screenlady_custom_bizz';
    } else if (i.curatedSection === 'women_inspiration' || isInspirationItem(i)) {
      sec = 'women_inspiration';
      target = 'http://localhost:4321/#womenInspirationSection';
      storeKey = 'screenlady_custom_inspiration';
    } else if (i.curatedSection === 'fashion_lifestyle' || isFashionItem(i)) {
      sec = 'fashion_lifestyle';
      target = 'http://localhost:4321/#fashionLifestyleSection';
      storeKey = 'screenlady_custom_fashion';
    }
    return { ...i, _section: sec, _targetUrl: target, _storageKey: storeKey };
  });

  let allItems = [];
  if (activeManageFilter === 'news') allItems = taggedNews;
  else if (activeManageFilter === 'filmy_adda') allItems = taggedUpdates.filter(i => i._section === 'filmy_adda');
  else if (activeManageFilter === 'bizz_world') allItems = taggedUpdates.filter(i => i._section === 'bizz_world');
  else if (activeManageFilter === 'women_inspiration') allItems = taggedUpdates.filter(i => i._section === 'women_inspiration');
  else if (activeManageFilter === 'fashion_lifestyle') allItems = taggedUpdates.filter(i => i._section === 'fashion_lifestyle');
  else if (activeManageFilter === 'business_ads' || activeManageFilter === 'home_photos') allItems = taggedHomePhotos;
  else if (activeManageFilter === 'editorials') allItems = taggedEditorials;
  else if (activeManageFilter === 'podcast') allItems = taggedPodcasts;
  else if (activeManageFilter === 'photos') allItems = taggedPhotos;
  else if (activeManageFilter === 'updates') allItems = taggedUpdates.filter(i => i._section === 'updates');
  else {
    // Combine all sections with deduplication across feeds
    allItems = [...taggedNews, ...taggedHomePhotos, ...taggedEditorials, ...taggedPodcasts, ...taggedPhotos, ...taggedUpdates];
  }

  // Deduplicate strictly by ID so no row ever appears twice in the admin desk
  const seenTableIds = new Set();
  const dedupedTableItems = [];
  for (const item of allItems) {
    if (item && item.id && !seenTableIds.has(item.id)) {
      seenTableIds.add(item.id);
      dedupedTableItems.push(item);
    }
  }
  allItems = dedupedTableItems;

  // Strictly sort descending by date & timestamp (Latest First)
  allItems.sort((a, b) => {
    const dateA = new Date(a.date || a.displayDate || 0).getTime();
    const dateB = new Date(b.date || b.displayDate || 0).getTime();
    if (dateB !== dateA) return dateB - dateA;
    return (b.timestamp || 0) - (a.timestamp || 0);
  });

  if (allItems.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 3rem; color: var(--text-muted);">
          No items found in this section. Use the Composer above to publish your first post!
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = allItems.map((item, idx) => {
    const isTop = idx === 0 && (activeManageFilter === item._section || activeManageFilter === 'all');
    const safeTitle = escapeHtml(item.title || item.womanName || item.headline || 'Untitled');
    const safeDate = escapeHtml(item.displayDate || item.date || 'Recent');
    const safeCat = escapeHtml(item.category || 'General');
    const imgSrc = item.photo || 'https://ik.imagekit.io/acooladescreenlady/assets/images/featured-icon-saree.jpg';

    // Section Badge
    let sectionBadgeHtml = '';
    if (item._section === 'news') {
      sectionBadgeHtml = `<span class="admin-badge admin-badge-danger">Live News</span>`;
    } else if (item._section === 'filmy_adda') {
      sectionBadgeHtml = `<span class="admin-badge admin-badge-gold">Filmy Adda</span>`;
    } else if (item._section === 'bizz_world') {
      sectionBadgeHtml = `<span class="admin-badge admin-badge-gold">Bizz World</span>`;
    } else if (item._section === 'women_inspiration') {
      sectionBadgeHtml = `<span class="admin-badge admin-badge-gold">Inspiration</span>`;
    } else if (item._section === 'fashion_lifestyle') {
      sectionBadgeHtml = `<span class="admin-badge admin-badge-blue">Fashion & Life</span>`;
    } else if (item._section === 'home_photos') {
      sectionBadgeHtml = `<span class="admin-badge" style="background: rgba(168, 85, 247, 0.2); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.4);">Home Photo</span>`;
    } else if (item._section === 'editorials') {
      sectionBadgeHtml = `<span class="admin-badge admin-badge-gold">Editorial</span>`;
    } else if (item._section === 'podcast') {
      sectionBadgeHtml = `<span class="admin-badge admin-badge-blue">Podcast</span>`;
    } else if (item._section === 'photos') {
      sectionBadgeHtml = `<span class="admin-badge" style="background: rgba(255, 255, 255, 0.08); color: #FFFFFF; border: 1px solid rgba(255, 255, 255, 0.15);">Gallery</span>`;
    } else {
      sectionBadgeHtml = `<span class="admin-badge admin-badge-gold">Updates</span>`;
    }

    // Extract description text (strictly 2-line clamped in editorial desk)
    const rawDesc = item.caption || item.infoSummary || item.summary || item.photoCaption || (item.pullQuote || '') || (item.content ? item.content.replace(/<[^>]+>/g, '').trim() : '') || (item.showNotes ? item.showNotes.replace(/<[^>]+>/g, '').trim() : '');
    const safeDesc = escapeHtml(rawDesc);

    return `
      <tr class="${isTop ? 'highlight-top-row' : ''}">
        <td>
          <span class="admin-order-badge ${isTop ? 'first-order' : ''}">
            #${idx + 1}
          </span>
        </td>
        <td>
          <img src="${imgSrc}" alt="${safeTitle}" class="admin-table-thumb">
        </td>
        <td>
          ${sectionBadgeHtml}
        </td>
        <td>
          <strong style="color: #FFFFFF; font-size: 0.94rem; display: block; font-weight: 700; margin-bottom: 0.25rem;">${safeTitle}</strong>
          <div style="display: flex; gap: 0.65rem; flex-wrap: wrap; align-items: center; margin-bottom: 0.25rem;">
            ${item.author ? `<span style="font-size: 0.76rem; color: var(--admin-gold-light); font-weight: 600;">By: ${escapeHtml(item.author)}</span>` : ''}
            ${item.guest ? `<span style="font-size: 0.76rem; color: var(--admin-gold-light); font-weight: 600;">Guest: ${escapeHtml(item.guest)} • ${item.duration || ''}</span>` : ''}
            ${item.venue ? `<span style="font-size: 0.76rem; color: var(--admin-gold-light); font-weight: 600;">Location: ${escapeHtml(item.venue)}</span>` : ''}
          </div>
          ${safeDesc ? `<p class="admin-table-desc-clamp">${safeDesc}</p>` : ''}
        </td>
        <td>
          <div style="font-size: 0.86rem; color: #E5E7EB; font-weight: 500;">${safeDate}</div>
          <span class="badge-gold" style="font-size: 0.65rem; margin-top: 0.35rem; display: inline-block;">${safeCat}</span>
        </td>
        <td style="text-align: right;">
          <div style="display: inline-flex; gap: 0.4rem; justify-content: flex-end;">
            <a href="${item._targetUrl}" target="_blank" class="admin-btn admin-btn-outline admin-btn-sm" style="padding: 0.3rem 0.65rem; font-size: 0.76rem;" title="View live on website">
              View
            </a>
            <button type="button" class="admin-btn admin-btn-gold admin-btn-sm" style="padding: 0.3rem 0.65rem; font-size: 0.76rem;" onclick="editItem('${item.id}', '${item._section}')" title="Edit this entry">
              Edit
            </button>
            <button type="button" class="admin-btn admin-btn-danger admin-btn-sm" style="padding: 0.3rem 0.65rem; font-size: 0.76rem;" onclick="promptDeleteItem('${item.id}', '${item._section}', '${escapeHtml(safeTitle).replace(/'/g, "\\'")}')" title="Permanently delete this entry">
              Delete
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

/* =============================================================
   6. Edit, Delete & Form Reset Handlers
============================================================= */
window.editItem = function(id, section) {
  let item = null;
  if (section === 'news') {
    item = (typeof getAllHomeNews === 'function' ? getAllHomeNews() : []).find(i => i.id === id);
  } else if (section === 'business_ads' || section === 'home_photos') {
    item = (typeof getAllHomePhotos === 'function' ? getAllHomePhotos() : []).find(i => i.id === id);
    if (!item && window.backendLiveBusinessAds) item = window.backendLiveBusinessAds.find(i => i.id === id);
    if (!item) {
      try {
        const raw = localStorage.getItem('screenlady_custom_business_ads') || localStorage.getItem('screenlady_custom_home_photos');
        if (raw) item = JSON.parse(raw).find(i => i.id === id);
      } catch(e) {}
    }
  } else if (section === 'editorials') {
    item = (typeof getAllEditorials === 'function' ? getAllEditorials() : []).find(i => i.id === id);
  } else if (section === 'podcast') {
    item = (typeof getAllPodcasts === 'function' ? getAllPodcasts() : []).find(i => i.id === id);
  } else if (section === 'photos') {
    item = (typeof getAllPhotos === 'function' ? getAllPhotos() : []).find(i => i.id === id);
  } else if (section === 'filmy_adda') {
    try {
      const list = JSON.parse(localStorage.getItem('screenlady_custom_filmy') || '[]');
      item = list.find(i => i && i.id === id);
    } catch(e) {}
    if (!item && typeof getAllUpdates === 'function') item = getAllUpdates().find(i => i.id === id);
  } else if (section === 'bizz_world') {
    try {
      const list = JSON.parse(localStorage.getItem('screenlady_custom_bizz') || '[]');
      item = list.find(i => i && i.id === id);
    } catch(e) {}
    if (!item && typeof getAllUpdates === 'function') item = getAllUpdates().find(i => i.id === id);
  } else if (section === 'women_inspiration') {
    try {
      const list = JSON.parse(localStorage.getItem('screenlady_custom_inspiration') || '[]');
      item = list.find(i => i && i.id === id);
    } catch(e) {}
    if (!item && typeof getAllUpdates === 'function') item = getAllUpdates().find(i => i.id === id);
  } else if (section === 'fashion_lifestyle') {
    try {
      const list = JSON.parse(localStorage.getItem('screenlady_custom_fashion') || '[]');
      item = list.find(i => i && i.id === id);
    } catch(e) {}
    if (!item && typeof getAllUpdates === 'function') item = getAllUpdates().find(i => i.id === id);
  } else {
    item = (typeof getAllUpdates === 'function' ? getAllUpdates() : []).find(i => i.id === id);
  }

  // Fallback to checking any custom storage or all home news
  if (!item && typeof getAllHomeNews === 'function') {
    item = getAllHomeNews().find(i => i.id === id);
  }

  if (!item) return;

  editingItem = { id: id, section: section };

  // Select section in dropdown
  const sectionSelect = document.getElementById('postSectionSelect');
  if (sectionSelect) sectionSelect.value = section;
  handleSectionChange(section);

  // Populate common values
  const dateInput = document.getElementById('postDate');
  if (dateInput) dateInput.value = item.date || '';

  const catSelect = document.getElementById('postCategory');
  if (catSelect && item.category) catSelect.value = item.category;

  const photoInput = document.getElementById('postPhotoInput');
  if (photoInput) photoInput.value = item.photo || '';
  updatePhotoPreview(item.photo || 'https://ik.imagekit.io/acooladescreenlady/assets/images/featured-icon-saree.jpg');

  const tagsInput = document.getElementById('postTags');
  if (tagsInput) tagsInput.value = (item.tags || []).join(', ');

  // Populate section-specific fields
  if (section === 'news') {
    switchUpdateSubtype('news');
    if (document.getElementById('postHeadline')) document.getElementById('postHeadline').value = item.headline || item.title || '';
    if (document.getElementById('postSummary')) document.getElementById('postSummary').value = item.summary || item.infoSummary || '';
    if (document.getElementById('postFullBody')) document.getElementById('postFullBody').value = stripParagraphTags(item.fullBody || item.fullInfo || '');
  } else if (section === 'filmy_adda') {
    if (document.getElementById('postHeadline')) document.getElementById('postHeadline').value = item.headline || item.title || '';
    if (document.getElementById('postSummary')) document.getElementById('postSummary').value = item.summary || item.infoSummary || '';
    if (document.getElementById('postFullBody')) document.getElementById('postFullBody').value = stripParagraphTags(item.fullBody || item.fullInfo || '');
  } else if (section === 'bizz_world') {
    if (document.getElementById('postHeadline')) document.getElementById('postHeadline').value = item.headline || item.title || '';
    if (document.getElementById('postSummary')) document.getElementById('postSummary').value = item.summary || item.infoSummary || '';
    if (document.getElementById('postFullBody')) document.getElementById('postFullBody').value = stripParagraphTags(item.fullBody || item.fullInfo || '');
  } else if (section === 'women_inspiration') {
    if (document.getElementById('postWomanName')) document.getElementById('postWomanName').value = item.womanName || item.title || '';
    if (document.getElementById('postHeadline')) document.getElementById('postHeadline').value = item.headline || item.title || '';
    if (document.getElementById('postSummary')) document.getElementById('postSummary').value = item.summary || item.infoSummary || '';
    if (document.getElementById('postFullBody')) document.getElementById('postFullBody').value = stripParagraphTags(item.fullBody || item.fullInfo || '');
  } else if (section === 'fashion_lifestyle') {
    if (document.getElementById('postHeadline')) document.getElementById('postHeadline').value = item.headline || item.title || '';
    if (document.getElementById('postSummary')) document.getElementById('postSummary').value = item.summary || item.infoSummary || '';
    if (document.getElementById('postFullBody')) document.getElementById('postFullBody').value = stripParagraphTags(item.fullBody || item.fullInfo || '');
  } else if (section === 'business_ads' || section === 'home_photos') {
    if (document.getElementById('postBrandName')) document.getElementById('postBrandName').value = item.brandName || item.title || '';
    if (document.getElementById('postBrandHeadline')) document.getElementById('postBrandHeadline').value = item.headline || item.title || '';
    if (document.getElementById('postBrandTagline')) document.getElementById('postBrandTagline').value = item.tagline || '';
    if (document.getElementById('postBrandSummary')) document.getElementById('postBrandSummary').value = item.summary || item.infoSummary || '';
    if (document.getElementById('postBrandDestUrl')) document.getElementById('postBrandDestUrl').value = item.destinationUrl || item.link || '';
    if (document.getElementById('postBrandCategory')) document.getElementById('postBrandCategory').value = item.category || 'Enterprise';
    if (document.getElementById('postPhotoVenue')) document.getElementById('postPhotoVenue').value = item.venue || item.location || '';
    if (document.getElementById('postPhotoCaption')) document.getElementById('postPhotoCaption').value = item.caption || item.description || item.title || '';
  } else if (section === 'editorials') {
    document.getElementById('postEditorialTitle').value = item.title || item.headline || '';
    document.getElementById('postEditorialAuthor').value = item.author || '';
    document.getElementById('postEditorialDesignation').value = item.authorDesignation || item.authorRole || '';
    document.getElementById('postEditorialReadTime').value = item.readTime || '5 Min Read';
    document.getElementById('postEditorialQuote').value = item.pullQuote || item.summary || '';
    document.getElementById('postEditorialBody').value = stripParagraphTags(item.fullContent || item.fullBody || item.content || item.summary || '');
  } else if (section === 'podcast') {
    document.getElementById('postPodcastTitle').value = item.title || '';
    document.getElementById('postPodcastHost').value = item.host || '';
    document.getElementById('postPodcastGuest').value = item.guest || '';
    document.getElementById('postPodcastDuration').value = item.duration || '38 Mins';
    document.getElementById('postPodcastSocialLink').value = item.socialLink || '';
    document.getElementById('postPodcastAudioUrl').value = item.audioUrl || '';
    document.getElementById('postPodcastShowNotes').value = stripParagraphTags(item.showNotes || item.summary || '');
  } else if (section === 'photos') {
    if (document.getElementById('postPhotoTitle')) document.getElementById('postPhotoTitle').value = item.title || item.caption || '';
    if (document.getElementById('postPhotoVenue')) document.getElementById('postPhotoVenue').value = item.venue || item.location || '';
    if (document.getElementById('postPhotoCaption')) document.getElementById('postPhotoCaption').value = item.caption || item.description || item.title || '';
  } else {
    // updates
    switchUpdateSubtype(item.type || 'photo-info');
    if (document.getElementById('postWomanName')) document.getElementById('postWomanName').value = item.womanName || item.teamMembers || item.title || '';
    if (document.getElementById('postHeadline')) document.getElementById('postHeadline').value = item.headline || item.title || '';
    if (document.getElementById('postUpdateVenue')) document.getElementById('postUpdateVenue').value = item.venue || item.location || '';
    if (document.getElementById('postArticleTitle')) document.getElementById('postArticleTitle').value = item.title || '';
    if (document.getElementById('postAuthor')) document.getElementById('postAuthor').value = item.author || '';
    if (document.getElementById('postPhotoTitle')) document.getElementById('postPhotoTitle').value = item.title || '';
    if (document.getElementById('postCredit')) document.getElementById('postCredit').value = item.credit || '';
    if (document.getElementById('postSummary')) document.getElementById('postSummary').value = item.infoSummary || item.photoCaption || item.summary || '';
    if (document.getElementById('postFullBody')) document.getElementById('postFullBody').value = stripParagraphTags(item.fullInfo || item.fullBody || '');
  }

  // Update UI mode
  const cancelBtn = document.getElementById('adminCancelEditBtn');
  if (cancelBtn) cancelBtn.style.display = 'inline-block';

  const formCardTitle = document.getElementById('formCardTitle');
  if (formCardTitle) formCardTitle.textContent = `Editing: ${item.title || item.womanName || 'Selected Item'}`;

  const submitBtn = document.getElementById('adminSubmitBtn');
  if (submitBtn) submitBtn.textContent = 'Save Changes to Entry';

  // Navigate to normal composer panel in edit mode
  if (typeof navigateToComposer === 'function') {
    navigateToComposer(section);
  }
};

window.cancelEdit = function() {
  editingItem = null;
  resetForm();
  if (typeof switchAdminView === 'function') switchAdminView('panel-content');
};

window.resetForm = function() {
  editingItem = null;
  const form = document.getElementById('adminPostForm');
  if (form) form.reset();

  const cancelBtn = document.getElementById('adminCancelEditBtn');
  if (cancelBtn) cancelBtn.style.display = 'none';

  const dateInput = document.getElementById('postDate');
  if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

  const photoInput = document.getElementById('postPhotoInput');
  if (photoInput) photoInput.value = 'https://ik.imagekit.io/acooladescreenlady/assets/images/featured-icon-saree.jpg';
  updatePhotoPreview('https://ik.imagekit.io/acooladescreenlady/assets/images/featured-icon-saree.jpg');

  const uploadStatus = document.getElementById('uploadFileStatus');
  if (uploadStatus) {
    uploadStatus.textContent = 'Upload any JPG/PNG/WEBP photo, or select a preset below:';
    uploadStatus.style.color = 'var(--text-muted)';
  }

  handleSectionChange(currentSection);
};

window.promptDeleteItem = function(id, section, title) {
  const displayTitle = title ? `"${title}"` : 'this entry';
  if (confirm(`Are you sure you want to permanently delete ${displayTitle} from ${section}?\n\nThis will remove it from the website and Editorial Desk.`)) {
    deleteItem(id, section);
  }
};

window.deleteItem = function(id, section) {
  // 1. Record ID into global deleted IDs registry so both custom and default items are removed
  if (typeof window.addScreenladyDeletedId === 'function') {
    window.addScreenladyDeletedId(id);
  } else {
    try {
      const raw = localStorage.getItem('screenlady_deleted_ids');
      const list = raw ? JSON.parse(raw) : [];
      if (!list.includes(id)) {
        list.push(id);
        localStorage.setItem('screenlady_deleted_ids', JSON.stringify(list));
      }
    } catch (e) {}
  }

  // 2. Also remove from custom items list if present
  const allStorageKeys = [
    'screenlady_custom_editorials',
    'screenlady_custom_podcasts',
    'screenlady_custom_photos',
    'screenlady_custom_updates',
    'screenlady_custom_news',
    'screenlady_custom_home_photos',
    'screenlady_custom_filmy',
    'screenlady_custom_bizz',
    'screenlady_custom_inspiration',
    'screenlady_custom_fashion'
  ];

  for (const sKey of allStorageKeys) {
    try {
      const raw = localStorage.getItem(sKey);
      if (raw) {
        const list = JSON.parse(raw);
        const filtered = list.filter(item => item && item.id !== id);
        if (filtered.length !== list.length) {
          localStorage.setItem(sKey, JSON.stringify(filtered));
        }
      }
    } catch (e) {}
  }
  try {
    localStorage.setItem('screenlady_last_updated', Date.now().toString());
  } catch (err) {}

  if (editingItem && editingItem.id === id) {
    resetForm();
  }

  // Live Backend Cloudflare Worker Synchronization
  if (window.ScreenladyAPI && typeof window.ScreenladyAPI.deleteItem === 'function') {
    const targetSection = section;
    window.ScreenladyAPI.deleteItem(targetSection, id)
      .then(res => {
        if (res && res.success) console.log(`[Screenlady Desk] Live deleted on backend (${targetSection}):`, id);
      })
      .catch(err => console.warn(`[Screenlady Desk] Backend delete notice:`, err.message));
  }

  showToast(`✓ Item permanently deleted from ${section}.`);
  loadAdminDashboard();
};

window.deleteCurrentSectionData = function() {
  const sectionName = activeManageFilter === 'all' ? 'all sections' : activeManageFilter;
  if (!confirm(`Are you sure you want to delete all published items in ${sectionName}?\n\nThis will clear all entries in this section from the website.`)) {
    return;
  }

  let itemsToDelete = [];
  if (activeManageFilter === 'news') itemsToDelete = typeof getAllHomeNews === 'function' ? getAllHomeNews() : [];
  else if (activeManageFilter === 'filmy_adda') itemsToDelete = (typeof getAllUpdates === 'function' ? getAllUpdates() : []).filter(isFilmyAddaItem);
  else if (activeManageFilter === 'bizz_world') itemsToDelete = (typeof getAllUpdates === 'function' ? getAllUpdates() : []).filter(isBizzWorldItem);
  else if (activeManageFilter === 'women_inspiration') itemsToDelete = (typeof getAllUpdates === 'function' ? getAllUpdates() : []).filter(isInspirationItem);
  else if (activeManageFilter === 'fashion_lifestyle') itemsToDelete = (typeof getAllUpdates === 'function' ? getAllUpdates() : []).filter(isFashionItem);
  else if (activeManageFilter === 'home_photos') itemsToDelete = typeof getAllHomePhotos === 'function' ? getAllHomePhotos() : [];
  else if (activeManageFilter === 'editorials') itemsToDelete = typeof getAllEditorials === 'function' ? getAllEditorials() : [];
  else if (activeManageFilter === 'podcast') itemsToDelete = typeof getAllPodcasts === 'function' ? getAllPodcasts() : [];
  else if (activeManageFilter === 'photos') itemsToDelete = typeof getAllPhotos === 'function' ? getAllPhotos() : [];
  else if (activeManageFilter === 'updates') itemsToDelete = typeof getAllUpdates === 'function' ? getAllUpdates() : [];
  else {
    itemsToDelete = [
      ...(typeof getAllHomeNews === 'function' ? getAllHomeNews() : []),
      ...(typeof getAllHomePhotos === 'function' ? getAllHomePhotos() : []),
      ...(typeof getAllEditorials === 'function' ? getAllEditorials() : []),
      ...(typeof getAllPodcasts === 'function' ? getAllPodcasts() : []),
      ...(typeof getAllPhotos === 'function' ? getAllPhotos() : []),
      ...(typeof getAllUpdates === 'function' ? getAllUpdates() : [])
    ];
  }

  itemsToDelete.forEach(item => {
    if (item && item.id) {
      if (typeof window.addScreenladyDeletedId === 'function') {
        window.addScreenladyDeletedId(item.id);
      }
    }
  });

  if (activeManageFilter === 'all' || activeManageFilter === 'news') localStorage.removeItem('screenlady_custom_news');
  if (activeManageFilter === 'all' || activeManageFilter === 'home_photos') localStorage.removeItem('screenlady_custom_home_photos');
  if (activeManageFilter === 'all' || activeManageFilter === 'editorials') localStorage.removeItem('screenlady_custom_editorials');
  if (activeManageFilter === 'all' || activeManageFilter === 'podcast') localStorage.removeItem('screenlady_custom_podcasts');
  if (activeManageFilter === 'all' || activeManageFilter === 'photos') localStorage.removeItem('screenlady_custom_photos');
  if (activeManageFilter === 'all' || activeManageFilter === 'updates') localStorage.removeItem('screenlady_custom_updates');
  if (activeManageFilter === 'all' || activeManageFilter === 'filmy_adda') localStorage.removeItem('screenlady_custom_filmy');
  if (activeManageFilter === 'all' || activeManageFilter === 'bizz_world') localStorage.removeItem('screenlady_custom_bizz');
  if (activeManageFilter === 'all' || activeManageFilter === 'women_inspiration') localStorage.removeItem('screenlady_custom_inspiration');
  if (activeManageFilter === 'all' || activeManageFilter === 'fashion_lifestyle') localStorage.removeItem('screenlady_custom_fashion');

  resetForm();
  showToast(`✓ All entries in ${sectionName} have been deleted.`);
  loadAdminDashboard();
};

window.deleteAllData = function() {
  if (!confirm('⚠️ WARNING: Are you sure you want to PERMANENTLY DELETE ALL DATA across all sections?\n\nThis will completely clear Live News, Homepage Photos, Editorials, Podcasts, Photos, and Updates from both the website and Editorial Desk.')) {
    return;
  }

  const all = [
    ...(typeof getAllHomeNews === 'function' ? getAllHomeNews() : []),
    ...(typeof getAllHomePhotos === 'function' ? getAllHomePhotos() : []),
    ...(typeof getAllEditorials === 'function' ? getAllEditorials() : []),
    ...(typeof getAllPodcasts === 'function' ? getAllPodcasts() : []),
    ...(typeof getAllPhotos === 'function' ? getAllPhotos() : []),
    ...(typeof getAllUpdates === 'function' ? getAllUpdates() : [])
  ];

  all.forEach(item => {
    if (item && item.id) {
      if (typeof window.addScreenladyDeletedId === 'function') {
        window.addScreenladyDeletedId(item.id);
      }
    }
  });

  localStorage.removeItem('screenlady_custom_news');
  localStorage.removeItem('screenlady_custom_home_photos');
  localStorage.removeItem('screenlady_custom_editorials');
  localStorage.removeItem('screenlady_custom_podcasts');
  localStorage.removeItem('screenlady_custom_photos');
  localStorage.removeItem('screenlady_custom_updates');
  localStorage.removeItem('screenlady_custom_filmy');
  localStorage.removeItem('screenlady_custom_bizz');
  localStorage.removeItem('screenlady_custom_inspiration');
  localStorage.removeItem('screenlady_custom_fashion');

  resetForm();
  showToast('✓ All data successfully cleared from website and Editorial Desk.');
  loadAdminDashboard();
};

/* =============================================================
   7. Backup & Reset Utilities
============================================================= */
window.exportDataJson = function() {
  const exportData = {
    news: (typeof getAllHomeNews === 'function' ? getAllHomeNews() : []),
    homePhotos: (typeof getAllHomePhotos === 'function' ? getAllHomePhotos() : []),
    editorials: (typeof getAllEditorials === 'function' ? getAllEditorials() : []),
    podcasts: (typeof getAllPodcasts === 'function' ? getAllPodcasts() : []),
    photos: (typeof getAllPhotos === 'function' ? getAllPhotos() : []),
    updates: (typeof getAllUpdates === 'function' ? getAllUpdates() : []),
    exportedAt: new Date().toISOString()
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute('href', dataStr);
  dlAnchor.setAttribute('download', `screenlady-all-data-backup-${Date.now()}.json`);
  dlAnchor.click();
};

window.resetAllDefaults = function() {
  if (!confirm('Restore factory default archives? This will restore original sample stories and un-hide default items.')) {
    return;
  }
  if (typeof window.clearAllScreenladyDeletedIds === 'function') {
    window.clearAllScreenladyDeletedIds();
  } else {
    localStorage.removeItem('screenlady_deleted_ids');
  }
  localStorage.removeItem('screenlady_custom_news');
  localStorage.removeItem('screenlady_custom_home_photos');
  localStorage.removeItem('screenlady_custom_editorials');
  localStorage.removeItem('screenlady_custom_podcasts');
  localStorage.removeItem('screenlady_custom_photos');
  localStorage.removeItem('screenlady_custom_updates');
  showToast('✓ Original default archives restored.');
  loadAdminDashboard();
};

/* =============================================================
   8. Formatting & Toast Utilities
============================================================= */
function formatParagraphs(text) {
  if (!text) return '';
  const clean = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const blocks = clean
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);

  if (blocks.length === 0) return '';

  return blocks
    .map(block => {
      const lines = block.split(/\n/).map(line => escapeHtml(line.trim())).filter(Boolean);
      return `<p>${lines.join('<br>\n')}</p>`;
    })
    .join('\n\n');
}

function stripParagraphTags(html) {
  if (!html) return '';
  let text = String(html);
  text = text.replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n\n$1\n\n');
  text = text.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, '\n\n"$1"\n\n');
  text = text.replace(/<div[^>]*class="[^"]*editorial-lead-box[^"]*"[^>]*>(.*?)<\/div>/gis, '$1\n\n');
  text = text.replace(/<div[^>]*class="[^"]*editorial-quote-card[^"]*"[^>]*>(.*?)<\/div>/gis, '\n\n$1\n\n');
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<\/p>\s*<p[^>]*>/gi, '\n\n');
  text = text.replace(/<[^>]+>/g, '');
  text = text.replace(/&amp;/g, '&')
             .replace(/&lt;/g, '<')
             .replace(/&gt;/g, '>')
             .replace(/&quot;/g, '"')
             .replace(/&#39;/g, "'")
             .replace(/&nbsp;/g, ' ');
  text = text.replace(/\n{3,}/g, '\n\n');
  return text.trim();
}

/* =============================================================
   8. DEDICATED SECTION: MAGAZINE PURCHASE DETAILS (ORDERS ENGINE)
============================================================= */
let activeMagazineOrderFilter = 'all';
let activeMagazineOrderSearch = '';

window.scrollToMagazineOrders = function() {
  if (typeof switchAdminView === 'function') switchAdminView('panel-orders');
};

window.setMagazineOrderFilter = function(filter) {
  activeMagazineOrderFilter = filter;
  document.querySelectorAll('[data-order-filter]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-order-filter') === filter);
  });
  renderMagazineOrdersTable();
};

window.handleMagazineOrderSearch = function(query) {
  activeMagazineOrderSearch = (query || '').toLowerCase().trim();
  renderMagazineOrdersTable();
};

window.renderMagazineOrdersTable = function() {
  const tbody = document.getElementById('adminMagazineOrdersTableBody');
  if (!tbody) return;

  const orders = (typeof getAllMagazineOrders === 'function') ? getAllMagazineOrders() : [];

  // Calculate Metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
  const paidCount = orders.filter(o => (o.paymentStatus || '').toLowerCase().includes('paid')).length;
  const pendingCount = orders.filter(o => (o.shippingStatus || '').toLowerCase().includes('pending')).length;
  const shippedCount = orders.filter(o => (o.shippingStatus || '').toLowerCase().includes('shipped') || (o.shippingStatus || '').toLowerCase().includes('transit')).length;
  const deliveredCount = orders.filter(o => (o.shippingStatus || '').toLowerCase().includes('delivered')).length;
  const fulfilledCount = shippedCount + deliveredCount;

  // Update KPI counters
  const elTotal = document.getElementById('kpiOrdersTotal');
  const elRevenue = document.getElementById('kpiOrdersRevenue');
  const elPaid = document.getElementById('kpiOrdersPaid');
  const elPending = document.getElementById('kpiOrdersPending');
  const elFulfilled = document.getElementById('kpiOrdersFulfilled');
  const topBadge = document.getElementById('adminOrdersCounterBadge');
  const statCard = document.getElementById('statTotalMagazineOrders');

  if (elTotal) elTotal.textContent = totalOrders;
  if (elRevenue) elRevenue.textContent = `₹${totalRevenue.toLocaleString('en-IN')}`;
  if (elPaid) elPaid.textContent = paidCount;
  if (elPending) elPending.textContent = pendingCount;
  if (elFulfilled) elFulfilled.textContent = fulfilledCount;
  if (topBadge) topBadge.textContent = totalOrders;
  if (statCard) statCard.textContent = totalOrders;

  // Update Filter Tab counters
  const cAll = document.getElementById('countOrderAll');
  const cPaid = document.getElementById('countOrderPaid');
  const cPending = document.getElementById('countOrderPending');
  const cShipped = document.getElementById('countOrderShipped');
  const cDelivered = document.getElementById('countOrderDelivered');
  if (cAll) cAll.textContent = totalOrders;
  if (cPaid) cPaid.textContent = paidCount;
  if (cPending) cPending.textContent = pendingCount;
  if (cShipped) cShipped.textContent = shippedCount;
  if (cDelivered) cDelivered.textContent = deliveredCount;

  // Apply Filter
  let filtered = [...orders];
  if (activeMagazineOrderFilter === 'paid') {
    filtered = filtered.filter(o => (o.paymentStatus || '').toLowerCase().includes('paid'));
  } else if (activeMagazineOrderFilter === 'pending') {
    filtered = filtered.filter(o => (o.shippingStatus || '').toLowerCase().includes('pending'));
  } else if (activeMagazineOrderFilter === 'shipped') {
    filtered = filtered.filter(o => (o.shippingStatus || '').toLowerCase().includes('shipped') || (o.shippingStatus || '').toLowerCase().includes('transit'));
  } else if (activeMagazineOrderFilter === 'delivered') {
    filtered = filtered.filter(o => (o.shippingStatus || '').toLowerCase().includes('delivered'));
  }

  // Apply Search
  if (activeMagazineOrderSearch) {
    const q = activeMagazineOrderSearch;
    filtered = filtered.filter(o => 
      (o.id || '').toLowerCase().includes(q) ||
      (o.fullName || '').toLowerCase().includes(q) ||
      (o.phone || '').toLowerCase().includes(q) ||
      (o.email || '').toLowerCase().includes(q) ||
      (o.city || '').toLowerCase().includes(q) ||
      (o.state || '').toLowerCase().includes(q) ||
      (o.pincode || '').toLowerCase().includes(q) ||
      (o.address || '').toLowerCase().includes(q) ||
      (o.paymentMethod || '').toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 3rem 1.5rem; color: var(--text-muted);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🛍️</div>
          <div style="font-size: 1rem; color: var(--gold-light); font-weight: 700;">No Magazine Purchase Records Found</div>
          <div style="font-size: 0.82rem; margin-top: 0.35rem;">
            ${activeMagazineOrderSearch ? 'No customer orders match your search keyword.' : 'Customer orders will automatically appear here in real-time as users order through the website.'}
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map((order, idx) => {
    const cleanPhone = (order.phone || '').replace(/[^0-9]/g, '');
    const isFirst = idx === 0;

    return `
      <tr class="${isFirst ? 'highlight-top-row' : ''}">
        <!-- Order ID & Date -->
        <td>
          <div style="font-family: monospace; font-size: 0.85rem; font-weight: 800; color: var(--gold-light);">
            ${order.id}
          </div>
          <div style="font-size: 0.74rem; color: var(--text-muted); margin-top: 0.2rem;">
            ${order.displayDate || order.date}
          </div>
        </td>

        <!-- Customer Information -->
        <td>
          <div class="admin-order-user-card">
            <span class="admin-order-user-name">${escapeHtml(order.fullName)}</span>
            <div class="admin-order-user-meta">
              <a href="https://wa.me/${cleanPhone}" target="_blank" rel="noopener" style="color: #34D399; text-decoration: none; display: inline-flex; align-items: center; gap: 0.25rem;" title="Chat directly with customer on WhatsApp">
                <span>WA:</span> ${escapeHtml(order.phone)}
              </a>
            </div>
            <div class="admin-order-user-meta">
              <a href="mailto:${order.email}" style="color: #93C5FD; text-decoration: none; display: inline-flex; align-items: center; gap: 0.25rem;" title="Send email to customer">
                <span>Email:</span> ${escapeHtml(order.email)}
              </a>
            </div>
          </div>
        </td>

        <!-- Complete Home Address -->
        <td>
          <div class="admin-order-address-box">
            <div>${escapeHtml(order.address)}</div>
            <div style="margin-top: 0.25rem; font-weight: 600; color: #FFFFFF;">
              ${escapeHtml(order.city)}, ${escapeHtml(order.state)} &mdash; <span style="color: var(--admin-gold-light);">${order.pincode}</span>
            </div>
          </div>
        </td>

        <!-- Edition & Qty -->
        <td>
          <div style="font-size: 0.82rem; font-weight: 700; color: #FFFFFF; line-height: 1.3;">
            ${escapeHtml(order.edition || 'November 2026 Print Edition')}
          </div>
          <div style="font-size: 0.74rem; color: var(--admin-gold-light); margin-top: 0.2rem;">
            ${order.quantity || 1} Copy &bull; <strong>₹${order.amount || 499}</strong>
          </div>
        </td>

        <!-- Payment Method -->
        <td>
          <div style="font-size: 0.8rem; font-weight: 600; color: #E5E7EB;">
            ${escapeHtml(order.paymentMethod || 'Online (UPI)')}
          </div>
          <div style="font-size: 0.7rem; color: #34D399; margin-top: 0.15rem;">
            Online Gateway
          </div>
        </td>

        <!-- Payment Status (Online Only) -->
        <td>
          <select class="order-status-select" onchange="updateOrderPaymentStatus('${order.id}', this.value)" style="border-color: ${order.paymentStatus === 'Paid (Online)' ? 'rgba(34, 197, 94, 0.5)' : 'rgba(234, 179, 8, 0.5)'};">
            <option value="Paid (Online)" ${order.paymentStatus === 'Paid (Online)' ? 'selected' : ''}>Paid (Online)</option>
            <option value="Pending Payment" ${order.paymentStatus === 'Pending Payment' ? 'selected' : ''}>Pending Payment</option>
            <option value="Refunded" ${order.paymentStatus === 'Refunded' ? 'selected' : ''}>Refunded</option>
            <option value="Failed" ${order.paymentStatus === 'Failed' ? 'selected' : ''}>Failed</option>
          </select>
        </td>

        <!-- Fulfillment / Shipping Status -->
        <td>
          <select class="order-status-select" onchange="updateOrderShippingStatus('${order.id}', this.value)">
            <option value="Pending Dispatch" ${order.shippingStatus === 'Pending Dispatch' ? 'selected' : ''}>Pending Dispatch</option>
            <option value="Processing Packaging" ${order.shippingStatus === 'Processing Packaging' ? 'selected' : ''}>Packaging</option>
            <option value="Shipped / In Transit" ${order.shippingStatus === 'Shipped / In Transit' ? 'selected' : ''}>Shipped / In Transit</option>
            <option value="Delivered" ${order.shippingStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
            <option value="Cancelled" ${order.shippingStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>

        <!-- Action Buttons -->
        <td>
          <div style="display: flex; gap: 0.35rem; justify-content: flex-end; flex-wrap: wrap;">
            <button type="button" class="admin-btn admin-btn-outline admin-btn-sm" style="padding: 0.25rem 0.55rem; font-size: 0.75rem;" onclick="openOrderSlipModal('${order.id}')" title="Generate printable packing slip and courier label">
              Slip
            </button>
            <button type="button" class="admin-btn admin-btn-outline admin-btn-sm" style="padding: 0.25rem 0.55rem; font-size: 0.75rem; color: #34D399; border-color: rgba(52, 211, 153, 0.4);" onclick="openCustomerWhatsApp('${order.id}')" title="Send order confirmation message to customer on WhatsApp">
              WA
            </button>
            <button type="button" class="admin-btn admin-btn-danger admin-btn-sm" style="padding: 0.25rem 0.55rem; font-size: 0.75rem;" onclick="deleteMagazineOrder('${order.id}')" title="Delete this order record">
              Delete
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
};

window.updateOrderPaymentStatus = function(orderId, newStatus) {
  const orders = getAllMagazineOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  order.paymentStatus = newStatus;
  saveMagazineOrders(orders);
  renderMagazineOrdersTable();
  if (window.ScreenladyAPI && typeof window.ScreenladyAPI.updateOrderStatus === 'function') {
    window.ScreenladyAPI.updateOrderStatus(orderId, { paymentStatus: newStatus });
  }
  showToast(`✓ Order ${orderId} payment status updated to: ${newStatus}`);
};

window.updateOrderShippingStatus = function(orderId, newStatus) {
  const orders = getAllMagazineOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  order.shippingStatus = newStatus;
  saveMagazineOrders(orders);
  renderMagazineOrdersTable();
  if (window.ScreenladyAPI && typeof window.ScreenladyAPI.updateOrderStatus === 'function') {
    window.ScreenladyAPI.updateOrderStatus(orderId, { dispatchStatus: newStatus });
  }
  showToast(`✓ Order ${orderId} dispatch status updated to: ${newStatus}`);
};

window.deleteMagazineOrder = function(orderId) {
  if (!confirm(`Are you sure you want to permanently delete Order #${orderId}?`)) return;

  let orders = getAllMagazineOrders();
  orders = orders.filter(o => o.id !== orderId);
  saveMagazineOrders(orders);
  renderMagazineOrdersTable();
  updateStatCounters();
  if (window.ScreenladyAPI && typeof window.ScreenladyAPI.deleteOrder === 'function') {
    window.ScreenladyAPI.deleteOrder(orderId);
  }
  showToast(`✓ Order #${orderId} has been deleted.`);
};

window.openOrderSlipModal = function(orderId) {
  const orders = getAllMagazineOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) {
    alert('Order details not found.');
    return;
  }

  const content = `
    <div style="padding: 1.5rem; max-width: 650px; margin: 0 auto; background: #FFFFFF; color: #111827; border-radius: 8px; font-family: sans-serif;" id="printableOrderSlip">
      <!-- Slip Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #D4AF37; padding-bottom: 1rem; margin-bottom: 1.25rem;">
        <div>
          <div style="font-size: 1.35rem; font-weight: 800; color: #0A0A0D; letter-spacing: 0.05em;">ACCOLADE SCREENLADY</div>
          <div style="font-size: 0.78rem; color: #64748B;">Official Monthly Print Publication • Dispatch Unit</div>
          <div style="font-size: 0.74rem; color: #64748B; margin-top: 0.2rem;">WhatsApp: +91 96650 35503 | editor@accoladescreenlady.com</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 1.1rem; font-weight: 800; color: #D4AF37;">COURIER DISPATCH SLIP</div>
          <div style="font-size: 0.82rem; font-weight: 700; color: #0A0A0D; font-family: monospace;">${order.id}</div>
          <div style="font-size: 0.72rem; color: #64748B;">${order.displayDate || order.date}</div>
        </div>
      </div>

      <!-- Shipping Address Box -->
      <div style="background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 6px; padding: 1.2rem; margin-bottom: 1.25rem;">
        <div style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: #D4AF37; letter-spacing: 0.08em; margin-bottom: 0.4rem;">
          SHIP TO RECIPIENT:
        </div>
        <div style="font-size: 1.15rem; font-weight: 800; color: #0F172A; margin-bottom: 0.35rem;">
          ${escapeHtml(order.fullName)}
        </div>
        <div style="font-size: 0.92rem; color: #334155; line-height: 1.5; margin-bottom: 0.5rem;">
          ${escapeHtml(order.address)}<br>
          ${escapeHtml(order.city)}, ${escapeHtml(order.state)} — <strong style="font-size: 1.05rem; color: #0F172A;">${order.pincode}</strong>
        </div>
        <div style="font-size: 0.85rem; color: #475569; font-weight: 600;">
          Contact Phone: ${escapeHtml(order.phone)} | Email: ${escapeHtml(order.email)}
        </div>
      </div>

      <!-- Items Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.25rem; font-size: 0.85rem;">
        <thead>
          <tr style="background: #0F172A; color: #FFFFFF;">
            <th style="padding: 0.65rem; text-align: left;">Item Description</th>
            <th style="padding: 0.65rem; text-align: center; width: 60px;">Qty</th>
            <th style="padding: 0.65rem; text-align: right; width: 100px;">Price</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 0.75rem 0.65rem;">
              <strong>${escapeHtml(order.edition || 'Screenlady Monthly Print Edition')}</strong><br>
              <span style="font-size: 0.74rem; color: #64748B;">Luxury High-Gloss 120 GSM Collector's Edition</span>
            </td>
            <td style="padding: 0.75rem 0.65rem; text-align: center; font-weight: 700;">${order.quantity || 1}</td>
            <td style="padding: 0.75rem 0.65rem; text-align: right; font-weight: 700;">₹${order.amount}</td>
          </tr>
        </tbody>
      </table>

      <!-- Status Summary -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1.5px solid #0F172A; padding-top: 0.85rem; margin-bottom: 1.5rem;">
        <div style="font-size: 0.78rem; color: #475569;">
          <div><strong>Payment Status:</strong> ${order.paymentStatus} (${order.paymentMethod || 'Online'})</div>
          <div><strong>Dispatch Status:</strong> ${order.shippingStatus}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.75rem; color: #64748B;">Total Amount Paid</div>
          <div style="font-size: 1.4rem; font-weight: 800; color: #0F172A;">₹${order.amount}</div>
        </div>
      </div>

      <!-- Action buttons -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #E2E8F0; padding-top: 1rem;">
        <button type="button" class="admin-btn admin-btn-outline admin-btn-sm" onclick="window.print()" style="background: #0F172A; color: #FFFFFF;">
          Print Packing Slip
        </button>
        <button type="button" class="admin-btn admin-btn-gold admin-btn-sm" onclick="document.getElementById('inlineOrderSlipBox').style.display='none'">
          Close Slip
        </button>
      </div>
    </div>
  `;

  const box = document.getElementById('inlineOrderSlipBox');
  const target = document.getElementById('inlineOrderSlipContent');
  if (box && target) {
    target.innerHTML = content;
    box.style.display = 'block';
    box.scrollIntoView({ behavior: 'smooth' });
  }
};

window.openCustomerWhatsApp = function(orderId) {
  const orders = getAllMagazineOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  const cleanPhone = (order.phone || '').replace(/[^0-9]/g, '');
  const message = `Namaste ${order.fullName}! 🙏 Greetings from Accolade Screenlady Editorial Desk.\n\nRegarding your Magazine Order *${order.id}* (${order.edition}):\nYour order is currently marked as *${order.shippingStatus}*.\nDelivery Address: ${order.address}, ${order.city}, ${order.state} - ${order.pincode}.\n\nThank you for choosing Accolade Screenlady!`;
  
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};

window.exportMagazineOrdersCsv = function() {
  const orders = getAllMagazineOrders();
  if (orders.length === 0) {
    alert('No magazine orders available to export.');
    return;
  }

  const headers = ['Order ID', 'Order Date', 'Customer Name', 'Phone', 'Email', 'Address', 'City', 'State', 'Pincode', 'Edition', 'Quantity', 'Amount', 'Payment Method', 'Payment Status', 'Shipping Status'];
  
  const csvRows = [headers.join(',')];
  orders.forEach(o => {
    const row = [
      `"${o.id || ''}"`,
      `"${(o.displayDate || o.date || '').replace(/"/g, '""')}"`,
      `"${(o.fullName || '').replace(/"/g, '""')}"`,
      `"${(o.phone || '').replace(/"/g, '""')}"`,
      `"${(o.email || '').replace(/"/g, '""')}"`,
      `"${(o.address || '').replace(/"/g, '""')}"`,
      `"${(o.city || '').replace(/"/g, '""')}"`,
      `"${(o.state || '').replace(/"/g, '""')}"`,
      `"${(o.pincode || '').replace(/"/g, '""')}"`,
      `"${(o.edition || '').replace(/"/g, '""')}"`,
      o.quantity || 1,
      o.amount || 499,
      `"${(o.paymentMethod || '').replace(/"/g, '""')}"`,
      `"${(o.paymentStatus || '').replace(/"/g, '""')}"`,
      `"${(o.shippingStatus || '').replace(/"/g, '""')}"`
    ];
    csvRows.push(row.join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Screenlady_Magazine_Orders_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('✓ Orders CSV export generated and downloaded.');
};

window.openMagazineIssueConfigModal = function() {
  switchAdminView('panel-magazine');
  const target = document.getElementById('panel-magazine');
  if (target) target.scrollIntoView({ behavior: 'smooth' });
};

window.populateMagazineSettingsForm = function(settings) {
  const s = settings || (typeof getMagazineSettings === 'function' ? getMagazineSettings() : null) || {
    edition: 'November 2026 — Power, Art & Corporate Leadership Issue',
    price: 220,
    coverImage: 'https://ik.imagekit.io/acooladescreenlady/assets/images/magazine-cover-latest.jpg',
    page2Image: 'https://ik.imagekit.io/acooladescreenlady/assets/images/magazine-page2-feature.jpg',
    headline: 'THE ARCHITECTS OF MODERN INFLUENCE',
    subtitle: 'Celebrating Trailblazing Women Behind the Screen & Across Boardrooms',
    popupBadge: 'Screenlady Print Magazine',
    popupMessage: "Collector's Print Edition Now Available • Insured Doorstep Courier Across India"
  };

  const ed = document.getElementById('cfgMagEdition');
  if (ed && s.edition) ed.value = s.edition;
  const pr = document.getElementById('cfgMagPrice');
  if (pr && s.price) pr.value = s.price;
  const cov = document.getElementById('cfgMagCover');
  if (cov && s.coverImage) cov.value = s.coverImage;
  const p2 = document.getElementById('cfgMagPage2');
  if (p2 && s.page2Image) p2.value = s.page2Image;
  const hl = document.getElementById('cfgMagHeadline');
  if (hl && s.headline) hl.value = s.headline;
  const sub = document.getElementById('cfgMagSubtitle');
  if (sub && s.subtitle) sub.value = s.subtitle;
  const pb = document.getElementById('cfgMagPopupBadge');
  if (pb && s.popupBadge) pb.value = s.popupBadge;
  const pm = document.getElementById('cfgMagPopupMsg');
  if (pm && s.popupMessage) pm.value = s.popupMessage;

  // Previews
  const coverEl = document.getElementById('adminPanelMagCoverImg');
  if (coverEl && s.coverImage) coverEl.src = s.coverImage;
  const page2El = document.getElementById('adminPanelMagPage2Img');
  if (page2El && s.page2Image) page2El.src = s.page2Image;
  const editionEl = document.getElementById('adminPanelMagEdition');
  if (editionEl && s.edition) editionEl.textContent = s.edition;
  const priceEl = document.getElementById('adminPanelMagPrice');
  if (priceEl && s.price) priceEl.textContent = `Price: ₹${s.price}`;
  const headlineEl = document.getElementById('adminPanelMagHeadline');
  if (headlineEl && s.headline) headlineEl.textContent = s.headline;
  const subtitleEl = document.getElementById('adminPanelMagSubtitle');
  if (subtitleEl && s.subtitle) subtitleEl.textContent = s.subtitle;
};

window.handleMagSettingUpload = async function(e, targetInputId, targetImgId) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const input = document.getElementById(targetInputId);
  const img = document.getElementById(targetImgId);

  // Instant local preview
  const reader = new FileReader();
  reader.onload = (event) => {
    if (input && !input.value) input.value = event.target.result;
    if (img) img.src = event.target.result;
  };
  reader.readAsDataURL(file);

  showToast(`Uploading ${file.name} to ImageKit CDN...`);

  try {
    if (window.ScreenladyAPI && typeof window.ScreenladyAPI.uploadMedia === 'function') {
      const customKey = 'mag-setting-' + Date.now();
      const res = await window.ScreenladyAPI.uploadMedia(file, customKey, 'magazine-covers');
      const url = res.url || (res.data && res.data.url);
      if (url) {
        if (input) input.value = url;
        if (img) img.src = url;
        showToast('✓ Photo uploaded to ImageKit CDN');
        return;
      }
    }
  } catch (err) {
    console.warn('Upload warning (preserved locally):', err);
  }
};

window.handleSaveMagazineConfig = async function(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();

  const edition = (document.getElementById('cfgMagEdition')?.value || '').trim();
  const price = parseInt(document.getElementById('cfgMagPrice')?.value || '220', 10);
  const coverImage = (document.getElementById('cfgMagCover')?.value || '').trim();
  const page2Image = (document.getElementById('cfgMagPage2')?.value || '').trim();
  const headline = (document.getElementById('cfgMagHeadline')?.value || '').trim();
  const subtitle = (document.getElementById('cfgMagSubtitle')?.value || '').trim();
  const popupBadge = (document.getElementById('cfgMagPopupBadge')?.value || '').trim();
  const popupMessage = (document.getElementById('cfgMagPopupMsg')?.value || '').trim();

  const newSettings = {
    edition: edition || 'November 2026 — Power, Art & Corporate Leadership Issue',
    monthYear: 'November 2026',
    price: isNaN(price) ? 220 : price,
    coverImage: coverImage || 'https://ik.imagekit.io/acooladescreenlady/magazine-covers/cover-1795330731064_0Xwt7ILYb',
    page2Image: page2Image || 'https://ik.imagekit.io/acooladescreenlady/screenlady/general/magazine-page2-feature_gqTZYEREU.jpg',
    headline: headline || 'THE ARCHITECTS OF MODERN INFLUENCE',
    subtitle: subtitle || 'Celebrating Trailblazing Women Behind the Screen & Across Boardrooms',
    popupBadge: popupBadge || 'Screenlady Print Magazine',
    popupMessage: popupMessage || "Collector's Print Edition Now Available • Insured Doorstep Courier Across India",
    curator: 'Conceived & Curated under the Editorial Vision of Mr. Prashant Chandrakant Sagvekar'
  };

  // Update inline preview elements
  const coverEl = document.getElementById('adminPanelMagCoverImg');
  if (coverEl) coverEl.src = newSettings.coverImage;
  const page2El = document.getElementById('adminPanelMagPage2Img');
  if (page2El) page2El.src = newSettings.page2Image;
  const editionEl = document.getElementById('adminPanelMagEdition');
  if (editionEl) editionEl.textContent = newSettings.edition;
  const priceEl = document.getElementById('adminPanelMagPrice');
  if (priceEl) priceEl.textContent = `Price: ₹${newSettings.price}`;
  const headlineEl = document.getElementById('adminPanelMagHeadline');
  if (headlineEl) headlineEl.textContent = newSettings.headline;
  const subtitleEl = document.getElementById('adminPanelMagSubtitle');
  if (subtitleEl) subtitleEl.textContent = newSettings.subtitle;

  // Save locally
  if (typeof saveMagazineSettings === 'function') {
    saveMagazineSettings(newSettings);
  } else {
    localStorage.setItem('screenlady_magazine_settings', JSON.stringify(newSettings));
    try {
      window.dispatchEvent(new CustomEvent('screenlady_magazine_settings_changed', { detail: newSettings }));
    } catch (err) {}
  }

  // Update backend via D1 worker API
  if (window.ScreenladyAPI && typeof window.ScreenladyAPI.updateMagazineSettings === 'function') {
    try {
      const pin = getSavedPin();
      const res = await window.ScreenladyAPI.updateMagazineSettings(newSettings, pin);
      if (res && res.error) {
        showToast('⚠️ Backend notice: ' + res.error);
      } else {
        showToast('✓ Monthly Magazine settings successfully saved to D1 database!');
      }
    } catch (backendErr) {
      console.warn('[Admin] Cloudflare D1 magazine sync notice:', backendErr);
      showToast('⚠️ Sync notice: ' + backendErr.message);
    }
  }

  if (typeof initAvailableInPrint === 'function') initAvailableInPrint();
  if (typeof updateMagazinePopupFromSettings === 'function') {
    updateMagazinePopupFromSettings();
  }
};

function showToast(message) {
  let container = document.getElementById('adminToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'adminToastContainer';
    container.className = 'admin-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'admin-toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--admin-gold); flex-shrink: 0;"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => toast.classList.add('visible'), 40);
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* =============================================================
   HOMEPAGE BUSINESS SHOWCASE (BRAND SPOTLIGHT) CONTROLLER
   Connected to 'business_ads' D1 table
   ============================================================= */

window.updateAdPhotoPreview = function(url) {
  const img = document.getElementById('adPhotoPreview');
  const ph = document.getElementById('adPhotoPreviewPlaceholder');
  if (img) {
    if (url && url.trim().length > 0) {
      img.src = url.trim();
      img.style.display = 'block';
      if (ph) ph.style.display = 'none';
    } else {
      img.style.display = 'none';
      if (ph) ph.style.display = 'inline';
    }
  }
};

window.handleAdPhotoUpload = async function(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const status = document.getElementById('adPhotoUploadStatus');
  if (status) status.textContent = 'Uploading photo to ImageKit CDN...';

  try {
    if (window.ScreenladyAPI && typeof window.ScreenladyAPI.uploadMedia === 'function') {
      const customKey = 'brand-' + Date.now();
      const res = await window.ScreenladyAPI.uploadMedia(file, customKey, 'brands');
      const url = res.url || (res.data && res.data.url);
      if (url) {
        const input = document.getElementById('adPhotoInput');
        if (input) input.value = url;
        updateAdPhotoPreview(url);
        if (status) status.textContent = '✓ Uploaded to ImageKit CDN successfully.';
        showToast('✓ Photo uploaded to ImageKit CDN');
        return;
      }
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const input = document.getElementById('adPhotoInput');
      if (input) input.value = dataUrl;
      updateAdPhotoPreview(dataUrl);
      if (status) status.textContent = '✓ Photo loaded locally.';
    };
    reader.readAsDataURL(file);
  } catch (err) {
    if (status) status.textContent = 'Upload failed: ' + err.message;
    console.warn('Brand photo upload error:', err);
  }
};

window.renderBusinessAdsPanel = async function() {
  const tableBody = document.getElementById('businessAdsTableBody');
  const statBadge = document.getElementById('navStatBusinessAds');
  const kpiStat = document.getElementById('statTotalBusinessAds');

  let ads = [];
  try {
    if (window.ScreenladyAPI && typeof window.ScreenladyAPI.getBusinessAds === 'function') {
      const backendAds = await window.ScreenladyAPI.getBusinessAds();
      if (backendAds && Array.isArray(backendAds)) {
        ads = backendAds;
        window.backendLiveBusinessAds = ads;
      }
    }
  } catch (err) {
    console.warn('[Admin] Notice fetching business ads:', err);
  }

  if (ads.length === 0 && window.backendLiveBusinessAds && window.backendLiveBusinessAds.length > 0) {
    ads = window.backendLiveBusinessAds;
  }

  if (ads.length === 0) {
    try {
      const raw = localStorage.getItem('screenlady_custom_business_ads');
      if (raw) ads = JSON.parse(raw);
    } catch (e) { ads = []; }
  }

  const deletedIds = (typeof window.getScreenladyDeletedIds === 'function')
    ? window.getScreenladyDeletedIds()
    : (() => { try { const r = localStorage.getItem('screenlady_deleted_ids'); return r ? JSON.parse(r) : []; } catch(e){ return []; } })();

  ads = ads.filter(item => item && !deletedIds.includes(item.id));

  if (statBadge) statBadge.textContent = ads.length;
  if (kpiStat) kpiStat.textContent = ads.length;

  if (!tableBody) return;

  if (ads.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 3rem 1.5rem; color: var(--admin-text-muted);">
          <div style="font-size: 1.1rem; color: var(--admin-gold-light); font-weight: 600; margin-bottom: 0.5rem;">No Brand Partners Published Yet</div>
          <p style="font-size: 0.85rem; max-width: 420px; margin: 0 auto;">Use the form above to publish your first brand partner to the homepage right-hand showcase.</p>
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = ads.map(item => `
    <tr>
      <td>
        <img src="${escapeHtml(item.photo || item.image)}" alt="${escapeHtml(item.brandName || item.title)}" style="width: 58px; height: 58px; object-fit: cover; border-radius: 4px; border: 1px solid var(--admin-border-gold);" onerror="this.src='/assets/images/featured-icon-saree.jpg'">
      </td>
      <td>
        <div style="font-weight: 700; color: #FFFFFF; font-size: 0.92rem;">${escapeHtml(item.brandName || item.title)}</div>
        <span class="admin-badge admin-badge-gold" style="font-size: 0.7rem; margin-top: 0.25rem;">${escapeHtml(item.category || 'Featured Partner')}</span>
      </td>
      <td>
        <div style="font-weight: 600; color: var(--admin-gold-light); font-size: 0.85rem; margin-bottom: 0.2rem;">${escapeHtml(item.headline || '')}</div>
        <div style="color: var(--admin-text-muted); font-size: 0.78rem; max-width: 380px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${escapeHtml(item.summary || '')}</div>
      </td>
      <td>
        ${item.destinationUrl ? `<a href="${escapeHtml(item.destinationUrl)}" target="_blank" rel="noopener" style="color: var(--admin-gold); font-size: 0.8rem; text-decoration: underline;">Visit &rarr;</a>` : '<span style="color: var(--admin-text-faint); font-size: 0.75rem;">None</span>'}
      </td>
      <td style="text-align: right;">
        <div style="display: inline-flex; gap: 0.4rem;">
          <button type="button" class="admin-btn admin-btn-outline admin-btn-sm" onclick="editBusinessAd('${escapeHtml(item.id)}')">Edit</button>
          <button type="button" class="admin-btn admin-btn-danger admin-btn-sm" onclick="deleteBusinessAd('${escapeHtml(item.id)}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
};

window.handleSaveBusinessAd = async function(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();

  const editingId = (document.getElementById('adEditingId')?.value || '').trim();
  const brandName = (document.getElementById('adBrandName')?.value || '').trim();
  const category = (document.getElementById('adCategory')?.value || '').trim();
  const headline = (document.getElementById('adHeadline')?.value || '').trim();
  const tagline = (document.getElementById('adTagline')?.value || '').trim();
  const destUrl = (document.getElementById('adDestUrl')?.value || '').trim();
  const summary = (document.getElementById('adSummary')?.value || '').trim();
  const photo = (document.getElementById('adPhotoInput')?.value || '').trim();

  if (!brandName || !headline || !summary || !photo) {
    showToast('⚠️ Please fill in all required fields (Brand Name, Headline, Summary, Photo).');
    return;
  }

  const id = editingId || ('brand-' + Date.now());
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const adItem = {
    id,
    brandName,
    title: brandName,
    category: category || 'Enterprise',
    categoryBadge: 'Brand Spotlight',
    badge: 'Brand Spotlight',
    headline,
    tagline: tagline || headline,
    summary,
    destinationUrl: destUrl,
    photo,
    image: photo,
    date: dateStr,
    displayDate: dateStr,
    timestamp: Date.now(),
    isCustom: true
  };

  const pin = getSavedPin();

  // Save to Cloudflare D1 Backend
  if (window.ScreenladyAPI && typeof window.ScreenladyAPI.publishItem === 'function') {
    try {
      await window.ScreenladyAPI.publishItem('business_ads', adItem, pin);
    } catch (err) {
      console.warn('Backend publish notice:', err);
    }
  }

  // Update localStorage custom ads
  let localAds = [];
  try {
    const raw = localStorage.getItem('screenlady_custom_business_ads');
    if (raw) localAds = JSON.parse(raw);
  } catch (e) { localAds = []; }

  const existIdx = localAds.findIndex(a => a.id === id);
  if (existIdx >= 0) {
    localAds[existIdx] = adItem;
  } else {
    localAds.unshift(adItem);
  }
  localStorage.setItem('screenlady_custom_business_ads', JSON.stringify(localAds));

  // Update in-memory backend list
  if (!window.backendLiveBusinessAds) window.backendLiveBusinessAds = [];
  const bIdx = window.backendLiveBusinessAds.findIndex(a => a.id === id);
  if (bIdx >= 0) {
    window.backendLiveBusinessAds[bIdx] = adItem;
  } else {
    window.backendLiveBusinessAds.unshift(adItem);
  }

  cancelBusinessAdEdit();
  renderBusinessAdsPanel();
  showToast(editingId ? '✓ Brand partner updated successfully!' : '✓ Brand partner published to homepage showcase!');
};

window.editBusinessAd = function(id) {
  let ads = window.backendLiveBusinessAds || [];
  if (ads.length === 0) {
    try {
      const raw = localStorage.getItem('screenlady_custom_business_ads');
      if (raw) ads = JSON.parse(raw);
    } catch (e) { ads = []; }
  }

  const item = ads.find(a => a && a.id === id);
  if (!item) return;

  const idField = document.getElementById('adEditingId');
  if (idField) idField.value = item.id;
  const bn = document.getElementById('adBrandName');
  if (bn) bn.value = item.brandName || item.title || '';
  const cat = document.getElementById('adCategory');
  if (cat) cat.value = item.category || '';
  const hl = document.getElementById('adHeadline');
  if (hl) hl.value = item.headline || '';
  const tl = document.getElementById('adTagline');
  if (tl) tl.value = item.tagline || '';
  const dest = document.getElementById('adDestUrl');
  if (dest) dest.value = item.destinationUrl || '';
  const sum = document.getElementById('adSummary');
  if (sum) sum.value = item.summary || '';
  const photo = document.getElementById('adPhotoInput');
  if (photo) photo.value = item.photo || item.image || '';

  updateAdPhotoPreview(item.photo || item.image || '');

  const titleEl = document.getElementById('adFormTitle');
  if (titleEl) titleEl.textContent = 'Edit Brand Partner Showcase';
  const subBtn = document.getElementById('adSubmitBtn');
  if (subBtn) subBtn.innerHTML = 'Update Brand Partner &rarr;';
  const cancelBtn = document.getElementById('adCancelBtn');
  if (cancelBtn) cancelBtn.style.display = 'inline-block';

  const form = document.getElementById('businessAdForm');
  if (form) form.scrollIntoView({ behavior: 'smooth' });
};

window.cancelBusinessAdEdit = function() {
  const form = document.getElementById('businessAdForm');
  if (form) form.reset();
  const idField = document.getElementById('adEditingId');
  if (idField) idField.value = '';
  updateAdPhotoPreview('');
  const titleEl = document.getElementById('adFormTitle');
  if (titleEl) titleEl.textContent = '+ Add New Brand Partner Showcase';
  const subBtn = document.getElementById('adSubmitBtn');
  if (subBtn) subBtn.innerHTML = 'Publish Brand Partner &rarr;';
  const cancelBtn = document.getElementById('adCancelBtn');
  if (cancelBtn) cancelBtn.style.display = 'none';
  const status = document.getElementById('adPhotoUploadStatus');
  if (status) status.textContent = '';
};

window.deleteBusinessAd = async function(id) {
  if (!confirm('Are you sure you want to remove this brand partner from the homepage showcase?')) return;

  const pin = getSavedPin();

  if (window.ScreenladyAPI && typeof window.ScreenladyAPI.deleteItem === 'function') {
    try {
      await window.ScreenladyAPI.deleteItem('business_ads', id, pin);
    } catch (err) {
      console.warn('Backend delete notice:', err);
    }
  }

  let deletedIds = [];
  try {
    const raw = localStorage.getItem('screenlady_deleted_ids');
    if (raw) deletedIds = JSON.parse(raw);
  } catch (e) { deletedIds = []; }
  if (!deletedIds.includes(id)) {
    deletedIds.push(id);
    localStorage.setItem('screenlady_deleted_ids', JSON.stringify(deletedIds));
  }
  if (!window.backendDeletedIds) window.backendDeletedIds = [];
  if (!window.backendDeletedIds.includes(id)) window.backendDeletedIds.push(id);

  try {
    const raw = localStorage.getItem('screenlady_custom_business_ads');
    if (raw) {
      const list = JSON.parse(raw).filter(a => a.id !== id);
      localStorage.setItem('screenlady_custom_business_ads', JSON.stringify(list));
    }
  } catch (e) {}

  if (window.backendLiveBusinessAds) {
    window.backendLiveBusinessAds = window.backendLiveBusinessAds.filter(a => a.id !== id);
  }

  renderBusinessAdsPanel();
  showToast('✓ Brand partner removed from homepage showcase.');
};


/* =============================================================
   HOMEPAGE MAGAZINE EDITION SLIDESHOW CONTROLLER
   Connected to 'magazine_settings.available_issues' in D1
   ============================================================= */

window.updateEdCoverPreview = function(url) {
  const img = document.getElementById('edIssueCoverPreview');
  const ph = document.getElementById('edIssueCoverPlaceholder');
  if (img) {
    if (url && url.trim().length > 0) {
      img.src = url.trim();
      img.style.display = 'block';
      if (ph) ph.style.display = 'none';
    } else {
      img.style.display = 'none';
      if (ph) ph.style.display = 'inline';
    }
  }
};

window.handleEdCoverUpload = async function(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const status = document.getElementById('edIssueUploadStatus');
  if (status) status.textContent = 'Uploading cover to ImageKit CDN...';

  try {
    if (window.ScreenladyAPI && typeof window.ScreenladyAPI.uploadMedia === 'function') {
      const customKey = 'mag-cover-' + Date.now();
      const res = await window.ScreenladyAPI.uploadMedia(file, customKey, 'magazine');
      const url = res.url || (res.data && res.data.url);
      if (url) {
        const input = document.getElementById('edIssueCover');
        if (input) input.value = url;
        updateEdCoverPreview(url);
        if (status) status.textContent = '✓ Uploaded cover to ImageKit CDN.';
        showToast('✓ Cover uploaded to ImageKit CDN');
        return;
      }
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const input = document.getElementById('edIssueCover');
      if (input) input.value = dataUrl;
      updateEdCoverPreview(dataUrl);
      if (status) status.textContent = '✓ Cover loaded locally.';
    };
    reader.readAsDataURL(file);
  } catch (err) {
    if (status) status.textContent = 'Upload failed: ' + err.message;
  }
};

window.getAvailableMagazineIssues = function() {
  let settings = null;
  try {
    const raw = localStorage.getItem('screenlady_magazine_settings');
    if (raw) settings = JSON.parse(raw);
  } catch (e) {}

  if (settings && Array.isArray(settings.availableIssues)) {
    return settings.availableIssues;
  }
  return [];
};

window.renderMagazineEditionsList = async function(passedIssues) {
  const tableBody = document.getElementById('magEditionsTableBody');
  if (!tableBody) return;

  let issues = passedIssues;
  if (!issues || !Array.isArray(issues)) {
    if (window.ScreenladyAPI && typeof window.ScreenladyAPI.getMagazineSettings === 'function') {
      try {
        const backendMag = await window.ScreenladyAPI.getMagazineSettings();
        if (backendMag && Array.isArray(backendMag.availableIssues)) {
          issues = backendMag.availableIssues;
        }
      } catch (err) {}
    }
  }

  if (!issues || !Array.isArray(issues)) {
    issues = getAvailableMagazineIssues();
  }

  if (issues.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 2.5rem 1.5rem; color: var(--admin-text-muted);">
          <div style="font-size: 1rem; color: var(--admin-gold-light); font-weight: 600; margin-bottom: 0.35rem;">No Monthly Editions Added to Slideshow</div>
          <p style="font-size: 0.82rem; margin: 0;">Add monthly editions using the form above to showcase them on the Homepage Hero Slideshow.</p>
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = issues.map((issue, idx) => `
    <tr>
      <td>
        <img src="${escapeHtml(issue.cover)}" alt="${escapeHtml(issue.title || 'Edition')}" style="width: 48px; height: 68px; object-fit: cover; border-radius: 3px; border: 1px solid var(--admin-border-gold);" onerror="this.src='/assets/images/magazine-cover-latest.jpg'">
      </td>
      <td>
        <div style="font-weight: 700; color: #FFFFFF; font-size: 0.92rem;">${escapeHtml(issue.monthYear || (issue.title ? issue.title.split('—')[0].trim() : 'Edition'))}</div>
        <span style="font-size: 0.72rem; color: var(--admin-text-faint); font-family: monospace;">ID: ${escapeHtml(issue.id || 'issue-' + idx)}</span>
      </td>
      <td>
        <div style="font-weight: 600; color: var(--admin-gold-light); font-size: 0.85rem;">${escapeHtml(issue.title || '')}</div>
      </td>
      <td>
        <span style="font-weight: 600; color: #34D399; font-size: 0.85rem;">₹${escapeHtml(issue.price || 220)}</span>
      </td>
      <td style="text-align: right;">
        <div style="display: inline-flex; gap: 0.4rem;">
          <button type="button" class="admin-btn admin-btn-outline admin-btn-sm" onclick="editMagazineEdition('${escapeHtml(issue.id || '')}')">Edit</button>
          <button type="button" class="admin-btn admin-btn-danger admin-btn-sm" onclick="deleteMagazineEdition('${escapeHtml(issue.id || '')}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
};

window.handleSaveMagazineEdition = async function(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();

  const issueId = (document.getElementById('edIssueId')?.value || '').trim();
  const month = (document.getElementById('edIssueMonth')?.value || '').trim();
  const title = (document.getElementById('edIssueTitle')?.value || '').trim();
  const cover = (document.getElementById('edIssueCover')?.value || '').trim();
  const price = parseInt(document.getElementById('edIssuePrice')?.value || '220', 10);

  if (!month || !title || !cover) {
    showToast('⚠️ Please enter Month, Title, and Cover Image URL.');
    return;
  }

  let currentSettings = {};
  try {
    const raw = localStorage.getItem('screenlady_magazine_settings');
    if (raw) currentSettings = JSON.parse(raw);
  } catch (err) {}

  let issues = Array.isArray(currentSettings.availableIssues) ? [...currentSettings.availableIssues] : [];

  const id = issueId || (month.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now());

  const newIssue = {
    id,
    monthYear: month,
    title,
    cover,
    price: isNaN(price) ? 220 : price
  };

  const existIdx = issues.findIndex(i => i.id === id);
  if (existIdx >= 0) {
    issues[existIdx] = newIssue;
  } else {
    issues.push(newIssue);
  }

  currentSettings.availableIssues = issues;

  localStorage.setItem('screenlady_magazine_settings', JSON.stringify(currentSettings));

  const pin = getSavedPin();
  if (window.ScreenladyAPI && typeof window.ScreenladyAPI.updateMagazineSettings === 'function') {
    try {
      await window.ScreenladyAPI.updateMagazineSettings(currentSettings, pin);
    } catch (err) {
      console.warn('Backend magazine settings sync notice:', err);
    }
  }

  cancelMagazineEditionEdit();
  renderMagazineEditionsList(issues);
  showToast(issueId ? '✓ Magazine edition updated in slideshow!' : '✓ Magazine edition added to homepage slideshow!');
};

window.editMagazineEdition = function(id) {
  const issues = getAvailableMagazineIssues();
  const item = issues.find(i => i.id === id);
  if (!item) return;

  const idField = document.getElementById('edIssueId');
  if (idField) idField.value = item.id;
  const monthField = document.getElementById('edIssueMonth');
  if (monthField) monthField.value = item.monthYear || (item.title ? item.title.split('—')[0].trim() : '');
  const titleField = document.getElementById('edIssueTitle');
  if (titleField) titleField.value = item.title || '';
  const coverField = document.getElementById('edIssueCover');
  if (coverField) coverField.value = item.cover || '';
  const priceField = document.getElementById('edIssuePrice');
  if (priceField) priceField.value = item.price || 220;

  updateEdCoverPreview(item.cover || '');

  const formTitle = document.getElementById('edIssueFormTitle');
  if (formTitle) formTitle.textContent = 'Edit Monthly Edition in Slideshow';
  const subBtn = document.getElementById('edIssueSubmitBtn');
  if (subBtn) subBtn.innerHTML = 'Update Edition &rarr;';
  const cancelBtn = document.getElementById('edIssueCancelBtn');
  if (cancelBtn) cancelBtn.style.display = 'inline-block';

  const form = document.getElementById('magEditionForm');
  if (form) form.scrollIntoView({ behavior: 'smooth' });
};

window.cancelMagazineEditionEdit = function() {
  const form = document.getElementById('magEditionForm');
  if (form) form.reset();
  const idField = document.getElementById('edIssueId');
  if (idField) idField.value = '';
  updateEdCoverPreview('');
  const formTitle = document.getElementById('edIssueFormTitle');
  if (formTitle) formTitle.textContent = '+ Add New Monthly Edition to Slideshow';
  const subBtn = document.getElementById('edIssueSubmitBtn');
  if (subBtn) subBtn.innerHTML = '+ Add Edition to Homepage Slideshow';
  const cancelBtn = document.getElementById('edIssueCancelBtn');
  if (cancelBtn) cancelBtn.style.display = 'none';
  const status = document.getElementById('edIssueUploadStatus');
  if (status) status.textContent = '';
};

window.deleteMagazineEdition = async function(id) {
  if (!confirm('Are you sure you want to remove this edition from the homepage slideshow?')) return;

  let currentSettings = {};
  try {
    const raw = localStorage.getItem('screenlady_magazine_settings');
    if (raw) currentSettings = JSON.parse(raw);
  } catch (err) {}

  let issues = Array.isArray(currentSettings.availableIssues) ? [...currentSettings.availableIssues] : [];
  issues = issues.filter(i => i.id !== id);
  currentSettings.availableIssues = issues;

  localStorage.setItem('screenlady_magazine_settings', JSON.stringify(currentSettings));

  const pin = getSavedPin();
  if (window.ScreenladyAPI && typeof window.ScreenladyAPI.updateMagazineSettings === 'function') {
    try {
      await window.ScreenladyAPI.updateMagazineSettings(currentSettings, pin);
    } catch (err) {
      console.warn('Backend magazine settings sync notice:', err);
    }
  }

  renderMagazineEditionsList(issues);
  showToast('✓ Edition removed from homepage slideshow.');
};

/* =============================================================
   HOMEPAGE MAGAZINE COVERS CONTROLLER ("Exploring the Diverse World of Women")
   Connected to 'magazine_covers' D1 table
   ============================================================= */

window.getAllMagazineCovers = function() {
  const localDeleted = (() => { try { const r = localStorage.getItem('screenlady_deleted_ids'); return r ? JSON.parse(r) : []; } catch(e){ return []; } })();
  const backendDeleted = window.backendDeletedIds || [];
  const deletedIds = Array.from(new Set([...localDeleted, ...backendDeleted]));

  let customCovers = [];
  try {
    const raw = localStorage.getItem('screenlady_custom_magazine_covers');
    if (raw) customCovers = JSON.parse(raw);
  } catch (e) { customCovers = []; }

  const backendCovers = window.backendLiveMagazineCovers || [];

  const seen = new Set();
  const deduped = [];

  for (const item of customCovers) {
    if (item && item.id && !seen.has(item.id) && !deletedIds.includes(item.id)) {
      seen.add(item.id);
      deduped.push({ ...item, isCustom: true });
    }
  }

  for (const item of backendCovers) {
    if (item && item.id && !seen.has(item.id) && !deletedIds.includes(item.id)) {
      seen.add(item.id);
      deduped.push(item);
    }
  }

  deduped.sort((a, b) => {
    const timeA = Number(a.timestamp) || new Date(a.date || 0).getTime() || 0;
    const timeB = Number(b.timestamp) || new Date(b.date || 0).getTime() || 0;
    return timeB - timeA;
  });

  return deduped;
};

window.updateMagCoverPhotoPreview = function(url) {
  const img = document.getElementById('magCoverPhotoPreview');
  const card = document.getElementById('magCoverPhotoPreviewCard');
  const urlText = document.getElementById('magCoverPreviewUrlText');
  const status = document.getElementById('magCoverPhotoUploadStatus');

  if (url && url.trim().length > 0) {
    const cleanUrl = url.trim();
    if (img) {
      img.src = cleanUrl;
      img.style.display = 'block';
    }
    if (card) {
      card.style.display = 'flex';
    }
    if (urlText) {
      urlText.textContent = cleanUrl.startsWith('data:') ? 'Local file selected & ready for publish' : cleanUrl;
    }
    if (status && !status.textContent.includes('Error')) {
      status.textContent = '✓ Cover photo ready';
      status.style.color = '#34D399';
    }
  } else {
    if (img) {
      img.src = '';
      img.style.display = 'none';
    }
    if (card) {
      card.style.display = 'none';
    }
    if (urlText) {
      urlText.textContent = '';
    }
  }
};

window.clearMagCoverPhoto = function() {
  const input = document.getElementById('magCoverPhotoInput');
  const fileInput = document.getElementById('magCoverPhotoFileInput');
  const status = document.getElementById('magCoverPhotoUploadStatus');
  if (input) input.value = '';
  if (fileInput) fileInput.value = '';
  if (status) status.textContent = '';
  updateMagCoverPhotoPreview('');
};

window.handleMagCoverPhotoUpload = async function(e) {
  const file = (e.target && e.target.files && e.target.files[0]) || (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]);
  if (!file) return;

  const status = document.getElementById('magCoverPhotoUploadStatus');
  if (status) {
    status.textContent = `Reading ${file.name} and uploading to ImageKit CDN...`;
    status.style.color = 'var(--admin-gold)';
  }

  // Instantly show local preview via FileReader
  const reader = new FileReader();
  reader.onload = (event) => {
    const dataUrl = event.target.result;
    const input = document.getElementById('magCoverPhotoInput');
    if (input && !input.value) input.value = dataUrl;
    updateMagCoverPhotoPreview(dataUrl);
  };
  reader.readAsDataURL(file);

  try {
    if (window.ScreenladyAPI && typeof window.ScreenladyAPI.uploadMedia === 'function') {
      const customKey = 'cover-' + Date.now();
      const res = await window.ScreenladyAPI.uploadMedia(file, customKey, 'magazine-covers');
      const url = res.url || (res.data && res.data.url);
      if (url) {
        const input = document.getElementById('magCoverPhotoInput');
        if (input) input.value = url;
        updateMagCoverPhotoPreview(url);
        if (status) {
          status.textContent = `✓ Uploaded ${file.name} to ImageKit CDN`;
          status.style.color = '#34D399';
        }
        showToast('✓ Cover uploaded to ImageKit CDN');
        return;
      }
    }
  } catch (err) {
    console.warn('Cover upload warning (preserved locally):', err);
    if (status) {
      status.textContent = `✓ Image selected: ${file.name} (ready to publish)`;
      status.style.color = '#34D399';
    }
  }
};

window.renderMagazineCoversPanel = async function() {
  const tableBody = document.getElementById('magazineCoversTableBody');
  const statBadge = document.getElementById('navStatMagCovers');
  const kpiStat = document.getElementById('statTotalMagCovers');

  let covers = [];
  try {
    if (window.ScreenladyAPI && typeof window.ScreenladyAPI.getMagazineCovers === 'function') {
      const backendCovers = await window.ScreenladyAPI.getMagazineCovers();
      if (backendCovers && Array.isArray(backendCovers)) {
        covers = backendCovers;
        window.backendLiveMagazineCovers = covers;
      }
    }
  } catch (err) {
    console.warn('[Admin] Notice fetching magazine covers:', err);
  }

  if (covers.length === 0 && window.backendLiveMagazineCovers && window.backendLiveMagazineCovers.length > 0) {
    covers = window.backendLiveMagazineCovers;
  }

  if (covers.length === 0) {
    try {
      const raw = localStorage.getItem('screenlady_custom_magazine_covers');
      if (raw) covers = JSON.parse(raw);
    } catch (e) { covers = []; }
  }

  const deletedIds = (typeof window.getScreenladyDeletedIds === 'function')
    ? window.getScreenladyDeletedIds()
    : (() => { try { const r = localStorage.getItem('screenlady_deleted_ids'); return r ? JSON.parse(r) : []; } catch(e){ return []; } })();

  // Filter deleted IDs and eliminate any legacy assets references
  covers = covers.filter(item => {
    if (!item || deletedIds.includes(item.id)) return false;
    const photo = (item.photo || item.cover || item.image || '').trim();
    if (!photo) return false;
    if (photo.startsWith('assets/images/magazine-cover') || photo.startsWith('/assets/images/magazine-cover')) {
      return false;
    }
    return true;
  });

  if (statBadge) statBadge.textContent = covers.length;
  if (kpiStat) kpiStat.textContent = covers.length;

  if (!tableBody) return;

  if (covers.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 3rem 1.5rem; color: var(--admin-text-muted);">
          <div style="font-size: 1.1rem; color: var(--admin-gold-light); font-weight: 600; margin-bottom: 0.5rem;">No Magazine Covers Published Yet</div>
          <p style="font-size: 0.85rem; max-width: 420px; margin: 0 auto; line-height: 1.5;">Use the form above to upload and publish your magazine edition covers to the Hero Slideshow ("Exploring the Diverse World of Women").</p>
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = covers.map(item => {
    const photoUrl = item.photo || item.cover || item.image || '';
    return `
      <tr>
        <td>
          <img src="${escapeHtml(photoUrl)}" alt="${escapeHtml(item.title || 'Cover')}" style="width: 48px; height: 68px; object-fit: cover; border-radius: 3px; border: 1px solid var(--admin-border-gold); background: #14120e;" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'48\\' height=\\'68\\' viewBox=\\'0 0 48 68\\'><rect width=\\'48\\' height=\\'68\\' fill=\\'%2314120e\\'/><text x=\\'50%25\\' y=\\'50%25\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'%23d4af37\\' font-family=\\'sans-serif\\' font-size=\\'8\\'>COVER</text></svg>';">
        </td>
        <td>
          <div style="font-weight: 700; color: #FFFFFF; font-size: 0.92rem;">${escapeHtml(item.monthYear || item.month || 'Monthly Issue')}</div>
          <span style="font-size: 0.72rem; color: var(--admin-text-faint); font-family: monospace;">ID: ${escapeHtml(item.id)}</span>
        </td>
        <td>
          <div style="font-weight: 600; color: var(--admin-gold-light); font-size: 0.88rem; margin-bottom: 0.2rem;">${escapeHtml(item.title)}</div>
          ${item.headline ? `<div style="color: var(--admin-text-muted); font-size: 0.78rem;">${escapeHtml(item.headline)}</div>` : ''}
        </td>
        <td>
          <span style="font-weight: 600; color: #34D399; font-size: 0.88rem;">₹${escapeHtml(item.price || 220)}</span>
        </td>
        <td style="text-align: right;">
          <div style="display: inline-flex; gap: 0.4rem;">
            <button type="button" class="admin-btn admin-btn-outline admin-btn-sm" onclick="editMagazineCover('${escapeHtml(item.id)}')">Edit</button>
            <button type="button" class="admin-btn admin-btn-danger admin-btn-sm" onclick="deleteMagazineCover('${escapeHtml(item.id)}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
};

window.handleSaveMagazineCover = async function(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();

  const editingId = (document.getElementById('magCoverEditingId')?.value || '').trim();
  const month = (document.getElementById('magCoverMonth')?.value || '').trim();
  const title = (document.getElementById('magCoverTitle')?.value || '').trim();
  const price = parseFloat(document.getElementById('magCoverPrice')?.value || '220');
  const photo = (document.getElementById('magCoverPhotoInput')?.value || '').trim();
  const headline = (document.getElementById('magCoverHeadline')?.value || '').trim();
  const orderLink = (document.getElementById('magCoverOrderLink')?.value || '').trim();
  const summary = (document.getElementById('magCoverSummary')?.value || '').trim();

  if (!month || !title || !photo) {
    showToast('⚠️ Please enter Edition Month, Title, and Cover Photo URL.');
    return;
  }

  const id = editingId || ('mag-cover-' + month.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now());
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const coverItem = {
    id,
    title,
    monthYear: month,
    month,
    photo,
    cover: photo,
    image: photo,
    price: isNaN(price) ? 220 : price,
    headline,
    summary,
    description: summary,
    orderLink,
    date: dateStr,
    displayDate: dateStr,
    timestamp: Date.now(),
    isCustom: true
  };

  const pin = getSavedPin();

  // 1. Publish directly to Cloudflare D1 magazine_covers table
  if (window.ScreenladyAPI && typeof window.ScreenladyAPI.publishItem === 'function') {
    try {
      await window.ScreenladyAPI.publishItem('magazine_covers', coverItem, pin);
    } catch (err) {
      console.warn('Backend magazine_covers publish notice:', err);
    }
  }

  // 2. Also keep available_issues array in magazine_settings synced for backwards compatibility
  try {
    let magSettings = {};
    const raw = localStorage.getItem('screenlady_magazine_settings');
    if (raw) magSettings = JSON.parse(raw);
    let issues = Array.isArray(magSettings.availableIssues) ? [...magSettings.availableIssues] : [];
    const existIdx = issues.findIndex(i => i.id === id);
    const editionObj = { id, title, monthYear: month, cover: photo, price: coverItem.price };
    if (existIdx >= 0) issues[existIdx] = editionObj;
    else issues.unshift(editionObj);
    magSettings.availableIssues = issues;
    localStorage.setItem('screenlady_magazine_settings', JSON.stringify(magSettings));
    if (window.ScreenladyAPI && typeof window.ScreenladyAPI.updateMagazineSettings === 'function') {
      window.ScreenladyAPI.updateMagazineSettings(magSettings, pin).catch(() => {});
    }
  } catch (e) {}

  // 3. Update localStorage custom magazine covers
  let localCovers = [];
  try {
    const raw = localStorage.getItem('screenlady_custom_magazine_covers');
    if (raw) localCovers = JSON.parse(raw);
  } catch (e) { localCovers = []; }

  const existIdx = localCovers.findIndex(c => c.id === id);
  if (existIdx >= 0) {
    localCovers[existIdx] = coverItem;
  } else {
    localCovers.unshift(coverItem);
  }
  localStorage.setItem('screenlady_custom_magazine_covers', JSON.stringify(localCovers));

  // 4. Update in-memory backend list
  if (!window.backendLiveMagazineCovers) window.backendLiveMagazineCovers = [];
  const bIdx = window.backendLiveMagazineCovers.findIndex(c => c.id === id);
  if (bIdx >= 0) {
    window.backendLiveMagazineCovers[bIdx] = coverItem;
  } else {
    window.backendLiveMagazineCovers.unshift(coverItem);
  }

  cancelMagazineCoverEdit();
  renderMagazineCoversPanel();
  showToast(editingId ? '✓ Magazine cover updated successfully!' : '✓ Magazine cover published to Hero Slideshow!');
};

window.editMagazineCover = function(id) {
  let covers = window.backendLiveMagazineCovers || [];
  if (covers.length === 0) {
    try {
      const raw = localStorage.getItem('screenlady_custom_magazine_covers');
      if (raw) covers = JSON.parse(raw);
    } catch (e) { covers = []; }
  }

  const item = covers.find(c => c && c.id === id);
  if (!item) return;

  const idField = document.getElementById('magCoverEditingId');
  if (idField) idField.value = item.id;
  const monthField = document.getElementById('magCoverMonth');
  if (monthField) monthField.value = item.monthYear || item.month || (item.title ? item.title.split('—')[0].trim() : '');
  const titleField = document.getElementById('magCoverTitle');
  if (titleField) titleField.value = item.title || '';
  const priceField = document.getElementById('magCoverPrice');
  if (priceField) priceField.value = item.price || 220;
  const photoField = document.getElementById('magCoverPhotoInput');
  if (photoField) photoField.value = item.photo || item.cover || item.image || '';
  const hlField = document.getElementById('magCoverHeadline');
  if (hlField) hlField.value = item.headline || '';
  const orderField = document.getElementById('magCoverOrderLink');
  if (orderField) orderField.value = item.orderLink || '';
  const sumField = document.getElementById('magCoverSummary');
  if (sumField) sumField.value = item.summary || item.description || '';

  updateMagCoverPhotoPreview(item.photo || item.cover || item.image || '');

  const formTitle = document.getElementById('magCoverFormTitle');
  if (formTitle) formTitle.textContent = 'Edit Magazine Cover in Hero Slideshow';
  const subBtn = document.getElementById('magCoverSubmitBtn');
  if (subBtn) subBtn.innerHTML = 'Update Magazine Cover &rarr;';
  const cancelBtn = document.getElementById('magCoverCancelBtn');
  if (cancelBtn) cancelBtn.style.display = 'inline-block';

  const form = document.getElementById('magazineCoverForm');
  if (form) form.scrollIntoView({ behavior: 'smooth' });
};

window.cancelMagazineCoverEdit = function() {
  const form = document.getElementById('magazineCoverForm');
  if (form) form.reset();
  const idField = document.getElementById('magCoverEditingId');
  if (idField) idField.value = '';
  if (typeof clearMagCoverPhoto === 'function') {
    clearMagCoverPhoto();
  } else {
    updateMagCoverPhotoPreview('');
  }
  const formTitle = document.getElementById('magCoverFormTitle');
  if (formTitle) formTitle.textContent = '+ Add New Magazine Cover to Hero Slideshow';
  const subBtn = document.getElementById('magCoverSubmitBtn');
  if (subBtn) subBtn.innerHTML = 'Publish Magazine Cover &rarr;';
  const cancelBtn = document.getElementById('magCoverCancelBtn');
  if (cancelBtn) cancelBtn.style.display = 'none';
  const status = document.getElementById('magCoverPhotoUploadStatus');
  if (status) status.textContent = '';
};

window.deleteMagazineCover = async function(id) {
  if (!confirm('Are you sure you want to remove this magazine cover from the hero slideshow?')) return;

  const pin = getSavedPin();

  if (window.ScreenladyAPI && typeof window.ScreenladyAPI.deleteItem === 'function') {
    try {
      await window.ScreenladyAPI.deleteItem('magazine_covers', id, pin);
    } catch (err) {
      console.warn('Backend delete notice:', err);
    }
  }

  // Update deleted IDs list
  let deletedIds = [];
  try {
    const raw = localStorage.getItem('screenlady_deleted_ids');
    if (raw) deletedIds = JSON.parse(raw);
  } catch (e) { deletedIds = []; }
  if (!deletedIds.includes(id)) {
    deletedIds.push(id);
    localStorage.setItem('screenlady_deleted_ids', JSON.stringify(deletedIds));
  }
  if (!window.backendDeletedIds) window.backendDeletedIds = [];
  if (!window.backendDeletedIds.includes(id)) window.backendDeletedIds.push(id);

  // Update localStorage
  try {
    const raw = localStorage.getItem('screenlady_custom_magazine_covers');
    if (raw) {
      const list = JSON.parse(raw).filter(c => c.id !== id);
      localStorage.setItem('screenlady_custom_magazine_covers', JSON.stringify(list));
    }
  } catch (e) {}

  if (window.backendLiveMagazineCovers) {
    window.backendLiveMagazineCovers = window.backendLiveMagazineCovers.filter(c => c.id !== id);
  }

  renderMagazineCoversPanel();
  showToast('✓ Magazine cover removed from hero slideshow.');
};
