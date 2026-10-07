import { serve } from './server.mjs';
import { access } from 'node:fs/promises';
import { resolve } from 'node:path';
const directory = process.argv[2] || 'dist/entrega/aprovacao-2026-10-05/site';
await access(resolve(directory, 'index.html'));
const server = await serve(directory, Number(process.argv[3] || 4173));
console.log(`Versão de aprovação: ${server.url}\nPasta: ${resolve(directory)}\nAcesso local neste computador. Ctrl+C para encerrar.`);
process.on('SIGINT', async () => { await server.close(); process.exit(0); });
process.on('SIGTERM', async () => { await server.close(); process.exit(0); });
