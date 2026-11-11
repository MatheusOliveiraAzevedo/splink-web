import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { serve, executablePath } from './server.mjs';
const output = process.argv[2] ?? '/tmp/splink-hero-carousel';
await mkdir(output, { recursive: true });
const server = await serve('dist/splink-web/browser');
const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-first-run', '--disable-extensions'] });
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const results = [];
try {
  for (const width of [320, 390, 768, 1440]) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900, isMobile: width < 1000, hasTouch: width < 1000 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('cookiePreferences', 'accepted');

    });
    await page.setRequestInterception(true);
    page.on('request', r => {
      return r.url().startsWith(server.url) || r.url().startsWith('data:') ? r.continue() : r.abort();
    });
    await page.goto(server.url, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.hero__title');
    await page.evaluate(() => document.fonts.ready);
    const top = () => page.$eval('#plans', e => e.getBoundingClientRect().top + scrollY);
    const height = await top();
    assert(await page.$$eval('.hero__media', items => items.every(item => item.closest('.p-carousel-item') && item.closest('[data-slide]'))), 'Banner image is outside the slide');
    assert.equal(await page.$$eval('app-banner-principal .p-carousel-item:not(.p-carousel-item-clone) .hero__media img', images => images.length), 1);
    await page.waitForFunction(() => [...document.querySelectorAll('app-banner-principal .p-carousel-item-active .hero__media img')].some(img => img.complete && img.naturalWidth > 0));
    assert.equal(await page.$$eval('h1', e => e.length), 1);
    assert.equal(await page.$eval('.hero', e => Math.round(e.getBoundingClientRect().width)), width);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    assert.equal(await page.$('.hero__pause'), null, 'Single slide has a rotation control');
    assert.equal(await page.$('app-banner-principal .p-carousel-next-button'), null, 'Single slide has navigation');
    await pause(500);
    assert.equal(await top(), height, 'Banner shifted the page');
    await (await page.$('.hero')).screenshot({ path: `${output}/internet-${width}.png` });
    results.push({ width, fullWidth: true, stableHeight: true, reducedMotion: true, passed: true });
    console.log(JSON.stringify(results.at(-1)));
    await page.close();
  }
  await writeFile(`${output}/checks.json`, JSON.stringify(results, null, 2));
} finally { await browser.close(); await server.close(); }
