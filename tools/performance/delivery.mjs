import puppeteer from 'puppeteer-core';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import ts from 'typescript';
import { serve, executablePath } from './server.mjs';
const [directory = 'dist/splink-web/browser', output = 'docs/entrega'] = process.argv.slice(2);
const dataModule = async name => {
  const source = await readFile(`src/app/shared/model/${name}.ts`, 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
};
const { plans } = await dataModule('plans');
const { links, navBarMenu } = await dataModule('links');
await mkdir(output, { recursive: true });
const server = await serve(directory);
const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-first-run', '--disable-extensions'] });
const report = { buildIndexSha256: createHash('sha256').update(await readFile(resolve(directory, 'index.html'))).digest('hex'), createdAt: new Date().toISOString(), scope: 'Local browser; external requests blocked; recruitment API mocked; no real messages sent', checks: [], whatsapp: [], links: [], forms: [], errors: [] };
let apiMode = 'success', apiCalls = 0;
const check = (name, condition, detail) => { report.checks.push({ name, passed: !!condition, ...(detail ? { detail } : {}) }); };
const pause = ms => new Promise(r => setTimeout(r, ms));
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  page.on('pageerror', error => report.errors.push(error.message));
  await page.setRequestInterception(true);
  page.on('request', async request => {
    if (request.url().includes('script.google.com/macros/')) {
      apiCalls++;
      if (apiMode === 'network-error') return request.abort();
      const body = { success: '{"success":true}', status: '{"status":"success"}', rejected: '{"success":false}', ambiguous: '{}', malformed: 'not json' }[apiMode];
      return request.respond({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body });
    }
    return request.url().startsWith(server.url) || request.url().startsWith('data:') ? request.continue() : request.abort();
  });
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('cookiePreferences', 'accepted');
    window.__opened = [];
    window.open = url => { window.__opened.push(String(url)); return null; };
  });
  await page.goto(server.url, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.plan-card');
  const events = () => page.evaluate(() => (window.dataLayer || []).filter(x => x.source === 'splink_site'));
  check('No commercial event on initial page load', (await events()).length === 0);
  const click = selector => page.$eval(selector, el => el.click());
  const captureWhatsApp = async (name, action, position, plan = null, intent = 'coverage') => {
    const before = (await events()).length;
    const opens = await page.evaluate(() => window.__opened.length);
    await action(); await pause(100);
    const url = new URL(await page.evaluate(() => window.__opened.at(-1)));
    const emitted = (await events()).slice(before);
    const event = emitted.find(x => x.event === 'whatsapp_click');
    const message = url.searchParams.get('text');
    const passed = url.hostname === 'api.whatsapp.com' && url.searchParams.get('phone') === '5551995320037'
      && message.includes(`Origem no site: ${{hero:'banner principal',plans:'seção de planos',floating:'botão flutuante',footer:'rodapé',about:'quem somos',watch_tv:'Watch TV',wifi_6:'Wi-Fi 6',coverage_form:'formulário de cobertura'}[position]}.`) && (!plan || message.toLowerCase().includes(plan.name.toLowerCase()))
      && event?.position === position && event.plan_id === (plan?.id ?? null) && event.plan_name === (plan?.name ?? null)
      && event.intent === intent && emitted.filter(x => x.event === 'whatsapp_click').length === 1
      && (await page.evaluate(() => window.__opened.length)) === opens + 1;
    report.whatsapp.push({ name, recipient: url.searchParams.get('phone'), message, events: emitted, passed });
    check(`WhatsApp: ${name}`, passed);
  };
  for (const [i, plan] of plans.entries()) {
    await captureWhatsApp(plan.name, () => page.$$eval('.plan-card .btn-plan', (els, i) => els[i].click(), i), 'plans', plan);
  }
  for (const [name,selector,position] of [
    ['Flutuante','#container-button-wpp','floating'],
    ['Rodapé','app-footer .bi-whatsapp','footer'], ['Quem somos','app-who-we-are app-button-attention button','about'],
    ['Watch TV','app-retain-attention .service-card:first-child button','watch_tv'],
    ['Wi-Fi 6','app-retain-attention .service-card:last-child button','wifi_6'],
  ]) await captureWhatsApp(name, () => click(selector), position);

  for (const [selector,target] of [['.hero__plans','#plans'],['.hero__coverage','#coverage-form']]) {
    await click(selector); await pause(800);
    check(`Hero navigation ${target}`,await page.$eval(target,el=>Math.abs(el.getBoundingClientRect().top)<160));
  }
  const setValues = values => page.evaluate(values => {
    for (const [selector,value] of Object.entries(values)) {
      const el = document.querySelector(selector); el.value = value;
      el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
    }
  }, values);
  const address = { '#coverage-city':'Imbé', '#coverage-neighborhood':'Bairro de teste', '#coverage-street':'Rua de teste', '#coverage-number':'209', '#coverage-contact':'pessoa@example.com' };
  for (const [name,values] of [['empty',{}],['blank street',{...address,'#coverage-street':'   '}],['invalid contact',{...address,'#coverage-contact':'invalid'}]]) {
    const before = (await events()).length;
    await setValues(values); await click('#coverage-form button[type=submit]'); await pause(100);
    check(`Coverage rejects ${name}`, (await events()).length === before);
  }
  for (const intent of ['coverage','expansion']) {
    await setValues({ ...address, '#coverage-intent':intent, '#coverage-complement':intent === 'coverage' ? 'Loja 03' : '', '#coverage-city':intent === 'coverage' ? 'Imbé' : 'Outra cidade' });
    await captureWhatsApp(`Formulário ${intent}`, () => click('#coverage-form button[type=submit]'), 'coverage_form', null, intent);
    const last = report.whatsapp.at(-1);
    check(`Coverage ${intent} event separation`, last.events.map(x => x.event).join(',') === 'form_prepared,whatsapp_click');
    check(`Coverage ${intent} address formatting`, last.message.includes('\nBairro: Bairro de teste\nRua: Rua de teste\nNúmero: 209\n'));
    check(`Coverage ${intent} personal data absent from events`, !JSON.stringify(last.events).includes('pessoa@example.com'));
    check(`Coverage ${intent} feasibility disclaimer`, last.message.includes(intent === 'coverage' ? 'Aguardo a confirmação de viabilidade' : 'não garante atendimento nem prazo'));
  }
  const anchors = await page.$$eval('a[href]', els => els.map(el => ({ text: el.textContent.trim(), href: el.getAttribute('href') })));
  for (const item of anchors) {
    if (item.href.startsWith('#')) check(`Anchor ${item.href}`, !!(await page.$(item.href)));
    if (item.href.startsWith('mailto:')) check(`Email ${item.text}`, item.href.slice(7) === item.text);
    report.links.push({ ...item, kind: item.href.startsWith('mailto:') || item.href.startsWith('tel:') ? 'protocol-only; no email/call made' : 'anchor/route' });
  }
  const outgoing = [
    ['.container-addresses span:nth-child(1)',links.endereco_01], ['.container-addresses span:nth-child(2)',links.endereco_02],
    ['app-footer .bi-instagram',links.instagram],['app-footer .bi-facebook',links.facebook],
    ['app-footer img[alt="Logo loja de aplicativos App Store"]',links.app_iphone],['app-footer img[alt="Logo loja de aplicativos Play Store"]',links.app_android],
  ];
  for (const [selector,expected] of outgoing) {
    await click(selector); const actual = await page.evaluate(() => window.__opened.at(-1));
    check(`Outgoing ${expected}`, actual === expected); report.links.push({ selector, href: actual, kind:'click captured; availability checked separately' });
  }
  const pdfs = [links.contratoLocacao, links.contratoSVA, links.contratoServico];
  for (const [index,path] of pdfs.entries()) {
    await page.$$eval('app-footer nav > ul:nth-child(2) app-buttom-footer', (els,index) => els[index].click(), index);
    check(`PDF button ${path}`, (await page.evaluate(() => window.__opened.at(-1))) === path);
    const response = await fetch(new URL(path, server.url)); const body = Buffer.from(await response.arrayBuffer());
    check(`PDF file ${path}`, response.ok && body.subarray(0,5).toString() === '%PDF-');
    report.links.push({ href:path, status:response.status, pdfSignature:body.subarray(0,5).toString() });
  }
  for (const [i,item] of navBarMenu.entries()) {
    if (item.submenu) continue;
    await page.$$eval('app-menu-bar .nav-link', (els,i) => els[i].click(), i); await pause(800);
    if (item.url) check(`Menu ${item.label}`, (await page.evaluate(() => window.__opened.at(-1))) === item.url);
    else check(`Menu ${item.label}`, await page.$eval(`#${item.scrollTo}`, el => Math.abs(el.getBoundingClientRect().top) < 160));
  }
  for (const [i,id] of ['whoWeAre','workUs'].entries()) {
    await page.$$eval('app-menu-bar .dropdown-item', (els,i) => els[i].click(), i); await pause(800);
    check(`Submenu ${id}`, await page.$eval(`#${id}`, el => Math.abs(el.getBoundingClientRect().top) < 160));
    await page.$$eval('app-footer nav > ul:first-child app-buttom-footer', (els,i) => els[i].click(), i); await pause(800);
    check(`Footer ${id}`, await page.$eval(`#${id}`, el => Math.abs(el.getBoundingClientRect().top) < 160));
  }
  await page.$eval('#workUs', el => el.scrollIntoView()); await page.waitForSelector('#nome');
  const clearToast = async () => { for (const el of await page.$$('.p-toast-close-button')) await el.click(); await pause(400); };
  
  await page.type('#nome','Teste de aprovação'); await page.type('#tel','51999990000'); await page.type('#endereco','Rua de teste, 209');
  const fixture = resolve(output,'fixture-cv.txt'); await writeFile(fixture,'Currículo sintético de teste local.');
  await (await page.$('#curriculo')).uploadFile(fixture);
  await click('app-work-with-us button[type=submit]'); await pause(200);
  check('Recruitment rejects unchecked consent even with all fields filled', apiCalls === 0); await clearToast();
  await page.click('#iAgree');
  await setValues({ '#nome':'' });
  await click('app-work-with-us button[type=submit]'); await pause(200);
  check('Recruitment rejects missing required field with consent', apiCalls === 0); await clearToast();
  await setValues({ '#nome':'Teste de aprovação' });
  for (const mode of ['rejected','ambiguous','malformed','network-error','success','status']) {
    apiMode = mode; const before = (await events()).filter(x => x.event === 'form_submitted').length; const calls = apiCalls;
    await click('app-work-with-us button[type=submit]');
    await page.waitForFunction(() => !document.querySelector('app-work-with-us button[type=submit]').disabled);
    await page.waitForSelector('.p-toast-message'); await pause(200);
    const text = await page.$eval('.p-toast-message', el => el.textContent);
    const emitted = (await events()).filter(x => x.event === 'form_submitted').length - before;
    const success = ['success','status'].includes(mode);
    const passed = apiCalls === calls + 1 && emitted === (success ? 1 : 0) && text.includes(success ? 'Enviado com sucesso' : 'Envio não confirmado');
    report.forms.push({ mode, mocked:true, apiCalls:apiCalls-calls, submittedEvents:emitted, text, passed }); check(`Recruitment response ${mode}`,passed); await clearToast();
  }
  const schema = await page.$eval('#plans-structured-data', el => JSON.parse(el.textContent));
  for (const plan of plans) { const product = schema['@graph'].find(p => p.name === `${plan.name} – SP-Link`); check(`Schema price ${plan.name}`, plan.price === null ? !product.offers : product.offers.price === plan.price.toFixed(2)); }
  const business = await page.$$eval('script[type="application/ld+json"]', els => els.map(el => JSON.parse(el.textContent)).find(x => x['@type'] === 'InternetServiceProvider'));
  for (const key of ['logo','image']) { const response = await fetch(new URL(new URL(business[key]).pathname,server.url)); check(`Schema asset ${key}`, response.ok); }
  for (const [path,selector] of [['politica-de-privacidade','app-privacy-policy'],['politica-de-cookies','app-privacy-cookies'],['politica-de-direito-dos-titulares','app-rights-policy'],['not-a-real-page','app-error-404']]) {
    await page.goto(`${server.url}/${path}`,{waitUntil:'networkidle0'}); await page.waitForSelector(`${selector} h1`);
    check(`Route ${path}`,true); check(`No stale plan schema ${path}`,!(await page.$('#plans-structured-data')));
  }
  await click('app-error-404 button'); await page.waitForSelector('.hero__cta'); check('404 return home',new URL(page.url()).pathname === '/');
  for (const selector of ['app-menu-bar > nav > div > img','app-footer .img-logo']) { await click(selector); await pause(900); check(`Logo home ${selector}`, await page.evaluate(() => scrollY < 100)); }
  check('No runtime errors',report.errors.length === 0,report.errors);
  check('No click interpreted as sale', !(await events()).some(x => ['purchase','contract_confirmed','conversion'].includes(x.event)));
} catch (error) { report.errors.push(error.stack); check('Runner completed',false,error.message); }
finally { await browser.close(); await server.close(); await writeFile(resolve(output,'validacao-tecnica.json'),JSON.stringify(report,null,2)); }
console.log(JSON.stringify({ checks:report.checks.length, failed:report.checks.filter(x=>!x.passed), whatsapp:report.whatsapp.length, forms:report.forms.length },null,2));
assert(report.checks.every(x=>x.passed),'Validation failed; inspect report');
