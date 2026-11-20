import re

with open('original-site/admin.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# Fix unclosed option tags in datalist
unclosed_options = [
    '<option value="Mr. Prashant Sagvekar (Founder & Publisher)">',
    '<option value="Mrs. Amruta Rao (Editor-in-Chief)">',
    '<option value="Mrs. Sakshi Sagvekar (Managing Director)">',
    '<option value="Mr. Vedang Sagvekar (Marketing Director)">',
    '<option value="Mrs. Manasi Ingle (Board Member)">',
    '<option value="Mrs. Supriya Vinod (Board Member)">',
    '<option value="Accolade Screenlady Full Executive Team">'
]

for opt in unclosed_options:
    fixed_opt = opt[:-1] + '></option>'
    text = text.replace(opt, fixed_opt)

# Normalize asset paths
text = text.replace('src="assets/', 'src="/assets/')
text = text.replace('href="assets/', 'href="/assets/')

# Change back link to main website
text = text.replace('href="index.html"', 'href="http://localhost:4321"')

with open('admin-portal/src/pages/index.astro', 'w', encoding='utf-8') as f:
    f.write(text)

print('Admin portal index.astro generated!')

