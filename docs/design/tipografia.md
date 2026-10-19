# Tipografia SP-Link

Aplicação do manual: títulos em **Codec Pro Bold (700)**, subtítulos em
**Codec Pro Regular (400)** e textos, campos, botões e textos pequenos em
**Inter Regular (400)**. Velocidades e valores principais dos planos usam
Codec Pro Bold como destaques de título.

## Manutenção

- Fontes e regras globais: `src/styles/_typography.scss`.
- Família e peso dos títulos do Bootstrap: início de `src/styles.scss`.
- Novos títulos: usar elementos `h1` a `h6`.
- Novos subtítulos: adicionar a classe `brand-subtitle`.
- Texto comum: herda Inter Regular. Não adicionar pesos inexistentes.
- `font-synthesis: none` impede negrito/itálico artificiais. Ênfase semântica
  com `strong` continua disponível para tecnologias assistivas.

Os arquivos são servidos localmente em WOFF2, com `font-display: swap`.
O site não depende do Google Fonts. Os TTF originais ficam preservados em
`src/assets/fonts`; o navegador utiliza somente WOFF2.

## Origem dos arquivos

- Codec Pro Regular e Bold: `codec-pro.zip` disponível em Downloads nesta
  sessão; copyright preservado em `CodecPro-COPYRIGHT.txt`.
  Os nomes PostScript são `CodecPro-Regular` e `CodecPro-Bold`.
  O Bold fornecido tem peso interno 500, mas nome/subfamília Bold; o
  `@font-face` associa esse arquivo verdadeiro ao peso CSS 700.
- Inter Regular 4.1: [distribuição oficial](https://rsms.me/inter/font-files/Inter-Regular.woff2?v=4.1).
  Licença OFL preservada em `Inter-LICENSE.txt`.
- Conversão dos dois TTF para WOFF2 sem recorte de caracteres usando
  [fontTools](https://fonttools.readthedocs.io/en/latest/ttLib/woff2.html)
  4.66.1, função `fontTools.ttLib.woff2.compress`.

## Validação

```sh
npm run build
node tools/performance/check.mjs dist/splink-web/browser docs/performance/typography after
```

O teste verifica 320, 390, 768 e 1440 px, formulários com envio simulado,
navegação e fontes efetivamente renderizadas pelo navegador (nome PostScript,
peso e origem local). Capturas e resultados ficam em `docs/performance/typography`.

## Otimização de carregamento (19/10/2026)

Os arquivos `*-latin.woff2` cobrem português, caracteres latinos básicos,
acentos combinantes, pontuação e símbolos usados na interface. São priorizados
por `unicode-range`; os WOFF2 completos permanecem como alternativa para outros
caracteres (inclusive nomes e comentários retornados pelo Google).
O peso total das três fontes latinas é 142.680 bytes, contra 379.408 bytes dos
arquivos completos. A família e os pesos permanecem iguais.

Para reproduzir: instalar `fonttools[woff]` em um ambiente Python e executar
`python tools/fonts/subset.py`. Gerado com fontTools 4.67.0.
