-- ==============================================================
-- ACCOLADE SCREENLADY - CLOUDFLARE D1 RELATIONAL DATABASE SCHEMA
-- Separate dedicated tables for each content category & section
-- ==============================================================

-- 1. Real-Time News (Homepage Left Column Feed)
CREATE TABLE IF NOT EXISTS realtime_updates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  headline TEXT,
  category TEXT DEFAULT 'Real-Time News',
  category_badge TEXT DEFAULT '✦ Real-Time News',
  summary TEXT,
  full_body TEXT,
  photo TEXT,
  author TEXT,
  date TEXT,
  display_date TEXT,
  timestamp INTEGER,
  created_at TEXT,
  extra_data TEXT
);
CREATE INDEX IF NOT EXISTS idx_rt_news_timestamp ON realtime_updates(timestamp DESC);

-- 2. Business Showcase / Commercial Partner Spotlights (Homepage Right Column - Frontend word: Brand Spotlight, NO 'ads' word)
CREATE TABLE IF NOT EXISTS business_ads (
  id TEXT PRIMARY KEY,
  brand_name TEXT NOT NULL,
  headline TEXT,
  tagline TEXT,
  summary TEXT,
  photo TEXT NOT NULL,
  destination_url TEXT,
  category TEXT DEFAULT 'Enterprise',
  category_badge TEXT DEFAULT 'Brand Spotlight',
  date TEXT,
  display_date TEXT,
  timestamp INTEGER,
  created_at TEXT,
  extra_data TEXT
);
CREATE INDEX IF NOT EXISTS idx_business_ads_timestamp ON business_ads(timestamp DESC);

-- 3. Updates Section - Filmy Adda
CREATE TABLE IF NOT EXISTS filmy_adda (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  headline TEXT,
  category TEXT DEFAULT 'Filmy Adda',
  category_badge TEXT DEFAULT 'Filmy Adda',
  summary TEXT,
  full_body TEXT,
  photo TEXT,
  venue TEXT,
  date TEXT,
  display_date TEXT,
  timestamp INTEGER,
  created_at TEXT,
  extra_data TEXT
);
CREATE INDEX IF NOT EXISTS idx_filmy_timestamp ON filmy_adda(timestamp DESC);

-- 4. Updates Section - Bizz World
CREATE TABLE IF NOT EXISTS bizz_world (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  headline TEXT,
  category TEXT DEFAULT 'Bizz World',
  category_badge TEXT DEFAULT 'Bizz World',
  summary TEXT,
  full_body TEXT,
  photo TEXT,
  venue TEXT,
  date TEXT,
  display_date TEXT,
  timestamp INTEGER,
  created_at TEXT,
  extra_data TEXT
);
CREATE INDEX IF NOT EXISTS idx_bizz_timestamp ON bizz_world(timestamp DESC);

-- 5. Updates Section - Women of Inspiration
CREATE TABLE IF NOT EXISTS women_inspiration (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  woman_name TEXT,
  headline TEXT,
  category TEXT DEFAULT 'Women of Inspiration',
  category_badge TEXT DEFAULT 'Women of Inspiration',
  summary TEXT,
  full_body TEXT,
  photo TEXT,
  venue TEXT,
  date TEXT,
  display_date TEXT,
  timestamp INTEGER,
  created_at TEXT,
  extra_data TEXT
);
CREATE INDEX IF NOT EXISTS idx_women_insp_timestamp ON women_inspiration(timestamp DESC);

-- 6. Updates Section - Fashion and Lifestyle
CREATE TABLE IF NOT EXISTS fashion_lifestyle (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  headline TEXT,
  category TEXT DEFAULT 'Fashion & Lifestyle',
  category_badge TEXT DEFAULT 'Fashion & Lifestyle',
  summary TEXT,
  full_body TEXT,
  photo TEXT,
  venue TEXT,
  date TEXT,
  display_date TEXT,
  timestamp INTEGER,
  created_at TEXT,
  extra_data TEXT
);
CREATE INDEX IF NOT EXISTS idx_fashion_timestamp ON fashion_lifestyle(timestamp DESC);

-- 7. Visual Photo Gallery (Strictly /photos ONLY - Never mixed into homepage or other sections)
CREATE TABLE IF NOT EXISTS gallery_photos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  photo TEXT NOT NULL,
  venue TEXT,
  category TEXT DEFAULT 'Gallery',
  category_badge TEXT DEFAULT 'Photo Archive',
  caption TEXT,
  credit TEXT,
  date TEXT,
  display_date TEXT,
  timestamp INTEGER,
  created_at TEXT,
  extra_data TEXT
);
CREATE INDEX IF NOT EXISTS idx_gallery_timestamp ON gallery_photos(timestamp DESC);

-- 8. Editorial Columns & In-Depth Articles (/editorials)
CREATE TABLE IF NOT EXISTS editorials (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  author_designation TEXT,
  read_time TEXT,
  pull_quote TEXT,
  summary TEXT,
  full_body TEXT,
  photo TEXT,
  category TEXT DEFAULT 'Editorial',
  category_badge TEXT DEFAULT 'Editorial Column',
  date TEXT,
  display_date TEXT,
  timestamp INTEGER,
  created_at TEXT,
  extra_data TEXT
);
CREATE INDEX IF NOT EXISTS idx_editorials_timestamp ON editorials(timestamp DESC);

-- 9. Podcasts (/podcast)
CREATE TABLE IF NOT EXISTS podcasts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  host TEXT,
  guest TEXT,
  duration TEXT,
  social_link TEXT,
  audio_url TEXT,
  summary TEXT,
  photo TEXT,
  category TEXT DEFAULT 'Podcast',
  category_badge TEXT DEFAULT 'Audio Dispatch',
  date TEXT,
  display_date TEXT,
  timestamp INTEGER,
  created_at TEXT,
  extra_data TEXT
);
CREATE INDEX IF NOT EXISTS idx_podcasts_timestamp ON podcasts(timestamp DESC);

-- 10. Magazine Orders
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_id TEXT,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  pincode TEXT,
  state TEXT,
  edition TEXT,
  quantity INTEGER DEFAULT 1,
  amount REAL DEFAULT 0,
  status TEXT DEFAULT 'received',
  payment_status TEXT DEFAULT 'pending',
  dispatch_status TEXT DEFAULT 'processing',
  payment_method TEXT DEFAULT 'COD',
  payment_id TEXT,
  tracking_number TEXT,
  notes TEXT,
  timestamp INTEGER,
  created_at TEXT,
  extra_data TEXT
);
CREATE INDEX IF NOT EXISTS idx_orders_timestamp ON orders(timestamp DESC);

-- 11. Globally Deleted Records Registry
CREATE TABLE IF NOT EXISTS deleted_records (
  id TEXT PRIMARY KEY,
  table_name TEXT,
  deleted_at TEXT
);

-- 12. Magazine Pricing & Issue Settings
CREATE TABLE IF NOT EXISTS magazine_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  active_issue TEXT,
  cover_image TEXT,
  page2_image TEXT,
  price REAL DEFAULT 220,
  currency TEXT DEFAULT 'INR',
  headline TEXT,
  subtitle TEXT,
  popup_badge TEXT,
  popup_message TEXT,
  home_delivery INTEGER DEFAULT 1,
  available_issues TEXT,
  updated_at TEXT
);

-- 13. Magazine Covers / Editions (Homepage Hero Slideshow - "Exploring the Diverse World of Women")
CREATE TABLE IF NOT EXISTS magazine_covers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  month_year TEXT NOT NULL,
  photo TEXT NOT NULL,
  price REAL DEFAULT 220,
  headline TEXT,
  description TEXT,
  order_link TEXT,
  display_order INTEGER DEFAULT 0,
  date TEXT,
  display_date TEXT,
  timestamp INTEGER,
  created_at TEXT,
  extra_data TEXT
);
CREATE INDEX IF NOT EXISTS idx_mag_covers_timestamp ON magazine_covers(timestamp DESC);

-- Backward compatibility view/table for legacy queries if any
CREATE TABLE IF NOT EXISTS content_items (
  id TEXT PRIMARY KEY,
  section TEXT NOT NULL,
  curated_section TEXT,
  type TEXT,
  title TEXT,
  headline TEXT,
  woman_name TEXT,
  author TEXT,
  author_designation TEXT,
  category TEXT,
  category_badge TEXT,
  summary TEXT,
  pull_quote TEXT,
  full_body TEXT,
  photo TEXT,
  venue TEXT,
  date TEXT,
  display_date TEXT,
  read_time TEXT,
  duration TEXT,
  host TEXT,
  guest TEXT,
  audio_url TEXT,
  social_link TEXT,
  tags TEXT,
  is_homepage_news INTEGER DEFAULT 0,
  is_custom INTEGER DEFAULT 1,
  timestamp INTEGER,
  created_at TEXT,
  extra_data TEXT
);

-- 14. Admin Authentication Credentials (Cross-Device Persistent Passcode)
CREATE TABLE IF NOT EXISTS admin_auth (
  id TEXT PRIMARY KEY,
  pin_hash TEXT NOT NULL,
  pin_plain TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

