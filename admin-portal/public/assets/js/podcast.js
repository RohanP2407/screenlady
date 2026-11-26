/**
 * ACCOLADE SCREENLADY - PODCAST BROADCASTS & AUDIO PREVIEW CONTROLLER
 * Manages chronological feed for podcast episodes, interviews,
 * and high-impact audio/video broadcasts with interactive 10-second previews.
 * 
 * Strictly sorts by date/timestamp descending:
 * The latest episode ALWAYS displays first at the top,
 * and previous episodes shift down automatically.
 */

// Initial Podcast Episodes (Kept empty per user request - Season 1 Coming Soon)
const DEFAULT_SCREENLADY_PODCASTS = [];

function purgeLegacyMockPodcasts() {
  try {
    const raw = localStorage.getItem('screenlady_custom_podcasts');
    if (raw) {
      const list = JSON.parse(raw);
      const cleaned = list.filter(item => item && item.id && !item.id.startsWith('podcast-default-'));
      if (cleaned.length !== list.length) {
        localStorage.setItem('screenlady_custom_podcasts', JSON.stringify(cleaned));
      }
    }
    const delRaw = localStorage.getItem('screenlady_deleted_ids');
    if (delRaw) {
      const deleted = JSON.parse(delRaw).filter(id => id && !id.startsWith('podcast-default-'));
      localStorage.setItem('screenlady_deleted_ids', JSON.stringify(deleted));
    }
  } catch (e) {
    console.error('Error purging legacy mock podcasts:', e);
  }
}

function getCustomPodcasts() {
  try {
    const raw = localStorage.getItem('screenlady_custom_podcasts');
    if (raw) return JSON.parse(raw);
    return [];
  } catch (e) {
    console.error('Error reading custom podcasts:', e);
    return [];
  }
}

function getAllPodcasts() {
  const custom = getCustomPodcasts();
  const deletedIds = (typeof window.getScreenladyDeletedIds === 'function') 
    ? window.getScreenladyDeletedIds() 
    : (() => { try { const r = localStorage.getItem('screenlady_deleted_ids'); return r ? JSON.parse(r) : []; } catch(e){ return []; } })();

  const backendItems = window.backendLivePodcasts || [];
  const combined = [...custom, ...backendItems, ...DEFAULT_SCREENLADY_PODCASTS].filter(item => !deletedIds.includes(item.id));

  // Strictly sort descending by date / timestamp
  combined.sort((a, b) => {
    const dateA = new Date(a.date).getTime() || a.timestamp || 0;
    const dateB = new Date(b.date).getTime() || b.timestamp || 0;
    return dateB - dateA;
  });

  return combined;
}

/* ==========================================================================
   10-SECOND AUDIO PLAYBACK ENGINE (Web Audio API Synthesizer & Audio Player)
   ========================================================================== */
let activeAudioCtx = null;
let activeOscillators = [];
let previewIntervalTimer = null;
let currentlyPlayingEpisodeId = null;

/**
 * Starts a 10-second playback preview.
 * Uses native Web Audio API to play a soothing, high-fidelity luxury podcast intro melody,
 * ensuring 100% reliable offline/online playback with no broken links or external dependencies.
 */
function togglePreviewPlayback(episodeId) {
  const previewBox = document.getElementById(`preview-box-${episodeId}`);
  const toggleBtn = document.getElementById(`preview-btn-${episodeId}`);
  const timerDisplay = document.getElementById(`preview-timer-${episodeId}`);
  const alertBox = document.getElementById(`preview-alert-${episodeId}`);

  // If already playing this episode, stop it
  if (currentlyPlayingEpisodeId === episodeId) {
    stopPreviewPlayback();
    return;
  }

  // Stop any other currently playing preview
  stopPreviewPlayback();

  currentlyPlayingEpisodeId = episodeId;
  if (previewBox) previewBox.classList.add('is-playing');
  if (toggleBtn) toggleBtn.innerHTML = '<span>⏸ Pause (10s)</span>';
  if (alertBox) alertBox.classList.remove('show');

  let secondsLeft = 10;
  if (timerDisplay) timerDisplay.textContent = `0:10`;

  // Start Web Audio Synthesized Chime/Melody
  startPodcastSynthMelody();

  previewIntervalTimer = setInterval(() => {
    secondsLeft--;
    if (timerDisplay) {
      timerDisplay.textContent = `0:0${secondsLeft}`;
    }

    if (secondsLeft <= 0) {
      stopPreviewPlayback();
      if (timerDisplay) timerDisplay.textContent = `0:00`;
      if (toggleBtn) toggleBtn.innerHTML = '<span>↺ Replay 10s Sample</span>';
      if (alertBox) {
        alertBox.classList.add('show');
      }
    }
  }, 1000);
}

function startPodcastSynthMelody() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (!activeAudioCtx) {
      activeAudioCtx = new AudioContext();
    }
    if (activeAudioCtx.state === 'suspended') {
      activeAudioCtx.resume();
    }

    // Melodic chord progression reminiscent of a luxury podcast theme
    // Pentatonic scale notes: F3, C4, D4, F4, G4, A4, C5
    const notes = [
      { freq: 174.61, time: 0.0, dur: 4.5 }, // F3 bass drone
      { freq: 261.63, time: 0.2, dur: 3.5 }, // C4
      { freq: 329.63, time: 0.6, dur: 3.2 }, // E4
      { freq: 392.00, time: 1.2, dur: 3.0 }, // G4
      { freq: 523.25, time: 1.8, dur: 3.5 }, // C5 chime
      { freq: 220.00, time: 3.2, dur: 4.5 }, // A3 bass change
      { freq: 329.63, time: 3.6, dur: 3.5 }, // E4
      { freq: 440.00, time: 4.2, dur: 3.2 }, // A4
      { freq: 659.25, time: 5.0, dur: 3.0 }, // E5
      { freq: 174.61, time: 6.5, dur: 3.5 }, // F3 resolution
      { freq: 392.00, time: 7.2, dur: 2.8 }, // G4
      { freq: 523.25, time: 8.0, dur: 2.0 }  // C5 bell fade
    ];

    const masterGain = activeAudioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, activeAudioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.25, activeAudioCtx.currentTime + 0.5);
    masterGain.gain.setValueAtTime(0.25, activeAudioCtx.currentTime + 8.5);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, activeAudioCtx.currentTime + 10.0);
    masterGain.connect(activeAudioCtx.destination);

    notes.forEach(note => {
      const osc = activeAudioCtx.createOscillator();
      const noteGain = activeAudioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, activeAudioCtx.currentTime + note.time);

      noteGain.gain.setValueAtTime(0.0001, activeAudioCtx.currentTime + note.time);
      noteGain.gain.exponentialRampToValueAtTime(0.2, activeAudioCtx.currentTime + note.time + 0.15);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, activeAudioCtx.currentTime + note.time + note.dur);

      osc.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(activeAudioCtx.currentTime + note.time);
      osc.stop(activeAudioCtx.currentTime + note.time + note.dur);

      activeOscillators.push(osc);
    });
  } catch (e) {
    console.warn('Web Audio Playback preview active:', e);
  }
}

function stopPreviewPlayback() {
  if (previewIntervalTimer) {
    clearInterval(previewIntervalTimer);
    previewIntervalTimer = null;
  }

  if (activeOscillators.length > 0) {
    activeOscillators.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    activeOscillators = [];
  }

  if (currentlyPlayingEpisodeId) {
    const prevBox = document.getElementById(`preview-box-${currentlyPlayingEpisodeId}`);
    const prevBtn = document.getElementById(`preview-btn-${currentlyPlayingEpisodeId}`);
    if (prevBox) prevBox.classList.remove('is-playing');
    if (prevBtn) prevBtn.innerHTML = '<span>▶ Play 10s Preview</span>';
    currentlyPlayingEpisodeId = null;
  }
}

function renderPodcasts(filter = 'all') {
  const container = document.getElementById('podcastFeedContainer');
  const countBadge = document.getElementById('podcastTotalCount');
  if (!container) return;

  const podcasts = getAllPodcasts();

  let filtered = podcasts;
  if (filter !== 'all') {
    const filterLower = filter.toLowerCase();
    filtered = podcasts.filter(item => {
      return item.category && item.category.toLowerCase().includes(filterLower);
    });
  }

  if (countBadge) {
    countBadge.textContent = filtered.length > 0 ? `${filtered.length} Broadcast Episodes` : 'Season 1 • Premiering Soon';
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="podcast-coming-soon-card">
        
        <div class="podcast-coming-soon-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--gold-primary);"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
        </div>

        <div style="margin-bottom: 0.85rem;">
          <span class="editorial-kicker-pill" style="font-size: 0.82rem; padding: 0.35rem 1.1rem;">
            ACCOLADE SCREENLADY BROADCAST STUDIO
          </span>
        </div>

        <h2 class="podcast-coming-soon-title">
          The Official Video & Audio Podcast Series Is Coming Soon!
        </h2>

        <p class="podcast-coming-soon-desc">
          We are currently in studio production with our premier season of in-depth masterclass dialogues, candid memoirs, and conversations celebrating extraordinary women across cinema, entrepreneurship, and cultural leadership.
        </p>

        <div class="podcast-pillars-grid">
          <div class="podcast-pillar-box">
            <div class="podcast-pillar-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4M3 12h18"/></svg>
            </div>
            <h4 class="podcast-pillar-title">Cinema & Artistry</h4>
            <p class="podcast-pillar-text">Unvarnished journeys, artistic struggles, and the craft behind iconic performances.</p>
          </div>

          <div class="podcast-pillar-box">
            <div class="podcast-pillar-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
            </div>
            <h4 class="podcast-pillar-title">Women in Leadership</h4>
            <p class="podcast-pillar-text">Boardroom triumphs and courageous vision in business, politics & medicine.</p>
          </div>

          <div class="podcast-pillar-box">
            <div class="podcast-pillar-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <h4 class="podcast-pillar-title">Culture & Empowerment</h4>
            <p class="podcast-pillar-text">Inspiring stories of perseverance, financial independence, and social impact.</p>
          </div>
        </div>

        <div class="podcast-channels-box">
          <span class="podcast-channels-label">
            Official Broadcast Channels:
          </span>
          <div class="podcast-channels-btns">
            <a href="https://www.youtube.com/@Accolade_Screenlady" target="_blank" rel="noopener" class="btn btn-gold">
              <span>YouTube (@AccoladeScreenlady)</span>
            </a>
            <a href="https://www.instagram.com/accoladescreenlady_official?obrf=M2plNzAza252NWlu" target="_blank" rel="noopener" class="btn btn-outline-gold">
              <span>Instagram (@accoladescreenlady_official)</span>
            </a>
          </div>
        </div>

      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((item, index) => {
    const isFirst = index === 0;
    const highlightClass = isFirst ? 'podcast-card latest-highlight' : 'podcast-card';
    const latestRibbon = isFirst ? `<div class="latest-ribbon">✦ LATEST BROADCAST</div>` : '';

    return `
      <article class="${highlightClass}" id="${item.id}">
        ${latestRibbon}
        <div class="podcast-artwork-wrap">
          <img src="${item.photo || 'assets/images/featured-culture-leader.jpg'}" alt="${item.title}" class="podcast-artwork-img" loading="lazy">
          <div class="podcast-episode-badge">${item.episodeNumber || `Ep. ${index + 1}`}</div>
          <span class="badge-gold" style="position: absolute; bottom: 0.75rem; left: 0.85rem; z-index: 2; font-size: 0.65rem;">
            ${item.category || 'Broadcast Series'}
          </span>
        </div>

        <div class="podcast-body-wrap">
          <div class="podcast-meta-row">
            <span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="vertical-align: -2px; margin-right: 4px;"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>${item.displayDate || item.date}</span>
            <span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="vertical-align: -2px; margin-right: 4px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${item.duration || '35 Mins'}</span>
          </div>

          <div class="podcast-guest-badge">
            Guest: ${item.guest || item.host || 'Featured Luminary'}
          </div>

          <h3 class="podcast-title" onclick="openPodcastNotesModal('${item.id}')" style="cursor: pointer;">${item.title}</h3>

          <p class="podcast-summary-text">
            ${item.summary || (item.showNotes ? item.showNotes.replace(/<[^>]+>/g, '').substring(0, 150) + '...' : '') || 'Masterclass dialogue with trailblazing women reshaping modern cinema, enterprise, and culture.'}
          </p>

          <!-- 10-Second Interactive Audio Preview Box -->
          <div class="podcast-preview-box" id="preview-box-${item.id}">
            <div class="preview-controls-row">
              <button type="button" class="btn-preview-toggle" id="preview-btn-${item.id}" onclick="togglePreviewPlayback('${item.id}')">
                <span>Play 10s Preview</span>
              </button>

              <div class="preview-timer-display">
                <div class="preview-equalizer">
                  <div class="eq-bar"></div>
                  <div class="eq-bar"></div>
                  <div class="eq-bar"></div>
                  <div class="eq-bar"></div>
                  <div class="eq-bar"></div>
                </div>
                <span id="preview-timer-${item.id}">0:10</span>
              </div>
            </div>

            <!-- Complete Alert Banner -->
            <div class="preview-complete-alert" id="preview-alert-${item.id}">
              <strong>Sample Complete.</strong> Stream the full episode on 
              <a href="${item.podcastLink || 'https://youtube.com'}" target="_blank" rel="noopener" style="color: var(--gold-light); text-decoration: underline; font-weight: 700;">
                ${item.socialPlatform || 'YouTube / Spotify'} &rarr;
              </a>
            </div>
          </div>

          <!-- Social Media Podcast Links -->
          <div class="podcast-social-links-row">
            <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">Stream Full Episode:</span>
            <a href="${item.podcastLink || 'https://youtube.com'}" target="_blank" rel="noopener" class="podcast-platform-btn youtube" title="Watch on YouTube">
              YouTube
            </a>
            <a href="${item.spotifyLink || 'https://spotify.com'}" target="_blank" rel="noopener" class="podcast-platform-btn spotify" title="Listen on Spotify">
              Spotify
            </a>
            <button class="btn btn-outline-gold btn-sm" onclick="openPodcastModal('${item.id}')" style="margin-left: auto; font-size: 0.72rem; padding: 0.28rem 0.65rem;">
              Show Notes &rarr;
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function openPodcastModal(id) {
  const podcasts = getAllPodcasts();
  const item = podcasts.find(p => p.id === id);
  if (!item) return;

  const modal = document.getElementById('globalModal');
  const modalBody = document.getElementById('modalBody');
  if (!modal || !modalBody) return;

  const shareUrl = encodeURIComponent(window.location.origin + window.location.pathname + '#' + item.id);
  const shareTitle = encodeURIComponent(item.title);

  modalBody.innerHTML = `
    <div style="max-width: 780px; margin: 0 auto;">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.25rem; flex-wrap: wrap;">
        <span class="badge-gold">${item.episodeNumber || 'Broadcast Episode'} • ${item.category || 'Interview'}</span>
        <span style="font-size: 0.8rem; color: var(--gold-light); display: inline-flex; align-items: center; gap: 0.5rem;">
          <span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="vertical-align: -2px; margin-right: 4px;"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>${item.displayDate || item.date}</span>
          <span>•</span>
          <span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="vertical-align: -2px; margin-right: 4px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${item.duration || '35 Mins'}</span>
        </span>
      </div>

      <h1 style="font-family: var(--font-serif-display); font-size: 1.85rem; line-height: 1.3; color: var(--text-ivory); margin-bottom: 1rem;">
        ${item.title}
      </h1>

      <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-gold-subtle); padding: 0.95rem 1.25rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem;">
        <div style="font-size: 0.85rem; color: var(--gold-light); margin-bottom: 0.25rem;">
          <strong>Host:</strong> ${item.host || 'Mr. Prashant Chandrakant Sagvekar'}
        </div>
        <div style="font-size: 0.88rem; color: var(--text-ivory); font-weight: 600;">
          <strong>Featured Guest:</strong> ${item.guest || 'Distinguished Luminary'}
        </div>
      </div>

      <div style="margin-bottom: 1.75rem; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--border-gold-subtle);">
        <img src="${item.photo || 'assets/images/featured-culture-leader.jpg'}" alt="${item.title}" style="width: 100%; max-height: 380px; object-fit: cover; display: block;">
      </div>

      <!-- Play 10-Second Sample Inside Modal -->
      <div style="background: rgba(20,20,28,0.9); border: 1px solid var(--gold-primary); padding: 1.25rem; border-radius: var(--radius-sm); margin-bottom: 1.75rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--gold-light); margin-bottom: 0.2rem;">
              Executive 10-Second Broadcast Sample
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">
              Listen to the opening segment before tuning into the complete episode.
            </div>
          </div>
          <button type="button" class="btn-preview-toggle" onclick="togglePreviewPlayback('${item.id}')">
            <span>Play 10s Sample</span>
          </button>
        </div>
      </div>

      <!-- Full Episode Stream Buttons -->
      <div style="background: rgba(212,175,55,0.08); border-left: 3px solid var(--gold-primary); padding: 1.25rem; margin-bottom: 2rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0;">
        <h4 style="font-size: 0.95rem; color: var(--gold-light); margin-bottom: 0.5rem;">Stream Complete Episode on Social Channels:</h4>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.75rem;">
          <a href="${item.podcastLink || 'https://youtube.com'}" target="_blank" rel="noopener" class="btn btn-gold btn-sm" style="display: inline-flex; align-items: center; gap: 0.4rem;">
            Watch Full on YouTube
          </a>
          <a href="${item.spotifyLink || 'https://spotify.com'}" target="_blank" rel="noopener" class="btn btn-outline-gold btn-sm" style="display: inline-flex; align-items: center; gap: 0.4rem;">
            Listen on Spotify
          </a>
          <a href="https://www.instagram.com/accoladescreenlady_official?obrf=M2plNzAza252NWlu" target="_blank" rel="noopener" class="btn btn-outline-gold btn-sm">
            Instagram Highlights
          </a>
        </div>
      </div>

      <!-- Show Notes Content -->
      <div class="article-reader-content">
        ${item.showNotes || `<p>${item.summary}</p>`}
      </div>

      <!-- Social Media Share -->
      <div style="margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(212,175,55,0.2);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div style="font-size: 0.82rem; color: var(--text-muted);">
            Broadcast Series by <strong>Accolade Screenlady</strong> • Producer Mr. Prashant Chandrakant Sagvekar
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <span style="font-size: 0.75rem; color: var(--gold-light); font-weight: 600;">Share:</span>
            <a href="https://wa.me/?text=${shareTitle}%20${shareUrl}" target="_blank" rel="noopener" class="btn btn-outline-gold btn-sm" style="font-size: 0.7rem; padding: 0.25rem 0.6rem;">WhatsApp</a>
            <a href="https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}" target="_blank" rel="noopener" class="btn btn-outline-gold btn-sm" style="font-size: 0.7rem; padding: 0.25rem 0.6rem;">X / Twitter</a>
            <button class="btn btn-outline-gold btn-sm" onclick="navigator.clipboard.writeText(window.location.href); alert('Episode link copied!');" style="font-size: 0.7rem; padding: 0.25rem 0.6rem;">Copy Link</button>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function initPodcastPage() {
  purgeLegacyMockPodcasts();
  const container = document.getElementById('podcastFeedContainer');
  if (!container) return;

  container.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 4.5rem 1rem;">
      <p style="color: var(--gold-light); font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase;">Loading Broadcasts...</p>
    </div>
  `;

  // Async sync with Cloudflare Worker Backend:
  async function fetchPodcasts() {
    if (window.ScreenladyAPI && typeof window.ScreenladyAPI.getPodcasts === 'function') {
      try {
        const liveData = await window.ScreenladyAPI.getPodcasts();
        if (Array.isArray(liveData)) {
          window.backendLivePodcasts = liveData;
        }
      } catch (e) {
        console.warn('[Screenlady Podcast] API notice:', e.message);
      }
    }
    renderPodcasts(window.activePodcastFilter || 'all');
  }

  fetchPodcasts();

  // Filter Buttons
  const filterBtns = document.querySelectorAll('.podcast-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter') || 'all';
      window.activePodcastFilter = cat;
      renderPodcasts(cat);
    });
  });

  // Deep linking
  if (window.location.hash) {
    const targetId = window.location.hash.substring(1);
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        openPodcastModal(targetId);
      }
    }, 300);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initPodcastPage();
  });
} else {
  initPodcastPage();
}
