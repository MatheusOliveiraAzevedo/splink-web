# Enquadramento aberto da família

A pedido do responsável, a referência passou a ser a arte de marketing
`/Users/matheusazevedo/Downloads/1200 x 540  banner site_splink.png`.

Edição produzida com a ferramenta integrada `image_gen` (habilidade imagegen),
sem CLI/API externa. É uma edição assistida baseada na referência, não uma
extração de pixels que garanta identidade binária com o arquivo de marketing.

Arquivo selecionado no projeto: `src/assets/banner/familia-aberta.png` (1512 × 1040).
Originais e variantes anteriores foram preservados. O site usa variantes AVIF/WebP
480, 800, 1280 e 1512 px; reprodução da compressão: `node tools/performance/hero-image.mjs`.

O CSS usa `object-fit: contain` para mostrar todo o recorte. No celular, a altura
da área da foto acompanha sua proporção e a logo fica abaixo, sem cobrir os rostos.
Preservam-se os limites já presentes na referência; não há promessa de recuperar
partes do corpo que a arte original já não mostrava.

## Prompt enviado à ferramenta

```text
Edit target: attached original marketing banner, 1200 x 540. Deliver ONLY a faithful wider crop of its photographic family area on the LEFT, approximately x=0 through x=785 and the FULL y=0 through y=540. This is a cropping task, NOT a redesign or generation of a new family. Preserve exactly the original four people (mother, older daughter, younger daughter, father), their identities, expressions, poses, clothing, hands, feet and devices, as far as visible in the source. Keep every visible part of those four people from the input inside the output. Do NOT zoom, tighten framing, replace faces, add limbs, or invent anything outside the source. Exclude the logo, headline, marketing copy and CTA on the right. Preserve the source's decorative curves and photographic colors, including the existing pale edge fade. Output the left family area as a single landscape image, approximately 785:540 aspect ratio; use full height and leave enough right margin to avoid clipping the father. No added text, no added logo, no new graphics. Save the image as a local file for use in the web project and return the file path.
```
