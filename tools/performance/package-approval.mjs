import { createHash } from 'node:crypto';
import { access, cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const version = process.argv[2] || 'aprovacao-2026-10-05';
assert(/^[a-z0-9-]+$/.test(version),'Invalid version label');
const build = resolve('dist/splink-web/browser');
const destination = resolve('dist/entrega',version);
const technical = JSON.parse(await readFile('docs/entrega/validacao-tecnica.json','utf8'));
const ui = JSON.parse(await readFile('docs/entrega/interface/after-checks.json','utf8'));
const uiBuild = JSON.parse(await readFile('docs/entrega/interface/after-build.json','utf8'));
const hash = data => createHash('sha256').update(data).digest('hex');
const indexSha256 = hash(await readFile(join(build,'index.html')));
assert(technical.checks.length >= 80 && technical.checks.every(x=>x.passed) && technical.errors.length === 0,'Technical checks must pass');
assert([320,390,768,1440].every(width=>ui.some(x=>x.width===width && x.passed)) && ui.every(x=>x.passed),'Interface checks must pass');
assert(technical.buildIndexSha256 === indexSha256 && uiBuild.indexSha256 === indexSha256,'Tests do not match the current build; rerun validation');
await mkdir(resolve('dist/entrega'),{recursive:true});
await mkdir(destination); // Never silently replace a version that may already be under review.
await cp(build,join(destination,'site'),{recursive:true});
async function inventory(directory,prefix='') {
  const files=[];
  for (const entry of (await readdir(directory,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))) {
    const name=prefix+entry.name, path=join(directory,entry.name);
    if(entry.isDirectory()) files.push(...await inventory(path,name+'/'));
    else { const bytes=await readFile(path); files.push({path:name,bytes:bytes.length,sha256:hash(bytes)}); }
  }
  return files;
}
const files=await inventory(join(destination,'site'));
const manifest={ version, createdAt:new Date().toISOString(), baseCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(), includesUncommittedChanges:true, publication:'not published; local approval snapshot', indexSha256, buildSha256:hash(JSON.stringify(files)), tested:{technical:technical.checks.length,whatsappMessages:technical.whatsapp.length,formResponses:technical.forms.length,interfaceWidths:[320,390,768,1440]}, files };
await writeFile('docs/entrega/versao.json',JSON.stringify(manifest,null,2));
let messages='# Evidência técnica das mensagens de WhatsApp\n\nCapturas locais da versão `'+version+'`. Destinatário configurado: +55 51 99532-0037.\nNenhuma mensagem foi enviada. Plano/origem no atendimento e registro comercial aguardam confirmação.\nEndereços e contatos abaixo são dados sintéticos de teste.\n\n';
for(const row of technical.whatsapp) messages+=`## ${row.name}\n\nResultado local: ${row.passed ? 'aprovado' : 'falhou'}.\n\n\`\`\`text\n${row.message}\n\`\`\`\n\nEventos capturados:\n\n\`\`\`json\n${JSON.stringify(row.events,null,2)}\n\`\`\`\n\n`;
await writeFile('docs/entrega/mensagens-whatsapp.md',messages);
await cp('docs',join(destination,'docs'),{recursive:true});
await mkdir(join(destination,'tools/performance'),{recursive:true});
await cp('tools/performance/README.md',join(destination,'tools/performance/README.md'));
await cp('tools/performance/preview.mjs',join(destination,'preview.mjs'));
await cp('tools/performance/server.mjs',join(destination,'server.mjs'));
await writeFile(join(destination,'LEIA-ME.md'),`# SP-Link — ${version}\n\nVersão para aprovação. Não publicada.\n\nCom Node instalado, execute nesta pasta:\n\n\`\`\`sh\nnode preview.mjs site 4173\n\`\`\`\n\nAbra http://127.0.0.1:4173 no mesmo computador.\n\nLeia [checklist e pendências](docs/entrega/README.md), [manutenção](docs/entrega/manutencao.md) e [conferência no atendimento](docs/entrega/validacao-atendimento.md).\n\nAs pastas src mencionadas no guia pertencem ao repositório de desenvolvimento, não a este pacote estático.\nIdentificador do build: ${manifest.buildSha256}\n`);
const zip=destination+'.zip';
execFileSync('python3',['-c','import pathlib,sys,zipfile\np=pathlib.Path(sys.argv[1])\nwith zipfile.ZipFile(sys.argv[2],"x",zipfile.ZIP_DEFLATED) as z:\n for f in sorted(p.rglob("*")):\n  if f.is_file(): z.write(f, f.relative_to(p.parent))',destination,zip]);
const zipBytes=await readFile(zip);
await writeFile('docs/entrega/pacote.json',JSON.stringify({version,path:zip,bytes:zipBytes.length,sha256:hash(zipBytes)},null,2));
console.log(JSON.stringify({version,directory:destination,zip,files:files.length,zipBytes:zipBytes.length,sha256:manifest.buildSha256},null,2));
