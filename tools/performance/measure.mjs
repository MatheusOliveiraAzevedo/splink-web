import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer-core';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import { serve, executablePath } from './server.mjs';

const [directory, output, label = 'run'] = process.argv.slice(2);
if (!directory || !output) throw new Error('Usage: node measure.mjs BUILD_DIRECTORY OUTPUT_DIRECTORY LABEL');
await mkdir(output, { recursive: true });
const server = await serve(directory);
const measurements = [];
const profiles = {
  mobile: { formFactor: 'mobile', screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 2, disabled: false }, throttling: { rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4 } },
  desktop: { formFactor: 'desktop', screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false }, throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 } },
};
try {
  for (const [profile, settings] of Object.entries(profiles)) {
    for (let run = 1; run <= 3; run++) {
      const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-first-run', '--disable-extensions', '--disable-background-networking'] });
      try {
        const { lhr } = await lighthouse(server.url, {
          port: Number(new URL(browser.wsEndpoint()).port), logLevel: 'error',
          onlyCategories: ['performance', 'accessibility'],
          blockedUrlPatterns: ['https://*'], throttlingMethod: 'simulate',
          ...settings,
        });
        if (lhr.runtimeError) throw new Error(JSON.stringify(lhr.runtimeError));
        const audits = lhr.audits;
        const item = {
          profile, run, browser: await browser.version(), lighthouse: lhr.lighthouseVersion, fetchedAt: lhr.fetchTime,
          settings, performance: Math.round(lhr.categories.performance.score * 100), accessibility: Math.round(lhr.categories.accessibility.score * 100),
          fcpMs: audits['first-contentful-paint'].numericValue, lcpMs: audits['largest-contentful-paint'].numericValue,
          speedIndexMs: audits['speed-index'].numericValue, tbtMs: audits['total-blocking-time'].numericValue,
          cls: audits['cumulative-layout-shift'].numericValue, transferBytes: audits['total-byte-weight'].numericValue,
          resources: audits['network-requests'].details.items.map(r => ({ url: r.url.replace(server.url, ''), type: r.resourceType, bytes: r.transferSize, status: r.statusCode })),
          failedAudits: Object.entries(audits).filter(([,a]) => a.score !== null && a.score < 1).map(([id,a]) => ({ id, title: a.title, displayValue: a.displayValue })),
        };
        measurements.push(item);
        await writeFile(resolve(output, `${label}-${profile}-${run}.json.gz`), gzipSync(JSON.stringify(lhr)));
        await writeFile(resolve(output, `${label}.json`), JSON.stringify(measurements, null, 2));
        console.log(JSON.stringify({ label, profile, run, performance: item.performance, lcpMs: Math.round(item.lcpMs), transferBytes: item.transferBytes }));
      } finally { await browser.close(); }
    }
  }
} finally { await server.close(); }
