// Real Places smoke test: two configured locations, no marketing requests or submissions.
import puppeteer from 'puppeteer-core';
import { executablePath } from './server.mjs';
const target = new URL(process.argv[2] ?? 'http://localhost:4200/');
const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-first-run', '--disable-extensions'] });
try {
  const page = await browser.newPage();
  const errors = [];
  const apiFailures = [];
  const diagnostics = [];
  page.on('response', response => {
    const url = new URL(response.url());
    if (!url.hostname.endsWith('googleapis.com') || response.status() < 400) return;
    diagnostics.push((async () => {
      const body = await response.text().catch(() => '');
      apiFailures.push({ endpoint: url.hostname + url.pathname, status: response.status(), body: body.replace(/AIza[\w-]+/g, '[REDACTED]').slice(0, 6000) });
    })());
  });
  page.on('pageerror', error => errors.push(error.message.replace(/AIza[\w-]+/g, '[REDACTED]')));
  page.on('requestfailed', request => { const url = new URL(request.url()); if (url.hostname.endsWith('googleapis.com') || url.hostname === 'maps.gstatic.com') errors.push(url.hostname + url.pathname + ': ' + request.failure()?.errorText); });
  page.on('console', message => {
    const text = message.text();
    const code = text.match(/(?:Google Maps JavaScript API (?:error|warning):\s*)([A-Za-z]+)/)?.[1];
    if (code) errors.push(code);
    else if (message.type() === 'error' || message.type() === 'warn') {
      errors.push(text.replace(/AIza[\w-]+/g, '[REDACTED]').slice(0, 500));
    }
  });
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('cookiePreferences', 'accepted');
    let ready;
    Object.defineProperty(window, 'splinkPlacesReady', {
      configurable: true,
      get: () => ready,
      set: callback => { ready = () => {
        const original = window.google.maps.importLibrary;
        window.google.maps.importLibrary = async function(...args) {
          try {
            const library = await original.apply(this, args);
            if (args[0] === 'places') {
              const fetchFields = library.Place.prototype.fetchFields;
              library.Place.prototype.fetchFields = async function(...fields) {
                try { return await fetchFields.apply(this, fields); }
                catch (error) { console.error(String(error)); throw error; }
              };
            }
            return library;
          } catch (error) { console.error(String(error)); throw error; }
        };
        callback();
      }; }
    });
  });
  await page.setRequestInterception(true);
  page.on('request', request => {
    const url = new URL(request.url());
    const allowed = url.origin === target.origin || request.url().startsWith('data:') ||
      ['maps.googleapis.com', 'places.googleapis.com', 'maps.gstatic.com', 'lh3.googleusercontent.com'].includes(url.hostname);
    return allowed ? request.continue() : request.abort();
  });
  await page.goto(target.href, { waitUntil: 'domcontentloaded' });
  await page.$eval('#reviews', el => el.scrollIntoView({ behavior: 'instant' }));
  await page.waitForSelector('app-google-reviews');
  await page.waitForFunction(() => {
    const cards = [...document.querySelectorAll('app-google-reviews article')];
    return cards.length === 2 && cards.every(card => card.getAttribute('aria-busy') === 'false');
  }, { timeout: 45000 });
  const locations = await page.$$eval('app-google-reviews article', cards => cards.map(card => ({
    unit: card.querySelector('h3')?.textContent,
    rating: card.querySelector('.rating-value')?.textContent ?? null,
    count: card.querySelector('.review-count')?.textContent ?? null,
    reviewsDisplayed: card.querySelectorAll('.review').length,
    unavailable: card.textContent.includes('Não foi possível'),
  })));
  // The SDK's RPC can hide the reason behind a generic PERMISSION_DENIED.
  // Opt in to one IDs-only REST request from the same browser/referrer to get
  // Google's structured error details, without fetching or storing reviews.
  let permissionDiagnostic;
  if (process.argv.includes('--diagnose') && locations.some(location => location.unavailable)) {
    permissionDiagnostic = await page.evaluate(async () => {
      try {
        const configResponse = await fetch('/google-places.json', { cache: 'no-store', signal: AbortSignal.timeout(10000) });
        if (!configResponse.ok) return { configurationStatus: configResponse.status };
        const config = await configResponse.json();
        const placeId = config.placeIds?.tramandai;
        if (!config.apiKey || !placeId) return { error: 'Missing API key or Place ID' };
        const endpoint = new URL(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`);
        endpoint.searchParams.set('fields', 'id');
        endpoint.searchParams.set('key', config.apiKey);
        const response = await fetch(endpoint, { signal: AbortSignal.timeout(15000) });
        return { status: response.status, body: (await response.text()).replace(/AIza[\w-]+/g, '[REDACTED]').slice(0, 6000) };
      } catch (error) { return { error: String(error).replace(/AIza[\w-]+/g, '[REDACTED]') }; }
    });
  }
  await Promise.all(diagnostics);
  console.log(JSON.stringify({ origin: target.origin, locations, permissionDiagnostic, apiFailures, errors: [...new Set(errors)] }, null, 2));
} finally { await browser.close(); }
