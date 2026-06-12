import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 800 }
});

await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

// Scroll to contact section using scrollIntoView
await page.evaluate(() => {
  const el = document.querySelector('#contact');
  if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
});
await page.waitForTimeout(1000);

// Fill the form with force
await page.fill('#cf-name', 'Test User', { force: true });
await page.fill('#cf-email', 'test@example.com', { force: true });
await page.fill('#cf-school', 'Test School', { force: true });
await page.fill('#cf-message', 'This is a test message.', { force: true });

// Check if preventDefault works by submitting and checking URL
const initialUrl = page.url();
await page.click('button[type="submit"]', { force: true });
await page.waitForTimeout(500);
const finalUrl = page.url();

console.log('Initial URL:', initialUrl);
console.log('Final URL:', finalUrl);
console.log('Form prevented default:', initialUrl === finalUrl);

await page.screenshot({ path: '/tmp/rarebird-form.png', fullPage: false });
console.log('Form screenshot saved');

await browser.close();
