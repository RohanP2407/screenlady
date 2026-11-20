import re
import json

def extract_between(text, start_pattern, end_pattern):
    m = re.search(start_pattern, text)
    if not m:
        return None
    start_pos = m.end()
    # Find matching bracket
    count = 1
    i = start_pos
    while i < len(text) and count > 0:
        if text[i] == '[':
            count += 1
        elif text[i] == ']':
            count -= 1
        i += 1
    return text[start_pos-1:i]

with open('assets/js/updates.js', 'r', encoding='utf-8') as f:
    updates_text = f.read()
updates_raw = extract_between(updates_text, r'DEFAULT_SCREENLADY_UPDATES\s*=\s*\[', r'\]')

with open('assets/js/editorials.js', 'r', encoding='utf-8') as f:
    editorials_text = f.read()
editorials_raw = extract_between(editorials_text, r'DEFAULT_SCREENLADY_EDITORIALS\s*=\s*\[', r'\]')

with open('assets/js/photos.js', 'r', encoding='utf-8') as f:
    photos_text = f.read()
photos_raw = extract_between(photos_text, r'DEFAULT_SCREENLADY_PHOTOS\s*=\s*\[', r'\]')

with open('assets/js/podcast.js', 'r', encoding='utf-8') as f:
    podcast_text = f.read()
podcast_raw = extract_between(podcast_text, r'DEFAULT_SCREENLADY_PODCASTS\s*=\s*\[', r'\]')

data_file_content = f"""// Default Seed Data for Accolade Screenlady Backend

export const DEFAULT_UPDATES = {updates_raw or '[]'};

export const DEFAULT_EDITORIALS = {editorials_raw or '[]'};

export const DEFAULT_PHOTOS = {photos_raw or '[]'};

export const DEFAULT_PODCASTS = {podcast_raw or '[]'};

export const DEFAULT_MAGAZINE = {{
  activeIssue: "October 2026",
  coverImage: "/assets/images/magazine-cover-latest.jpg",
  page2Image: "/assets/images/magazine-page2-feature.jpg",
  price: 220,
  currency: "INR",
  homeDelivery: true,
  availableIssues: [
    {{ id: "october-2026", title: "October 2026 Edition", cover: "/assets/images/magazine-cover-october.jpg" }},
    {{ id: "september-2026", title: "September 2026 Edition", cover: "/assets/images/magazine-cover-september.jpg" }},
    {{ id: "august-2026", title: "August 2026 Edition", cover: "/assets/images/magazine-cover-august.jpg" }},
    {{ id: "july-2026", title: "July 2026 Edition", cover: "/assets/images/magazine-cover-july.jpg" }},
    {{ id: "june-2026", title: "June 2026 Edition", cover: "/assets/images/magazine-cover-june.jpg" }}
  ]
}};
"""

with open('backend/src/data.js', 'w', encoding='utf-8') as f:
    f.write(data_file_content)

print(f"backend/src/data.js generated ({len(data_file_content)} bytes)")
