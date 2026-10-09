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

// 3. Inject the project's public Supabase configuration at build time.
// These are public client credentials; never place a service-role/secret key here.
let supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
let supabasePublishableKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

if (!supabaseUrl || !supabasePublishableKey) {
  const envPaths = ['.env.local', 'creatoros-ai/.env.local', 'growthos-market/.env.local'];
  for (const ep of envPaths) {
    if (fs.existsSync(ep)) {
      const envContent = fs.readFileSync(ep, 'utf8');
      const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
      const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
      if (urlMatch && !supabaseUrl) supabaseUrl = urlMatch[1].trim();
      if (keyMatch && !supabasePublishableKey) supabasePublishableKey = keyMatch[1].trim();
    }
  }
}

if (!supabaseUrl) supabaseUrl = 'https://rkmyzxkabtambnghtmux.supabase.co';
const appSupabasePath = path.resolve('dist/assets/js/supabase.js');
let appSupabaseSource = fs.readFileSync(appSupabasePath, 'utf8');
if (appSupabaseSource.includes('"__SUPABASE_URL__"') || appSupabaseSource.includes('"__SUPABASE_PUBLISHABLE_KEY__"')) {
  appSupabaseSource = appSupabaseSource
    .replace('"__SUPABASE_URL__"', JSON.stringify(supabaseUrl))
    .replace('"__SUPABASE_PUBLISHABLE_KEY__"', JSON.stringify(supabasePublishableKey));
  fs.writeFileSync(appSupabasePath, appSupabaseSource);
  console.log('✓ Injected Supabase project URL and publishable key for this deployment');
} else {
  console.log('✓ Supabase configuration already configured in dist/assets/js/supabase.js');
}

// 4. Verify all HTML pages exist in dist
const pages = [
  'index.html',
  'creators.html',
  'creator.html',
  'creator-dashboard.html',
  'brief.html',
  'dashboard.html',
  'gig.html',
  'insights.html',
  'creator-profile.html',
  'brand-profile.html',
  'profile.html',
  'login.html',
  'signup.html'
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
