const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const targetDir = path.join(baseDir, 'assets', 'images');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(baseDir);

const mappings = [
  { match: 'LOGO.png', dest: 'logo.png' },
  { match: 'kaka.jpeg', dest: 'prashant-sagvekar-main.jpg' },
  { match: '10.23.41 PM (2)', dest: 'prashant-sagvekar-suit.jpg' },
  { match: '10.23.42 PM (1)', dest: 'prashant-sagvekar-ethnic.jpg' },
  { match: '10.23.41 PM.jpeg', dest: 'prashant-sagvekar-casual.jpg' },
  { match: '487296917', dest: 'featured-icon-saree.jpg' },
  { match: '8.53.39 PM', dest: 'featured-corporate-leader.jpg' },
  { match: '8.01.31 PM', dest: 'featured-executive-office.jpg' },
  { match: '514328665', dest: 'featured-culture-leader.jpg' },
  { match: '199066554', dest: 'featured-creative-director.jpg' },
  { match: 'images (13)', dest: 'featured-veteran-artist.jpg' },
  { match: '11.20.37 PM', dest: 'media-exec-sony.jpg' },
  { match: '11.44.51 PM', dest: 'gala-host.jpg' }
];

for (const m of mappings) {
  const found = files.find(f => f.includes(m.match));
  if (found) {
    const srcPath = path.join(baseDir, found);
    const destPath = path.join(targetDir, m.dest);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied: ${found} -> ${m.dest}`);
  } else {
    console.warn(`Not found: ${m.match}`);
  }
}
