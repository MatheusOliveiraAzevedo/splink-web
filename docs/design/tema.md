# Modo claro e escuro

Paleta consultada: página 16 do Manual de Identidade Visual SP-Link.
O modo escuro usa cinza `#4D4D4D`, verde `#0C725C`, destaque `#A2DF75`,
texto `#FEFEFE` e bordas `#8C8C8C`. Os cards usam uma variação do cinza
escurecida em 20%, para distinguir as superfícies. Erros têm uma cor funcional
clara para manter a leitura sobre fundo escuro.

## Manutenção

- Cores e ajustes do modo escuro: `src/styles/_theme.scss`. Alterar a pequena
  lista de variáveis no início desse arquivo; as regras abaixo adaptam os
  componentes existentes. Não há biblioteca adicional de temas.
- Controle: `src/app/components/theme-toggle/theme-toggle.component.ts`.
  Botão de sol/lua fixo no canto inferior esquerdo, com nome acessível.
- Estado: atributo `data-bs-theme` no `html`, compartilhado com Bootstrap
  e com o seletor configurado no PrimeNG em `app.config.ts`.
- Persistência: chave `splink-theme` em `localStorage`, valores `light`/`dark`.
  Não contém dados pessoais nem é enviada ao servidor. Permanece no mesmo
  navegador e domínio até ser alterada ou os dados do site serem apagados.
  Localhost, Vercel e domínio de produção têm preferências independentes.
- Padrão: claro. A escolha salva é aplicada no `index.html` antes dos estilos,
  evitando exibir primeiro uma página clara ao retornar no modo escuro.
  Se o navegador bloquear armazenamento, o botão continua funcionando na página,
  mas a preferência não pode ser persistida.
- Logos não são recoloridos; as versões existentes usam suporte claro quando
  necessário para preservar a legibilidade e a atribuição do Google Maps.

## Validação

`npm run build`

`node tools/performance/theme.mjs /tmp/splink-theme`

Testa 320, 390 e 1440 px, alternância pelo teclado, persistência após recarregar,
rotas internas, retorno ao claro, armazenamento bloqueado, cores de destaque,
menu móvel e ausência de rolagem horizontal. Avaliações são simuladas;
o teste não consome Google Places nem envia formulários.
