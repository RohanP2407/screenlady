import re
import os

pages_meta = {
    'about-us.html': {
        'target': 'src/pages/about-us.astro',
        'title': 'About Us',
        'description': 'Learn about Accolade Screenlady, our vision, board members, and editorial team.',
        'activeNav': 'about-us',
        'extraScripts': ['/assets/js/editorial-homepage.js']
    },
    'editorials.html': {
        'target': 'src/pages/editorials.astro',
        'title': 'Editorials',
        'description': 'Read insightful columns, deep essays, and perspectives on cinema, culture, and women in leadership.',
        'activeNav': 'editorials',
        'extraScripts': ['/assets/js/editorials.js']
    },
    'photos.html': {
        'target': 'src/pages/photos.astro',
        'title': 'Gallery',
        'description': 'Accolade Screenlady event photographs, exclusive portraits, and award celebrations.',
        'activeNav': 'photos',
        'extraScripts': ['/assets/js/photos.js']
    },
    'podcast.html': {
        'target': 'src/pages/podcast.astro',
        'title': 'Podcast',
        'description': 'Listen to inspiring voices, interviews, and deep conversations with women pioneers.',
        'activeNav': 'podcast',
        'extraScripts': ['/assets/js/podcast.js']
    },
    'updates.html': {
        'target': 'src/pages/updates.astro',
        'title': 'Updates',
        'description': 'Live news, event announcements, and latest updates from Accolade Screenlady.',
        'activeNav': 'updates',
        'extraScripts': ['/assets/js/updates.js']
    },
    'social-media.html': {
        'target': 'src/pages/social-media.astro',
        'title': 'Social Media',
        'description': 'Follow Accolade Screenlady across our verified social channels.',
        'activeNav': 'social-media',
        'extraScripts': []
    },
    'admin.html': {
        'target': 'src/pages/admin.astro',
        'title': 'Admin Editorial Desk',
        'description': 'Editorial Desk controller for managing content, magazines, and orders.',
        'activeNav': 'admin',
        'extraScripts': [
            '/assets/js/updates.js',
            '/assets/js/home-news-photos.js',
            '/assets/js/editorials.js',
            '/assets/js/podcast.js',
            '/assets/js/photos.js',
            '/assets/js/admin.js'
        ]
    }
}

for src_file, meta in pages_meta.items():
    src_path = os.path.join('original-site', src_file)
    with open(src_path, 'r', encoding='utf-8', errors='ignore') as f:
        html = f.read()

    # Extract body content between header/nav and footer
    # Find the end of mobileNav or site-header
    if '</aside>' in html:
        # Check if there are multiple aside (like top-bar, mobile-nav)
        # We want the content after </aside> (mobileNav)
        last_aside_idx = html.rfind('</aside>')
        content_start = last_aside_idx + len('</aside>')
    elif '</header>' in html:
        content_start = html.find('</header>') + len('</header>')
    else:
        content_start = html.find('<body>') + len('<body>') if '<body>' in html else 0

    footer_start = html.find('<footer')
    if footer_start == -1:
        footer_start = len(html)

    body_content = html[content_start:footer_start].strip()

    # Clean any lingering mobile-nav-backdrop or mobile-nav that might appear after content_start
    body_content = re.sub(r'<div class="mobile-nav-backdrop"[^>]*></div>', '', body_content)
    body_content = re.sub(r'<aside class="mobile-nav"[\s\S]*?</aside>', '', body_content)
    body_content = re.sub(r'<nav class="mobile-sub-nav"[\s\S]*?</nav>', '', body_content)

    # Normalize relative links to Astro routes
    body_content = re.sub(r'href="index\.html(#?[^"]*)"', r'href="/\1"', body_content)
    body_content = re.sub(r'href="about-us\.html(#?[^"]*)"', r'href="/about-us\1"', body_content)
    body_content = re.sub(r'href="editorials\.html(#?[^"]*)"', r'href="/editorials\1"', body_content)
    body_content = re.sub(r'href="photos\.html(#?[^"]*)"', r'href="/photos\1"', body_content)
    body_content = re.sub(r'href="podcast\.html(#?[^"]*)"', r'href="/podcast\1"', body_content)
    body_content = re.sub(r'href="updates\.html(#?[^"]*)"', r'href="/updates\1"', body_content)
    body_content = re.sub(r'href="social-media\.html(#?[^"]*)"', r'href="/social-media\1"', body_content)
    body_content = re.sub(r'href="admin\.html(#?[^"]*)"', r'href="/admin\1"', body_content)

    # Normalize asset paths: src="assets/ -> src="/assets/ and href="assets/ -> href="/assets/
    body_content = re.sub(r'src="assets/', 'src="/assets/', body_content)
    body_content = re.sub(r'href="assets/', 'href="/assets/', body_content)

    # For JSX/Astro compatibility: close unclosed <img> or <input> if needed, or Astro parses HTML fine.
    # Astro supports standard HTML, but void elements are self-closing or standard.
    
    extra_scripts_json = str(meta['extraScripts']).replace("'", '"')

    astro_template = f"""---
// {os.path.basename(meta['target'])}
import BaseLayout from '../layouts/BaseLayout.astro';

const extraScripts = {extra_scripts_json};
---

<BaseLayout
  title="{meta['title']}"
  description="{meta['description']}"
  activeNav="{meta['activeNav']}"
  extraScripts={{extraScripts}}
>
{body_content}
</BaseLayout>
"""

    with open(meta['target'], 'w', encoding='utf-8') as out:
        out.write(astro_template)

    print(f"Generated {meta['target']} ({len(astro_template)} bytes)")

print("All pages converted!")

