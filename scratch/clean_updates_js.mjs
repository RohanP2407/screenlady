import fs from 'fs';

const filePath = 'd:/Screenlady Website (NEW)/public/assets/js/updates.js';
let content = fs.readFileSync(filePath, 'utf-8');

const regex = /\/\/ Official Screenlady Team Updates: Meetings, Awards, Movie Talks, Meet & Greets, Events\s+const DEFAULT_SCREENLADY_UPDATES = \[[\s\S]*?\n\];/;

if (!regex.test(content)) {
  console.error("Regex did not match DEFAULT_SCREENLADY_UPDATES!");
  process.exit(1);
}

content = content.replace(regex, '// Official Screenlady Team Updates: Fetched dynamically from Cloudflare D1 Backend\nconst DEFAULT_SCREENLADY_UPDATES = [];');

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Successfully replaced DEFAULT_SCREENLADY_UPDATES with empty array in updates.js");

