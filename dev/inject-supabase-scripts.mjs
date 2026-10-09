import fs from 'fs';
import path from 'path';

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

for (const p of pages) {
  const filePath = path.resolve('dist', p);
  let html = fs.readFileSync(filePath, 'utf8');

  // Check if supabase scripts are present
  if (!html.includes('assets/js/vendor/supabase.js')) {
    html = html.replace(
      '<script src="assets/js/data.js"></script>',
      '<script src="assets/js/vendor/supabase.js"></script>\n<script src="assets/js/supabase.js"></script>\n<script src="assets/js/data.js"></script>'
    );
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✓ Injected Supabase scripts into ${p}`);
  } else {
    console.log(`- Supabase scripts already in ${p}`);
  }
}
