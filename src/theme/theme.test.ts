import { vi } from 'vitest';
import {
  assertCompleteHansTheme,
  getHansThemeVars,
  normalizeThemeValue,
  registerHansThemeApi,
  resetHansTheme,
  setHansTheme,
} from './theme';
import type { HansThemeCombination } from './theme.types';

const COMPLETE_THEME: HansThemeCombination = {
  primary: {
    strong: '#111111',
    default: '#222222',
    neutral: '#333333',
  },
  secondary: {
    strong: '#444444',
    default: '#555555',
    neutral: '#666666',
  },
  success: {
    strong: '#123123',
    default: '#234234',
    neutral: '#345345',
  },
  danger: {
    strong: '#456456',
    default: '#567567',
    neutral: '#678678',
  },
  warning: {
    strong: '#789789',
    default: '#89a89a',
    neutral: '#9ab9ab',
  },
  info: {
    strong: '#abcabc',
    default: '#bcdbcd',
    neutral: '#cdecde',
  },
  base: {
    strong: '#0f172a',
    default: '#334155',
    neutral: '#cbd5e1',
  },
  backgroundColor: '#f8fafc',
  textColor: '#020617',
};

describe('theme', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    document.documentElement.removeAttribute('data-theme');
    document.body.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-hans-theme-vars');
    document.body.removeAttribute('data-hans-theme-vars');
    document.documentElement.removeAttribute('style');
    document.body.removeAttribute('style');
    delete window.HansUI;
  });

  it('Should build css vars from a complete dynamic combination object', () => {
    expect(getHansThemeVars(COMPLETE_THEME)).toEqual({
      '--primary-strong-color': '#111111',
      '--primary-default-color': '#222222',
      '--primary-neutral-color': '#333333',
      '--secondary-strong-color': '#444444',
      '--secondary-default-color': '#555555',
      '--secondary-neutral-color': '#666666',
      '--success-strong-color': '#123123',
      '--success-default-color': '#234234',
      '--success-neutral-color': '#345345',
      '--danger-strong-color': '#456456',
      '--danger-default-color': '#567567',
      '--danger-neutral-color': '#678678',
      '--warning-strong-color': '#789789',
      '--warning-default-color': '#89a89a',
      '--warning-neutral-color': '#9ab9ab',
      '--info-strong-color': '#abcabc',
      '--info-default-color': '#bcdbcd',
      '--info-neutral-color': '#cdecde',
      '--base-strong-color': '#0f172a',
      '--base-default-color': '#334155',
      '--base-neutral-color': '#cbd5e1',
      '--background-color': '#f8fafc',
      '--text-color': '#020617',
    });
  });

  it('Should require all 23 color tokens in the dynamic combination object', () => {
    expect(() =>
      assertCompleteHansTheme({
        ...COMPLETE_THEME,
        primary: {
          ...COMPLETE_THEME.primary,
          neutral: '   ',
        },
      }),
    ).toThrow(/Hans theme requires all 23 color tokens/);
  });

  it('Should normalize undefined theme values to empty string', () => {
    expect(normalizeThemeValue(undefined)).toBe('');
  });

  it('Should require backgroundColor and textColor too', () => {
    expect(() =>
      assertCompleteHansTheme({
        ...COMPLETE_THEME,
        backgroundColor: ' ',
        textColor: '',
      }),
    ).toThrow(/backgroundColor, textColor/);
  });

  it('Should apply theme vars to html and body to override existing data-theme usage', () => {
    document.body.setAttribute('data-theme', 'combination3');

    setHansTheme(COMPLETE_THEME);

    expect(
      document.documentElement.style.getPropertyValue('--primary-default-color'),
    ).toBe('#222222');
    expect(
      document.body.style.getPropertyValue('--primary-default-color'),
    ).toBe('#222222');
    expect(document.body.style.getPropertyValue('--background-color')).toBe(
      '#f8fafc',
    );
    expect(
      document.documentElement.getAttribute('data-hans-theme-vars'),
    ).toContain('--primary-default-color');
    expect(document.body.getAttribute('data-hans-theme-vars')).toContain(
      '--background-color',
    );
  });

  it('Should clear data-theme attributes when requested', () => {
    document.documentElement.setAttribute('data-theme', 'combination2');
    document.body.setAttribute('data-theme', 'combination4');

    setHansTheme(COMPLETE_THEME, { clearDataTheme: true });

    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    expect(document.body.hasAttribute('data-theme')).toBe(false);
  });

  it('Should reset only vars managed by the theme api', () => {
    document.documentElement.style.setProperty('--manual-token', '#abcdef');
    document.body.style.setProperty('--manual-token', '#abcdef');

    setHansTheme(COMPLETE_THEME);
    resetHansTheme();

    expect(
      document.documentElement.style.getPropertyValue('--primary-default-color'),
    ).toBe('');
    expect(document.body.style.getPropertyValue('--primary-default-color')).toBe(
      '',
    );
    expect(document.documentElement.style.getPropertyValue('--manual-token')).toBe(
      '#abcdef',
    );
    expect(document.body.style.getPropertyValue('--manual-token')).toBe(
      '#abcdef',
    );
    expect(
      document.documentElement.hasAttribute('data-hans-theme-vars'),
    ).toBe(false);
    expect(document.body.hasAttribute('data-hans-theme-vars')).toBe(false);
  });

  it('Should register the theme api on window for CDN consumers', () => {
    registerHansThemeApi();

    expect(window.HansUI?.setTheme).toBe(setHansTheme);
    expect(window.HansUI?.resetTheme).toBe(resetHansTheme);
    expect(window.HansUI?.getThemeVars).toBe(getHansThemeVars);
  });

  it('Should be safe to call setHansTheme without document support', () => {
    vi.stubGlobal('document', undefined);

    expect(() =>
      setHansTheme(COMPLETE_THEME, { clearDataTheme: true }),
    ).not.toThrow();
  });

  it('Should clear theme attributes even when document.body is not available yet', () => {
    const documentElement = document.documentElement;
    vi.stubGlobal('document', {
      documentElement,
      body: undefined,
    });

    expect(() =>
      setHansTheme(COMPLETE_THEME, { clearDataTheme: true }),
    ).not.toThrow();
  });

  it('Should be safe to call resetHansTheme without document support', () => {
    vi.stubGlobal('document', undefined);

    expect(() => resetHansTheme()).not.toThrow();
  });

  it('Should be safe to register the theme api without window support', () => {
    vi.stubGlobal('window', undefined);

    expect(() => registerHansThemeApi()).not.toThrow();
  });
});
