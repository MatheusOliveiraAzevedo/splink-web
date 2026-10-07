# Como atualizar o conteúdo

Faça as alterações no código-fonte, execute `npm run build` e revise a versão
local antes de substituir o site publicado. O projeto não tem painel administrativo.

## Planos e condições

Arquivo: `src/app/shared/model/plans.ts`.

- `name`: nome exibido e enviado no WhatsApp; `id`: identificador usado no rastreamento.
  Preserve o ID de um plano existente para manter a continuidade dos registros.
- `download` e `upload`: números em Mbps; 1 Giga usa `download: 1000`.
- `price`: mensalidade numérica, com ponto decimal (ex.: `119.9` = R$ 119,90).
  Use `null` para “sob consulta”, nunca `0` para representar um preço desconhecido.
- `description` e `benefits`: descrição e lista de benefícios do card.
- `highlight: true` e `badge`: destaque visual; mantenha o 500 Mega destacado,
  a menos que o marketing aprove uma mudança.
- `includedInAllPlans`: equipamento, Watch TV, instalação, fidelidade e suporte
  dos planos residenciais. O card empresarial tem descrição e benefícios próprios.

Exemplo de alteração isolada: mudar `price: 119.9` para o novo valor aprovado no
objeto `id: '500'`. O card e o JSON-LD serão atualizados juntos. Não refaça artes.
Revise também as mensagens de WhatsApp se mudar o nome do plano.

**Antes da publicação:** confirmar uploads, fidelidade, comodato e o pacote exato
incluído no Watch TV. Esses dados continuam provisórios por orientação do responsável.
O texto atual não comprova a aprovação comercial dessas condições.

## Avaliações

As notas atuais estão em `src/index.html`, no bloco JSON-LD `InternetServiceProvider`:

| Local | `ratingValue` atual | `reviewCount` atual |
| --- | ---: | ---: |
| Agregado da empresa | 4.8 | 443 |
| `department` Tramandaí | 4.8 | 423 |
| `department` Imbé | 5.0 | 20 |

Esses são os valores encontrados no projeto, **não notas consultadas ou certificadas
na entrega**. Confirme fonte, data, unidade e quantidade antes de atualizar.

1. Consulte o perfil correto de cada unidade nos links de mapa de
   `src/app/shared/model/links.ts`; registre a data e a evidência da consulta.
2. Atualize `ratingValue` e `reviewCount` da unidade correspondente em `src/index.html`.
3. Revise também o `aggregateRating` da empresa. Não use média simples nem some
   avaliações sem confirmar que o agregado representa a mesma base, sem duplicação.
4. Atualize a descrição com as notas em **dois lugares**: `description` no JSON-LD
   de `src/index.html` e `data.description` da página inicial em `src/app/app.routes.ts`.
5. Confirme a afirmação “a melhor avaliação” antes de mantê-la. Uma nota isolada
   não demonstra comparação com todos os concorrentes.

Hoje não existe lista de depoimentos no corpo da página nem sincronização automática
com Google. Não invente comentários, autores ou números. Pesquise ocorrências antigas
com `rg -n 'ratingValue|reviewCount|estrelas|avaliação' src` depois da alteração.

## Bairros atendidos

Arquivo: `src/app/shared/model/coverage.ts`.

Preencha `neighborhoods` de Tramandaí e Imbé somente com a lista fornecida pela
operação. Exemplo de formato, que deve ser substituído por nomes reais aprovados:

```ts
{ name: 'Imbé', neighborhoods: ['NOME CONFIRMADO PELA OPERAÇÃO'] }
```

As listas vazias atuais indicam ausência da relação oficial, não ausência de cobertura.
Não deduza bairros do desenho do mapa. A página passa a exibir a lista automaticamente.
Mesmo com o bairro listado, a equipe continua confirmando a viabilidade de cada endereço.
O mapa é uma referência e o cadastro de expansão não promete prazo ou atendimento.

## Contatos e destinos

- WhatsApp, redes sociais, mapas, central, aplicativos e contratos:
  `src/app/shared/model/links.ts`.
- Rótulos de origem e mensagens: `src/app/shared/generalutils.ts`.
- E-mails/telefone/endereço visíveis: `src/app/components/footer/footer.component.html`.
  Para alterar dados da empresa, mantenha também o JSON-LD de `src/index.html` consistente.
- Destino do currículo: `src/app/shared/services/contact-form.service.ts`.
  O responsável pela API precisa validar o recebimento real e a resposta de sucesso.

## Verificação após editar

```sh
npm run build
node tools/performance/check.mjs dist/splink-web/browser docs/entrega/interface after
node tools/performance/delivery.mjs dist/splink-web/browser docs/entrega
```

Os testes de navegador usam as dependências isoladas de `tools/performance` e o
navegador configurado em `CHROME_PATH` (Brave no Mac por padrão). Veja
`tools/performance/README.md`. Os testes interceptam os envios: não substituem a
validação de recebimento pela equipe. Depois de uma alteração, gere uma nova versão
para aprovação; o pacote de 05/10/2026 é uma cópia fixa e não se atualiza sozinho.
