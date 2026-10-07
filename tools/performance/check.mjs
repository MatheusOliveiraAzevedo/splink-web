import puppeteer from 'puppeteer-core';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { serve, executablePath } from './server.mjs';
const [directory, output, label = 'after'] = process.argv.slice(2);
if (!directory || !output) throw new Error('Usage: node check.mjs BUILD_DIRECTORY OUTPUT_DIRECTORY LABEL');
await mkdir(output, { recursive: true });
await writeFile(resolve(output, `${label}-build.json`), JSON.stringify({ createdAt: new Date().toISOString(), indexSha256: createHash('sha256').update(await readFile(resolve(directory, 'index.html'))).digest('hex') }, null, 2));
const server = await serve(directory);
const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-first-run', '--disable-extensions'] });
const results = [];
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
try {
  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    const requests = [];
    const errors = [];
    const failures = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.url().startsWith(server.url) && r.status() >= 400) failures.push(r.url()); });
    await page.setViewport({ width, height: width < 1000 ? 844 : 900, deviceScaleFactor: width < 1000 ? 2 : 1, isMobile: width < 1000, hasTouch: width < 1000 });
    await page.setRequestInterception(true);
    page.on('request', r => {
      requests.push(r.url());
      if (r.url().includes('script.google.com/macros/')) return r.respond({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: '{"success":true}' });
      if (r.url().startsWith(server.url) || r.url().startsWith('data:')) return r.continue();
      return r.abort();
    });
    await page.evaluateOnNewDocument(() => {
      window.__opened = [];
      window.open = url => { window.__opened.push(String(url)); return null; };
    });
    const check = (condition, message) => { if (!condition) failures.push(message); };
    try {
      await page.goto(server.url, { waitUntil: 'networkidle0' });
      await page.waitForSelector('#save-preferences', { timeout: 10000, visible: true });
      await pause(500);
      check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Horizontal overflow with cookie dialog');
      if (width === 390) await page.screenshot({ path: resolve(output, `${label}-${width}-cookies.png`) });
      if (label === 'after' && await page.$('app-cookies dialog')) {
        check(await page.$eval('#save-preferences', el => el === document.activeElement), 'Cookie focus not on accept');
        await page.keyboard.press('Escape');
        check(await page.$eval('app-cookies dialog', el => el.open), 'Cookie dialog closed without a choice');
        for (let tab = 0; tab < 7; tab++) {
          await page.keyboard.press('Tab');
          check(await page.$eval('app-cookies dialog', el => el.contains(document.activeElement)), 'Keyboard focus escaped cookie dialog');
        }
        for (let tab = 0; tab < 7; tab++) {
          await page.keyboard.down('Shift');
          await page.keyboard.press('Tab');
          await page.keyboard.up('Shift');
          check(await page.$eval('app-cookies dialog', el => el.contains(document.activeElement)), 'Reverse keyboard focus escaped cookie dialog');
        }
        check(!(await page.$('#nome')), 'Recruitment form rendered before scrolling');
      }
      await page.click('#save-preferences');
      await pause(400);
      await page.evaluate(() => document.fonts.ready);
      if (label === 'after') {
        const client = await page.createCDPSession();
        await client.send('DOM.enable');
        await client.send('CSS.enable');
        const { root } = await client.send('DOM.getDocument');
        const typography = [];
        for (const [selector, expectedFont, weight] of [
          ['.hero__title strong', 'CodecPro-Bold', '700'],
          ['.hero__subtitle', 'CodecPro-Regular', '400'],
          ['.hero__coverage', 'Inter-Regular', '400'],
        ]) {
          const { nodeId } = await client.send('DOM.querySelector', { nodeId: root.nodeId, selector });
          const { fonts } = await client.send('CSS.getPlatformFontsForNode', { nodeId });
          check(fonts.some(font => font.postScriptName === expectedFont && font.isCustomFont && font.glyphCount > 0), `Font not rendered: ${selector} / ${expectedFont}`);
          check(await page.$eval(selector, el => getComputedStyle(el).fontWeight) === weight, `Incorrect font weight: ${selector}`);
          typography.push({ selector, expectedFont, weight, fonts });
        }
        check(!requests.some(url => /fonts\.(googleapis|gstatic)\.com/.test(url)), 'External Google Fonts request');
        await writeFile(resolve(output, `${label}-${width}-fonts.json`), JSON.stringify(typography, null, 2));
        await client.detach();
      }
      const initial = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, banner: document.querySelector('.hero__media img').currentSrc, images: performance.getEntriesByType('resource').filter(r => r.initiatorType === 'img' || r.initiatorType === 'link').map(r => r.name), iframeCount: document.querySelectorAll('iframe[src*="maps"]').length }));
      check(initial.scrollWidth <= initial.width + 1, 'Horizontal overflow on page');
      if (label === 'after') {
        check(initial.images.filter(u => /familia/.test(u)).length === 1, 'Banner must fetch exactly one candidate');
        check(!initial.images.some(u => /fachada/i.test(u)), 'Facade loaded before scrolling');
        check(initial.iframeCount === 0, 'Map iframe exists before interaction');
      }
      await page.screenshot({ path: resolve(output, `${label}-${width}-hero.png`) });
      if (label === 'before') {
        results.push({ width, initial, errors, failures, passed: failures.length === 0 });
        await writeFile(resolve(output, `${label}-checks.json`), JSON.stringify(results, null, 2));
        console.log(JSON.stringify({ label, width, passed: failures.length === 0 }));
        await context.close();
        continue;
      }
      await page.click('.hero__plans');
      await pause(600);
      check(await page.$eval('#plans', el => el.getBoundingClientRect().top < 150), 'Hero plans link');
      await page.click('.hero__coverage');
      await pause(600);
      await page.click('#coverage-form button[type=submit]');
      await page.waitForFunction(() => document.querySelector('#coverage-city').getAttribute('aria-invalid') === 'true');
      const fonts = await page.$$eval('#coverage-form input', els => els.map(el => parseFloat(getComputedStyle(el).fontSize)));
      check(fonts.every(size => size >= 16), 'Coverage input fonts below 16px');
      for (const [id,value] of Object.entries({ city:'Imbé', neighborhood:'Bairro de teste', street:'Rua de teste', number:'209', complement:'Loja 03', contact:'pessoa@example.com' })) await page.type(`#coverage-${id}`, value);
      await page.click('#coverage-form button[type=submit]');
      const message = new URL(await page.evaluate(() => window.__opened.at(-1))).searchParams.get('text');
      check(message.includes('Cidade: Imbé\nBairro: Bairro de teste\nRua: Rua de teste\nNúmero: 209\nComplemento: Loja 03'), 'Coverage message address formatting');
      await page.select('#coverage-intent', 'expansion');
      for (const [id,value] of Object.entries({ city:'Outra cidade', neighborhood:'Bairro de teste', street:'Rua de teste', number:'s/n', contact:'51999990000' })) await page.type(`#coverage-${id}`, value);
      await page.click('#coverage-form button[type=submit]');
      check(decodeURIComponent(await page.evaluate(() => window.__opened.at(-1))).includes('não garante atendimento nem prazo'), 'Expansion disclaimer');
      await page.$eval('#coverage-form', el => el.scrollIntoView({ block: 'start' }));
      await pause(300);
      await page.screenshot({ path: resolve(output, `${label}-${width}-coverage.png`) });
      if (label === 'after') {
        await page.click('.coverage-map summary');
        await page.waitForSelector('.coverage-map iframe');
        await pause(600);
        check(requests.some(u => u.includes('google.com/maps/d/embed')), 'Map not requested when opened');
        await page.click('.coverage-map summary');
      }
      await page.evaluate(() => window.scrollTo(0, 500));
      await pause(500);
      if (width < 992) {
        await page.click('.navbar-toggler');
        await page.waitForSelector('#navbarNav.show');
      }
      const menuItem = await page.$$('app-menu-bar .nav-link');
      await menuItem[2].click();
      await pause(800);
      check(await page.$eval('#plans', el => el.getBoundingClientRect().top < 150), 'Menu did not navigate to plans');
      if (width < 992) check(!(await page.$('#navbarNav.show')), 'Mobile menu did not close');
      if (width < 768) {
        await page.click('button[aria-label="Ver próximos planos"]'); await pause(600);
        await page.click('button[aria-label="Ver próximos planos"]'); await pause(600);
      } else if (width <= 1100) { await page.click('button[aria-label="Ver próximos planos"]'); await pause(600); }
      await page.click('.plan-card--highlight .btn-plan');
      check(decodeURIComponent(await page.evaluate(() => window.__opened.at(-1))).includes('500 Mega'), '500 Mega message');
      await page.$eval('.plan-card--highlight', el => el.scrollIntoView({ block: 'start' }));
      await pause(600);
      await page.evaluate(() => window.scrollBy({ top: -80, behavior: 'instant' }));
      await page.screenshot({ path: resolve(output, `${label}-${width}-plans.png`) });
      check(await page.$$eval('.bi', els => els.every(el => getComputedStyle(el, '::before').maskImage.includes('data:image/svg+xml'))), 'Missing SVG icon');
      // File and API response are synthetic; no application is sent to the real endpoint.
      await page.$eval('app-who-we-are', el => el.scrollIntoView({ block: 'start' }));
      await pause(600);
      await (await page.$('app-who-we-are')).screenshot({ path: resolve(output, `${label}-${width}-about.png`) });
      await page.$eval('#workUs', el => el.scrollIntoView({ block: 'start' }));
      await page.waitForSelector('#nome', { visible: true });
      await pause(600);
      await (await page.$('app-work-with-us')).screenshot({ path: resolve(output, `${label}-${width}-work-form.png`) });
      await page.type('#nome', 'Teste automatizado');
      await page.type('#tel', '51999990000');
      await page.type('#endereco', 'Endereço de teste');
      const input = await page.$('#curriculo');
      const file = resolve(output, 'fixture-cv.txt');
      await writeFile(file, 'Arquivo de teste local, sem dados pessoais.');
      await input.uploadFile(file);
      await page.click('#iAgree');
      await page.click('app-work-with-us button[type=submit]');
      await page.waitForFunction(() => window.dataLayer?.some(item => item.event === 'form_submitted'), { timeout: 10000 });
      const closeToast = await page.$('.p-toast-close-button');
      if (closeToast) await closeToast.click();
      await page.mouse.move(0, 0);
      await page.waitForSelector('.p-toast-message', { hidden: true, timeout: 10000 });
      await page.click('#container-button-wpp');
      await pause(150);
      await page.focus('#container-button-wpp');
      await page.keyboard.press('Enter');
      await pause(100);
      check(decodeURIComponent(await page.evaluate(() => window.__opened.at(-1))).includes('botão flutuante'), 'Floating WhatsApp context');
      await page.$eval('app-footer', el => el.scrollIntoView());
      await pause(500);
      check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Horizontal overflow after full navigation');
      check(await page.$$eval('img', els => els.filter(el => el.getBoundingClientRect().height > 0 && el.getBoundingClientRect().top < innerHeight).every(el => el.complete && el.naturalWidth > 0)), 'Broken visible image');
      check(errors.length === 0, 'Browser runtime errors: ' + errors.join('; '));
      results.push({ width, initial, errors, failures, requests: requests.map(u => u.replace(server.url, '')), passed: failures.length === 0 });
    } catch (error) { results.push({ width, errors, failures: [...failures, error.stack], passed: false }); }
    console.log(JSON.stringify({ label, width, passed: results.at(-1).passed, failures: results.at(-1).failures }));
    await writeFile(resolve(output, `${label}-checks.json`), JSON.stringify(results, null, 2));
    await context.close();
  }
  if (label === 'after') {
    const page = await browser.newPage();
    const requests = [];
    await page.setRequestInterception(true);
    page.on('request', r => {
      requests.push(r.url());
      return r.url().startsWith(server.url) ? r.continue() : r.abort();
    });
    await page.goto(`${server.url}/politica-de-privacidade`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('app-privacy-policy h1');
    const passed = !requests.some(url => url.includes('familia-'));
    results.push({ route: '/politica-de-privacidade', passed, failures: passed ? [] : ['Home banner preloaded on a secondary page'] });
    await writeFile(resolve(output, `${label}-checks.json`), JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results.at(-1)));
    const cookieFailures = [];
    await page.waitForSelector('#save-preferences', { visible: true });
    await page.evaluate(() => { document.cookie = 'testCookie=yes; path=/'; sessionStorage.setItem('test', 'yes'); });
    await page.click('app-cookies dialog .btn');
    if (!(await page.evaluate(() => !document.querySelector('app-cookies dialog').open && !document.cookie.includes('testCookie') && sessionStorage.length === 0 && localStorage.getItem('cookiePreferences') === null))) cookieFailures.push('Refusal behavior changed');
    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForSelector('#save-preferences', { visible: true });
    await page.click('#save-preferences');
    await page.reload({ waitUntil: 'networkidle0' });
    await pause(2200);
    if (!(await page.evaluate(() => !document.querySelector('app-cookies dialog').open && localStorage.getItem('cookiePreferences') === 'accepted'))) cookieFailures.push('Acceptance not retained');
    results.push({ flow: 'cookie-preferences', passed: cookieFailures.length === 0, failures: cookieFailures });
    for (const [route, selector] of [['politica-de-cookies','app-privacy-cookies'], ['politica-de-direito-dos-titulares','app-rights-policy'], ['pagina-inexistente','app-error-404']]) {
      await page.goto(`${server.url}/${route}`, { waitUntil: 'networkidle0' });
      await page.waitForSelector(`${selector} h1`);
      results.push({ route, passed: true, failures: [] });
    }
    await writeFile(resolve(output, `${label}-checks.json`), JSON.stringify(results, null, 2));
    console.log('Cookie choices and lazy routes passed.');
  }
} finally { await browser.close(); await server.close(); }
assert(results.every(result => result.passed), 'Some browser checks failed; inspect the JSON report.');
