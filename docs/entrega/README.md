# Versão para aprovação — 05/10/2026

**Situação: entregue para revisão, sem publicação e com confirmações externas pendentes.**
Identificador: `aprovacao-2026-10-05`. O número interno do projeto continua 1.3.0.
O inventário SHA-256 do build está em [versao.json](versao.json).

## Abrir a versão

No repositório, depois de gerar o pacote:

```sh
node tools/performance/preview.mjs dist/entrega/aprovacao-2026-10-05/site 4173
```

Acesse http://127.0.0.1:4173 neste computador. Essa URL não é pública e não funciona
no celular de outra pessoa. Para compartilhar, envie o ZIP
`dist/entrega/aprovacao-2026-10-05.zip`; quem recebe pode extrair e executar
`node preview.mjs site 4173` com Node instalado, dentro da pasta extraída.
Não abra `index.html` diretamente por `file://`, pois a aplicação usa rotas e módulos.

Para uma URL de homologação compartilhada, o build precisa ser hospedado no ambiente
escolhido pela equipe. Nenhum ambiente público foi criado ou substituído nesta entrega.
A aprovação deve referenciar esta cópia fixa; alterações posteriores pedem uma nova versão.

## Checklist

| Item solicitado | Resultado | Observação |
| --- | --- | --- |
| E-mail comercial | Concluído no código | `mailto:comercial@splinktelecom.com.br`, separado do DPO; recebimento de e-mail não testado. |
| Preços nos dados estruturados | Concluído e testado | Mesma fonte dos cards; planos sob consulta sem oferta de preço zero. |
| Imbé: 209, loja 03 | Concluído no site | Rodapé e JSON-LD consistentes; link aponta ao perfil Imbé. Cadastro/endereço no Google exige conferência do responsável. |
| “Não é à toa” | Concluído | Texto corrigido. |
| Título, planos e diferenciais selecionáveis | Concluído | Conteúdo em HTML, carrossel preservado, 500 Mega destacado. |
| Velocidades, preço, equipamento, benefícios e condições | Implementado; aprovação comercial pendente | Upload, fidelidade, comodato e pacote Watch TV mantidos provisoriamente conforme orientação. |
| Tramandaí e Imbé em texto | Concluído | Formulário e seção de cobertura. |
| Lista de bairros | Estrutura pronta; conteúdo pendente | A operação ainda não forneceu a lista. Nenhum bairro foi deduzido do mapa. |
| Consulta de endereço e interesse em expansão | Concluído no site e testado | Dados em linhas separadas; equipe confirma viabilidade; expansão sem promessa. Usuário precisa enviar no WhatsApp. |
| WhatsApp por plano e posição | Concluído e testado localmente | Seis planos e oito outras entradas verificadas; mensagens e eventos em anexo. |
| Plano/origem recebidos e registrados no atendimento | Pendente de validação externa | Responsável optou por fazer depois. Não há integração automática com registro comercial. |
| Tags e separação entre clique/envio/contratação | Implementado no frontend | Instalações preservadas; revisão de duplicidades no GTM e destinos em Ads/Analytics dependem do gestor. Clique não gera venda. |
| Imagens responsivas/comprimidas, mapa adiado | Concluído e testado | Uma variante do banner; mapa sob interação; formulário de currículo carregado ao chegar à seção. |
| Desempenho antes/depois | Entregue | [Relatório da segunda rodada](../performance/phase-2/README.md); testes locais controlados, não dados de produção. |
| Links e formulários | Verificação técnica entregue | Escopo e exceções abaixo; testes de recebimento real pendentes. |
| Orientação de atualização | Entregue | [Planos, avaliações, bairros e contatos](manutencao.md). |
| Publicação | Não realizada | Versão destinada à aprovação. |

Escopo recebido: etapas 1, 2, 3, 4, 6 e 7. Não foi fornecida uma etapa 5.

## Links e formulários: evidências e limites

- [Validação técnica local](validacao-tecnica.json): verificações dos botões dos
  planos, todas as origens de WhatsApp, âncoras do menu/rodapé, três PDFs com
  assinatura de arquivo válida, políticas, página de erro e retorno ao início.
- E-mails e telefone: formato/destino conferidos; não houve envio de e-mail ou ligação.
- [Links externos](links-externos.json): 12 destinos consultados por GET, seguindo
  redirecionamentos. Onze responderam HTTP 200, incluindo redes sociais, central,
  mapas e lojas. Cloudflare Radar respondeu 403 com “Just a moment...”; conferir
  manualmente. A verificação não comprova login na central nem instalação dos apps.
- Formulário comercial: obrigatoriedade de endereço/contato, entradas inválidas,
  cobertura/expansão, formatação da mensagem, eventos separados e ausência de dados
  pessoais nos eventos testados. Não existe confirmação automática de recebimento.
- Currículo: consentimento obrigatório, campos obrigatórios, resposta positiva,
  negativa, ambígua, JSON inválido e falha de rede testados com API simulada.
  Apenas sucesso explícito gera `form_submitted`. O endpoint real não recebeu testes.
- [Interface em quatro larguras](interface/after-checks.json): 320, 390, 768 e 1440 px,
  com navegação, carrossel, mapa, formulários, cookies e teclado. Chromium emulado;
  não equivale a teste físico de iPhone/Android nem Safari.

Correções encontradas nesta revisão: o formulário de currículo agora exige a caixa
de consentimento também na primeira tentativa; caminhos de logo/imagem no JSON-LD
foram corrigidos para assets existentes. Build de produção passou; permanecem os
avisos conhecidos de Sass/Bootstrap e tamanho do SCSS do carrossel.

## Plano e origem: o que está comprovado

Os testes registram o número de destino, a mensagem completa preparada por cada
botão e os objetos emitidos no `dataLayer`, em [mensagens-whatsapp.md](mensagens-whatsapp.md).
Eles verificam a passagem de plano/origem **até a abertura preparada pelo site**.
Não comprovam mensagem enviada, entrega no WhatsApp, armazenamento pela equipe,
chegada a Analytics/Ads ou contratação. A recepção real está deliberadamente
pendente conforme combinado com o responsável.

Siga o [roteiro de conferência com o atendimento](validacao-atendimento.md) para
completar essa evidência antes da aprovação final. Consulte também o
[inventário de rastreamento](../rastreamento.md).

## Confirmações antes da publicação

- Marketing: condições comerciais provisórias, preços vigentes, pacote Watch TV
  e validade/fonte das notas e afirmações de avaliação existentes.
- Operação: lista oficial de bairros e conferência do endereço no perfil de Imbé.
- Atendimento: confirmar mensagem recebida e registro de plano/origem pelo roteiro.
- Responsável pela API de currículo: confirmar recebimento real e contrato da resposta.
- Gestor de tags: revisar Preview do GTM, duplicidades e chegada dos eventos ao destino.
- Responsável pelo site: registrar aprovação desta versão e autorizar publicação.

## Reproduzir

```sh
npm run build
node tools/performance/delivery.mjs dist/splink-web/browser docs/entrega
node tools/performance/check.mjs dist/splink-web/browser docs/entrega/interface after
node tools/performance/links.mjs
node tools/performance/package-approval.mjs
```

Dependências de navegador: `npm ci --prefix tools/performance`. O teste usa Brave
no Mac por padrão; `CHROME_PATH` permite outro executável Chromium.
O gerador do pacote exige relatórios aprovados e copia o build, os documentos e
um servidor local. `versao.json` registra os hashes; o ZIP fica em `dist/entrega/`.
