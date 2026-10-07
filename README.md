# SplinkWeb

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build` to generate the used icons and build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Atualização dos planos

Edite `src/app/shared/model/plans.ts` para alterar velocidades, mensalidades,
benefícios e condições. `price: null` significa “sob consulta”; não use zero.
Os cards e o JSON-LD dos planos usam esses mesmos dados. O JSON-LD é inserido
no documento quando a página inicial é renderizada e removido ao sair dela.
`includedInAllPlans` reúne as condições comuns dos planos residenciais e também
alimenta os textos dos diferenciais. Não é necessário refazer as imagens.

Pendente de confirmação com o marketing: velocidades de upload, fidelidade de
12 meses, comodato sem custo e pacote/conteúdo incluído no Watch TV. As informações
atuais foram mantidas provisoriamente a pedido do responsável pelo projeto.

## Cobertura e interessados

A seção de cobertura recebe consultas de viabilidade e interesse em expansão.
O formulário valida o endereço e um telefone com DDD ou e-mail, e prepara uma
mensagem para o WhatsApp comercial definido em `links.whatsappBase`. O visitante
precisa confirmar o envio no WhatsApp; o site não grava cadastros em uma base e
não informa que a equipe recebeu a mensagem antes disso.

Edite `src/app/shared/model/coverage.ts` quando a operação fornecer a lista de
bairros por cidade. As listas estão vazias intencionalmente: o mapa disponível
não foi usado para deduzir bairros nem para aprovar cobertura automaticamente.
Cadastros de expansão aceitam outras cidades e não prometem atendimento ou prazo.

## WhatsApp e rastreamento

Mensagens e eventos são centralizados em `src/app/shared/generalutils.ts`.
Consulte [o inventário das tags e o guia de configuração](docs/rastreamento.md).
Eventos no dataLayer ainda dependem da configuração do GTM para chegar aos relatórios.
Contratações fechadas no WhatsApp exigem confirmação externa; cliques não são vendas.


## Desempenho e validação em celular

Veja a [comparação antes/depois e as condições de teste](docs/performance/README.md).
Os scripts em `tools/performance` reproduzem a compressão de imagens, as medições
Lighthouse e os testes de interface sem enviar mensagens ou formulários reais.

## Versão para aprovação e entrega

Consulte [o checklist, as evidências e as pendências de aprovação](docs/entrega/README.md).
O [guia de manutenção](docs/entrega/manutencao.md) explica como atualizar planos,
avaliações, bairros e contatos. O recebimento no WhatsApp/registro comercial
será validado pelo responsável conforme o [roteiro do atendimento](docs/entrega/validacao-atendimento.md).
Nenhuma publicação é feita pelos scripts de validação ou empacotamento.
