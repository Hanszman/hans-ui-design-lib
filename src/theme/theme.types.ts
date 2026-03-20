import type { Color } from '../types/Common.types';

export type HansThemeSemanticKey = Color;
export type HansThemeToneLevel = 'strong' | 'default' | 'neutral';
export type HansThemeTone = Record<HansThemeToneLevel, string>;
export type HansThemeCombinationName =
  | 'combination1'
  | 'combination2'
  | 'combination3'
  | 'combination4'
  | 'combination5';
export type HansThemeCombination = Record<HansThemeSemanticKey, HansThemeTone> & {
  backgroundColor: string;
  textColor: string;
};
export type HansThemeSetOptions = {
  clearDataTheme?: boolean;
};
export type HansThemeCssVars = Record<string, string>;
export type HansThemeApi = {
  setTheme: (theme: HansThemeCombination, options?: HansThemeSetOptions) => void;
  resetTheme: () => void;
  getThemeVars: (theme: HansThemeCombination) => HansThemeCssVars;
};
