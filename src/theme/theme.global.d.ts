declare global {
  interface Window {
    HansUI?: {
      setTheme?: typeof import('./theme').setHansTheme;
      resetTheme?: typeof import('./theme').resetHansTheme;
      getThemeVars?: typeof import('./theme').getHansThemeVars;
    };
  }
}

export {};
