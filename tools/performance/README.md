# Medições locais de desempenho

Ferramentas isoladas do aplicativo. Requer Node 22, um navegador Chromium instalado
e `npm ci --prefix tools/performance`. Defina `CHROME_PATH` para usar outro executável;
o padrão é o Brave no macOS. As versões estão fixadas no package-lock.json.

```sh
npm run build
node tools/performance/measure.mjs dist/splink-web/browser docs/performance after
node tools/performance/check.mjs dist/splink-web/browser docs/performance/screenshots after
node tools/performance/report.mjs docs/performance
```

`measure.mjs` serve o build de produção por HTTP local com gzip e sem cache, abre
um perfil novo para cada execução e faz três medições Lighthouse em cada perfil:

- Celular: 390 × 844, DPR 2, RTT 150 ms, 1.638,4 Kbit/s, CPU 4×.
- Desktop: 1440 × 900, DPR 1, RTT 40 ms, 10.240 Kbit/s, CPU 1×.

A limitação de rede/CPU é simulada pelo Lighthouse. URLs HTTPS externas são
bloqueadas igualmente nas duas versões: Google Fonts, tags e Google Maps não
participam dessa medição. Nenhuma preferência de cookies é pré-gravada; o aviso de
primeira visita permanece presente. Não execute medições simultaneamente com
outros testes ou builds.

Para preservar a versão anterior, copie `dist/splink-web/browser` antes de editar
os fontes. Passe o caminho dessa cópia e o rótulo `before` para os dois scripts.
O rótulo `before` em `check.mjs` registra somente a primeira tela e sua largura;
os fluxos completos são validados com `after`.

Os relatórios completos Lighthouse são guardados como JSON gzip. Os arquivos
`before.json` e `after.json` incluem métricas, recursos e condições por execução.
A comparação usa a mediana das três execuções, não o melhor resultado.

`check.mjs` testa 320, 390, 768 e 1440 pixels. Bloqueia serviços externos, intercepta
window.open e simula a resposta do formulário de currículo. Não envia mensagens
nem candidaturas reais. Registra screenshots e um JSON dos resultados. O mapa é
verificado quanto ao momento da requisição, não quanto ao funcionamento do Google
Maps remoto. Os testes não substituem validação em aparelhos físicos e Safari.

Para reproduzir a compressão das imagens originais:

```sh
node tools/performance/images.mjs
```

O script preserva os originais e gera AVIF/WebP sem ampliar a resolução. Os srcsets
do banner e seu preload condicional em src/index.html devem permanecer iguais.
Imagens antigas dos planos, artes retiradas e PDFs não são baixados na navegação
inicial; foram preservados para manutenção.

## Ícones e carregamento sob demanda

`npm run build` gera automaticamente `src/bootstrap-icons.css` com os ícones
`bi-*` referenciados nos arquivos HTML/TypeScript de `src/app`, incluindo os
nomes definidos nos dados dos planos. Os desenhos são os SVG originais do
Bootstrap Icons, com licença copiada para os assets. Ao adicionar ícones durante
`ng serve`, execute `npm run icons` para atualizar esse arquivo. Use nomes
completos literais (`bi-tv`), pois nomes montados por concatenação não são detectados.

O teste de interface também verifica o carregamento do formulário de currículo ao
rolar, as rotas secundárias e o foco/aceitação/recusa do aviso de cookies nativo.
A segunda rodada de otimizações tem suas próprias evidências em
`docs/performance/phase-2`, preservando os resultados anteriores.

## Entrega para aprovação

- `delivery.mjs`: testa destinos dos controles, mensagens dos seis planos e oito
  outras entradas, eventos, PDFs, rotas e respostas simuladas de formulários.
- `links.mjs`: consulta destinos HTTP públicos. Não envia formulários ou mensagens;
  HTTP 403/timeout permanece como pendência manual, sem trocar o endereço por suposição.
- `package-approval.mjs`: exige os relatórios aprovados vinculados ao build, copia
  uma versão fixa para `dist/entrega`, gera inventário SHA-256 e ZIP. Não publica.
  Uma versão existente nunca é sobrescrita; use outro rótulo como argumento para
  uma nova revisão e atualize a identificação nos documentos correspondentes.
- `preview.mjs PASTA PORTA`: serve a versão local por HTTP, com fallback das rotas.

Veja `docs/entrega/README.md` para a ordem de execução e os limites das evidências.
As mensagens são capturadas antes de sair do site; o recebimento real e o registro
comercial dependem da confirmação do atendimento.
