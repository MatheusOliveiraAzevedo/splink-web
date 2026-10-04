# WhatsApp e rastreamento

## Instalações preservadas

| Instalação no código | ID | Situação |
| --- | --- | --- |
| Google Tag Manager | GTM-NXWZ6T7R | Script e noscript preservados; configuração interna não auditada sem acesso ao container. |
| Google Ads / Google tag | AW-16726610036 | Carregamento e configuração preservados. |
| Meta Pixel | 1528133588052375 | Inicialização, PageView e fallback noscript preservados. |
| Conversão legada | AW-16726610036/iCDjCILFi94ZEPSg76c- | ID documentado em google-tags.ts; finalidade na conta ainda precisa ser confirmada. |

A conversão legada era disparada incondicionalmente no carregamento da página e
novamente nos botões de WhatsApp, sempre com valor de R$ 1. Esses disparos foram
retirados: não demonstravam envio de mensagem nem contratação. Nenhuma instalação
foi removida. Não foram criadas ações de conversão nas contas externas.

GTM e gtag coexistirem não comprova duplicidade. O gestor deve verificar no Preview
se o container também instala AW-16726610036, o mesmo Pixel ou aciona a conversão
legada por carregamento, clique genérico ou formulário. Essas duplicidades externas
continuam possíveis; conferir antes de alterar qualquer instalação.

## Eventos implementados no site

Todos são publicados uma vez por ação em `window.dataLayer` por `GeneralUtils`,
com `source: 'splink_site'`. Não enviam valores monetários, contatos, endereços,
texto da mensagem ou URL do WhatsApp. Campos opcionais são zerados com `null` em
cada evento para evitar herdar o plano de um clique anterior.

| Evento | Quando ocorre | Significado |
| --- | --- | --- |
| whatsapp_click | Clique em um botão de WhatsApp | Intenção de abrir atendimento; não comprova mensagem entregue nem venda. |
| form_prepared | Formulário de cobertura/expansão válido prepara a mensagem | Dados preparados no navegador; não equivale a formulário recebido. |
| form_submitted | API do Trabalhe Conosco confirma `success: true` ou `status: 'success'` | Recebimento de candidatura, com `form_id: 'work_with_us'`; não é lead comercial nem contratação. |

`whatsapp_click` informa `position`, `plan_id`, `plan_name` e `intent`.
Posições: `hero`, `plans`, `floating`, `footer`, `about`, `watch_tv`, `wifi_6`,
`coverage_form`. Plano aparece apenas quando efetivamente
escolhido. A mensagem que chega ao atendimento inclui a origem em português.
O formulário comercial registra `form_prepared` e `whatsapp_click`. Os dados pessoais
seguem somente para a mensagem.

O contrato de resposta do Google Apps Script precisa ser conferido pelo responsável.
Respostas ambíguas, `success: false`, falhas e erros de parsing com HTTP 200 não
comprovam recebimento e não geram `form_submitted`. O site exibe “Envio não confirmado”.

## Contratação confirmada: integração pendente

A contratação acontece exclusivamente no WhatsApp. O frontend não tem acesso ao
resultado dessa conversa, portanto NÃO emite `contract_confirmed` nem `purchase`.
Também não tenta inferir venda ao voltar para a aba, clicar ou aguardar um tempo.

Até haver integração, a equipe precisa registrar os contratos efetivamente fechados
separadamente, com identificador único do contrato, data de confirmação, plano e
origem informada na mensagem. A origem identifica posição/plano, não permite por
si só atribuir uma venda individual a um clique de anúncio.

Para automatizar, a fonte confiável (sistema de contratos, CRM ou processo de
importação validado) deve produzir `contract_confirmed` somente após a confirmação,
com `transaction_id` único e `plan_id`. O responsável define o valor comercial real,
se aplicável. A deduplicação deve ocorrer por contrato na fonte persistente. Não
criar um botão público, parâmetro de URL ou evento de clique que confirme vendas.
Importação para Ads e ligação ao anúncio exigem configurar a coleta e associação
dos identificadores aceitos pela plataforma; isso ainda não foi implementado.

## Configuração necessária no GTM / Ads

1. Criar acionadores de evento personalizado com os nomes exatos acima e filtro
   `source = splink_site`. Configurar variáveis de camada de dados para os campos.
2. Encaminhar os eventos para o destino Analytics aprovado pelo responsável.
   O repositório não contém um ID GA4 explícito; não inventar um ID de medição.
3. Manter cliques e mensagens preparadas separados de vendas, sem receita fictícia.
   Se usados como conversões de intenção no Ads, classificá-los separadamente das
   contratações. Não mapear `form_submitted` do Trabalhe Conosco para lead comercial.
4. Verificar gatilhos genéricos de clique/envio e medição automática de formulários
   para não registrar novamente a mesma ação. Não coletar URLs de WhatsApp com a mensagem
   completa, pois elas podem conter endereço e contato.
5. No Preview, conferir um clique no plano 500 Mega (um `whatsapp_click`, plano 500),
   um clique genérico (plano null), formulário inválido (nenhum evento) e formulário
   comercial válido (preparação + clique, nenhuma venda).
6. Confirmar com o gestor a finalidade da ação legada antes de reclassificá-la ou
   reativá-la. Validar que uma visita não produz conversão de contratação.

Publicar objetos no dataLayer prepara a integração; não garante que os eventos já
cheguem aos relatórios. Os acionadores/destinos remotos ainda precisam ser configurados
e validados pelo gestor, sem alterar a política de consentimento nesta etapa.

Referências oficiais:
- [Camada de dados e eventos personalizados](https://developers.google.com/tag-platform/tag-manager/datalayer)
- [Medição de conversões](https://support.google.com/google-ads/answer/1722022)
- [Importação de conversões offline](https://support.google.com/google-ads/answer/7012522)
