import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 800 }
});

await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

// Screenshot at different scroll positions
const scrollPoints = [0, 800, 1600, 2400, 3200, 4000, 4800, 5600];
for (let i = 0; i < scrollPoints.length; i++) {
  const y = scrollPoints[i];
  await page.evaluate(y => window.scrollTo(0, y), y);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `/tmp/rarebird-y${y}.png`, fullPage: false });
  console.log(`Screenshot at Y=${y} saved`);
}

await browser.close();
