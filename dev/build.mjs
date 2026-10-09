import fs from 'fs';
import path from 'path';

console.log('--- Running CreatorOS AI Production Build ---');

// 1. Ensure vendor directory exists
const vendorDir = path.resolve('dist/assets/js/vendor');
if (!fs.existsSync(vendorDir)) {
  fs.mkdirSync(vendorDir, { recursive: true });
}

// 2. Copy official Supabase UMD library to vendor
const srcSupabase = path.resolve('node_modules/@supabase/supabase-js/dist/umd/supabase.js');
const destSupabase = path.join(vendorDir, 'supabase.js');
if (fs.existsSync(srcSupabase)) {
  fs.copyFileSync(srcSupabase, destSupabase);
  console.log('✓ Vendored official Supabase client to dist/assets/js/vendor/supabase.js');
} else {
  console.warn('! Supabase UMD source not found at:', srcSupabase);
}

// 3. Verify all HTML pages exist in dist
const pages = [
  'index.html',
  'creators.html',
  'creator.html',
  'creator-dashboard.html',
  'brief.html',
  'dashboard.html',
  'gig.html',
  'insights.html'
];

let allValid = true;
for (const p of pages) {
  const pPath = path.resolve('dist', p);
  if (fs.existsSync(pPath)) {
    const stat = fs.statSync(pPath);
    console.log(`✓ Verified page: ${p} (${(stat.size / 1024).toFixed(1)} KB)`);
  } else {
    console.error(`✗ Missing required page: ${p}`);
    allValid = false;
  }
}

if (!allValid) {
  console.error('Build verification failed.');
  process.exit(1);
}

console.log('--- Production Build Complete: All Assets Verified ---');
