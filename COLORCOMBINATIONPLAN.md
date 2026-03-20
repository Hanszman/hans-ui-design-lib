# Parametrização dinâmica de combinations via API programática

## Summary

Adicionar uma API de tema em runtime, mantendo `data-theme="combination1..5"` 100% compatível como fallback.  
A arquitetura atual suporta isso bem porque os componentes já consomem apenas CSS variables sem depender de contexto React; então basta introduzir uma camada oficial da lib para aplicar um objeto de tokens semânticos no alvo desejado (`document.documentElement` por padrão).

## Key Changes

- Criar um contrato público de tema, algo como:
  - `HansThemeSemanticKey = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'base'`
  - `HansThemeTone = { strong: string; default: string; neutral: string }`
  - `HansThemeCombination = Partial<Record<HansThemeSemanticKey, HansThemeTone>> & { backgroundColor?: string; textColor?: string }`
  - `HansThemeTarget = HTMLElement | Document`
- Criar utilitários puros para:
  - normalizar o alvo (`Document` -> `document.documentElement`)
  - mapear o objeto para CSS vars (`primary.default` -> `--primary-default-color`)
  - aplicar/remover variáveis com `style.setProperty`
  - validar o mínimo esperado e preencher faltas com fallback da combination ativa ou da `combination1`
- Expor no pacote React/TS:
  - `setHansTheme(theme, options?)`
  - `resetHansTheme(options?)`
  - `getHansThemeVars(theme)`
- Expor a mesma API no bundle CDN/web components:
  - registrar `window.HansUI.setTheme(...)`
  - registrar `window.HansUI.resetTheme(...)`
- Regra de precedência:
  1. tema dinâmico aplicado por API no alvo
  2. `data-theme="combinationX"`
  3. fallback de `:root` já existente em `colors.scss`
- Manter `colors.scss` com as 5 combinations atuais, mas tratá-lo como baseline estático e fallback, não como único mecanismo.
- Atualizar docs do README e Storybook Color System com:
  - uso atual por `data-theme`
  - novo uso por objeto programático
  - exemplos React e CDN/Angular
- Atualizar o preview/documentação do Color System para também demonstrar a leitura do tema aplicado por API, não só das combinations fixas.

## Public API / Interfaces

- Novo arquivo público de tema exportado pelo `src/index.ts`.
- API proposta:
  - `setHansTheme(theme: HansThemeCombination, options?: { target?: HansThemeTarget; clearDataTheme?: boolean }): void`
  - `resetHansTheme(options?: { target?: HansThemeTarget }): void`
  - `getHansThemeVars(theme: HansThemeCombination): Record<string, string>`
- Comportamento:
  - `target` default: `document`
  - `clearDataTheme` default: `false`
  - chaves ausentes no objeto não quebram o tema; usam fallback
  - valores aceitos: `#hex`, `rgb(...)`, `hsl(...)`, `var(--alguma-coisa)` e equivalentes CSS válidos

## How It Works

- Hoje os componentes já leem tokens como `var(--primary-default-color)` nos SCSS e helpers.
- Com a nova API, a aplicação consumidora passa um objeto com os trios desejados.
- A lib converte esse objeto em CSS custom properties e grava no elemento-alvo.
- Como React app, Angular app e web components enxergam as mesmas CSS vars, todos passam a renderizar com a combinação customizada sem mudar os componentes.
- Exemplo conceitual:
  - React/npm: `setHansTheme({ primary: { strong: '#123', default: '#456', neutral: '#789' } })`
  - CDN: `window.HansUI.setTheme({ primary: { ... }, secondary: { ... } })`
- Se nenhum tema dinâmico for aplicado, tudo continua funcionando via `data-theme` exatamente como hoje.

## Test Plan

- Unit tests dos utilitários de mapeamento:
  - converte tokens semânticos em nomes corretos de CSS vars
  - aplica apenas chaves informadas
  - preserva fallback quando houver campos ausentes
  - remove vars no reset
- Tests de integração DOM:
  - `setHansTheme` escreve vars no `document.documentElement`
  - componentes renderizam usando o novo valor sem mudar props
  - `resetHansTheme` devolve comportamento ao `data-theme`/fallback
- Tests de compatibilidade:
  - `data-theme="combination1..5"` continua funcionando sem usar a nova API
  - Chart continua resolvendo cores por `getComputedStyle`
  - web component continua herdando CSS vars após `window.HansUI.setTheme`
- Storybook/manual acceptance:
  - docs exibem combinations fixas e tema dinâmico
  - build, lint e cobertura permanecem verdes
  - coverage 100% para os novos helpers e branches de fallback/reset

## Assumptions

- O escopo inicial vai parametrizar os tokens semânticos finais, não redefinir famílias base como `purple-500`.
- `data-theme` permanece suportado e documentado como caminho estático/fallback.
- A API principal será programática, única e shared entre npm/React e CDN.
- O alvo padrão será global; suporte por container/host pode existir via `target`, mas sem introduzir provider React nesta primeira versão.
