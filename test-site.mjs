import { chromium } from 'playwright';

async function testDesktop() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 }
  });

  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  console.log('=== DESKTOP TEST ===');
  console.log('Page title:', await page.title());

  const sections = await page.$$eval('section, [id]', els => els.map(e => e.id || e.tagName));
  console.log('Sections/IDs found:', sections);

  const hasMotion = await page.evaluate(() => {
    return {
      rareBirdMotion: typeof window.rareBirdMotion !== 'undefined',
      motionOn: document.body.classList.contains('motion-on'),
      noMotion: document.body.classList.contains('no-motion'),
    };
  });
  console.log('Motion state:', hasMotion);

  const hasTweaksPanel = await page.$eval('[data-tweaks-panel]', () => true).catch(() => false);
  console.log('Tweaks panel present:', hasTweaksPanel);

  const html = await page.content();
  const expectedTerms = ['Rare Bird', 'mission', 'School', 'support', 'children', 'classroom', 'inclusion'];
  for (const term of expectedTerms) {
    const found = html.toLowerCase().includes(term.toLowerCase());
    console.log(`Contains "${term}":`, found);
  }

  console.log('Console errors:', errors);
  await page.screenshot({ path: '/tmp/rarebird-desktop.png', fullPage: true });
  console.log('Desktop screenshot saved to /tmp/rarebird-desktop.png');

  await browser.close();
}

async function testReducedMotion() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    reducedMotion: 'reduce',
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  console.log('\n=== REDUCED MOTION TEST ===');
  const motionState = await page.evaluate(() => {
    return {
      motionOn: document.body.classList.contains('motion-on'),
      noMotion: document.body.classList.contains('no-motion'),
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    };
  });
  console.log('Motion state:', motionState);

  console.log('Console errors:', errors);
  await page.screenshot({ path: '/tmp/rarebird-reduced-motion.png', fullPage: true });
  console.log('Reduced motion screenshot saved');

  await browser.close();
}

async function testMobile() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 375, height: 812 }
  });

  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  console.log('\n=== MOBILE TEST ===');
  const sections = await page.$$eval('section, [id]', els => els.map(e => e.id || e.tagName));
  console.log('Sections/IDs found:', sections);

  const hasMotion = await page.evaluate(() => {
    return {
      rareBirdMotion: typeof window.rareBirdMotion !== 'undefined',
      motionOn: document.body.classList.contains('motion-on'),
      noMotion: document.body.classList.contains('no-motion'),
    };
  });
  console.log('Motion state:', hasMotion);

  console.log('Console errors:', errors);
  await page.screenshot({ path: '/tmp/rarebird-mobile.png', fullPage: true });
  console.log('Mobile screenshot saved');

  await browser.close();
}

async function testEdgeCase() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 }
  });

  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  // Test with very small viewport
  await page.setViewportSize({ width: 200, height: 400 });
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('\n=== EDGE CASE (tiny viewport) ===');
  const sections = await page.$$eval('section, [id]', els => els.map(e => e.id || e.tagName));
  console.log('Sections/IDs found:', sections);
  console.log('Console errors:', errors);
  await page.screenshot({ path: '/tmp/rarebird-tiny.png', fullPage: true });
  console.log('Tiny viewport screenshot saved');

  await browser.close();
}

(async () => {
  await testDesktop();
  await testReducedMotion();
  await testMobile();
  await testEdgeCase();
})();
