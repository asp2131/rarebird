const { chromium } = require('playwright');

(async () => {
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

  const title = await page.title();
  console.log('Page title:', title);

  // Check all sections exist
  const sections = await page.$$eval('section, [id]', els => els.map(e => e.id || e.tagName));
  console.log('Sections found:', sections);

  // Check for GSAP
  const hasGSAP = await page.evaluate(() => typeof window.gsap !== 'undefined');
  console.log('GSAP loaded:', hasGSAP);

  // Check for motion toggle
  const motionToggle = await page.evaluate(() => {
    return typeof window.rareBirdMotion !== 'undefined' ? 'present' : 'missing';
  });
  console.log('Motion toggle:', motionToggle);

  // Check for reduced motion support
  const reducedMotion = await page.evaluate(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  console.log('Prefers reduced motion (current):', reducedMotion);

  // Check no tweaks panel
  const hasTweaksPanel = await page.$eval('[data-tweaks-panel]', () => true).catch(() => false);
  console.log('Tweaks panel present:', hasTweaksPanel);

  // Check no React-specific classes
  const html = await page.content();
  console.log('Has React root:', html.includes('__REACT__'));
  console.log('Has tweaks panel import:', html.includes('tweaks-panel'));

  // Console errors
  console.log('Console errors:', errors);

  // Take screenshot
  await page.screenshot({ path: '/tmp/rarebird-desktop.png', fullPage: true });
  console.log('Screenshot saved to /tmp/rarebird-desktop.png');

  await browser.close();
})();
