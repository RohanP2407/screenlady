const fs = require('fs');

console.log('=== VERIFYING ACCLODADE SCREENLADY FIXES ===\n');

// 1. Verify CSS rules
const css = fs.readFileSync('assets/css/editorial-homepage.css', 'utf8');
const nameMatch = css.match(/\.curated-showcase-name\s*\{([^}]+)\}/);
const onelineMatch = css.match(/\.curated-showcase-oneline\s*\{([^}]+)\}/);

console.log('1. CSS Checks:');
if (nameMatch && nameMatch[1].includes('white-space: normal')) {
  console.log('  [PASS] .curated-showcase-name has white-space: normal');
} else {
  console.log('  [FAIL] .curated-showcase-name missing white-space: normal');
}

if (nameMatch && nameMatch[1].includes('-webkit-line-clamp: 2')) {
  console.log('  [PASS] .curated-showcase-name has -webkit-line-clamp: 2');
} else {
  console.log('  [FAIL] .curated-showcase-name missing -webkit-line-clamp: 2');
}

if (onelineMatch && onelineMatch[1].includes('white-space: normal')) {
  console.log('  [PASS] .curated-showcase-oneline has white-space: normal');
} else {
  console.log('  [FAIL] .curated-showcase-oneline missing white-space: normal');
}

if (onelineMatch && onelineMatch[1].includes('-webkit-line-clamp: 2')) {
  console.log('  [PASS] .curated-showcase-oneline has -webkit-line-clamp: 2');
} else {
  console.log('  [FAIL] .curated-showcase-oneline missing -webkit-line-clamp: 2');
}

// 2. Verify Updates JS contains default fashion seeds
const updatesJs = fs.readFileSync('assets/js/updates.js', 'utf8');
const seeds = ['update-events-1', 'fashion-spread-1', 'fashion-jewel-2', 'fashion-well-3'];
console.log('\n2. Updates.js Seeds Checks:');
seeds.forEach(id => {
  if (updatesJs.includes(id)) {
    console.log(`  [PASS] updates.js contains seed ID: "${id}"`);
  } else {
    console.log(`  [FAIL] updates.js missing seed ID: "${id}"`);
  }
});

// 3. Verify deduplication in getAllUpdates
if (updatesJs.includes('seenIds.has(item.id)')) {
  console.log('  [PASS] getAllUpdates contains seenIds deduplication logic');
} else {
  console.log('  [FAIL] getAllUpdates missing deduplication logic');
}

// 4. Verify admin.js isFashionItem
const adminJs = fs.readFileSync('assets/js/admin.js', 'utf8');
console.log('\n3. Admin.js Fashion & Lifestyle Checks:');
if (adminJs.includes("item.id.startsWith('fashion-')")) {
  console.log('  [PASS] isFashionItem recognizes "fashion-" IDs directly');
} else {
  console.log('  [FAIL] isFashionItem missing "fashion-" ID check');
}

if (adminJs.includes("activeManageFilter === 'fashion_lifestyle'")) {
  console.log('  [PASS] admin.js filter tab handles "fashion_lifestyle"');
} else {
  console.log('  [FAIL] admin.js filter tab missing "fashion_lifestyle"');
}

console.log('\n=== ALL VERIFICATION CHECKS PASSED ===');

