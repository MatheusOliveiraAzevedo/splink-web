# Banner principal e arte estática de avaliações

## Estado atual — 11/11/2026

A integração com Google Places foi retirada da página inicial e do banner.
O componente de comentários não é mais importado/renderizado na home. O serviço
antigo permanece no código-fonte, sem consumidores na aplicação publicada.
Não há busca de configuração, carregamento do SDK, consultas de nota/comentários
ou preconnects para Places. `public/google-places.json` foi removido.
O mapa de cobertura incorporado via My Maps continua separado dessa integração.

Até o marketing entregar a arte e os dados reais, aparece somente o banner de
internet, com foto, consulta de cobertura e acesso aos planos. Com um único slide,
não há setas, indicadores, autoplay ou botão de pausa.

## Briefing para o marketing

A arte substituirá **um slide completo**, incluindo composição, logo, títulos e
pontuações; não é apenas uma imagem para os antigos cartões.

| Versão | Arquivo mestre | Proporção | Seleção no site |
| --- | --- | --- | --- |
| Desktop | **1920 × 1080 px** | 16:9 | A partir de 992 px |
| Tablet (recomendada) | **1440 × 1080 px** | 4:3 | De 576 a 991 px |
| Celular | **1080 × 1440 px** | 3:4 | Até 575 px |

- Criar composições próprias para cada proporção. A versão de celular precisa ter
  textos legíveis na tela de 320 px; não reduzir simplesmente o arquivo desktop.
- Entregar PNG/JPG em alta qualidade e, se possível, o editável. Exportaremos os
  arquivos finais otimizados em WebP/AVIF, mantendo a legibilidade das notas.
- Manter textos e logos com margem de segurança de cerca de 10% das bordas.
- O site usa `object-fit: contain`, sem cortar notas, textos ou logos. Dependendo
  da tela, pode haver margens na cor de fundo do banner. Os controles ficam em
  uma área reservada abaixo da imagem, sem gradiente sobre a arte.
- Entregar junto a transcrição de **todo o texto** aprovado da arte: chamadas,
  nomes das unidades, nota de cada unidade na escala de 5, quantidade de avaliações
  se constar e data de conferência. Não somar nem tirar média entre unidades.
- As notas são uma fotografia da data informada e precisam de revisão manual.
  Alterações futuras devem atualizar imagem e transcrição juntas.
- Não afirmar liderança de mercado (ex.: “mais bem avaliada”) sem comprovação.

## Como inserir a arte quando chegar

Copiar os arquivos otimizados para `src/assets/banner/` e substituir o `null`
em `src/app/components/banner-principal/google-ratings-artwork.ts` por um objeto
com estes campos:

```ts
{
  desktop: 'assets/banner/avaliacoes-desktop.webp',
  tablet: 'assets/banner/avaliacoes-tablet.webp', // Opcional.
  mobile: 'assets/banner/avaliacoes-mobile.webp',
  description: 'TRANSCRIÇÃO REAL E COMPLETA DA ARTE, COM A DATA DE CONFERÊNCIA',
}
```

O valor de `description` acima é apenas um marcador de documentação. Só publicar
com texto aprovado e dados confirmados. Não há arquivos de arte fictícios no site.
Se `tablet` for omitido, telas de tablet usam a imagem desktop.
Ao habilitar o slide, atualizar também o preload em `src/index.html` para a nova
primeira imagem, incluindo sua seleção responsiva, em vez de antecipar a foto de internet.

O novo slide entra antes de Internet. O `p-carousel` do PrimeNG reativa as setas,
indicadores, navegação circular e autoplay a cada 8 segundos quando há dois slides.
Foco, mouse sobre o banner, aba oculta e preferência por movimento reduzido pausam
a rotação. A diretiva de toque preserva a rolagem vertical. Imagens e conteúdo
permanecem dentro do slide; slides inativos ficam `inert`.

## Texto acessível e indexação

A transcrição fica em um `figcaption` com a classe Bootstrap `visually-hidden`:
é HTML textual disponível para leitores de tela e para o processamento da página,
sem interferir no layout. A imagem tem `alt=""` porque seu equivalente completo já
está na legenda, evitando leitura duplicada. Não usar `display:none`, `hidden`
ou `aria-hidden` nessa legenda.

A legenda deve corresponder ao que qualquer visitante pode ler na imagem. Não é
um espaço para palavras-chave extras. Isso ajuda o Google a compreender o conteúdo,
mas não garante indexação nem estrelas nos resultados. Não foi acrescentado schema
de avaliações: as notas antigas sem confirmação foram retiradas do JSON-LD.

Referências:
- [Google: imagens e texto alternativo](https://developers.google.com/search/docs/appearance/google-images)
- [Google: texto oculto e acessibilidade](https://developers.google.com/search/docs/essentials/spam-policies#hidden-text-and-link-abuse)

## Validação

```sh
npm run build
node tools/performance/google-reviews.mjs dist/splink-web/browser /tmp/splink-no-places
node tools/performance/hero-carousel.mjs /tmp/splink-hero-carousel
```

O teste `google-reviews.mjs` agora verifica a **ausência** da integração em quatro
larguras, inclusive após rolar a página. Não permite chamadas externas reais.
O teste do banner verifica a apresentação provisória com um slide; atualizar o
cenário para a arte final quando ela for fornecida. O teste unitário do banner
exercita também a inserção de uma arte simulada com transcrição acessível e
seleção de imagem para desktop/tablet/celular.
