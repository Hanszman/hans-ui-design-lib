import {
  getLoadingClassName,
  LOADING_COLOR_MAP,
  normalizeLoadingDimension,
} from './Loading.helper';

describe('Loading.helper', () => {
  it('Should normalize numeric dimensions to px', () => {
    expect(normalizeLoadingDimension(32, '100%')).toBe('32px');
  });

  it('Should normalize string dimensions', () => {
    expect(normalizeLoadingDimension(' 75% ', '100%')).toBe('75%');
  });

  it('Should fallback dimensions for empty values', () => {
    expect(normalizeLoadingDimension('', '100%')).toBe('100%');
    expect(normalizeLoadingDimension(undefined, '40px')).toBe('40px');
  });

  it('Should build loading class name', () => {
    expect(getLoadingClassName('spinner', 'small', 'custom')).toContain(
      'hans-loading-spinner hans-loading-small custom',
    );
  });

  it('Should not apply size class for skeleton', () => {
    const className = getLoadingClassName('skeleton', 'large', 'custom');
    expect(className).toContain('hans-loading-skeleton');
    expect(className).not.toContain('hans-loading-large');
  });

  it('Should expose color tokens for all common colors', () => {
    expect(LOADING_COLOR_MAP.base.borderTop).toBe('var(--base-default-color)');
    expect(LOADING_COLOR_MAP.primary.skeleton).toBe(
      'var(--primary-neutral-color)',
    );
    expect(LOADING_COLOR_MAP.warning.border).toBe(
      'var(--warning-neutral-color)',
    );
  });
});
