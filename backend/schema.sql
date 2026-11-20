-- ==============================================================
-- ACCOLADE SCREENLADY - CLOUDFLARE D1 RELATIONAL DATABASE SCHEMA
-- ==============================================================

-- 1. All Content Items (News, Filmy Adda, Bizz World, Inspiration, Fashion, Editorials, Photos, Podcasts, Updates)
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

-- Index for fast section querying and chronological sorting
CREATE INDEX IF NOT EXISTS idx_content_section ON content_items(section);
CREATE INDEX IF NOT EXISTS idx_content_curated ON content_items(curated_section);
CREATE INDEX IF NOT EXISTS idx_content_homepage_news ON content_items(is_homepage_news);
CREATE INDEX IF NOT EXISTS idx_content_timestamp ON content_items(timestamp DESC);

-- 2. Magazine Orders
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

-- 3. Globally Deleted Records Registry
CREATE TABLE IF NOT EXISTS deleted_records (
  id TEXT PRIMARY KEY,
  deleted_at TEXT
);

-- 4. Magazine Pricing & Issue Settings
CREATE TABLE IF NOT EXISTS magazine_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  active_issue TEXT,
  cover_image TEXT,
  page2_image TEXT,
  price REAL DEFAULT 220,
  currency TEXT DEFAULT 'INR',
  home_delivery INTEGER DEFAULT 1,
  available_issues TEXT,
  updated_at TEXT
);

