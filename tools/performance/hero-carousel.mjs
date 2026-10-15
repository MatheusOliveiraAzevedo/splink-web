import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { serve, executablePath } from './server.mjs';
const output = 'docs/performance/hero-carousel';
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
      window.google = { maps: { importLibrary: async () => ({ Place: class {
        constructor({ id }) { this.id = id; }
        async fetchFields({ fields }) {
          window.__fields = fields;
          this.rating = 4.8; this.userRatingCount = 123;
          this.googleMapsURI = 'https://www.google.com/maps'; this.attributions = [];
        }
      } }) } };
    });
    await page.setRequestInterception(true);
    page.on('request', r => {
      if (r.url() === `${server.url}/google-places.json`) return r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify({ apiKey: 'TEST', placeIds: { tramandai: 'test1', imbe: 'test2' } }) });
      return r.url().startsWith(server.url) || r.url().startsWith('data:') ? r.continue() : r.abort();
    });
    await page.goto(server.url, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.hero__rating-score');
    await page.evaluate(() => document.fonts.ready);
    const top = () => page.$eval('#plans', e => e.getBoundingClientRect().top + scrollY);
    const height = await top();
    assert(await page.$$eval('.hero__media', items => items.every(item => item.closest('.p-carousel-item') && item.closest('[data-slide]'))), 'Banner image is outside the slide');
    assert.equal(await page.$$eval('app-banner-principal .p-carousel-item:not(.p-carousel-item-clone) .hero__media img', images => images.length), 2);
    await page.waitForFunction(() => [...document.querySelectorAll('app-banner-principal .p-carousel-item-active .hero__media img')].some(img => img.complete && img.naturalWidth > 0));
    assert.equal(await page.$$eval('h1', e => e.length), 1);
    assert.equal(await page.$eval('.hero', e => Math.round(e.getBoundingClientRect().width)), width);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    assert.equal(await page.$eval('.hero__pause', e => e.getAttribute('aria-label')), 'Iniciar rotação automática');
    assert(!(await page.evaluate(() => window.__fields)).includes('reviews'), 'Banner requested full review payload');
    await (await page.$('.hero')).screenshot({ path: `${output}/reviews-${width}.png` });
    await page.click('app-banner-principal .p-carousel-indicator:nth-child(2) button');
    await page.waitForFunction(() => document.querySelector('.hero__reviews').inert);
    await pause(600);
    assert.equal(await top(), height, 'Rotation shifted the page');
    assert.equal(await page.$eval('.hero__reviews', e => e.inert), true);
    await (await page.$('.hero')).screenshot({ path: `${output}/internet-${width}.png` });
    await page.click('app-banner-principal .p-carousel-indicator:nth-child(1) button');
    await page.waitForFunction(() => !document.querySelector('.hero__reviews').inert);
    // Verify automatic rotation and explicit pause; no API/network work is real.
    if (width === 390) {
      await page.click('.hero__pause');
      await page.mouse.move(width - 1, 899);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForFunction(() => document.querySelector('app-banner-principal .p-carousel-indicator:nth-child(2) button').getAttribute('aria-current') === 'page', { timeout: 11000 });
      await page.click('.hero__pause');
      await page.waitForFunction(() => document.querySelector('.hero__pause').getAttribute('aria-label') === 'Iniciar rotação automática');
      assert.equal(await page.$eval('.hero__pause', e => e.getAttribute('aria-label')), 'Iniciar rotação automática');
      await pause(8300);
      assert.equal(await page.$eval('app-banner-principal .p-carousel-indicator:nth-child(2) button', e => e.getAttribute('aria-current')), 'page');
    }
    results.push({ width, fullWidth: true, stableHeight: true, reducedMotion: true, passed: true });
    console.log(JSON.stringify(results.at(-1)));
    await page.close();
  }
  await writeFile(`${output}/checks.json`, JSON.stringify(results, null, 2));
} finally { await browser.close(); await server.close(); }
