// Regression check for the retired Places integration. No real Google requests.
import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { serve, executablePath } from './server.mjs';

const directory = process.argv[2] ?? 'dist/splink-web/browser';
const output = process.argv[3] ?? '/tmp/splink-no-places';
await mkdir(output, { recursive: true });
const server = await serve(directory);
const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-first-run', '--disable-extensions'] });
const results = [];
try {
  for (const width of [320, 390, 768, 1440]) {
    const page = await browser.newPage();
    const placesRequests = [];
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewport({ width, height: 900 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.evaluateOnNewDocument(() => localStorage.setItem('cookiePreferences', 'accepted'));
    await page.setRequestInterception(true);
    page.on('request', request => {
      const url = new URL(request.url());
      if (url.pathname === '/google-places.json' || url.hostname === 'places.googleapis.com' ||
          (url.hostname === 'maps.googleapis.com' && url.pathname.startsWith('/maps/api/js'))) {
        placesRequests.push(url.hostname + url.pathname);
      }
      return url.origin === server.url || url.protocol === 'data:' ? request.continue() : request.abort();
    });
    await page.goto(server.url, { waitUntil: 'networkidle0' });
    for (const selector of ['#whoWeAre', '#workUs', 'app-footer', '.hero']) {
      await page.$eval(selector, element => element.scrollIntoView({ behavior: 'instant' }));
      if (selector === '#workUs') await page.waitForSelector('app-work-with-us .work-form');
    }
    assert.equal(await page.$('app-google-reviews'), null, 'Retired review component rendered');
    assert.equal(await page.$('#reviews'), null, 'Stale review anchor remains');
    assert.equal(await page.$('.hero__ratings'), null, 'Live rating cards remain');
    assert.equal(await page.$('a[href="#reviews"]'), null, 'Link points to the removed section');
    assert.equal(await page.$$eval('link[rel="preconnect"]', links => links.filter(link =>
      /maps\.googleapis|places\.googleapis|maps\.gstatic/.test(link.href)).length), 0);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Horizontal overflow');
    const schemas = await page.$$eval('script[type="application/ld+json"]', scripts => scripts.map(script => JSON.parse(script.textContent)));
    assert(!JSON.stringify(schemas).includes('aggregateRating'), 'Unconfirmed legacy ratings remain in schema');
    assert.deepEqual(placesRequests, [], 'Places requested despite removal');
    assert.deepEqual(errors, []);
    results.push({ width, placesRequests: 0, reviewComponentRemoved: true, passed: true });
    console.log(JSON.stringify(results.at(-1)));
    await page.close();
  }
  await writeFile(resolve(output, 'checks.json'), JSON.stringify(results, null, 2));
} finally { await browser.close(); await server.close(); }
