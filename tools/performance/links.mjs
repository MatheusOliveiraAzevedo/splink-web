import { readFile, writeFile, mkdir } from 'node:fs/promises';
const source = await readFile('src/app/shared/model/links.ts','utf8');
const html = await readFile('src/index.html','utf8');
const coverage = await readFile('src/app/components/coverage-area/coverage-area.component.html','utf8');
const business = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
const urls = [...new Set([
  ...[...source.matchAll(/https:\/\/[^'\s]+/g)].map(m=>m[0]),
  ...business.sameAs,
  coverage.match(/src="(https:[^"]+)"/)[1],
])].filter(url=>!url.includes('api.whatsapp.com'));
const results = await Promise.all(urls.map(async url => {
  try {
    const response = await fetch(url,{ signal:AbortSignal.timeout(20000),headers:{'User-Agent':'Mozilla/5.0 (compatible; SPLinkLinkCheck/1.0)'} });
    const body = await response.text();
    return { url, status:response.status, finalUrl:response.url, title:body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim(), result:response.ok ? 'HTTP reachable; identity/content requires review' : 'Manual review required; HTTP status alone does not prove a broken link' };
  } catch(error) { return {url,result:'Not verified',error:error.message}; }
}));
await mkdir('docs/entrega',{recursive:true});
await writeFile('docs/entrega/links-externos.json',JSON.stringify({createdAt:new Date().toISOString(),method:'GET public destinations, redirects followed, 20 s timeout. No POST, login, messages or forms.',results},null,2));
console.log(JSON.stringify(results,null,2));
