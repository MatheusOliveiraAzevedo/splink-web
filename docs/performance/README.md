# Desempenho e experiência no celular — etapa 6

A otimização adicional de JavaScript e ícones está documentada na
[segunda rodada](phase-2/README.md), com novas medições antes/depois.

## Resultado

A transferência total medida no celular caiu **75,7%** (2,32 MB → 0,56 MB) e o
LCP caiu **32,3%** (7,51 s → 5,08 s). No desktop, a transferência caiu **73,0%**
e o LCP caiu **24,5%**. O carrossel foi mantido, com setas abaixo dos cards no celular.

Os números abaixo são medianas de três execuções por perfil, em builds de produção.

| Métrica | Celular antes | Celular depois | Desktop antes | Desktop depois |
| --- | ---: | ---: | ---: | ---: |
| Pontuação Lighthouse (0–100) | 65 | 68 | 93 | 96 |
| Primeiro conteúdo — FCP | 4,07 s | 4,02 s | 0,90 s | 0,90 s |
| Maior conteúdo — LCP | 7,51 s | 5,08 s | 1,52 s | 1,15 s |
| Speed Index | 4,07 s | 4,02 s | 1,29 s | 1,32 s |
| Bloqueio por JavaScript — TBT | 96 ms | 205 ms | 0 ms | 0 ms |
| Deslocamento de layout — CLS | 0,00 | 0,00 | 0,00 | 0,00 |
| Transferência total medida | 2,32 MB | 0,56 MB | 2,32 MB | 0,63 MB |

**Limites e regressões:** o TBT móvel subiu de 96 ms para 205 ms. Os resultados
individuais foram 94–191 ms antes e 117–239,5 ms depois. Não há evidência suficiente
para atribuir essa diferença a uma alteração específica; ela não foi descartada
nem ocultada. O Speed Index do desktop variou de 1,29 s para 1,32 s. A etapa reduziu
principalmente transferência e espera pela imagem; o FCP móvel continua próximo de
4 s e o LCP em 5 s, portanto o carregamento móvel ainda merece uma futura revisão
da inicialização JavaScript/Angular. O CLS ficou em zero nas execuções registradas.

## Condições de teste

- Fonte anterior: commit `c1dd7c2`, copiado do build de produção antes de alterar os arquivos.
- Mesmo computador Apple M2, arm64, Darwin 27.0.0; Node 22.21.1.
- Lighthouse 12.8.2; navegador Chrome/154.0.8037.58 nas duas versões.
- Perfil novo, cache limpo e servidor HTTP local com gzip nível 6 e Cache-Control: no-store.
- Celular: 390 × 844, DPR 2, RTT 150 ms, 1.638,4 Kbit/s, CPU 4×.
- Desktop: 1440 × 900, DPR 1, RTT 40 ms, 10.240 Kbit/s, CPU 1×.
- Rede e CPU simuladas pelo Lighthouse; três execuções sequenciais por perfil,
  sem testes funcionais ou builds simultâneos.
- Nenhuma aceitação de cookies pré-gravada; a primeira visita inclui o aviso.
- URLs HTTPS externas bloqueadas nas duas versões: fontes Google, tags e mapa
  remoto ficam fora da medição. As instalações de marketing no site foram preservadas.

Períodos das medições, conforme os relatórios (UTC):

- Antes: 2026-10-04T14:26:14.473Z a 2026-10-04T14:26:56.453Z.
- Depois: 2026-10-05T11:23:49.124Z a 2026-10-05T11:24:31.271Z.

Esta é uma comparação local controlada, **não um resultado PageSpeed do site
publicado nem dados de usuários reais**. CDN, hospedagem, fontes remotas e tags
podem mudar os números em produção. A comparação mantém navegador, servidor,
cache e perfis iguais, mas não elimina a variação normal de carga do sistema.
O total de bytes é o observado pelo Lighthouse durante a coleta, não o tamanho
inteiro da pasta de assets. O navegador pode antecipar imagens lazy próximas à tela.

## Alterações entregues

- A versão recebida já tinha substituído os quatro banners antigos por uma foto.
  A foto agora usa `picture`, AVIF com fallback WebP e variantes de 480/800/960 px.
  `srcset` e `sizes` selecionam um único arquivo considerando tela e densidade.
- O preload usa os mesmos candidatos e só é criado na rota inicial. O banner não
  tem lazy loading e mantém prioridade alta. Não há download de banner nas páginas internas.
- Fachada com uma única imagem responsiva, variantes 480/800/1280 px e lazy loading.
  Foram retiradas as duas tags de imagem alternadas por CSS.
- Logo, ondas, ícone de WhatsApp e selo Android convertidos para WebP. Imagens
  abaixo da primeira tela usam carregamento adiado e dimensões para reservar espaço.
- O iframe do mapa é criado somente ao abrir “Ver mapa de referência da cobertura”.
- Retirada a segunda inclusão do CSS do Bootstrap. As escalas de fonte e espaçamento
  antigas, que eram mascaradas pela duplicação, foram corrigidas para os padrões
  já apresentados pelo site. O CSS gerado caiu de aproximadamente 482 kB para 312 kB
  sem compressão; não se removeu Bootstrap JavaScript nem biblioteca de carrossel.
- Cards ganham largura no celular com as setas abaixo. Botão flutuante menor e
  operável por teclado, campos com fonte mínima de 16 px e altura mínima de 44 px,
  menu com botões identificados em português e aviso de cookies adaptado à tela.
- Fontes Google continuam configuradas; a alternativa local agora é sans-serif
  para manter a leitura quando o serviço de fontes não estiver disponível.

Os originais e as artes antigas que já não aparecem na página foram preservados.
Não há necessidade de transferi-los durante a navegação. PDFs contratuais não foram
recomprimidos, pois não participam do carregamento inicial.

## Imagens: exemplos de redução

| Recurso | Original | Variante usada no teste móvel |
| --- | ---: | ---: |
| Foto do banner | 185.889 bytes | 36.693 bytes (AVIF 800 px) |
| Fachada | 1.374.015 bytes | 63.777 bytes (AVIF 800 px, sob demanda de rolagem) |
| Logo colorido | 156.009 bytes | 14.274 bytes (WebP 380 px) |
| Ícone WhatsApp | 46.479 bytes | 3.932 bytes (WebP 128 px) |

O inventário completo, inclusive os fallbacks WebP, está em [images.json](images.json).
A seleção pode mudar com a tela/DPR; imagens não foram ampliadas além do original.

## Testes de interface

Passaram em **320, 390, 768 e 1440 px**, em Chromium com emulação de viewport,
densidade e suporte a toque para os perfis menores:

- Primeira visita com aviso de cookies, sem rolagem horizontal indevida.
- Um único download de candidato do banner em cada perfil.
- Fachada ausente das requisições iniciais antes de rolar; mapa ausente do DOM até a interação.
- Menu móvel abre, navega aos planos e fecha; navegação desktop aos planos.
- Carrossel avança até 500 Mega e abre a mensagem com o plano escolhido.
- Consulta de cobertura indica campos inválidos e encaminha os dados com quebras de linha.
- Interesse em expansão aceita outra cidade e mantém o aviso de ausência de garantia/prazo.
- Currículo anexado e resposta positiva de API **simulados**, verificando o evento de envio.
- Botão flutuante funciona por clique e teclado Enter.
- Imagens visíveis carregam sem erro, sem erros JavaScript nem respostas 404 locais.
- A rota `/politica-de-privacidade` não baixa nenhuma variante da foto do banner.

Nenhuma mensagem ou candidatura real foi enviada. O teste do mapa verifica a
requisição no momento correto; o conteúdo remoto foi bloqueado. Não foram usados
aparelhos físicos nem Safari/iOS, e a emulação não substitui essa validação.

## Evidências e reprodução

- [Resultados antes](before.json), [resultados depois](after.json), [medianas](summary.json).
- Relatórios Lighthouse completos: `before-*.json.gz` e `after-*.json.gz` nesta pasta.
- [Testes de interface](screenshots/after-checks.json).
- [Celular antes](screenshots/before-390-hero.png) / [celular depois](screenshots/after-390-hero.png).
- [Desktop antes](screenshots/before-1440-hero.png) / [desktop depois](screenshots/after-1440-hero.png).
- [Carrossel no celular](screenshots/after-390-plans.png) e [formulário](screenshots/after-390-coverage.png).
- [Comandos e dependências fixadas](../../tools/performance/README.md).

O build de produção passou. Permanecem avisos do Sass/Bootstrap e o aviso de tamanho
do SCSS do carrossel, já existente. As medições não comprovam consentimento de tags
nem a classificação de conversões nas contas externas, assuntos da etapa 4.
