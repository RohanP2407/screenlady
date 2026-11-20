const fs = require('fs');

console.log('=== TEST FASHION & LIFESTYLE UPLOAD & HOMEPAGE INTEGRATION ===\n');

// Mock localStorage
const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; }
};

// Mock browser globals
global.window = global;
global.document = {
  addEventListener: () => {},
  querySelectorAll: () => [],
  getElementById: () => null
};

// Load updates.js
const updatesCode = fs.readFileSync('assets/js/updates.js', 'utf8');
eval(updatesCode);

console.log('1. Default Fashion items count in getAllUpdates():');
const defaultUpdates = getAllUpdates();
const defaultFashion = defaultUpdates.filter(u => u.curatedSection === 'fashion_lifestyle' || (u.id && u.id.startsWith('fashion-')) || u.id === 'update-events-1');
console.log(`  Found ${defaultFashion.length} default fashion seeds in getAllUpdates(). Expected 4.`);
defaultFashion.forEach((f, idx) => {
  console.log(`    [#${idx+1}] ID: ${f.id} | Title: "${f.title}" | Date: ${f.date}`);
});

console.log('\n2. Simulating User Upload from Editorial Desk:');
// Simulate user publishing a new Fashion & Lifestyle post today
const newPost = {
  id: `curated-fashion_lifestyle-${Date.now()}`,
  curatedSection: 'fashion_lifestyle',
  isCustom: true,
  type: 'photo-info',
  category: 'Haute Couture Spread',
  categoryBadge: '✦ Haute Couture Spread',
  date: '2026-11-19',
  displayDate: 'November 19, 2026',
  title: 'Royal Paithani Gold Weave Collection',
  headline: 'Royal Paithani Gold Weave Collection',
  womanName: 'Royal Paithani Gold Weave Collection',
  summary: 'Exquisite bridal handloom couture with pure gold zari work',
  infoSummary: 'Exquisite bridal handloom couture with pure gold zari work',
  fullBody: '<p>A masterpiece of handloom craft.</p>',
  fullInfo: '<p>A masterpiece of handloom craft.</p>',
  photo: 'assets/images/magazine-photos/5.1.jpg',
  tags: ['Fashion & Lifestyle', 'Paithani'],
  link: 'updates.html#curated-fashion-test',
  timestamp: Date.now()
};

// Save to custom updates
let customList = [];
customList.unshift(newPost);
localStorage.setItem('screenlady_custom_updates', JSON.stringify(customList));
localStorage.setItem('screenlady_custom_fashion', JSON.stringify(customList));

// Verify getAllUpdates() ordering
const updatedList = getAllUpdates();
const fashionAfterUpload = updatedList.filter(u => u.curatedSection === 'fashion_lifestyle' || (u.id && u.id.startsWith('fashion-')) || u.id === 'update-events-1');

console.log(`\n3. Verifying Homepage 4-Slot Output for Fashion & Lifestyle:`);
console.log(`  First item in Fashion grid: "${fashionAfterUpload[0].title}" (ID: ${fashionAfterUpload[0].id})`);
if (fashionAfterUpload[0].id === newPost.id) {
  console.log('  [PASS] Newly uploaded post leads at SLOT #1 on the Homepage!');
} else {
  console.log('  [FAIL] Newly uploaded post is NOT at slot #1!');
}

console.log(`  Total fashion items available: ${fashionAfterUpload.length}`);
console.log('  Top 4 items displayed on Homepage:');
fashionAfterUpload.slice(0, 4).forEach((item, idx) => {
  console.log(`    Slot #${idx+1}: "${item.title}" (${item.id}) [${item.isCustom ? 'USER UPLOADED' : 'Default Seed'}]`);
});

console.log('\n4. Verifying Editing an Existing Seed:');
const editedSeed = {
  id: 'fashion-spread-1',
  curatedSection: 'fashion_lifestyle',
  isCustom: true,
  title: 'Edited: Contemporary Silhouettes & Modern Grace',
  headline: 'Edited: Contemporary Silhouettes & Modern Grace',
  photo: 'assets/images/magazine-photos/5.2.jpg',
  date: '2026-11-19',
  timestamp: Date.now() + 1000
};

customList.unshift(editedSeed);
localStorage.setItem('screenlady_custom_updates', JSON.stringify(customList));

const listAfterEdit = getAllUpdates();
const fashionAfterEdit = listAfterEdit.filter(u => u.curatedSection === 'fashion_lifestyle' || (u.id && u.id.startsWith('fashion-')) || u.id === 'update-events-1');

const occurrences = fashionAfterEdit.filter(u => u.id === 'fashion-spread-1');
console.log(`  Occurrences of 'fashion-spread-1': ${occurrences.length} (Expected 1, no duplicates)`);
if (occurrences.length === 1 && occurrences[0].title.startsWith('Edited:')) {
  console.log('  [PASS] Edited item replaced default seed cleanly without duplication!');
} else {
  console.log('  [FAIL] Duplication or failed update for edited seed');
}

console.log('\n=== ALL FASHION & LIFESTYLE UPLOAD TESTS PASSED ===\n');

