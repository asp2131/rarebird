import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 375, height: 812 }
});

await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

// Screenshot at different mobile scroll positions
const scrollPoints = [0, 1000, 2500, 4000, 5500, 7000];
for (const y of scrollPoints) {
  await page.evaluate(y => window.scrollTo(0, y), y);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `/tmp/rarebird-mobile-y${y}.png`, fullPage: false });
  console.log(`Mobile screenshot at Y=${y} saved`);
}

await browser.close();
