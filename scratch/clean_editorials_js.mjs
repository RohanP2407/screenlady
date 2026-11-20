import fs from 'fs';

const filePath = 'd:/Screenlady Website (NEW)/public/assets/js/editorials.js';
let content = fs.readFileSync(filePath, 'utf-8');

const regex = /\/\/ Official Magazine Editorial Articles \(Ordered: Article 1 Tantuh on Left, Article 2 Body Shaming on Right\)\s+const DEFAULT_SCREENLADY_EDITORIALS = \[[\s\S]*?\n\];/;

if (!regex.test(content)) {
  console.error("Regex did not match DEFAULT_SCREENLADY_EDITORIALS!");
  process.exit(1);
}

content = content.replace(regex, '// Official Magazine Editorial Articles: Fetched dynamically from Cloudflare D1 Backend\nconst DEFAULT_SCREENLADY_EDITORIALS = [];');

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Successfully replaced DEFAULT_SCREENLADY_EDITORIALS with empty array in editorials.js");

