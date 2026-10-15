import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { serve, executablePath } from './server.mjs';

const [directory, output] = process.argv.slice(2);
if (!directory || !output) throw new Error('Usage: google-reviews.mjs BUILD OUTPUT');
await mkdir(output, { recursive: true });
const server = await serve(directory);
const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-first-run', '--disable-extensions'] });
const results = [];
try {
  for (const scenario of ['unconfigured', 'success', 'empty', 'partial-error', 'sdk-error']) {
    for (const width of scenario === 'success' || scenario === 'unconfigured' ? [320, 390, 1440] : [390]) {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      const requests = [], errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
      await page.evaluateOnNewDocument(() => localStorage.setItem('cookiePreferences', 'accepted'));
      await page.setRequestInterception(true);
      page.on('request', request => {
        requests.push(request.url());
        if (request.url() === `${server.url}/google-places.json`) {
          const config = scenario === 'unconfigured' ? { apiKey: '', placeIds: {} }
            : { apiKey: 'TEST_ONLY_NOT_A_REAL_KEY', placeIds: { tramandai: 'test-tramandai', imbe: 'test-imbe' } };
          return request.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(config) });
        }
        if (request.url().startsWith('https://maps.googleapis.com/maps/api/js?')) {
          if (scenario === 'sdk-error') return request.abort();
          return request.respond({ status: 200, contentType: 'text/javascript', body: `
            window.__placesCalls = [];
            window.google = { maps: { importLibrary: async () => ({ Place: class {
              constructor(options) { this.id = options.id; }
              async fetchFields(options) {
                window.__placesCalls.push({ id: this.id, fields: options.fields });
                if (${JSON.stringify(scenario)} === 'partial-error' && this.id === 'test-imbe') throw new Error('Simulated rejection');
                const city = this.id === 'test-imbe' ? 'Imbé' : 'Tramandaí';
                this.rating = this.id === 'test-imbe' ? 4.2 : 4.7;
                this.userRatingCount = this.id === 'test-imbe' ? 22 : 120;
                this.googleMapsURI = 'https://www.google.com/maps?place=' + this.id;
                this.attributions = [{ provider: 'Provedor de teste', providerURI: 'https://example.com/provider' }];
                this.reviews = ${JSON.stringify(scenario)} === 'empty' ? [] : [{
                  rating: 3, text: 'Texto traduzido de teste', originalText: '<img src=x onerror=alert(1)> Avaliação SIMULADA de ' + city,
                  publishTime: new Date('2026-10-01T12:00:00Z'),
                  googleMapsURI: 'https://www.google.com/maps/reviews?review=' + this.id,
                  authorAttribution: { displayName: 'Autor de teste ' + city, uri: 'https://www.google.com/maps/contrib/test' }
                }];
              }
            } }) } };
            window.splinkPlacesReady();
          ` });
        }
        if (request.url().startsWith(server.url) || request.url().startsWith('data:')) return request.continue();
        return request.abort();
      });
      await page.goto(server.url, { waitUntil: 'networkidle0' });
      assert(!await page.$('app-google-reviews'), 'Detailed review section loaded before scrolling');
      await page.$eval('#reviews', el => el.scrollIntoView());
      await page.waitForSelector('app-google-reviews');
      await page.waitForFunction(() => [...document.querySelectorAll('app-google-reviews article')].length === 2 && [...document.querySelectorAll('app-google-reviews article')].every(el => el.getAttribute('aria-busy') === 'false'));
      await page.evaluate(() => document.fonts.ready);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Horizontal overflow');
      assert.equal(await page.$$eval('.all-reviews', els => els.length), 2);
      const content = await page.$eval('app-google-reviews', el => el.textContent);
      if (scenario === 'unconfigured') {
        assert(!requests.some(url => url.includes('maps.googleapis.com/maps/api/js')), 'SDK requested without config');
        assert.equal(await page.$$eval('.rating-value', els => els.length), 0, 'Invented ratings');
      } else if (scenario === 'sdk-error') {
        assert(content.includes('Não foi possível carregar'));
      } else {
        assert.equal(requests.filter(url => url.includes('maps.googleapis.com/maps/api/js')).length, 1, 'Duplicate SDK');
        assert.equal((await page.evaluate(() => window.__placesCalls)).filter(call => call.fields.includes('reviews')).length, 2);
        if (scenario === 'empty') assert(content.includes('Nenhum comentário disponível'));
        else {
          assert(content.includes('Avaliação SIMULADA de Tramandaí'));
          assert(!await page.$('.review-text img'), 'Unescaped review HTML');
          assert(content.includes('4,7'));
          assert(content.includes('relevância pelo Google'));
          await page.$eval('.google-attribution', el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
          await page.waitForFunction(() => { const img = document.querySelector('.google-attribution'); return img.complete && img.naturalWidth > 0; });
          assert.equal(await page.$eval('.review-source', el => el.href), 'https://www.google.com/maps/reviews?review=test-tramandai');
          if (scenario === 'partial-error') assert(content.includes('Não foi possível carregar'));
          else { assert(content.includes('Avaliação SIMULADA de Imbé')); assert(content.includes('4,2')); }
        }
      }
      assert.deepEqual(errors, []);
      await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
      await (await page.$('app-google-reviews')).screenshot({ path: resolve(output, `${scenario}-${width}.png`) });
      results.push({ scenario, width, passed: true, simulated: true });
      await writeFile(resolve(output, 'checks.json'), JSON.stringify(results, null, 2));
      console.log(JSON.stringify(results.at(-1)));
      await context.close();
    }
  }
} finally { await browser.close(); await server.close(); }
