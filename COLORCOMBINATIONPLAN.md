# Dynamic Combination Theme API with Backward Compatibility

## Summary

Adicionar uma API pública de tematização dinâmica por objeto, sem quebrar o modelo atual baseado em `data-theme="combination1..5"`.  
A lib continuará suportando as 5 combinations existentes como comportamento oficial e estável, enquanto passa a aceitar um objeto com os trios semânticos (`primary`, `secondary`, `success`, etc.) para sobrescrever os CSS tokens em runtime.

## Key Changes

- Manter `src/styles/colors.scss` como baseline estático da lib:
  - preservar `:root` com fallbacks
  - preservar integralmente as 5 combinations atuais
  - manter `data-theme="combination1..5"` funcionando em React, CDN e Storybook
- Criar uma camada de theme runtime baseada em CSS variables, sem provider React:
  - `HansThemeSemanticKey = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'base'`
  - `HansThemeTone = { strong: string; default: string; neutral: string }`
  - `HansThemeCombination = Partial<Record<HansThemeSemanticKey, HansThemeTone>> & { backgroundColor?: string; textColor?: string }`
- Expor API pública no pacote npm:
  - `setHansTheme(theme, options?)`
  - `resetHansTheme(options?)`
  - `getHansThemeVars(theme)`
- Expor a mesma API no bundle CDN:
  - `window.HansUI.setTheme(...)`
  - `window.HansUI.resetTheme(...)`
- Implementar utilitários puros para:
  - transformar objeto de combination em mapa de CSS vars
  - aplicar vars no alvo (`document.documentElement` por padrão)
  - limpar vars dinâmicas no reset
  - preencher campos ausentes com fallback da combination ativa ou da `combination1`
- Definir precedência explícita:
  1. vars dinâmicas aplicadas pela API
  2. `data-theme="combinationX"`
  3. fallbacks de `:root`
- Atualizar `ColorSystemDocs.tsx` para documentar e demonstrar:
  - combinations fixas atuais
  - objeto dinâmico aplicado em runtime
  - leitura dos tokens resultantes após sobrescrita
- Atualizar `src/stories/ColorSystem/ColorSystem.mdx` com o novo sistema:
  - manter a explicação das 5 combinations existentes
  - explicar o novo modelo por objeto
  - mostrar exemplos de uso React/npm e CDN/web components
  - deixar claro quando usar `data-theme` e quando usar `setHansTheme`

## Consumer Implementations

- `hans-game-tracker-app` (Next/React via npm):
  - manter o uso atual de `import "hans-ui-design-lib/style.css"` e `data-theme="combination1"` em `src/app/layout.tsx`
  - adicionar um exemplo de consumo da API programática em client component, por exemplo no `ClientRoot`, aplicando um objeto customizado com `setHansTheme(...)`
  - garantir que o exemplo rode apenas no client e não introduza erro de SSR
- `hans-portfolio-app` (Angular via CDN/web components):
  - manter o uso atual do CSS e JS CDN em `src/index.html`
  - adicionar um exemplo de inicialização que chame `window.HansUI.setTheme(...)` após o bundle estar carregado
  - manter compatibilidade com o uso atual dos web components sem exigir mudança em `hans-button`, `hans-icon`, etc.
  - documentar que o tema dinâmico pode coexistir com `data-theme`, mas tem prioridade quando aplicado
- Em ambos os projetos irmãos, o exemplo deve ser demonstrativo e mínimo:
  - mostrar ao menos `primary` e `secondary`
  - incluir `backgroundColor` e `textColor`
  - evitar dependência de tokens internos não públicos

## Public API / Interfaces

- Novo módulo público de tema exportado por `src/index.ts`
- API proposta:
  - `setHansTheme(theme: HansThemeCombination, options?: { target?: HTMLElement | Document; clearDataTheme?: boolean }): void`
  - `resetHansTheme(options?: { target?: HTMLElement | Document }): void`
  - `getHansThemeVars(theme: HansThemeCombination): Record<string, string>`
- Comportamento:
  - `target` default: `document`
  - `clearDataTheme` default: `false`
  - valores ausentes usam fallback
  - aceitar valores CSS válidos como `#hex`, `rgb(...)`, `hsl(...)`, `var(--token)`

## Test Plan

- Unit tests dos helpers de theme:
  - mapeamento correto de tokens para CSS vars
  - aplicação parcial de objeto sem quebrar fallbacks
  - reset removendo apenas vars dinâmicas
  - precedência correta sobre `data-theme`
- Integração DOM:
  - `setHansTheme` altera `document.documentElement.style`
  - componentes continuam renderizando com os novos valores sem mudar props
  - Chart continua resolvendo cores por `getComputedStyle`
- Compatibilidade:
  - as 5 combinations atuais continuam funcionando sem a nova API
  - Storybook continua exibindo o color system corretamente
  - bundle npm e bundle CDN continuam expondo os estilos esperados
- Qualidade:
  - manter 100% coverage para o código novo
  - passar em lint, build da lib, build do CDN e build do Storybook
  - validar os exemplos nos dois projetos consumidores irmãos

## Assumptions

- O escopo inicial parametriza os tokens semânticos finais, não as famílias base como `purple-500`.
- O modelo atual com `data-theme="combination1..5"` permanece oficial, suportado e documentado.
- A API dinâmica será global/programática para servir React, Next, Angular e web components com a mesma implementação.
- O alvo padrão será global, sem introduzir provider React nesta primeira versão.
