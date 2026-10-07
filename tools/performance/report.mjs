import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const directory = resolve(process.argv[2] || 'docs/performance');
const before = JSON.parse(await readFile(resolve(directory, 'before.json'), 'utf8'));
const after = JSON.parse(await readFile(resolve(directory, 'after.json'), 'utf8'));
const median = values => [...values].sort((a,b) => a-b)[Math.floor(values.length / 2)];
const metrics = ['performance','fcpMs','lcpMs','speedIndexMs','tbtMs','cls','transferBytes'];
const summary = {};
for (const profile of ['mobile','desktop']) {
  summary[profile] = {};
  for (const [label, rows] of [['before', before], ['after', after]]) {
    const selected = rows.filter(row => row.profile === profile);
    if (selected.length !== 3) throw new Error(`Expected 3 runs: ${label} ${profile}`);
    summary[profile][label] = Object.fromEntries(metrics.map(key => [key, median(selected.map(row => row[key]))]));
    summary[profile][label].dates = selected.map(row => row.fetchedAt);
  }
}
await writeFile(resolve(directory, 'summary.json'), JSON.stringify(summary, null, 2));
const n = value => value.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const rows = [
  ['Pontuação Lighthouse (0–100)', 'performance', v => String(v)],
  ['Primeiro conteúdo — FCP', 'fcpMs', v => `${n(v / 1000)} s`],
  ['Maior conteúdo — LCP', 'lcpMs', v => `${n(v / 1000)} s`],
  ['Speed Index', 'speedIndexMs', v => `${n(v / 1000)} s`],
  ['Bloqueio por JavaScript — TBT', 'tbtMs', v => `${Math.round(v)} ms`],
  ['Deslocamento de layout — CLS', 'cls', v => n(v)],
  ['Transferência total medida', 'transferBytes', v => `${n(v / 1000000)} MB`],
];
let table = '| Métrica | Celular antes | Celular depois | Desktop antes | Desktop depois |\n| --- | ---: | ---: | ---: | ---: |\n';
for (const [label,key,format] of rows) table += `| ${label} | ${format(summary.mobile.before[key])} | ${format(summary.mobile.after[key])} | ${format(summary.desktop.before[key])} | ${format(summary.desktop.after[key])} |\n`;
await writeFile(resolve(directory, 'table.md'), table);
console.log(table);
