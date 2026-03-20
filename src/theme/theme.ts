import type { Color } from '../types/Common.types';

export type HansThemeSemanticKey = Color;
export type HansThemeToneLevel = 'strong' | 'default' | 'neutral';
export type HansThemeTone = Partial<Record<HansThemeToneLevel, string>>;
export type HansThemeCombinationName =
  | 'combination1'
  | 'combination2'
  | 'combination3'
  | 'combination4'
  | 'combination5';
export type HansThemeCombination = Partial<
  Record<HansThemeSemanticKey, HansThemeTone>
> & {
  backgroundColor?: string;
  textColor?: string;
};
export type HansThemeApi = {
  setTheme: typeof setHansTheme;
  resetTheme: typeof resetHansTheme;
  getThemeVars: typeof getHansThemeVars;
};

const HANS_THEME_MANAGED_ATTR = 'data-hans-theme-vars';
const HANS_THEME_WINDOW_KEY = 'HansUI';

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

const HANS_THEME_GLOBAL_VAR_MAP = {
  backgroundColor: '--background-color',
  textColor: '--text-color',
} as const;

const normalizeThemeValue = (value: string | undefined): string =>
  value?.trim() ?? '';

const getThemeCssVarName = (
  semanticKey: HansThemeSemanticKey,
  tone: HansThemeToneLevel,
): string => `--${semanticKey}-${tone}-color`;

const getThemeTargets = (): HTMLElement[] => {
  if (typeof document === 'undefined') return [];
  return [document.documentElement, document.body].filter(
    (element): element is HTMLElement => Boolean(element),
  );
};

const getManagedThemeVars = (element: HTMLElement): Set<string> =>
  new Set(
    (element.getAttribute(HANS_THEME_MANAGED_ATTR) ?? '')
      .split(',')
      .map((token) => token.trim())
      .filter(Boolean),
  );

const setManagedThemeVars = (
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

const clearThemeAttribute = (): void => {
  if (typeof document === 'undefined') return;
  document.documentElement.removeAttribute(HANS_THEME_DATA_ATTRIBUTE);
  document.body?.removeAttribute(HANS_THEME_DATA_ATTRIBUTE);
};

export const getHansThemeVars = (
  theme: HansThemeCombination,
): Record<string, string> => {
  const cssVars: Record<string, string> = {};

  HANS_THEME_SEMANTIC_KEYS.forEach((semanticKey) => {
    const tones = theme[semanticKey];
    if (!tones) return;

    HANS_THEME_TONE_LEVELS.forEach((tone) => {
      const value = normalizeThemeValue(tones[tone]);
      if (!value) return;
      cssVars[getThemeCssVarName(semanticKey, tone)] = value;
    });
  });

  const backgroundColor = normalizeThemeValue(theme.backgroundColor);
  if (backgroundColor) {
    cssVars[HANS_THEME_GLOBAL_VAR_MAP.backgroundColor] = backgroundColor;
  }

  const textColor = normalizeThemeValue(theme.textColor);
  if (textColor) {
    cssVars[HANS_THEME_GLOBAL_VAR_MAP.textColor] = textColor;
  }

  return cssVars;
};

export const setHansTheme = (
  theme: HansThemeCombination,
  options: { clearDataTheme?: boolean } = {},
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

  window[HANS_THEME_WINDOW_KEY] = {
    ...(window[HANS_THEME_WINDOW_KEY] ?? {}),
    setTheme: setHansTheme,
    resetTheme: resetHansTheme,
    getThemeVars: getHansThemeVars,
  };
};
