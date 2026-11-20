import glob
import re

for filepath in sorted(glob.glob('original-site/*.html')):
    filename = filepath.replace('original-site\\', '').replace('original-site/', '')
    if filename in ['index.html']:
        continue
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Find where <header> ends or <aside class="mobile-nav"> ends
    header_end = content.find('</aside>')
    if header_end != -1:
        # Also skip any mobile-sub-nav if it was before or after
        body_start = header_end + len('</aside>')
    else:
        body_start = 0

    footer_start = content.find('<footer')
    if footer_start == -1:
        footer_start = len(content)

    body_part = content[body_start:footer_start].strip()
    
    # Check scripts at bottom
    bottom_scripts = re.findall(r'<script\s+src=[\'"]([^\'"]+)[\'"]', content[footer_start:])
    
    print(f"=== {filename} ===")
    print(f"Body length: {len(body_part)} characters")
    print(f"Bottom scripts: {bottom_scripts}")
    sections = re.findall(r'<(?:section|main|div)[^>]*id=[\'"]([^\'"]+)[\'"]', body_part)
    print(f"Key IDs: {sections[:10]}")
    print()

