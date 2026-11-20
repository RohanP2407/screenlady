/**
 * ACCOLADE SCREENLADY - UPDATES FEED CONTROLLER
 * Manages chronological feed for diverse update formats:
 * 1. Photos with Information (Honoree spotlights & milestone chronicles)
 * 2. Articles & Stories (In-depth editorial articles & columns)
 * 3. Photos Only (Visual gallery showcases & event captures)
 *
 * Strictly sorts by date/timestamp descending:
 * The latest update ALWAYS displays first at the top,
 * and previous updates shift down automatically.
 */

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
   Category & Curated Section Classification Helpers
   ========================================================================== */
function isFilmyAddaUpdate(item) {
  if (!item) return false;
  if (item.curatedSection === 'filmy_adda') return true;
  if (item.curatedSection && item.curatedSection !== 'filmy_adda') return false;
  const cat = (item.category || '').toLowerCase();
  const title = (item.title || item.headline || '').toLowerCase();
  const tags = (item.tags || []).join(' ').toLowerCase();
  return cat.includes('film') || cat.includes('movie') || cat.includes('cinema') || cat.includes('box office') ||
         tags.includes('film') || tags.includes('movie') || tags.includes('cinema') || tags.includes('bollywood') ||
         title.includes('ramayana') || title.includes('box office') || title.includes('jalsa');
}

function isBizzWorldUpdate(item) {
  if (!item) return false;
  if (item.curatedSection === 'bizz_world') return true;
  if (item.curatedSection && item.curatedSection !== 'bizz_world') return false;
  const cat = (item.category || '').toLowerCase();
  const title = (item.title || item.headline || '').toLowerCase();
  const tags = (item.tags || []).join(' ').toLowerCase();
  return cat.includes('bizz') || cat.includes('business') || cat.includes('meeting') || cat.includes('enterprise') || cat.includes('corporate') ||
         tags.includes('business') || tags.includes('meeting') || tags.includes('enterprise') || tags.includes('leadership') || tags.includes('entrepreneur') ||
         title.includes('meeting') || title.includes('entrepreneur') || title.includes('leadership') || title.includes('partner');
}

function isInspirationUpdate(item) {
  if (!item) return false;
  if (item.curatedSection === 'women_inspiration') return true;
  if (item.curatedSection && item.curatedSection !== 'women_inspiration') return false;
  const cat = (item.category || '').toLowerCase();
  const title = (item.title || item.headline || '').toLowerCase();
  const tags = (item.tags || []).join(' ').toLowerCase();
  return cat.includes('inspiration') || cat.includes('struggle') || cat.includes('tribute') || cat.includes('award') ||
         tags.includes('inspiration') || tags.includes('struggle') || tags.includes('sindhutai') || tags.includes('mai') ||
         title.includes('sindhutai') || title.includes('distinction') || title.includes('tribute');
}

function isFashionUpdate(item) {
  if (!item) return false;
  if (item.curatedSection === 'fashion_lifestyle') return true;
  if (item.curatedSection && item.curatedSection !== 'fashion_lifestyle') return false;
  if (item.id && (item.id.startsWith('fashion-') || item.id === 'update-events-1')) return true;
  const cat = (item.category || '').toLowerCase();
  const title = (item.title || item.headline || '').toLowerCase();
  const tags = (item.tags || []).join(' ').toLowerCase();
  return cat.includes('fashion') || cat.includes('lifestyle') || cat.includes('jewellery') || cat.includes('couture') ||
         tags.includes('fashion') || tags.includes('lifestyle') || tags.includes('jewellery') || tags.includes('beauty') ||
         title.includes('fashion') || title.includes('jewellery') || title.includes('tantuh');
}

function isNewsUpdate(item) {
  if (!item) return false;
  if (item.curatedSection === 'news' || item._section === 'news' || item.type === 'news') return true;
  if (item.id && item.id.startsWith('news-')) return true;
  const cat = (item.category || '').toLowerCase();
  const title = (item.title || item.headline || '').toLowerCase();
  const tags = (item.tags || []).join(' ').toLowerCase();
  return cat.includes('news') || cat.includes('alert') || cat.includes('tribute') || cat.includes('movie talk') ||
         tags.includes('news') || tags.includes('press') || tags.includes('alert') ||
         title.includes('ramayana') || title.includes('bomb threat') || title.includes('sindhutai') || title.includes('box office');
}

window.isFilmyAddaUpdate = isFilmyAddaUpdate;
window.isBizzWorldUpdate = isBizzWorldUpdate;
window.isInspirationUpdate = isInspirationUpdate;
window.isFashionUpdate = isFashionUpdate;
window.isNewsUpdate = isNewsUpdate;

// Official Screenlady Team Updates: Meetings, Awards, Movie Talks, Meet & Greets, Events
const DEFAULT_SCREENLADY_UPDATES = [
  {
    id: "update-ramayana-1",
    type: "photo-info",
    category: "Movie Talk",
    womanName: "Ranbir Kapoor, Sai Pallavi & Yash",
    title: "Ramayana Makes a Strong Mark at the Box Office! Audiences Give an Enthusiastic Response",
    headline: "Ramayana Makes a Strong Mark at the Box Office! Audiences Give an Enthusiastic Response",
    date: "2026-11-15",
    displayDate: "November 15, 2026",
    venue: "Theatres Nationwide & Mumbai Box Office",
    photo: "assets/images/news/ramayana.jpeg",
    infoSummary: "The epic Ramayana, a symbol of pride in Indian culture, has now taken a grand form on the big screen directed by Nitesh Tiwari. With Ranbir Kapoor as Lord Ram, Sai Pallavi as Sita, and Yash as Ravana, the magnum opus crossed the remarkable ₹819.50 crore mark in its opening week.",
    fullInfo: `<p>The epic <em>Ramayana</em>, a symbol of pride in Indian culture, has now taken a grand form on the big screen. Director Nitesh Tiwari’s film <em>Ramayana: Rise of a Legend</em> has captured the audience’s attention following its release.</p>
    <p>Ranbir Kapoor’s powerful portrayal of Lord Shri Ram, Sai Pallavi’s graceful performance as Sita, and Yash’s commanding appearance as Ravana have become major talking points among viewers.</p>
    <p>The film’s grand visuals, modern visual effects, music, and performances by the cast are receiving appreciation from audiences. The movie is reportedly getting a strong response in theatres across the country and has also delivered an impressive performance at the box office.</p>
    <p>According to reports, the film’s India net collection crossed the remarkable ₹819.50 crore mark within its first week of release. It has also reportedly earned significantly at the global box office.</p>
    <blockquote style="margin: 1.5rem 0; padding: 1.25rem 1.75rem; border-left: 3px solid var(--gold-primary); background: rgba(212, 175, 55, 0.05); font-style: italic; color: var(--gold-light);">
      "Ramayana – Not just a film, but a grand cinematic experience celebrating Indian culture, faith, and traditions!" — Accolade Screenlady Magazine
    </blockquote>
    <p>The film continues to witness housefull screenings across single screens and multiplexes in Maharashtra and nationwide, setting new industry benchmarks for mythological storytelling.</p>`,
    tags: ["Ramayana", "RanbirKapoor", "SaiPallaviOfficial", "Yash", "YashFans", "SaiPallaviFansClub", "RamayanMovie", "AccoladeScreenlady", "SharadKelkar", "Movies", "BollywoodNews", "Bollywood", "BollywoodSongs", "BollywoodMusic", "BollywoodMovies", "BollywoodUpdates"],
    timestamp: 1794753600000
  },
  {
    id: "update-sindhutai-1",
    type: "photo-info",
    category: "Events",
    womanName: "Padma Shri Sindhutai Sapkal ('Mai')",
    title: "Birth Anniversary of Sindhutai Sapkal, the Mother of Orphans – A Loving Shelter for Thousands of Orphaned Children!",
    headline: "Birth Anniversary of Sindhutai Sapkal, the Mother of Orphans – A Loving Shelter for Thousands of Orphaned Children!",
    date: "2026-11-14",
    displayDate: "November 14, 2026",
    venue: "Navi Mumbai & Across Maharashtra",
    photo: "assets/images/news/sindhutai-sapkal.jpeg",
    infoSummary: "Today, November 14, marks the birth anniversary of Padma Shri Sindhutai Sapkal, who faced countless challenges in her own life yet went on to provide love, care, and shelter to thousands of orphaned and underprivileged children.",
    fullInfo: `<p><strong>Correspondent (Accolade Screenlady, Mumbai):</strong> Today, November 14, marks the birth anniversary of Padma Shri Sindhutai Sapkal, who faced countless challenges in her own life yet went on to provide love, care, and support to thousands of orphaned and underprivileged children.</p>
    <p>Fondly known across Maharashtra as the <strong>“Mother of Orphans”</strong> and <strong>“Mai,”</strong> Sindhutai’s remarkable contribution to society continues to inspire generations. Her life and selfless dedication remain a shining example of compassion, courage, and humanity.</p>
    <blockquote style="margin: 1.5rem 0; padding: 1.25rem 1.75rem; border-left: 3px solid var(--gold-primary); background: rgba(212, 175, 55, 0.05); font-style: italic; color: var(--gold-light);">
      "When life gives you thorns, make them a garden of love for the abandoned. Mai taught the world what true motherhood means."
    </blockquote>
    <p>Accolade Screenlady pays heartfelt homage to this divine soul whose legacy of shelter, education, and motherly protection continues to nurture thousands of young lives across Maharashtra.</p>
    <p>— Navi Mumbai</p>`,
    tags: ["AccoladeScreenlady", "Magazine", "SindhutaiSapkal", "SindhutaiMajhiMai", "Press", "NaviMumbai", "WomenOfDistinction"],
    timestamp: 1794667200000
  },
  {
    id: "update-boxoffice-1",
    type: "photo-info",
    category: "Movie Talk",
    womanName: "Amitabh Bachchan, Sharvari & Rashmika Mandanna",
    title: "A Treat for Movie Lovers! Big-Budget Films Set to Hit the Box Office in the Second Half of November",
    headline: "A Treat for Movie Lovers! Big-Budget Films Set to Hit the Box Office in the Second Half of November",
    date: "2026-11-13",
    displayDate: "November 13, 2026",
    venue: "Navi Mumbai / Bollywood Bureau",
    photo: "assets/images/news/films-box-office.jpeg",
    infoSummary: "Amitabh Bachchan, Jackie Shroff, Amit Sadh, Ayushmann Khurrana, Sharvari, and Rashmika Mandanna are set to entertain audiences with major box-office clashes scheduled for November 20 and 27.",
    fullInfo: `<p><strong>Correspondent (Accolade Screenlady, Mumbai):</strong> Amitabh Bachchan, Jackie Shroff, and Amit Sadh, along with Ayushmann Khurrana, Sharvari, and Rashmika Mandanna, are all set to entertain audiences with their upcoming films. November 20 and 27 are expected to witness major box-office clashes.</p>
    <p>The second half of November is going to be particularly exciting for movie lovers. Several prominent actors from the Hindi film industry, along with films belonging to different genres, are all set to arrive on the big screen.</p>
    <p>With several much-awaited films scheduled for release on November 20 and November 27, the box office is expected to witness an exciting battle for audience attention.</p>
    <blockquote style="margin: 1.5rem 0; padding: 1.25rem 1.75rem; border-left: 3px solid var(--gold-primary); background: rgba(212, 175, 55, 0.05); font-style: italic; color: var(--gold-light);">
      "From multi-starrer dramas to high-octane thrillers, November’s box office line-up is set to reignite single screens and multiplexes alike."
    </blockquote>
    <p>— Navi Mumbai</p>`,
    tags: ["AccoladeScreenlady", "Entertainment", "Films", "Marathi", "Movie", "NaviMumbai", "Bollywood"],
    timestamp: 1794580800000
  },
  {
    id: "update-jalsa-threat-1",
    type: "photo-info",
    category: "Events",
    womanName: "Mumbai Police & Security Agencies",
    title: "Bomb Threat Once Again Targets Amitabh Bachchan’s Jalsa Bungalow; Security Agencies on High Alert in Mumbai!",
    headline: "Bomb Threat Once Again Targets Amitabh Bachchan’s Jalsa Bungalow; Security Agencies on High Alert in Mumbai!",
    date: "2026-11-12",
    displayDate: "November 12, 2026",
    venue: "Juhu & Public Landmarks, Mumbai",
    photo: "assets/images/news/amitabh-bachchan.jpeg",
    infoSummary: "Mumbai was put on alert after Amitabh Bachchan received another bomb threat targeting his residence 'Jalsa' in Juhu alongside other key public landmarks. Mumbai Police and security agencies stepped up alertness.",
    fullInfo: `<p><strong>Correspondent (Accolade Screenlady, Mumbai):</strong> Mumbai was put on alert after Amitabh Bachchan, the legendary Bollywood actor, received another bomb threat targeting his residence, ‘Jalsa’, located in Juhu, Mumbai.</p>
    <p>Interestingly, the threatening email reportedly mentioned not only Amitabh Bachchan’s residence but also several other important public places across Mumbai. Following this threat, the Mumbai Police and security agencies have stepped up their alertness and security measures.</p>
    <blockquote style="margin: 1.5rem 0; padding: 1.25rem 1.75rem; border-left: 3px solid var(--gold-primary); background: rgba(212, 175, 55, 0.05); font-style: italic; color: var(--gold-light);">
      "Security protocols have been reinforced with bomb disposal squads and 24/7 patrol units deployed around Jalsa and key transit nodes."
    </blockquote>
    <p>The Mumbai Police Cyber Cell has initiated a probe to trace the origin of the IP address and email headers associated with the communication.</p>
    <p>— Navi Mumbai</p>`,
    tags: ["Accolade", "AccoladeScreenlady", "Entertainment", "AmitabhBachchan", "Jalsa", "MumbaiAlert", "Security"],
    timestamp: 1794494400000
  },
  {
    id: "update-meeting-1",
    type: "photo-info",
    category: "Meetings",
    womanName: "Mr. Prashant Sagvekar & Executive Board",
    title: "Executive Editorial & Publishing Board Meeting Led by Founder Mr. Prashant Sagvekar",
    headline: "Executive Editorial & Publishing Board Meeting Led by Founder Mr. Prashant Sagvekar",
    date: "2026-11-06",
    displayDate: "November 6, 2026",
    venue: "Screenlady Publishing Headquarters, Mumbai",
    photo: "assets/images/team/prashant-sagvekar.jpeg",
    infoSummary: "Founder & Publisher Mr. Prashant Chandrakant Sagvekar, Managing Director Mrs. Sakshi Sagvekar, and Marketing Director Mr. Vedang Sagvekar convened the fourth-quarter executive board meeting in Mumbai. The leadership reviewed expanded statewide print circulation across Maharashtra, finalised editorial commissions for the upcoming issues, and approved direct reader engagement initiatives.",
    fullInfo: `<p>Conducted at the Accolade Screenlady publishing headquarters in Mumbai, Founder and Publisher <strong>Mr. Prashant Chandrakant Sagvekar</strong> chaired a comprehensive strategic conclave with Managing Director <strong>Mrs. Sakshi Sagvekar</strong> and Marketing Director <strong>Mr. Vedang Sagvekar</strong>.</p>
    <p>The leadership reviewed subscriber growth following the PRGI registration under number <em>MHMAR/26/A3113</em>, expanding doorstep delivery across Raigad, Pune, Thane, and Mumbai with insured courier logistics. Special focus was given to commissioning exclusive interviews with women achievers in medicine, civil administration, and corporate governance.</p>
    <blockquote style="margin: 1.5rem 0; padding: 1.25rem 1.75rem; border-left: 3px solid var(--gold-primary); background: rgba(212, 175, 55, 0.05); font-style: italic; color: var(--gold-light);">
      "Accolade Screenlady’s mission is to be the unyielding voice celebrating women's resilience, triumphs, and dignity across every district of our state."
    </blockquote>
    <p>The board also approved upcoming partnerships with women-led handicraft enterprises and corporate sponsorship packages for upcoming collector's editions.</p>`,
    tags: ["Meetings", "Strategy", "Screenlady Leadership"],
    timestamp: 1793976000000
  },
  {
    id: "update-awards-1",
    type: "photo-info",
    category: "Awards",
    womanName: "Mrs. Amruta Rao, Mrs. Supriya Vinod & Mrs. Manasi Ingle",
    title: "Accolade Screenlady 'Women of Distinction' Annual Honors Announced",
    headline: "Accolade Screenlady 'Women of Distinction' Annual Honors Announced",
    date: "2026-11-04",
    displayDate: "November 4, 2026",
    venue: "Screenlady Cultural Foundation, Mumbai",
    photo: "assets/images/magazine-photos/4.2.jpg",
    infoSummary: "Editor-in-Chief Mrs. Amruta Rao alongside Board Members Mrs. Supriya Vinod and Mrs. Manasi Ingle officially announced the nomination guidelines for the 2026 Screenlady Honors. The prestigious platform celebrates remarkable women leaders, medical pioneers, entrepreneurs, and unsung grassroots achievers who turned struggle into lasting triumph.",
    fullInfo: `<p>In a joint announcement from the Screenlady Cultural Foundation, Editor-in-Chief <strong>Mrs. Amruta Rao</strong> together with Board Members <strong>Mrs. Supriya Vinod</strong> and <strong>Mrs. Manasi Ingle</strong> unveiled the official guidelines for the upcoming <em>Accolade Screenlady Women of Distinction Awards</em>.</p>
    <p>The honors recognize women who have broken glass ceilings in politics, corporate enterprise, healthcare, aviation, and social reform. A jury comprising esteemed journalists, senior jurists, and cultural scholars will evaluate nominations across 12 distinct categories.</p>
    <blockquote style="margin: 1.5rem 0; padding: 1.25rem 1.75rem; border-left: 3px solid var(--gold-primary); background: rgba(212, 175, 55, 0.05); font-style: italic; color: var(--gold-light);">
      "True recognition belongs not merely to fame, but to the tireless courage of women who rebuild societies quietly with their determination."
    </blockquote>
    <p>Public nominations open next month via the official Screenlady portal, with the gala felicitation evening scheduled for early 2027 in Mumbai.</p>`,
    tags: ["Awards", "Honors", "Women Leadership"],
    timestamp: 1793803200000
  },
  {
    id: "update-movietalk-1",
    type: "photo-info",
    category: "Movie Talk",
    womanName: "Screenlady Cinematography & Creative Desk",
    title: "Cinema Exclusive: Behind-the-Scenes Photo Session & Dialogue with Actresses",
    headline: "Cinema Exclusive: Behind-the-Scenes Photo Session & Dialogue with Actresses",
    date: "2026-11-01",
    displayDate: "November 1, 2026",
    venue: "Film City Studios, Goregaon, Mumbai",
    photo: "assets/images/magazine-photos/3.1.jpg",
    infoSummary: "The Screenlady creative production team hosted a behind-the-scenes photoshoot and in-depth cinema conversation exploring contemporary Marathi and Hindi cinema. Acclaimed actresses opened up about challenging roles, the shift toward women-centric narratives, and lesser-known aspects of their artistic journeys.",
    fullInfo: `<p>The creative and photography team of Accolade Screenlady spent an intensive day on set at Film City Studios, capturing exclusive high-fashion portraits and conducting candid dialogues with prominent actresses from the Marathi and Hindi film industries.</p>
    <p>Going beyond the glittering public glamour, the discussion delved into the emotional demands of character acting, the preparation required for complex historical and modern roles, and the growing influence of female filmmakers.</p>
    <blockquote style="margin: 1.5rem 0; padding: 1.25rem 1.75rem; border-left: 3px solid var(--gold-primary); background: rgba(212, 175, 55, 0.05); font-style: italic; color: var(--gold-light);">
      "When actresses portray real women with authenticity, cinema ceases to be mere entertainment and becomes a mirror of societal transformation."
    </blockquote>
    <p>The full photographic portfolio and comprehensive interview feature will appear across an 8-page glossy spread in the forthcoming print edition.</p>`,
    tags: ["Movie Talk", "Cinema", "Photo Shoot"],
    timestamp: 1793544000000
  },
  {
    id: "update-meetgreet-1",
    type: "photo-info",
    category: "Meet & Greet",
    womanName: "Mrs. Sakshi Sagvekar & Mrs. Amruta Rao",
    title: "Screenlady Reader & Women Entrepreneurs Meet & Greet Conclave in Pune",
    headline: "Screenlady Reader & Women Entrepreneurs Meet & Greet Conclave in Pune",
    date: "2026-10-28",
    displayDate: "October 28, 2026",
    venue: "JW Marriott Senapati Bapat Road, Pune",
    photo: "assets/images/magazine-photos/4.1.jpg",
    infoSummary: "Managing Director Mrs. Sakshi Sagvekar and Editor-in-Chief Mrs. Amruta Rao hosted an interactive meet-and-greet session with dedicated magazine subscribers, women startup founders, and college scholars in Pune. Discussions centered around self-reliance, financial literacy, and contributing personal success memoirs to future issues.",
    fullInfo: `<p>Screenlady’s regional reader outreach program kicked off with an energetic gathering at the JW Marriott in Pune, led by Managing Director <strong>Mrs. Sakshi Sagvekar</strong> and Editor-in-Chief <strong>Mrs. Amruta Rao</strong>.</p>
    <p>More than 150 women entrepreneurs, subscribers, boutique owners, and young professionals joined the interactive round-table. Attendees shared firsthand accounts of overcoming small-business challenges, building sustainable enterprises, and seeking greater media representation.</p>
    <blockquote style="margin: 1.5rem 0; padding: 1.25rem 1.75rem; border-left: 3px solid var(--gold-primary); background: rgba(212, 175, 55, 0.05); font-style: italic; color: var(--gold-light);">
      "Direct conversations with our readers keep Screenlady grounded in the genuine aspirations and dreams of today’s women."
    </blockquote>
    <p>Attendees received early-release copies of the latest issue, with several entrepreneur journeys selected for upcoming feature coverage.</p>`,
    tags: ["Meet & Greet", "Entrepreneurs", "Community"],
    timestamp: 1793198400000
  },
  {
    id: "update-events-1",
    type: "photo-info",
    curatedSection: "fashion_lifestyle",
    category: "Fashion & Lifestyle",
    categoryBadge: "✦ 💎 Heritage Jewellery",
    womanName: "Tantuh Artisanal Handcrafted Jewellery",
    title: "Tantuh Artisanal Handcrafted Jewellery",
    headline: "Tantuh Artisanal Handcrafted Jewellery",
    date: "2026-10-20",
    displayDate: "October 20, 2026",
    venue: "The St. Regis, Lower Parel, Mumbai",
    photo: "assets/images/articles/article-1.jpg",
    infoSummary: "Marketing Director Mr. Vedang Sagvekar hosted the formal partnership event unveiling Tantuh Handcrafted Jewellery as the official cover sponsor for Accolade Screenlady’s October 2026 edition. The collaboration highlights how heritage brass wirework and contemporary sustainable fashion empower women’s cultural identity.",
    fullInfo: `<p>In a grand celebration of indigenous artisanal craftsmanship and luxury publishing, Marketing Director <strong>Mr. Vedang Sagvekar</strong> joined <strong>Prasad Ghodke</strong> and <strong>Swati Ghodke</strong> of Tantuh to unveil their landmark cover sponsorship for Accolade Screenlady’s October 2026 edition.</p>
    <p>The event brought together jewellery connoisseurs, fashion editors, and prominent business leaders. The partnership illustrates Screenlady's commitment to offering purposeful, high-visibility promotional platforms for creative enterprises.</p>
    <blockquote style="margin: 1.5rem 0; padding: 1.25rem 1.75rem; border-left: 3px solid var(--gold-primary); background: rgba(212, 175, 55, 0.05); font-style: italic; color: var(--gold-light);">
      "When traditional artistry joins hands with forward-looking media, the cultural legacy of our nation reaches a whole new generation."
    </blockquote>
    <p>Special edition jewellery pieces from the Tantuh showcase will tour upcoming Screenlady cultural exhibitions across Maharashtra.</p>`,
    tags: ["Fashion & Lifestyle", "Heritage Jewellery", "Tantuh", "Partnerships", "Brand Launch"],
    timestamp: 1792507200000
  },
  {
    id: "fashion-spread-1",
    type: "photo-info",
    curatedSection: "fashion_lifestyle",
    category: "Fashion & Lifestyle",
    categoryBadge: "✦ 👗 High Fashion Spread",
    womanName: "Contemporary Silhouettes & Ethnic Grace",
    title: "Contemporary Silhouettes & Ethnic Grace",
    headline: "Contemporary Silhouettes & Ethnic Grace",
    date: "2026-10-25",
    displayDate: "October 25, 2026",
    venue: "Mumbai Fashion Week / Screenlady Studios",
    photo: "assets/images/magazine-photos/5.1.jpg",
    infoSummary: "Exclusive designer wear and high-gloss fashion spreads from our published magazine pages, bringing together artisanal weaves with modern couture.",
    fullInfo: `<p>Accolade Screenlady's creative fashion desk presents an exclusive visual chronicle celebrating the confluence of traditional handlooms and modern haute couture.</p>
    <p>Featuring handpicked ensembles from Maharashtra's premier textile artisans, the spread captures delicate Paithani silks, contemporary drapery, and minimalist styling tailored for the discerning modern woman.</p>
    <blockquote style="margin: 1.5rem 0; padding: 1.25rem 1.75rem; border-left: 3px solid var(--gold-primary); background: rgba(212, 175, 55, 0.05); font-style: italic; color: var(--gold-light);">
      "Fashion is the living canvas of a woman's confidence, culture, and sovereign identity." — Accolade Screenlady Fashion Desk
    </blockquote>
    <p>The feature highlights sustainable production cycles, ethical sourcing, and women artisans driving India's handloom renaissance.</p>`,
    tags: ["Fashion", "Haute Couture", "Lifestyle", "Paithani", "Ethnic Grace"],
    timestamp: 1792939200000
  },
  {
    id: "fashion-jewel-2",
    type: "photo-info",
    curatedSection: "fashion_lifestyle",
    category: "Fashion & Lifestyle",
    categoryBadge: "✦ ✨ Royal Adornments",
    womanName: "Timeless Jewellery for the Modern Era",
    title: "Timeless Jewellery for the Modern Era",
    headline: "Timeless Jewellery for the Modern Era",
    date: "2026-10-22",
    displayDate: "October 22, 2026",
    venue: "Heritage Jewellery Conclave, Pune",
    photo: "assets/images/magazine-photos/5.2.jpg",
    infoSummary: "Intricate patterns and festive adornments that highlight the timeless beauty of Indian traditions, temple motifs, and bridal heirlooms.",
    fullInfo: `<p>A celebration of enduring regal craftsmanship, this special feature showcases heritage jewellery traditions preserved by master silversmiths and goldsmiths across Western India.</p>
    <p>From Kolhapuri saaj to intricate filigree choker sets and uncut polki masterpieces, the showcase documents the historical symbolism embedded within classical adornment.</p>
    <blockquote style="margin: 1.5rem 0; padding: 1.25rem 1.75rem; border-left: 3px solid var(--gold-primary); background: rgba(212, 175, 55, 0.05); font-style: italic; color: var(--gold-light);">
      "Every handcrafted jewel carries forward the resilience and regal dignity of generations of Indian women."
    </blockquote>
    <p>Curated alongside practical styling guides for festive occasions, boardroom gatherings, and wedding seasons.</p>`,
    tags: ["Jewellery", "Heritage", "Adornments", "Bridal", "Lifestyle"],
    timestamp: 1792680000000
  },
  {
    id: "fashion-well-3",
    type: "photo-info",
    curatedSection: "fashion_lifestyle",
    category: "Fashion & Lifestyle",
    categoryBadge: "✦ 🌿 Wellness & Living",
    womanName: "Holistic Wellness & Modern Balance",
    title: "Holistic Wellness & Modern Balance",
    headline: "Holistic Wellness & Modern Balance",
    date: "2026-10-18",
    displayDate: "October 18, 2026",
    venue: "Holistic Health Summit, Navi Mumbai",
    photo: "assets/images/magazine-photos/5.3.jpg",
    infoSummary: "Navigating lifestyle, mental well-being, financial independence, and personal growth for modern women balancing ambition and serenity.",
    fullInfo: `<p>In our fast-paced modern world, wellness extends far beyond physical fitness — encompassing mental tranquility, emotional resilience, mindful living, and financial autonomy.</p>
    <p>Accolade Screenlady speaks with wellness coaches, holistic medical practitioners, and lifestyle mentors to compile an empowering daily blueprint for healthy living.</p>
    <blockquote style="margin: 1.5rem 0; padding: 1.25rem 1.75rem; border-left: 3px solid var(--gold-primary); background: rgba(212, 175, 55, 0.05); font-style: italic; color: var(--gold-light);">
      "True balance begins when a woman honors her own well-being with the same passion she dedicates to her career and family."
    </blockquote>
    <p>Featuring mindfulness practices, nutritional advice tailored for active lifestyles, and stress management routines.</p>`,
    tags: ["Wellness", "Lifestyle", "Mindfulness", "Balance", "Health"],
    timestamp: 1792334400000
  }
];

// Photo Presets for quick selection across team members and events
const PHOTO_PRESETS = [
  { label: 'Ramayana Movie Release', path: 'assets/images/news/ramayana.jpeg' },
  { label: 'Sindhutai Sapkal (Mai)', path: 'assets/images/news/sindhutai-sapkal.jpeg' },
  { label: 'November Box Office Releases', path: 'assets/images/news/films-box-office.jpeg' },
  { label: 'Amitabh Bachchan (Jalsa)', path: 'assets/images/news/amitabh-bachchan.jpeg' },
  { label: 'Mr. Prashant Sagvekar (Founder)', path: 'assets/images/team/prashant-sagvekar.jpeg' },
  { label: 'Mrs. Amruta Rao (Editor-in-Chief)', path: 'assets/images/team/amruta-rao.jpeg' },
  { label: 'Mrs. Sakshi Sagvekar (Managing Director)', path: 'assets/images/team/sakshi-sagvekar.jpeg' },
  { label: 'Mr. Vedang Sagvekar (Marketing Director)', path: 'assets/images/team/vedang-sagvekar.jpeg' },
  { label: 'Mrs. Manasi Ingle (Board Member)', path: 'assets/images/team/mansi-ingle.jpeg' },
  { label: 'Mrs. Supriya Vinod (Board Member)', path: 'assets/images/team/supriya-vinod.jpeg' },
  { label: 'Movie Talk & Shoots', path: 'assets/images/magazine-photos/3.1.jpg' },
  { label: 'Awards & Honors', path: 'assets/images/magazine-photos/4.2.jpg' },
  { label: 'Meet & Greet', path: 'assets/images/magazine-photos/4.1.jpg' },
  { label: 'Brand Event (Tantuh)', path: 'assets/images/articles/article-1.jpg' }
];

function purgeLegacyMockUpdates() {
  try {
    const raw = localStorage.getItem('screenlady_custom_updates');
    if (raw) {
      const list = JSON.parse(raw);
      const cleaned = list.filter(item => item && item.id && !item.id.startsWith('update-trial-'));
      if (cleaned.length !== list.length) {
        localStorage.setItem('screenlady_custom_updates', JSON.stringify(cleaned));
      }
    }
    const delRaw = localStorage.getItem('screenlady_deleted_ids');
    if (delRaw) {
      const deleted = JSON.parse(delRaw).filter(id => id && !id.startsWith('update-trial-'));
      localStorage.setItem('screenlady_deleted_ids', JSON.stringify(deleted));
    }
  } catch (e) {
    console.error('Error purging legacy mock updates:', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initUpdatesManager();
});

function initUpdatesManager() {
  purgeLegacyMockUpdates();
  const container = document.getElementById('updatesFeedContainer');
  if (!container) return;

  renderUpdates('all');
  initUpdatesToolbar();

  // If a hash exists in URL, scroll to it and open the reader modal
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (typeof window.openUpdateModal === 'function') {
        window.openUpdateModal(hash);
      }
    }, 250);
  }
}

/**
 * Normalizes an update item to ensure full compatibility across
 * Photo+Info, Article, and Photo formats.
 */
function normalizeUpdateItem(item) {
  const type = item.type || (item.womanName ? 'photo-info' : 'article');
  const title = item.title || item.headline || item.womanName || 'Screenlady Update';
  const headline = item.headline || item.title || '';
  const photo = item.photo || 'assets/images/featured-icon-saree.jpg';
  const date = item.date || new Date().toISOString().split('T')[0];
  const displayDate = item.displayDate || date;
  const category = item.category || 'Spotlight';
  const summary = item.infoSummary || item.summary || item.photoCaption || '';
  const fullText = item.fullInfo || item.fullArticle || item.bodyText || summary;
  const tags = item.tags || [category];
  const timestamp = item.timestamp || (new Date(date).getTime()) || 0;

  return {
    ...item,
    type,
    title,
    headline,
    photo,
    date,
    displayDate,
    category,
    infoSummary: summary,
    fullInfo: fullText,
    tags,
    timestamp
  };
}

/**
 * Retrieves merged updates list (custom user updates + defaults),
 * sorted strictly by date/timestamp descending.
 */
function getAllUpdates() {
  let custom = [];
  try {
    const raw = localStorage.getItem('screenlady_custom_updates');
    if (raw) custom = JSON.parse(raw);
  } catch (e) {
    console.error('Error loading custom updates:', e);
  }

  let customNews = [];
  try {
    const rawNews = localStorage.getItem('screenlady_custom_news');
    if (rawNews) customNews = JSON.parse(rawNews);
  } catch (e) {}

  let customFashion = [];
  try {
    const rawFashion = localStorage.getItem('screenlady_custom_fashion');
    if (rawFashion) customFashion = JSON.parse(rawFashion);
  } catch (e) {}

  const deletedIds = (typeof window.getScreenladyDeletedIds === 'function') 
    ? window.getScreenladyDeletedIds() 
    : (() => { try { const r = localStorage.getItem('screenlady_deleted_ids'); return r ? JSON.parse(r) : []; } catch(e){ return []; } })();

  const seenIds = new Set();
  const deduped = [];
  for (const item of [...custom, ...customNews, ...customFashion, ...DEFAULT_SCREENLADY_UPDATES]) {
    if (item && item.id && !seenIds.has(item.id)) {
      seenIds.add(item.id);
      deduped.push(item);
    }
  }

  const combined = deduped
    .map(normalizeUpdateItem)
    .filter(item => !deletedIds.includes(item.id));

  // Custom user-published items from Editorial Desk always lead at the top
  const customIds = new Set([
    ...custom.map(c => c.id),
    ...customNews.map(c => c.id),
    ...customFashion.map(c => c.id)
  ]);

  combined.sort((a, b) => {
    const aIsCustom = customIds.has(a.id) || a.isCustom;
    const bIsCustom = customIds.has(b.id) || b.isCustom;
    if (aIsCustom && !bIsCustom) return -1;
    if (!aIsCustom && bIsCustom) return 1;

    // Among custom items, sort newest timestamp first
    if (aIsCustom && bIsCustom) {
      const stampA = (a.timestamp || 0) || new Date(a.date || 0).getTime() || 0;
      const stampB = (b.timestamp || 0) || new Date(b.date || 0).getTime() || 0;
      if (stampB !== stampA) return stampB - stampA;
    }

    const dateA = new Date(a.date).getTime() || a.timestamp || 0;
    const dateB = new Date(b.date).getTime() || b.timestamp || 0;
    return dateB - dateA;
  });

  return combined;
}

// Expose getAllUpdates to window for homepage integration
window.getAllUpdates = getAllUpdates;

/**
 * Renders the updates stream. The first item in the list automatically receives
 * the 'latest-highlight' badge and styling.
 */
function renderUpdates(filter = 'all') {
  const container = document.getElementById('updatesFeedContainer');
  const countBadge = document.getElementById('updatesTotalCount');
  if (!container) return;

  const updates = getAllUpdates();

  let filtered = updates;
  if (filter !== 'all') {
    if (filter === 'filmy_adda') {
      filtered = updates.filter(isFilmyAddaUpdate);
    } else if (filter === 'bizz_world') {
      filtered = updates.filter(isBizzWorldUpdate);
    } else if (filter === 'women_inspiration') {
      filtered = updates.filter(isInspirationUpdate);
    } else if (filter === 'fashion_lifestyle') {
      filtered = updates.filter(isFashionUpdate);
    } else if (filter === 'news') {
      filtered = updates.filter(isNewsUpdate);
    } else if (filter === 'meetings') {
      filtered = updates.filter(u => {
        const cat = (u.category || '').toLowerCase();
        const tags = (u.tags || []).join(' ').toLowerCase();
        return cat.includes('meeting') || tags.includes('meeting');
      });
    } else if (filter === 'awards') {
      filtered = updates.filter(u => {
        const cat = (u.category || '').toLowerCase();
        const tags = (u.tags || []).join(' ').toLowerCase();
        return cat.includes('award') || cat.includes('honor') || tags.includes('award') || tags.includes('honor');
      });
    } else {
      const filterLower = filter.toLowerCase();
      filtered = updates.filter(u => {
        const typeLower = (u.type || '').toLowerCase();
        const catLower = (u.category || '').toLowerCase();
        return typeLower === filterLower || catLower.includes(filterLower) || filterLower.includes(catLower);
      });
    }
  }

  if (countBadge) {
    countBadge.textContent = `${filtered.length} Updates Published`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 2rem; background: rgba(255,255,255,0.02); border: 1px dashed rgba(212,175,55,0.3); border-radius: var(--radius-md);">
        <p style="font-family: var(--font-serif-display); font-size: 1.5rem; color: var(--gold-light); margin-bottom: 0.5rem;">No Updates Found in This Section</p>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">Try selecting "All Updates" or post a new update via the Admin Panel.</p>
        <button class="btn btn-gold btn-sm" onclick="renderUpdates('all')">Show All Updates</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((item, index) => {
    const isFirst = index === 0;
    const highlightClass = isFirst ? 'update-card latest-highlight' : 'update-card';
    const latestRibbon = isFirst ? `<div class="latest-ribbon">✦ LATEST UPDATE</div>` : '';

    if (item.type === 'article') {
      return renderArticleCard(item, highlightClass, latestRibbon);
    } else if (item.type === 'photo') {
      return renderPhotoCard(item, highlightClass, latestRibbon);
    } else {
      return renderPhotoInfoCard(item, highlightClass, latestRibbon);
    }
  }).join('');
}

/**
 * 1. Renders "Photo with Information" (Spotlight / Honoree profile)
 */
function renderPhotoInfoCard(item, highlightClass, latestRibbon) {
  const tagsHtml = (item.tags || []).slice(0, 2).map(t => `<span class="update-tag">#${escapeHtml(t)}</span>`).join('');
  const womanName = item.womanName || item.title;

  let badgeLabel = '📸 Photo + Info';
  let badgeClass = 'type-photo-info';
  if (item.curatedSection === 'filmy_adda' || isFilmyAddaUpdate(item)) {
    badgeLabel = '🎬 Filmy Adda';
  } else if (item.curatedSection === 'bizz_world' || isBizzWorldUpdate(item)) {
    badgeLabel = '💼 Bizz World';
  } else if (item.curatedSection === 'women_inspiration' || isInspirationUpdate(item)) {
    badgeLabel = '👑 Inspiration';
  } else if (item.curatedSection === 'fashion_lifestyle' || isFashionUpdate(item)) {
    badgeLabel = '✨ Fashion';
  } else if (item.curatedSection === 'news' || item._section === 'news' || item.type === 'news') {
    badgeLabel = '⚡ Live News';
  }

  return `
    <article class="${highlightClass} type-photo-info" id="${item.id}" data-type="photo-info" data-category="${escapeHtml(item.category)}">
      ${latestRibbon}
      <div class="update-photo-wrap" onclick="openUpdateModal('${item.id}')" style="cursor: pointer;" title="Click to read full profile">
        <img src="${item.photo}" alt="${escapeHtml(womanName)}" class="update-photo" loading="lazy">
        <div class="update-photo-overlay"></div>
      </div>

      <div class="update-details-wrap">
        <div>
          <div class="update-meta-top">
            <span class="update-type-pill ${badgeClass}">${badgeLabel}</span>
            <span class="update-date-text">${escapeHtml(item.displayDate || item.date)}</span>
          </div>

          <h3 class="update-honoree-name" onclick="openUpdateModal('${item.id}')" style="cursor: pointer;">
            <span class="name-highlight">${escapeHtml(womanName)}</span>
          </h3>

          <h4 class="update-headline" onclick="openUpdateModal('${item.id}')" style="cursor: pointer;">${escapeHtml(item.headline || item.title)}</h4>

          <p class="update-info-summary">
            ${escapeHtml(item.infoSummary)}
          </p>

          <div class="update-tags-row">
            <span class="update-category-pill">${escapeHtml(item.category)}</span>
            ${tagsHtml}
          </div>
        </div>

        <div class="update-footer-actions">
          <button class="btn-read-update" onclick="openUpdateModal('${item.id}')">
            <span>Read Story</span>
            <span>→</span>
          </button>
          <button class="update-share-btn" onclick="shareUpdate('${escapeHtml(womanName)}')" title="Share update">
            <span>Share</span>
            <span>🔗</span>
          </button>
        </div>
      </div>
    </article>
  `;
}

/**
 * 2. Renders "Article / Story" (Editorial piece / Column)
 */
function renderArticleCard(item, highlightClass, latestRibbon) {
  const tagsHtml = (item.tags || []).slice(0, 2).map(t => `<span class="update-tag">#${t}</span>`).join('');
  const author = item.author || 'Screenlady Editorial Desk';

  return `
    <article class="${highlightClass} type-article" id="${item.id}" data-type="article" data-category="${item.category}">
      ${latestRibbon}
      <div class="update-photo-wrap" onclick="openUpdateModal('${item.id}')" style="cursor: pointer;" title="Click to read article">
        <img src="${item.photo}" alt="${item.title}" class="update-photo" loading="lazy">
        <div class="update-photo-overlay"></div>
      </div>

      <div class="update-details-wrap">
        <div>
          <div class="update-meta-top">
            <span class="update-type-pill type-article">📝 Article</span>
            <span class="update-date-text">${item.displayDate || item.date}</span>
          </div>

          <h3 class="update-headline" onclick="openUpdateModal('${item.id}')" style="cursor: pointer;">
            ${item.title}
          </h3>

          <div class="update-byline-bar">
            <span>By <span class="author-name">${author}</span></span>
            ${item.readTime ? `<span>• ${item.readTime}</span>` : ''}
          </div>

          <p class="article-excerpt-text">
            ${item.infoSummary}
          </p>

          <div class="update-tags-row">
            <span class="update-category-pill">${item.category}</span>
            ${tagsHtml}
          </div>
        </div>

        <div class="update-footer-actions">
          <button class="btn-read-update" onclick="openUpdateModal('${item.id}')">
            <span>Read Article</span>
            <span>→</span>
          </button>
          <button class="update-share-btn" onclick="shareUpdate('${item.title}')" title="Share article">
            <span>Share</span>
            <span>🔗</span>
          </button>
        </div>
      </div>
    </article>
  `;
}

/**
 * 3. Renders "Photo Only / Visual Showcase"
 */
function renderPhotoCard(item, highlightClass, latestRibbon) {
  const safeTitle = escapeHtml(item.title || item.headline || 'Screenlady Event Photograph');
  const safeDate = escapeHtml(item.displayDate || item.date || 'Recent');
  const safeLocation = escapeHtml(item.venue || item.location || 'The Grand Ballroom, Mumbai');
  const safeDesc = escapeHtml(item.photoCaption || item.infoSummary || '');

  return `
    <article class="${highlightClass} type-photo" id="${item.id}" data-type="photo" data-category="${item.category}">
      ${latestRibbon}
      <div class="update-photo-wrap" style="cursor: pointer;" onclick="openUpdateModal('${item.id}')" title="Click to view full photo">
        <img src="${item.photo}" alt="${safeTitle}" class="update-photo" loading="lazy">
      </div>

      <div class="photo-event-details">
        <div class="photo-card-date">📅 ${safeDate}</div>
        <h3 class="photo-card-name" onclick="openUpdateModal('${item.id}')" style="cursor: pointer;">
          ${safeTitle}
        </h3>
        <div class="photo-card-location">📍 ${safeLocation}</div>
        <p class="photo-card-desc">
          ${safeDesc}
        </p>
      </div>
    </article>
  `;
}

/**
 * Filter toolbar click handling
 */
function initUpdatesToolbar() {
  const filterBtns = document.querySelectorAll('.update-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter') || 'all';
      renderUpdates(filter);
    });
  });

  const resetBtn = document.getElementById('resetUpdatesBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetTrialUpdates);
  }
}

/**
 * Open Full Update Story in Global Modal
 * Guaranteed Full Photo Display: Uncropped hero container with object-fit: contain
 */
window.openUpdateModal = function(updateId) {
  const updates = getAllUpdates();
  let item = updates.find(u => u.id === updateId);
  if (!item && typeof window.getAllHomeNews === 'function') {
    item = window.getAllHomeNews().find(u => u.id === updateId);
  }
  if (!item) {
    try {
      const allCustom = [
        ...JSON.parse(localStorage.getItem('screenlady_custom_updates') || '[]'),
        ...JSON.parse(localStorage.getItem('screenlady_custom_news') || '[]'),
        ...JSON.parse(localStorage.getItem('screenlady_custom_fashion') || '[]')
      ];
      item = allCustom.find(u => u && u.id === updateId);
    } catch(e) {}
  }
  if (!item) return;

  const tags = (item.tags || []).map(t => `<span class="badge-gold">#${escapeHtml(t)}</span>`).join(' ');

  let formattedFullInfo = item.fullInfo || item.infoSummary || item.summary || item.fullBody || '';
  if (formattedFullInfo && !formattedFullInfo.includes('<p>') && !formattedFullInfo.includes('<div>')) {
    formattedFullInfo = formattedFullInfo.split(/\r?\n\s*\r?\n/).map(p => `<p>${p.trim().replace(/\r?\n/g, '<br>')}</p>`).join('\n\n');
  }

  const womanName = item.womanName || item.title || item.headline || 'Accolade Screenlady Feature';
  const displayTitle = item.title || item.headline || womanName;
  const headline = item.headline || item.title || '';
  const dateStr = item.displayDate || item.date || '';

  // Determine section badge
  let sectionBadge = '📸 Spotlight';
  if (item.curatedSection === 'filmy_adda' || isFilmyAddaUpdate(item)) {
    sectionBadge = '🎬 Filmy Adda';
  } else if (item.curatedSection === 'bizz_world' || isBizzWorldUpdate(item)) {
    sectionBadge = '💼 Bizz World';
  } else if (item.curatedSection === 'women_inspiration' || isInspirationUpdate(item)) {
    sectionBadge = '👑 Women of Inspiration';
  } else if (item.curatedSection === 'fashion_lifestyle' || isFashionUpdate(item)) {
    sectionBadge = '✨ Fashion & Lifestyle';
  } else if (item.curatedSection === 'news' || item._section === 'news' || item.type === 'news') {
    sectionBadge = '⚡ Real-Time News';
  } else if (item.type === 'article') {
    sectionBadge = '📝 Article';
  }

  // Full photo stage: guarantees complete, uncropped photo display inside the reader
  const photoHtml = item.photo ? `
    <div class="reader-modal-hero-photo-wrap" style="width: 100%; max-height: 540px; background: #07070B radial-gradient(circle, #161622 0%, #07070B 100%); border-radius: var(--radius-md); border: 1.5px solid var(--border-gold-bright); box-shadow: 0 16px 45px rgba(0,0,0,0.95), 0 0 25px rgba(212,175,55,0.15); overflow: hidden; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; padding: 0.75rem;">
      <img src="${item.photo}" alt="${escapeHtml(displayTitle)}" style="max-height: 510px; max-width: 100%; width: auto; height: auto; object-fit: contain; display: block; margin: 0 auto; border-radius: 4px; box-shadow: 0 8px 30px rgba(0,0,0,0.8);">
    </div>
  ` : '';

  const modalBodyHtml = `
    <div style="display: flex; flex-direction: column;">
      ${photoHtml}

      <div>
        <div style="display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.75rem;">
          <span class="update-type-pill type-photo-info" style="font-weight: 700;">${sectionBadge}</span>
          ${item.category ? `<span class="update-category-pill">${escapeHtml(item.category)}</span>` : ''}
          ${dateStr ? `<span style="font-size: 0.82rem; color: var(--gold-light);">• 📅 ${escapeHtml(dateStr)}</span>` : ''}
          ${item.venue ? `<span style="font-size: 0.82rem; color: var(--text-muted);">• 📍 ${escapeHtml(item.venue)}</span>` : ''}
        </div>

        <h2 style="font-family: var(--font-serif-display); font-size: 2.15rem; color: var(--gold-light); margin-bottom: 0.6rem; line-height: 1.25; font-weight: 700;">
          ${escapeHtml(displayTitle)}
        </h2>

        ${(headline && headline !== displayTitle) ? `
          <h4 style="font-size: 1.05rem; color: var(--text-ivory); font-weight: 600; line-height: 1.45; margin-bottom: 1.15rem;">
            ${escapeHtml(headline)}
          </h4>
        ` : ''}

        ${item.author ? `
          <div style="font-size: 0.88rem; color: var(--text-ivory); font-style: italic; margin-bottom: 1rem;">
            By <strong>${escapeHtml(item.author)}</strong>
          </div>
        ` : ''}

        ${tags ? `<div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem;">${tags}</div>` : ''}
      </div>

      <div class="reader-story-content" style="border-top: 1px solid rgba(212, 175, 55, 0.25); padding-top: 1.75rem; margin-top: 0.5rem;">
        ${formattedFullInfo}
      </div>

      <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 1.25rem; margin-top: 1.75rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <span style="font-size: 0.8rem; color: var(--text-faint);">Accolade Screenlady Editorial Desk • Curated by Mr. Prashant Chandrakant Sagvekar</span>
        <button class="btn btn-gold btn-sm" onclick="shareUpdate('${escapeHtml(displayTitle)}')">Share Story</button>
      </div>
    </div>
  `;

  if (window.openModal) {
    window.openModal(displayTitle, modalBodyHtml);
  }
};

/**
 * Share Toast Trigger
 */
window.shareUpdate = function(name) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href);
  }
  if (window.showToast) {
    window.showToast(`Link for "${name}" copied to clipboard!`);
  }
};

/**
 * Reset to initial trial updates
 */
window.resetTrialUpdates = function() {
  if (confirm('Reset updates feed back to the initial trial base updates?')) {
    localStorage.removeItem('screenlady_custom_updates');
    renderUpdates('all');
    if (window.showToast) {
      window.showToast('Reset to initial trial updates successfully.');
    }
  }
};
