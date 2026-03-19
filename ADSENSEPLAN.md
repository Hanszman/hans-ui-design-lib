# AdSense v1 para a Hans UI Design Lib

## Summary

- Criar `HansAdSense` como um componente React reutilizável de **display ad unit manual**, seguindo o padrão da lib (`tsx`, `types`, `test`, `scss`, `mdx`, `stories` e helper se necessário).
- A lib vai encapsular a renderização da unidade de anúncio, mas o **script global do AdSense, a aprovação do site, `ads.txt`/meta tag e CMP** continuarão sendo responsabilidade do site host.
- A v1 será **React-first e segura**: exportar em `src/index.ts`, importar estilo em `src/styles/index.css` e **não** registrar no `src/index-wc.ts` nem no bundle CDN/Web Component.
- A documentação do componente vai ensinar o setup oficial do Google e deixar explícito que **a monetização é por conta + site aprovado**, não pela lib.

## Key Changes

- Criar `src/components/AdSense/AdSense.tsx`, `AdSense.types.ts`, `AdSense.test.tsx`, `AdSense.stories.tsx`, `AdSense.mdx` e `adsense.scss`.
- Se a lógica de fila/segurança ficar relevante, criar `src/components/AdSense/helpers/AdSense.helper.ts` e `AdSense.helper.test.ts`.
- Definir `HansAdSenseProps` com esta API pública:
  - `publisherId: string` obrigatório
  - `slotId: string` obrigatório
  - `adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal'` com default `'auto'`
  - `fullWidthResponsive?: boolean` com default `true`
  - `layout?: string`
  - `layoutKey?: string`
  - `ariaLabel?: string` com default `'Advertisement'`
  - `customClasses?: string`
  - `style?: React.CSSProperties`
  - herdar atributos HTML válidos do elemento contêiner
- Implementar o componente para renderizar o `<ins class="adsbygoogle">` com os `data-*` do Google e, no `useEffect`, executar `window.adsbygoogle.push({})` apenas quando a fila existir e a unidade ainda não tiver sido inicializada naquele mount.
- O componente **não** vai injetar o script do AdSense no `head`, **não** vai gerenciar Auto Ads e **não** vai tentar esconder regras de aprovação do Google dentro da lib.
- Adicionar tipagem global mínima para `window.adsbygoogle` em um arquivo de tipos compartilhado, sem espalhar `any`.
- Atualizar `src/index.ts` e `src/styles/index.css`; manter `src/index-wc.ts` sem mudanças para esse componente.
- Documentação do MDX deve cobrir:
  - como criar a conta AdSense
  - como adicionar e aprovar cada site
  - qual snippet global fica no host
  - quais campos do código gerado pelo Google viram props do componente
  - por que o componente pode ser reutilizado em vários sites, mas cada site precisa do próprio setup/aprovação
  - limitação explícita da v1: sem Web Component/CDN para AdSense

## Test Plan

- Renderiza a unidade com `publisherId`, `slotId` e atributos padrão corretos.
- Aplica defaults de responsividade e `ariaLabel`.
- Chama `adsbygoogle.push({})` uma vez quando a fila global está disponível.
- Não quebra nem chama `push` quando a fila global não existe.
- Não duplica inicialização em rerender simples do mesmo mount.
- Encaminha `customClasses` e `style` corretamente.
- Garante 100% de coverage do componente/helper e mantém `npm run test:coverage`, `npm run lint`, `npm run build` e `npm run build:storybook` como critérios de aceite.

## Assumptions

- O site host vai inserir o script global oficial do AdSense no `head` e cuidar de `ads.txt` ou meta tag conforme o fluxo do Google.
- Cada site que for monetizado será adicionado e aprovado separadamente na mesma conta AdSense.
- A v1 não cobre Auto Ads em runtime nem exportação via Web Component/CDN, porque o objetivo escolhido foi máxima compatibilidade com AdSense e menor risco técnico/político.
