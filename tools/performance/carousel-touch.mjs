import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { serve, executablePath } from './server.mjs';
const output = 'docs/performance/carousel-touch';
await mkdir(output, { recursive: true });
const server = await serve('dist/splink-web/browser');
const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-first-run', '--disable-extensions'] });
const results = [];
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
try {
  for (const width of [320, 390, 768]) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('cookiePreferences', 'accepted');
      window.__opened = [];
      window.open = url => { window.__opened.push(url); return null; };
    });
    await page.setRequestInterception(true);
    page.on('request', r => r.url().startsWith(server.url) || r.url().startsWith('data:') ? r.continue() : r.abort());
    await page.goto(server.url, { waitUntil: 'networkidle0' });
    await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
    const client = await page.createCDPSession();
    const gesture = async (dx, dy) => {
      await page.$eval('app-carousel-plans .p-carousel-viewport', el => { window.scrollTo(0, scrollY + el.getBoundingClientRect().top - 100); });
      await pause(300);
      const x = Math.round(width / 2), y = 400;
      await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] });
      for (let i = 1; i <= 12; i++) {
        await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + dx * i / 12, y: y + dy * i / 12, id: 1 }] });
        await pause(25);
      }
      await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await pause(500);
    };
    const state = () => page.evaluate(() => ({ y: scrollY, transform: document.querySelector('app-carousel-plans .p-carousel-item-list').style.transform }));
    for (const [dx, dy] of [[0, -180], [-45, -180], [40, 180]]) {
      await page.$eval('app-carousel-plans .p-carousel-viewport', el => window.scrollTo(0, scrollY + el.getBoundingClientRect().top - 100));
      const before = await state();
      await gesture(dx, dy);
      const after = await state();
      assert(Math.abs(after.y - before.y) > 50, `Vertical scroll blocked at ${width}: ${dx}/${dy}`);
      assert.equal(after.transform, before.transform, `Vertical gesture changed plan at ${width}`);
    }
    const before = await state();
    await gesture(-110, 8);
    const next = await state();
    assert.notEqual(next.transform, before.transform, `Horizontal swipe failed at ${width}`);
    await gesture(110, -8);
    assert.equal((await state()).transform, before.transform, `Reverse swipe failed at ${width}`);
    await page.click('button[aria-label="Ver próximos planos"]');
    await pause(500);
    assert.notEqual((await state()).transform, before.transform, 'Arrow navigation failed');
    await page.click('app-carousel-plans .p-carousel-item-active .btn-plan');
    assert.equal(await page.evaluate(() => window.__opened.length), 1, 'CTA tap failed');
    results.push({ width, vertical: true, diagonal: true, horizontalBothDirections: true, arrow: true, cta: true, passed: true });
    console.log(JSON.stringify(results.at(-1)));
    await page.close();
  }
  await writeFile(`${output}/checks.json`, JSON.stringify(results, null, 2));
} finally { await browser.close(); await server.close(); }
