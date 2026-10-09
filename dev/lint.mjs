import fs from 'fs';
import path from 'path';

console.log('--- Running CreatorOS AI Linting & Security Checks ---');

const bannedPatterns = [
  /sk-proj-[A-Za-z0-9_-]{30,}/,
  /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]{30,}\.[A-Za-z0-9_-]{20,}/, // JWT service role keys
  /ghp_[A-Za-z0-9]{30,}/
];

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.git' || e.name === 'vendor' || e.name === '.next' || e.name === '.env.local') continue;
    const fullPath = path.join(dir, e.name);
    if (e.isDirectory()) {
      scanDir(fullPath);
    } else if (/\.(js|mjs|ts|json|html|md)$/.test(e.name)) {
      // Exclude transcripts, build outputs or test files
      if (fullPath.includes('.system_generated') || fullPath.includes('dist') || fullPath.includes('build')) continue;
      const content = fs.readFileSync(fullPath, 'utf8');

      for (const pattern of bannedPatterns) {
        if (pattern.test(content)) {
          // Check if it's .env.example (which only has placeholders)
          if (e.name === '.env.example') continue;
          console.error(`✗ Security violation in ${fullPath}: Hardcoded secret or private credential detected.`);
          process.exit(1);
        }
      }
    }
  }
}

// 1. Scan root and subdirectories
scanDir(path.resolve('.'));
console.log('✓ Secret scanning passed: No private API keys or service role tokens committed in source files.');

// 2. Syntax validation
const checkFiles = [
  'functions/adapter.mjs',
  'functions/handler.mjs',
  'dev/build.mjs',
  'dev/marketplace.test.mjs',
  'dist/assets/js/supabase.js'
];

for (const f of checkFiles) {
  try {
    const fullPath = path.resolve(f);
    if (fs.existsSync(fullPath)) {
      if (f.endsWith('.mjs')) {
        await import(`file://${fullPath.replace(/\\/g, '/')}`);
      } else {
        new Function(fs.readFileSync(fullPath, 'utf8'));
      }
      console.log(`✓ Syntax check passed: ${f}`);
    }
  } catch (err) {
    console.error(`✗ Syntax error in ${f}:`, err.message);
    process.exit(1);
  }
}

console.log('--- Linting & Security Checks Passed Cleanly ---');
