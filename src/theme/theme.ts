import type {
  HansThemeApi,
  HansThemeCombination,
  HansThemeCssVars,
  HansThemeSemanticKey,
  HansThemeSetOptions,
  HansThemeToneLevel,
} from './theme.types';

export type {
  HansThemeApi,
  HansThemeCombination,
  HansThemeCombinationName,
  HansThemeCssVars,
  HansThemeSemanticKey,
  HansThemeSetOptions,
  HansThemeTone,
  HansThemeToneLevel,
} from './theme.types';

export const HANS_THEME_MANAGED_ATTR = 'data-hans-theme-vars';
export const HANS_THEME_WINDOW_KEY = 'HansUI';
export const HANS_THEME_DATA_ATTRIBUTE = 'data-theme';
export const HANS_THEME_COMBINATIONS = [
  'combination1',
  'combination2',
  'combination3',
  'combination4',
  'combination5',
] as const;
export const HANS_THEME_SEMANTIC_KEYS: HansThemeSemanticKey[] = [
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'info',
  'base',
];
export const HANS_THEME_TONE_LEVELS: HansThemeToneLevel[] = [
  'strong',
  'default',
  'neutral',
];
export const HANS_THEME_GLOBAL_VAR_MAP = {
  backgroundColor: '--background-color',
  textColor: '--text-color',
} as const;

export const normalizeThemeValue = (value: string | undefined): string =>
  value?.trim() ?? '';

export const getThemeCssVarName = (
  semanticKey: HansThemeSemanticKey,
  tone: HansThemeToneLevel,
): string => `--${semanticKey}-${tone}-color`;

export const getThemeTargets = (): HTMLElement[] => {
  if (typeof document === 'undefined') return [];
  return [document.documentElement, document.body].filter(
    (element): element is HTMLElement => Boolean(element),
  );
};

export const getManagedThemeVars = (element: HTMLElement): Set<string> =>
  new Set(
    (element.getAttribute(HANS_THEME_MANAGED_ATTR) ?? '')
      .split(',')
      .map((token) => token.trim())
      .filter(Boolean),
  );

export const setManagedThemeVars = (
  element: HTMLElement,
  managedVars: Set<string>,
): void => {
  if (managedVars.size === 0) {
    element.removeAttribute(HANS_THEME_MANAGED_ATTR);
    return;
  }

  element.setAttribute(
    HANS_THEME_MANAGED_ATTR,
    [...managedVars].sort().join(','),
  );
};

export const clearThemeAttribute = (): void => {
  if (typeof document === 'undefined') return;
  document.documentElement.removeAttribute(HANS_THEME_DATA_ATTRIBUTE);
  document.body?.removeAttribute(HANS_THEME_DATA_ATTRIBUTE);
};

export const getMissingThemeEntries = (theme: HansThemeCombination): string[] => {
  const missingEntries: string[] = [];

  HANS_THEME_SEMANTIC_KEYS.forEach((semanticKey) => {
    HANS_THEME_TONE_LEVELS.forEach((tone) => {
      if (!normalizeThemeValue(theme[semanticKey]?.[tone])) {
        missingEntries.push(`${semanticKey}.${tone}`);
      }
    });
  });

  if (!normalizeThemeValue(theme.backgroundColor)) {
    missingEntries.push('backgroundColor');
  }

  if (!normalizeThemeValue(theme.textColor)) {
    missingEntries.push('textColor');
  }

  return missingEntries;
};

export const assertCompleteHansTheme = (theme: HansThemeCombination): void => {
  const missingEntries = getMissingThemeEntries(theme);
  if (missingEntries.length === 0) return;

  throw new Error(
    `Hans theme requires all 23 color tokens. Missing: ${missingEntries.join(', ')}`,
  );
};

export const getHansThemeVars = (
  theme: HansThemeCombination,
): HansThemeCssVars => {
  assertCompleteHansTheme(theme);

  const cssVars: HansThemeCssVars = {};

  HANS_THEME_SEMANTIC_KEYS.forEach((semanticKey) => {
    HANS_THEME_TONE_LEVELS.forEach((tone) => {
      cssVars[getThemeCssVarName(semanticKey, tone)] = normalizeThemeValue(
        theme[semanticKey][tone],
      );
    });
  });

  cssVars[HANS_THEME_GLOBAL_VAR_MAP.backgroundColor] = normalizeThemeValue(
    theme.backgroundColor,
  );
  cssVars[HANS_THEME_GLOBAL_VAR_MAP.textColor] = normalizeThemeValue(
    theme.textColor,
  );

  return cssVars;
};

export const setHansTheme = (
  theme: HansThemeCombination,
  options: HansThemeSetOptions = {},
): void => {
  if (options.clearDataTheme) {
    clearThemeAttribute();
  }

  const targets = getThemeTargets();
  if (targets.length === 0) return;

  const themeVars = Object.entries(getHansThemeVars(theme));
  targets.forEach((element) => {
    const managedVars = getManagedThemeVars(element);
    themeVars.forEach(([cssVar, value]) => {
      element.style.setProperty(cssVar, value);
      managedVars.add(cssVar);
    });
    setManagedThemeVars(element, managedVars);
  });
};

export const resetHansTheme = (): void => {
  const targets = getThemeTargets();
  if (targets.length === 0) return;

  targets.forEach((element) => {
    const managedVars = getManagedThemeVars(element);
    managedVars.forEach((cssVar) => {
      element.style.removeProperty(cssVar);
    });
    setManagedThemeVars(element, new Set());
  });
};

export const registerHansThemeApi = (): void => {
  if (typeof window === 'undefined') return;

  const currentApi = (window[HANS_THEME_WINDOW_KEY] ?? {}) as Partial<HansThemeApi>;
  window[HANS_THEME_WINDOW_KEY] = {
    ...currentApi,
    setTheme: setHansTheme,
    resetTheme: resetHansTheme,
    getThemeVars: getHansThemeVars,
  };
};
