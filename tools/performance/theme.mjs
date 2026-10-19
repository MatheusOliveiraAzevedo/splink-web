import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { serve, executablePath } from './server.mjs';

const output = process.argv[2] ?? '/tmp/splink-theme';
await mkdir(output, { recursive: true });
const server = await serve('dist/splink-web/browser');
const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-first-run', '--disable-extensions'] });
const results = [];
try {
  for (const width of [320, 390, 1440]) {
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    await page.setViewport({ width, height: 900 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('cookiePreferences', 'accepted');
      window.google = { maps: { importLibrary: async () => ({ Place: class {
        async fetchFields() {
          this.rating = 4.8; this.userRatingCount = 123;
          this.reviews = [{ rating: 5, text: 'Avaliação simulada para teste visual.', authorAttribution: { displayName: 'Teste' } }];
        }
      } }) } };
    });
    await page.setRequestInterception(true);
    page.on('request', request => request.url().startsWith(server.url) || request.url().startsWith('data:') ? request.continue() : request.abort());
    await page.goto(server.url, { waitUntil: 'networkidle0' });
    assert.equal(await page.$eval('html', el => el.dataset.bsTheme), 'light');
    await page.focus('.theme-toggle');
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => localStorage.getItem('splink-theme')), 'dark');
    await page.reload({ waitUntil: 'networkidle0' });
    assert.equal(await page.$eval('html', el => el.dataset.bsTheme), 'dark');
    assert.equal(await page.$eval('.theme-toggle', el => el.getAttribute('aria-label')), 'Ativar modo claro');
    for (const selector of ['.hero', '#plans', '#coverage', '#whoWeAre', '#reviews', '#workUs', 'app-footer']) {
      await page.$eval(selector, el => el.scrollIntoView({ behavior: 'instant' }));
      if (selector === '#reviews') await page.waitForSelector('app-google-reviews .location');
      if (selector === '#workUs') await page.waitForSelector('app-work-with-us .work-form');
      await page.evaluate(() => document.fonts.ready);
      await (await page.$(selector)).screenshot({ path: `${output}/dark-${width}-${selector.replace(/[^a-zA-Z]/g, '')}.png` });
    }
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Horizontal overflow');
    const colors = await page.evaluate(() => Object.fromEntries([
      'body', '.plan-card--highlight', '.plan-card--highlight .plan-price__value',
      '.plan-speeds dd', '.coverage-form', '.coverage-form h3', '.form-control',
      '.hero__rating-card', '.hero__rating-score strong', '.hero__rating-link',
      'app-google-reviews h2', 'app-google-reviews .location', 'app-work-with-us .work-form',
    ].map(selector => {
      const css = getComputedStyle(document.querySelector(selector));
      return [selector, { color: css.color, background: css.backgroundColor }];
    })));
    for (const selector of ['.plan-card--highlight .plan-price__value', '.plan-speeds dd', '.coverage-form h3', '.hero__rating-score strong', 'app-google-reviews h2']) {
      assert.equal(colors[selector].color, 'rgb(162, 223, 117)', `Dark-theme contrast regression: ${selector}`);
    }
    assert.equal(colors['.hero__rating-link'].color, 'rgb(254, 254, 254)');
    if (width < 992) {
      await page.evaluate(() => window.scrollTo({ top: 300, behavior: 'instant' }));
      await page.click('.navbar-toggler');
      await page.waitForSelector('.offcanvas.show');
      await page.screenshot({ path: `${output}/dark-${width}-menu.png` });
      await page.click('.offcanvas .btn-close');
    }
    await page.goto(server.url + '/politica-de-privacidade', { waitUntil: 'networkidle0' });
    assert.equal(await page.$eval('html', el => el.dataset.bsTheme), 'dark');
    await page.click('.theme-toggle');
    await page.reload({ waitUntil: 'networkidle0' });
    assert.equal(await page.$eval('html', el => el.dataset.bsTheme), 'light');
    results.push({ width, passed: true, colors });
    console.log(JSON.stringify(results.at(-1)));
    await context.close();
  }
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    Storage.prototype.getItem = () => { throw new Error('Storage blocked'); };
    Storage.prototype.setItem = () => { throw new Error('Storage blocked'); };
  });
  await page.setRequestInterception(true);
  page.on('request', request => request.url().startsWith(server.url) ? request.continue() : request.abort());
  await page.goto(server.url + '/politica-de-privacidade', { waitUntil: 'networkidle0' });
  // Exercise the handler even when the existing cookie dialog is on top.
  await page.$eval('.theme-toggle', el => el.click());
  assert.equal(await page.$eval('html', el => el.dataset.bsTheme), 'dark');
  results.push({ storageBlocked: true, passed: true });
  await writeFile(`${output}/checks.json`, JSON.stringify(results, null, 2));
} finally { await browser.close(); await server.close(); }
