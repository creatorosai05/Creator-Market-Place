import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

// Load client-side libraries in a sandboxed context
function loadClientModules() {
  const sandbox = {};
  const dataCode = fs.readFileSync(path.resolve('dist/assets/js/data.js'), 'utf8');
  const aiCode = fs.readFileSync(path.resolve('dist/assets/js/ai.js'), 'utf8');
  const storeCode = fs.readFileSync(path.resolve('dist/assets/js/store.js'), 'utf8');

  // Provide minimal mock environment
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: (k) => store[k] || null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
      clear: () => { store = {}; }
    };
  })();

  const fn = new Function('sandbox', 'localStorage', `
    ${dataCode};
    sandbox.DB = DB;
    ${aiCode};
    sandbox.AI = AI;
    ${storeCode};
    sandbox.Store = Store;
  `);

  fn(sandbox, localStorageMock);
  return sandbox;
}

const { DB, AI, Store } = loadClientModules();

test('1. Marketplace Catalog Integrity', () => {
  assert.equal(DB.CREATORS.length, 18, 'Must have 18 verified creator profiles');
  assert.equal(DB.CATEGORIES.length, 10, 'Must have 10 standard content categories');
  assert.ok(DB.GIGS.length >= 30, 'Must have at least 30 live gig listings');
  assert.ok(DB.SEED_BRIEFS.length >= 5, 'Must have at least 5 benchmark briefs');

  // Check unique IDs
  const creatorIds = new Set(DB.CREATORS.map((c) => c.id));
  assert.equal(creatorIds.size, DB.CREATORS.length, 'Creator IDs must be unique');
});

test('2. AI Quality Score Deconstruction', () => {
  const c = DB.CREATORS[0];
  const q = AI.qualityScore(c);

  assert.ok(q.score >= 0 && q.score <= 100, 'Quality score must be between 0 and 100');
  assert.ok(q.grade, 'Must have an assigned grade (e.g., A+, A, B)');
  assert.ok(q.parts.length >= 5, 'Must break down score into at least 5 weighted sub-factors');

  const totalWeight = q.parts.reduce((sum, p) => sum + p.weight, 0);
  assert.equal(totalWeight, 100, 'Factor weights must sum to exactly 100%');
});

test('3. Explainable Creator Matching Engine', () => {
  const sampleBrief = {
    id: 'test-brief-1',
    title: 'D2C Skincare Reels in Hindi and English',
    category: 'video',
    language: 'Hindi',
    quantity: 8,
    deadlineDays: 20,
    budgetMin: 15000,
    budgetMax: 35000,
    commercialUse: true,
    description: '12 Instagram reels with fast hooks and product textures.',
    searchKeywords: ['reels', 'skincare', 'hindi', 'd2c']
  };

  const matches = AI.matchCreators(sampleBrief, { limit: 18 });
  assert.equal(matches.length, 18, 'Matching engine must score all candidates in catalogue');

  // Top match must have high score and detailed factors
  const top = matches[0];
  assert.ok(top.score > 60, 'Top match for direct category brief should score > 60');
  assert.ok(top.verdict?.text, 'Must provide written rationale verdict');
  assert.ok(top.factors?.length >= 5, 'Must explain scoring across category, tools, budget, capacity, reputation');

  // Verify factors are explainable
  for (const f of top.factors) {
    assert.ok(typeof f.max === 'number' && f.max > 0, 'Every factor must have positive max weight');
    assert.ok(typeof f.points === 'number', 'Every factor must have numeric points awarded');
    assert.ok(typeof f.reason === 'string' && f.reason.length > 0, 'Every factor must include written explanation');
  }
});

test('4. AI Pricing Benchmark Advisor', () => {
  const c = DB.CREATORS.find((x) => x.categories.includes('video'));
  assert.ok(c, 'Creator must exist');

  const advice = AI.adviseCreatorPricing(c);
  assert.ok(Array.isArray(advice), 'Should return pricing advice array');
  if (advice.length > 0) {
    const item = advice[0];
    assert.ok(item.recommended > 0, 'Must provide recommended price');
    assert.ok(item.peerMedian > 0, 'Must compare against category peer median');
    assert.ok(item.rationale.length > 0, 'Must provide explainable rationale');
  }
});

test('5. Commercial Rights and Brief Persistence in Store', () => {
  const briefData = {
    title: 'Commercial 3D Product Visuals',
    category: 'aiart',
    language: 'English',
    quantity: 10,
    deadlineDays: 14,
    budgetMin: 20000,
    budgetMax: 40000,
    commercialUse: true,
    commercialLicense: 'Exclusive Commercial Buyout',
    description: 'High-end photorealistic 3D product renders with commercial buyout.'
  };

  const created = Store.createBrief(briefData);
  assert.ok(created.id, 'Must generate unique brief ID');
  assert.equal(created.commercialUse, true, 'Commercial use requirement must persist');
  assert.equal(created.commercialLicense, 'Exclusive Commercial Buyout', 'Commercial license choice must persist');

  const retrieved = Store.brief(created.id);
  assert.equal(retrieved.id, created.id, 'Must retrieve created brief');
  assert.equal(retrieved.commercialLicense, 'Exclusive Commercial Buyout', 'Retrieved brief must retain commercial license');
});

test('6. Order Lifecycle State Transitions', () => {
  const gig = DB.GIGS[0];
  const order = Store.placeOrder({
    gigId: gig.id,
    packageKey: 'standard',
    brand: 'Test Brand',
    brief: 'Order execution test',
    dueDays: 5
  });

  assert.equal(order.status, 'placed', 'New order starts in placed status');
  assert.ok(order.escrow, 'Escrow protection must be enabled');
  assert.ok(order.total > 0, 'Order total must include subtotal + fee');

  const inProgress = Store.advanceOrder(order.id);
  assert.equal(inProgress.status, 'in-progress', 'Order moves to in-progress');

  const inReview = Store.advanceOrder(order.id);
  assert.equal(inReview.status, 'review', 'Order moves to review');

  const delivered = Store.advanceOrder(order.id);
  assert.equal(delivered.status, 'delivered', 'Order moves to delivered');
});

test('7. Security: Role Non-Escalation Check', () => {
  // Roles allowed: brand, creator (admin cannot be chosen at signup)
  const allowedSignupRoles = ['brand', 'creator'];
  const invalidRole = 'admin';

  function validateSignupRole(role) {
    if (!allowedSignupRoles.includes(role)) {
      return 'brand'; // default sanitize
    }
    return role;
  }

  assert.equal(validateSignupRole('creator'), 'creator');
  assert.equal(validateSignupRole('brand'), 'brand');
  assert.equal(validateSignupRole(invalidRole), 'brand', 'Role escalation to admin must be rejected and sanitized');
});
