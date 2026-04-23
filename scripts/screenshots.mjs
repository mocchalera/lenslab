import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

const HOST = '127.0.0.1';
const PORT = 5173;
const BASE_URL = `http://${HOST}:${PORT}`;
const OUTPUT_DIR = path.resolve('docs/screenshots');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForServer = async () => {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(BASE_URL);
      if (response.ok) return;
    } catch {
      // Server is not ready yet.
    }

    await sleep(250);
  }

  throw new Error(`Timed out waiting for ${BASE_URL}`);
};

const startVite = () => {
  const child = spawn(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['vite', '--host', HOST, '--port', String(PORT)],
    {
      stdio: 'inherit',
      env: {
        ...process.env,
        BROWSER: 'none',
      },
    },
  );

  return child;
};

const screenshot = async (target, fileName) => {
  await target.screenshot({
    path: path.join(OUTPUT_DIR, fileName),
    animations: 'disabled',
  });
};

const main = async () => {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const server = startVite();
  let browser;

  try {
    await waitForServer();

    browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      deviceScaleFactor: 1,
      locale: 'en-US',
    });

    await context.route('**/api/geocode**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: [
            {
              displayName: 'Tokyo Station, Marunouchi, Chiyoda, Tokyo, Japan',
              lat: 35.681236,
              lng: 139.767125,
              boundingbox: ['35.67', '35.69', '139.75', '139.78'],
            },
          ],
          cached: true,
        }),
      });
    });

    const page = await context.newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => window.localStorage.setItem('lenslab.language', 'en'));
    await page.reload({ waitUntil: 'networkidle' });

    await screenshot(page, '01-landing.png');

    const controlPanel = page.locator('.w-80.flex-shrink-0.z-20').first();
    await screenshot(controlPanel, '02-controls.png');

    await page.getByRole('tab', { name: 'Street' }).scrollIntoViewIfNeeded();
    await page.getByRole('tab', { name: 'Street' }).click();
    await page.getByRole('radiogroup', { name: 'Choose wardrobe' }).scrollIntoViewIfNeeded();
    await screenshot(controlPanel, '03-wardrobe-tabs.png');

    await page.getByRole('button', { name: 'Or choose from map' }).click();
    await page.getByPlaceholder('Example: Ginza, Omachi, Paris').fill('Tokyo Station');
    await page.getByRole('button', { name: 'Search' }).click();
    await page.getByText('Tokyo Station, Marunouchi').click();
    await page.locator('.leaflet-container').waitFor({ state: 'visible' });
    await page.waitForTimeout(1000);
    await screenshot(page.getByRole('dialog', { name: 'Choose a location from the map' }), '04-map-picker.png');
  } finally {
    if (browser) await browser.close();
    server.kill('SIGTERM');
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
