# Revisão de carregamento — 19/10/2026

Medições da versão de produção local: três execuções por perfil antes e depois, mesma ferramenta, servidor gzip, cache frio e condições de CPU/rede. Valores abaixo são medianas. Serviços externos HTTPS foram bloqueados nas duas séries: estes números não medem a latência real do Google, anúncios ou hospedagem Vercel.

| Perfil | Métrica | Antes | Depois |
|---|---|---:|---:|
| mobile | performance | 64 | 72 |
| mobile | fcpMs | 5113.61 | 3608.42 |
| mobile | lcpMs | 6544.06 | 5187.93 |
| mobile | tbtMs | 0 | 105 |
| mobile | cls | 0.02 | 0.02 |
| mobile | transferBytes | 891043 | 585973 |
| desktop | performance | 95 | 98 |
| desktop | fcpMs | 939.56 | 694.15 |
| desktop | lcpMs | 1323.47 | 1074.15 |
| desktop | tbtMs | 0 | 0 |
| desktop | cls | 0 | 0 |
| desktop | transferBytes | 955605 | 650535 |

## Alterações

- Fontes latinas: 142.680 bytes no total, antes 379.408 bytes (redução de 62,4%). Originais preservados como alternativa para caracteres adicionais. Sem mudar famílias/pesos.
- Retirada da espera fixa de 1.200 ms antes da consulta de notas do banner. Isso elimina uma espera programada; não é uma medição de ganho na resposta externa.
- Biblioteca Places solicitada junto com SDK e conexões antecipadas aos domínios do Google.
- Configuração compartilhada em memória durante a página, evitando a segunda busca do JSON; falhas permitem tentar novamente.
- Comentários continuam adiados até a seção aparecer. Sem novas consultas pagas nem cache persistente de avaliações.

## Validação

Build aprovado, mantendo avisos existentes de Sass e orçamento CSS. Testes funcionais em 320, 390, 768 e 1440 px passaram, incluindo menu, formulários com envio simulado e verificação das fontes efetivamente renderizadas.

Teste real pelo localhost:4200 retornou Tramandaí 4,8 / 483 avaliações (4 comentários exibidos) e Imbé 5 / 19 avaliações (5 comentários exibidos), sem respostas de erro da API. As mensagens genéricas de recursos bloqueados pelo teste não foram contabilizadas como falha da API. Dados observados nesta data, sujeitos a alteração.

Não houve publicação. O ng serve de desenvolvimento não representa o desempenho da versão compilada de produção. O tempo real das notas ainda depende da conexão e dos servidores do Google.
