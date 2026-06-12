import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 800 }
});

await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

// Check if elements are visible at different scroll positions
const scrollPoints = [0, 500, 1000, 2000, 3000, 4000, 5000, 6000];
for (const y of scrollPoints) {
  await page.evaluate(y => window.scrollTo(0, y), y);
  await page.waitForTimeout(500);
  const visibleText = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const mission = document.querySelector('.mission-statement');
    const program = document.querySelector('.program h2');
    const schools = document.querySelector('.schools h2');
    const story = document.querySelector('.story h2');
    const contact = document.querySelector('.contact h2');
    return {
      h1: h1?.textContent?.slice(0, 30),
      mission: mission?.textContent?.slice(0, 30),
      program: program?.textContent?.slice(0, 30),
      schools: schools?.textContent?.slice(0, 30),
      story: story?.textContent?.slice(0, 30),
      contact: contact?.textContent?.slice(0, 30),
    };
  });
  console.log(`Scroll Y=${y}:`, visibleText);
}

// Check the actual computed styles of key sections
const styles = await page.evaluate(() => {
  const getStyle = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const s = window.getComputedStyle(el);
    return {
      display: s.display,
      opacity: s.opacity,
      visibility: s.visibility,
      transform: s.transform,
      height: s.height,
      top: s.top,
      position: s.position,
    };
  };
  return {
    hero: getStyle('.hero'),
    mission: getStyle('.mission'),
    program: getStyle('.program'),
    schools: getStyle('.schools'),
    story: getStyle('.story'),
    contact: getStyle('.contact'),
    footer: getStyle('.site-footer'),
    smoothContent: getStyle('#smooth-content'),
    smoothWrapper: getStyle('#smooth-wrapper'),
  };
});
console.log('\nComputed styles:', JSON.stringify(styles, null, 2));

await page.screenshot({ path: '/tmp/rarebird-scrolled.png', fullPage: false });
console.log('Viewport screenshot saved');

await browser.close();
