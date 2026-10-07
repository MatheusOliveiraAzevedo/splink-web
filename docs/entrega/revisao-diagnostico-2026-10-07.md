# Revisão do diagnóstico completo — 07/10/2026

Revisão do código atual e das evidências já registradas. Não houve alteração do
site, nova medição de desempenho, consulta às contas externas ou envio real nesta
revisão. O diagnóstico completo inclui agora a etapa 5, ausente do escopo registrado
na entrega de 05/10. Aquela entrega é histórica e não representa todas as alterações atuais.

| Etapa | Situação atual | O que falta |
| --- | --- | --- |
| 1. Correções urgentes | E-mail comercial separado do DPO, preços derivados dos mesmos dados dos cards, ofertas sob consulta sem preço zero, Imbé 209 loja 03 e “à toa” corrigidos. | Conferência externa do cadastro/endereço do Google e recebimento no e-mail comercial. |
| 2. Planos em texto | Título, cards, preços e diferenciais em HTML; carrossel mantido; 500 Mega destacado; informações centralizadas em `plans.ts`. | Aprovação comercial dos uploads, fidelidade, comodato, preços e conteúdo exato do Watch TV. A descrição do aplicativo é genérica e provisória. |
| 3. Cobertura | Cidades em texto; formulário completo; mensagem formatada; opção de expansão com ressalva; mapa não confirma viabilidade. | Lista oficial de bairros; confirmação de que a equipe recebe e registra os interesses. O formulário prepara o WhatsApp, não grava um cadastro independente. |
| 4. WhatsApp e rastreamento | Mensagens por plano/posição; eventos de clique e preparação separados; disparos locais indevidos da conversão legada retirados; instalações mantidas. | Auditar container GTM e destinos Analytics/Ads; confirmar recebimento; definir registro de contratação confirmada. Não há integração automática com vendas nem confirmação de envio comercial pelo site. |
| 5. Confiança e busca local | História, atuação local, fachada, endereços e rede própria aparecem; título principal e títulos de seções implementados; principais imagens descritas. | Avaliações visíveis, FAQ, suporte separado, identificação de segunda via, ajustes de marca/metadados e validação dos textos. Detalhes abaixo. |
| 6. Desempenho e celular | Imagens responsivas/comprimidas; um candidato do banner por perfil nos testes; mapa adiado; testes de interface em quatro larguras; comparações anteriores documentadas. | Medir novamente a versão final após mudanças de banner/fontes. As métricas anteriores não caracterizam o build atual. Testes em aparelhos físicos/Safari ainda não documentados. |
| 7. Validação e entrega | Checklist, roteiro de atendimento, orientação de manutenção, testes técnicos e pacote de aprovação existentes. | Atualizar checklist com etapa 5, documentos e pacote; repetir a validação final de links/formulários no build de aprovação; comprovar recebimento real e obter aprovação. |

## Lacunas concretas da etapa 5

1. **Avaliações:** não existe seção de avaliações/depoimentos na home. `src/index.html`
   mantém notas/quantidades (4,8/443 no agregado, 4,8/423 Tramandaí, 5,0/20 Imbé)
   sem comprovação atual nesta revisão. A descrição também contém “a melhor avaliação”
   e notas em `src/app/app.routes.ts`. Confirmar fonte/data e selecionar depoimentos
   reais antes de publicar a seção e atualizar os números.
2. **Perguntas frequentes:** não há FAQ sobre cobertura, instalação, fidelidade,
   planos e suporte. As respostas comerciais precisam acompanhar as condições aprovadas.
3. **Canais separados:** contratar e Central do Assinante existem, mas não há
   entrada claramente identificada para suporte nem rótulo de segunda via.
   O WhatsApp genérico usa mensagem comercial. Confirmar destino/fluxo de suporte;
   pode ser o mesmo número, com intenção e mensagem distintas.
4. **Marca:** os dois logos do menu têm `alt="Logo da SP Link"`; o título de
   fallback em `app.component.ts` é `SP-LINK`. Padronizar para SP-Link sem alterar URLs/IDs.
5. **Busca local/metadados:** o título inicial não menciona as cidades. As rotas
   internas têm título próprio, mas não descrição própria; o código só atualiza
   a meta description quando a rota fornece uma, podendo manter a descrição comercial
   ao navegar para políticas. Revisar também acentos de “Política”/“Página”.
6. **Acessibilidade residual:** links de mapas, redes sociais, lojas de aplicativos
   e algumas ações do rodapé estão em `span`, `i`, `img` ou `a` sem `href`, com
   apenas `(click)`. Usar links/botões reais e validar foco/teclado e nomes acessíveis.
   As imagens principais têm descrição; `alt=""` no ícone do botão flutuante é
   intencional, pois o botão já tem nome acessível.
7. **Aprovação institucional:** os textos locais, história/equipe e afirmação de
   rede própria estão presentes, mas a revisão do código não comprova aprovação da empresa.

## Limites da comprovação de rastreamento

- `whatsapp_click`: abertura solicitada, não venda nem entrega da mensagem.
- `form_prepared`: formulário comercial válido que preparou a mensagem.
- `form_submitted`: confirmação da API de currículo; não é um lead comercial.
- Contratação: acontece no atendimento e ainda exige registro/integração externa.
- Origem atual: site e posição do botão, mais plano quando escolhido. Não há
  atribuição individual de campanha/anúncio por UTM ou identificador de clique.
  Se esse for o sentido desejado de “origem”, acrescentar esse escopo explicitamente.

## Evidências consultadas

- Código: `src/app/shared/model/plans.ts`, `coverage.ts`, `links.ts`,
  `src/app/shared/generalutils.ts`, `src/index.html`, rotas e templates dos componentes.
- [Rastreamento](../rastreamento.md), [manutenção](manutencao.md),
  [roteiro de recebimento](validacao-atendimento.md).
- [Testes após a tipografia](../performance/typography/after-checks.json):
  320, 390, 768 e 1440 px aprovados, sem erros de JavaScript registrados;
  envios simulados e Chromium emulado.
- [Comparação anterior de desempenho](../performance/phase-2/README.md).
- Pacote `aprovacao-2026-10-05`: cópia fixa anterior aos últimos ajustes visuais.

Ordem sugerida: completar a etapa 5 e aprovar conteúdo; concluir informações externas
e recebimento; medir/testar o build final; gerar novo pacote para aprovação.
