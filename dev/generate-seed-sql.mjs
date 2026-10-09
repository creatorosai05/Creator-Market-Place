import fs from 'fs';
import path from 'path';

// Read data.js and extract DB object
const dataJsPath = path.resolve('dist/assets/css/../js/data.js');
const content = fs.readFileSync(dataJsPath, 'utf8');

// Evaluate DB in a sandbox
const sandbox = {};
const fn = new Function('sandbox', `${content}; sandbox.DB = DB;`);
fn(sandbox);
const { DB } = sandbox;

function esc(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function jsonEsc(obj) {
  if (obj === null || obj === undefined) return "'{}'::jsonb";
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
}

function arrEsc(arr) {
  if (!Array.isArray(arr) || !arr.length) return "'{}'::text[]";
  const items = arr.map((x) => `"${String(x).replace(/"/g, '\\"')}"`).join(',');
  return `'{${items}}'::text[]`;
}

let sql = `-- CreatorOS AI — Seed Data for Creator Marketplace
-- Apply after 20261009_init.sql

BEGIN;

`;

// Generate dummy UUIDs for each creator: c01 -> 00000000-0000-0000-0000-000000000001, etc.
const creatorUuidMap = {};
DB.CREATORS.forEach((c, idx) => {
  const hex = (idx + 1).toString(16).padStart(12, '0');
  const uuid = `00000000-0000-0000-0000-${hex}`;
  creatorUuidMap[c.id] = uuid;

  sql += `INSERT INTO public.profiles (
    id, role, name, handle, title, bio, location, categories, tools, languages, niches,
    verified, verification_status, quality_score, rating, reviews_count, completed_orders, response_mins, ontime_rate
  ) VALUES (
    '${uuid}', 'creator', ${esc(c.name)}, ${esc(c.handle)}, ${esc(c.title)}, ${esc(c.bio)}, ${esc(c.location)},
    ${arrEsc(c.categories)}, ${arrEsc(c.tools)}, ${arrEsc(c.languages)}, ${arrEsc(c.niches)},
    ${c.verified ? 'true' : 'false'}, ${c.verified ? "'verified'" : "'unverified'"}, 92, ${c.rating || 4.9},
    ${c.reviews || 10}, ${c.completedOrders || 20}, ${c.responseMins || 20}, ${c.onTimeRate || 0.98}
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, handle = EXCLUDED.handle, title = EXCLUDED.title, bio = EXCLUDED.bio;
\n`;

  // Insert portfolio items
  if (Array.isArray(c.portfolio)) {
    c.portfolio.forEach((p) => {
      sql += `INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '${uuid}', ${esc(p.title)}, ${esc(p.kind || 'Portfolio Item')}, ${esc(p.metric || 'Commercial')},
        'Full commercial license included', ${arrEsc(c.tools.slice(0, 3))}, true
      );\n`;
    });
  }
});

// Insert Gigs
DB.GIGS.forEach((g) => {
  const creatorUuid = creatorUuidMap[g.creatorId] || '00000000-0000-0000-0000-000000000001';
  sql += `INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    ${esc(g.id)}, '${creatorUuid}', ${esc(g.title)}, ${esc(g.category)}, ${esc(g.title)},
    ${arrEsc(g.tools || [])}, ${jsonEsc(g.packages || {})}, ${g.views || 100}, ${g.orders || 15},
    ${g.queue || 1}, ${g.rating || 4.9}, ${g.trending ? 'true' : 'false'}, true
  ) ON CONFLICT (id) DO NOTHING;\n`;
});

// Insert Seed Briefs
DB.SEED_BRIEFS.forEach((b) => {
  sql += `INSERT INTO public.briefs (
    id, title, brand, category, language, quantity, deadline_days, budget_min, budget_max,
    description, deliverables, signals, status
  ) VALUES (
    ${esc(b.id)}, ${esc(b.title)}, ${esc(b.brand || 'Acme Brand')}, ${esc(b.category)}, ${esc(b.language || 'english')},
    ${b.quantity || 1}, ${b.deadlineDays || 14}, ${b.budgetMin || 10000}, ${b.budgetMax || 30000},
    ${esc(b.description || b.summary)}, ${jsonEsc(b.deliverables || [])},
    ${jsonEsc({ tools: b.tools || [], niches: b.niches || [] })}, 'open'
  ) ON CONFLICT (id) DO NOTHING;\n`;
});

sql += `\nCOMMIT;\n`;

fs.writeFileSync('supabase/seed.sql', sql, 'utf8');
console.log('Successfully generated supabase/seed.sql with', DB.CREATORS.length, 'creators,', DB.GIGS.length, 'gigs, and', DB.SEED_BRIEFS.length, 'briefs.');
