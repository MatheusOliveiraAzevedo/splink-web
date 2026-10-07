# Otimização adicional do carregamento — 5 de outubro de 2026

Esta rodada parte da versão já otimizada da etapa 6. A mesma versão anterior foi
medida novamente nesta sessão; por isso sua pontuação móvel foi 70, enquanto o
relatório anterior registrou 68. Os resultados históricos foram preservados.

## Resultado

No celular simulado, o primeiro conteúdo apareceu **30,5% mais cedo** e o maior
conteúdo apareceu **20,3% mais cedo**. A transferência observada caiu **37,3%**.
São medianas de três execuções por perfil, incluindo o aviso de cookies na
primeira visita.

| Métrica | Celular antes | Celular depois | Desktop antes | Desktop depois |
| --- | ---: | ---: | ---: | ---: |
| Pontuação Lighthouse (0–100) | 70 | 81 | 96 | 98 |
| Primeiro conteúdo — FCP | 4,03 s | 2,80 s | 0,91 s | 0,73 s |
| Maior conteúdo — LCP | 5,03 s | 4,01 s | 1,15 s | 0,96 s |
| Speed Index | 4,03 s | 3,25 s | 1,31 s | 1,24 s |
| Bloqueio por JavaScript — TBT | 152 ms | 103 ms | 0 ms | 0 ms |
| Deslocamento de layout — CLS | 0,00 | 0,00 | 0,00 | 0,00 |
| Transferência total medida | 0,56 MB | 0,35 MB | 0,63 MB | 0,42 MB |

## O que mudou

- Políticas e página de erro carregam seus componentes ao acessar a rota.
- O formulário de currículo, a máscara de telefone e o aviso de resultado do envio
  carregam ao chegar à seção. A âncora `workUs` permanece disponível para o menu,
  com espaço reservado e mensagem em caso de falha no carregamento.
- O aviso de cookies usa o elemento `dialog` nativo, dispensando Angular Material
  e seu diálogo no bundle inicial. Mantém o atraso original de dois segundos,
  os textos, links, botões e comportamento de armazenamento. Tab/Shift+Tab
  circulam pelos controles; Escape não fecha o aviso sem uma escolha.
- O arquivo completo da fonte Bootstrap Icons (130.592 bytes transferidos no teste)
  e seu catálogo CSS foram substituídos pelos mesmos 16 desenhos SVG utilizados
  pelo site, em máscaras CSS. A geração é automática antes de `npm run build`;
  a licença original acompanha os arquivos.
- O build inicial passou de aproximadamente 1,31 MB para 1,04 MB sem compressão;
  a estimativa de transferência do build passou de 260,71 KB para 214,43 KB.
  Essa estimativa não inclui todas as imagens/fontes e não equivale ao total
  efetivamente observado pelo Lighthouse na tabela.

O carrossel, mensagens de WhatsApp e instalações de tags foram preservados.
Os componentes adiados continuam disponíveis durante a navegação; seus downloads
não fazem parte da primeira tela, mas ocorrem quando necessários.

## Método e limites

- Snapshot anterior: build da etapa 6, `main-KE7SSQ46.js`, copiado antes das alterações.
- Build posterior: `main-KXGXN6BO.js`, `styles-3IXY2TBG.css`.
- Lighthouse 12.8.2, Chrome/154.0.8037.58, Node 22.21.1, Apple M2 arm64.
- Servidor local com gzip nível 6, cache limpo, novo navegador por execução.
- Celular 390 × 844, DPR 2, RTT 150 ms, 1.638,4 Kbit/s e CPU 4×.
- Desktop 1440 × 900, DPR 1, RTT 40 ms, 10.240 Kbit/s e CPU 1×.
- Rede/CPU simuladas; execuções sequenciais, sem outros builds ou testes de
  navegador simultâneos. Mesmas configurações nas duas versões.
- URLs HTTPS externas bloqueadas em ambas: Google Fonts, tags e mapas remotos
  não entram no resultado. Não houve preferências de cookies pré-gravadas.
- Antes: 2026-10-05 12:37:10–12:37:50 UTC. Depois: 12:38:11–12:38:50 UTC.

Estas são medições locais controladas, não uma pontuação do site publicado.
A rede, hospedagem, serviços externos e aparelho do visitante afetam a experiência
real. O LCP móvel ainda está próximo de quatro segundos: houve melhora, mas não
se afirma que todo o trabalho de desempenho esteja esgotado. O CLS da tabela
abrange a abertura; não representa uma medição completa durante toda a rolagem.

## Validação

Build de produção e verificação de diferenças passaram. Continuam os avisos
preexistentes de Sass/Bootstrap e tamanho do SCSS do carrossel.

Os testes de navegador passaram em 320, 390, 768 e 1440 px: banner responsivo,
mapa sob demanda, menu, carrossel, mensagens de cobertura/expansão, envio simulado
de currículo, botão flutuante, ausência de rolagem horizontal e ícones SVG.
Também passaram foco com Tab/Shift+Tab, Escape, recusa, persistência da aceitação,
rotas de políticas e página de erro. Nenhuma mensagem ou candidatura real foi enviada.
Foram usados Chromium e emulação; não foram testados aparelhos físicos nem Safari.

## Evidências

- [Medições anteriores](before.json), [posteriores](after.json) e [medianas](summary.json).
- Relatórios Lighthouse completos: `before-*.json.gz` e `after-*.json.gz`.
- [Verificações de interface](screenshots/after-checks.json).
- [Aviso de cookies](screenshots/after-390-cookies.png) e [carrossel móvel](screenshots/after-390-plans.png).
- [Ferramentas e reprodução](../../../tools/performance/README.md).
