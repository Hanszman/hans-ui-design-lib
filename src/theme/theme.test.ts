import { vi } from 'vitest';
import {
  getHansThemeVars,
  registerHansThemeApi,
  resetHansTheme,
  setHansTheme,
} from './theme';

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

  it('Should build css vars from a dynamic combination object', () => {
    expect(
      getHansThemeVars({
        primary: {
          strong: '#111111',
          default: '#222222',
          neutral: '#333333',
        },
        textColor: '#f5f5f5',
      }),
    ).toEqual({
      '--primary-strong-color': '#111111',
      '--primary-default-color': '#222222',
      '--primary-neutral-color': '#333333',
      '--text-color': '#f5f5f5',
    });
  });

  it('Should ignore empty theme values', () => {
    expect(
      getHansThemeVars({
        primary: {
          strong: '   ',
          default: '#222222',
        },
        backgroundColor: '',
      }),
    ).toEqual({
      '--primary-default-color': '#222222',
    });
  });

  it('Should apply theme vars to html and body to override existing data-theme usage', () => {
    document.body.setAttribute('data-theme', 'combination3');

    setHansTheme({
      primary: {
        default: '#445566',
      },
      backgroundColor: '#101010',
    });

    expect(
      document.documentElement.style.getPropertyValue('--primary-default-color'),
    ).toBe('#445566');
    expect(
      document.body.style.getPropertyValue('--primary-default-color'),
    ).toBe('#445566');
    expect(document.body.style.getPropertyValue('--background-color')).toBe(
      '#101010',
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

    setHansTheme(
      {
        secondary: {
          default: '#aa55cc',
        },
      },
      { clearDataTheme: true },
    );

    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    expect(document.body.hasAttribute('data-theme')).toBe(false);
  });

  it('Should reset only vars managed by the theme api', () => {
    document.documentElement.style.setProperty('--manual-token', '#abcdef');
    document.body.style.setProperty('--manual-token', '#abcdef');

    setHansTheme({
      primary: {
        default: '#123456',
      },
    });
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
      setHansTheme(
        {
          primary: {
            default: '#123456',
          },
        },
        { clearDataTheme: true },
      ),
    ).not.toThrow();
  });

  it('Should clear theme attributes even when document.body is not available yet', () => {
    const documentElement = document.documentElement;
    vi.stubGlobal('document', {
      documentElement,
      body: undefined,
    });

    expect(() =>
      setHansTheme(
        {
          primary: {
            default: '#123456',
          },
        },
        { clearDataTheme: true },
      ),
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
