# Carrossel do banner principal

O banner ocupa toda a largura da página e usa `p-carousel` do PrimeNG, a mesma
biblioteca já usada nos planos, com um item visível e navegação circular.
A biblioteca controla transição, setas, indicadores e autoplay a cada 8 segundos.
Os itens mantêm altura comum pelo layout flex do carrossel. O botão de pausa chama
`startAutoplay()` / `stopAutoplay()` da própria biblioteca, sem temporizador de rotação próprio.
Foco no conteúdo, navegação manual, mouse sobre o banner e aba oculta interrompem
a rotação; o visitante pode retomá-la em Iniciar. Movimento reduzido inicia pausado.
A diretiva de direção de toque usada nos planos também protege a rolagem vertical
no banner, permitindo navegação horizontal. Cada slide possui sua própria imagem responsiva dentro do item do PrimeNG; imagem,
gradiente e texto deslizam juntos. Por enquanto os dois usam o mesmo arquivo,
reaproveitado pelo navegador. A lista `slides` define `image` (prefixo dos arquivos),
`width`, `height` e `alt` separadamente. Ao trocar a arte, gerar as variantes
480/800/1280/1512 em AVIF/WebP e atualizar o preload em `src/index.html` se a primeira
imagem mudar.

A imagem usa `object-fit: cover` e ocupa todo o slide, inclusive no celular.
O texto fica sobre a foto, com gradiente verde mais intenso na área de leitura.
Não há uma faixa de imagem separada acima do conteúdo. O enquadramento se adapta à
proporção da tela, preservando a proporção da imagem; artes futuras devem manter
os elementos importantes em uma área segura. `sizes` e preload usam `100vw`.

Slides atuais:

1. Avaliações por unidade via Google Places, com nota, quantidade, atribuição e link.
   Em falta de configuração/erro, mantém links reais sem inventar notas. Não afirma
   “mais bem avaliada”, pois nota individual não comprova liderança no mercado.
2. Internet fibra óptica, com a foto atual, consulta de cobertura e acesso aos planos.

O banner consulta apenas resumo (`rating`, `userRatingCount`, `googleMapsURI`,
`attributions`), após a renderização inicial. Não solicita comentários. O SDK é
compartilhado com a seção de avaliações; essa seção consulta seus comentários somente
quando carregada. São até duas consultas de resumo no banner, além das consultas da
seção inferior; considerar isso nas quotas e custos. Não há armazenamento persistente.
A chave precisa autorizar localhost/Vercel/produção conforme o ambiente usado.

## Arte e conteúdo do programa de indicações

Preparar duas versões da imagem:

- Desktop: **1920 × 1080 px**, horizontal.
- Celular: **1080 × 1440 px**, vertical.
- Arquivo mestre em PNG ou JPG de alta qualidade; versão editável é bem-vinda.
- Deixar pessoas/logos/elementos essenciais longe das bordas e reservar área para
  título e botão. A área visível varia com tela e altura do conteúdo.
- Preferir imagem de fundo sem título, preço e botão incorporados: os textos ficam
  em HTML, selecionáveis e acessíveis. O site gera versões leves para publicação.
- Enviar título, descrição, benefício da indicação, critérios/regras, validade e
  destino do botão aprovados. Não há promoção fictícia publicada enquanto isso.

Implementação: `src/app/components/banner-principal/`.
O slide de indicação deverá ser adicionado com seus controles e rótulos, atualizando
a lista `slides`, o template de conteúdo e os testes; os dois slides atuais não constituem um CMS.

## Testes

`node tools/performance/hero-carousel.mjs` usa respostas simuladas de Places e valida
largura total, estabilidade entre slides, um título h1, redução de movimento, controles,
rotação e pausa em quatro larguras. Não comprova autorização da chave real.
