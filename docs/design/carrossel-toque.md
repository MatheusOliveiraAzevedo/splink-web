# Rolagem da página sobre os planos

A versão instalada do PrimeNG chama `preventDefault()` em qualquer `touchmove`
e decide a mudança de plano apenas pelo deslocamento horizontal final. Isso
bloqueava a rolagem vertical e podia trocar planos durante um gesto diagonal.

A diretiva `CarouselTouchDirectionDirective`, aplicada apenas ao carrossel de planos,
identifica o eixo predominante após 10 px de movimento e mantém essa direção até o
fim do gesto. Na fase de captura, impede que gestos verticais ou multitoque cheguem
aos handlers de movimento/finalização do PrimeNG, sem impedir o comportamento padrão
do navegador. Gestos horizontais continuam usando a navegação original da biblioteca.
Os listeners são removidos ao destruir o componente.

A viewport tem `touch-action: pan-y pinch-zoom`, preservando rolagem e zoom nativos.
Não foi alterado código em `node_modules`. Setas, indicadores e botões continuam no
carrossel original. Ao atualizar PrimeNG, revisar se os handlers internos ainda
precisam dessa adaptação e executar o teste de gestos.

Validação:

```sh
npm run build
node tools/performance/carousel-touch.mjs
```

O teste usa eventos de toque via Chrome DevTools Protocol em 320, 390 e 768 px:
rolagem vertical, diagonais predominantemente verticais nos dois sentidos, troca
horizontal de planos nos dois sentidos, seta e clique no botão comercial (interceptado,
sem envio real). Resultados: `docs/performance/carousel-touch/checks.json`.
É emulação Chromium; não substitui a conferência em um iPhone/Safari físico.
