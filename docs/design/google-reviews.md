# Avaliações do Google na página principal

Componente independente: `src/app/components/google-reviews/`.
Inserido depois de Quem somos, antes de Trabalhe conosco, com `@defer (on viewport)`.
As consultas de comentários só começam quando o componente é carregado e há configuração.
O banner também usa o SDK compartilhado para consultar notas e quantidades, sem comentários,
após sua renderização inicial; veja `banner-carousel.md`.

## Situação

Integração implementada; chave de navegador e Place IDs fornecidos pelo responsável
já preenchidos em `public/google-places.json`.
No teste real local de 14/10/2026, o Google retornou
`PLACES_GET_PLACE: PERMISSION_DENIED` porque o referenciador `http://127.0.0.1` na
porta do teste não estava autorizado. Isso não comprova falha no domínio de produção.
Em 15/10/2026, novo teste no endereço autorizado `http://localhost:4200/`
retornou HTTP 403 nas duas unidades, no endpoint
`places.googleapis.com/$rpc/google.maps.places.v1.Places/GetPlace`.
Resposta: `[7,"The caller does not have permission"]`.
A resposta atual não identifica bloqueio de referenciador nem detalha a permissão ausente.
Conferir no projeto da chave: Places API (New) e Maps JavaScript API habilitadas,
ambas permitidas nas restrições de APIs da chave e faturamento ativo.
Confirmar que as restrições da captura foram aplicadas à mesma chave usada pelo site.
Notas e comentários reais ainda não foram validados; manter as restrições de sites/APIs.

Teste real reproduzível, sem envio de formulários (até quatro consultas:
resumos no banner e avaliações das duas unidades):
`node tools/performance/google-places-live.mjs`.
O script usa o servidor já iniciado em `http://localhost:4200/`.
Outro endereço autorizado pode ser passado como primeiro argumento.
Pode consumir quota da API. As mensagens de diagnóstico ocultam a chave.

Sem chave/Place IDs, mostra apenas as unidades e links para seus perfis reais.
Não há notas antigas, avaliações inventadas ou substituição por dados de demonstração.
Os testes usam respostas simuladas fora do código publicado.

## Solicitar ao responsável

1. Projeto Google Cloud com faturamento ativo.
2. Habilitar Maps JavaScript API e Places API (New).
3. Criar chave de **navegador**, com restrição de sites (referenciadores HTTP),
   incluindo `https://sp-link.com.br/*` e os domínios de homologação utilizados.
   Incluir `https://www.sp-link.com.br/*` somente se esse domínio servir o site.
   Para desenvolvimento local, liberar `http://localhost:4200/*`.
4. Restringir a chave às APIs necessárias, configurar quotas e alertas de orçamento.
   Alertas não equivalem a um limite automático de gastos.
5. Obter o **Place ID** de cada perfil, conferindo o endereço: Tramandaí (Av. Curitiba,
   980) e Imbé (Av. Osório, 209, loja 03). Links `maps.app.goo.gl` e IDs de mapa de
   cobertura não são Place IDs. Usar a ferramenta oficial de identificação de lugares.

Preencher `public/google-places.json`:

```json
{
  "apiKey": "CHAVE_DE_NAVEGADOR_RESTRITA",
  "placeIds": {
    "tramandai": "PLACE_ID_CONFIRMADO_TRAMANDAI",
    "imbe": "PLACE_ID_CONFIRMADO_IMBE"
  }
}
```

Esses são marcadores explicativos, não valores válidos. O arquivo publicado fica em
`/google-places.json`; é uma configuração pública, não um cofre de segredos. Não usar
chave de servidor ou credenciais OAuth. A proteção da chave web depende das restrições
configuradas no Google Cloud. O site lê o JSON sem cache HTTP a cada montagem da seção.

## Comportamento

- Uma consulta de detalhes por unidade configurada, em paralelo. SDK compartilhado.
- Consulta `rating`, `userRatingCount`, `reviews`, `googleMapsURI` e `attributions`.
- Até cinco avaliações selecionadas por relevância pelo Google, sem filtrar por nota.
- Nota e quantidade específicas por unidade; não calcula uma média entre lojas.
- Mostra autor, avatar quando disponível, data, nota, texto original e links de fonte.
- Não usa `innerHTML`; URLs remotas aceitam somente HTTPS.
- Logo oficial do Google Maps e atribuições dos fornecedores acompanham o conteúdo.
- Sem avaliações, sem configuração ou em falha: mantém acesso direto ao perfil.
- Timeout evita carregamento indefinido; falha de uma unidade não oculta a outra.
- Sem persistência das avaliações em localStorage, banco ou arquivo do projeto.
- Não altera automaticamente notas legadas do JSON-LD: sua revisão continua pendente,
  conforme o diagnóstico. Não injeta avaliações no schema apenas para tentar obter estrelas.

## Validação

```sh
npm run build
node tools/performance/google-reviews.mjs dist/splink-web/browser docs/performance/google-reviews
```

Testes simulam sucesso, falta de configuração, resultados vazios, erro de uma unidade
e falha de SDK; verificam adiamento da carga, separação das lojas, links, escape de
texto e layout móvel/desktop. Após configurar a chave real, validar no domínio
autorizado, conferir os dois perfis e acompanhar consumo/erros no Google Cloud.
Os testes simulados não comprovam credenciais, faturamento ou dados reais retornados.

## Referências oficiais

- [Exemplo de avaliações com a biblioteca Places](https://developers.google.com/maps/documentation/javascript/place-reviews)
- [Configuração do projeto](https://developers.google.com/maps/documentation/javascript/cloud-setup)
- [Identificação do Place ID](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder)
- [Regras de atribuição/exibição](https://developers.google.com/maps/documentation/javascript/policies)
- [Cobrança](https://developers.google.com/maps/documentation/places/web-service/usage-and-billing)

`src/assets/google/google-maps.svg` é o logo cinza original, sem alterações, extraído
do pacote oficial Google_Maps_Attribution_Assets.zip indicado nas regras de atribuição.
