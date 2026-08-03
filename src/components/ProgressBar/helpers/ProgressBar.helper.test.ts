import { describe, expect, it } from 'vitest';
import {
  getProgressBarClassName,
  normalizeProgressBarValues,
} from './ProgressBar.helper';

describe('ProgressBar.helper', () => {
  it('normalizes, clamps and calculates the percentage', () => {
    expect(normalizeProgressBarValues(50, 0, 100)).toEqual({
      min: 0,
      max: 100,
      value: 50,
      percentage: 50,
    });
    expect(normalizeProgressBarValues(200, 0, 100).value).toBe(100);
    expect(normalizeProgressBarValues(-1, 0, 100).value).toBe(0);
  });

  it('recovers from non-finite and invalid limits', () => {
    expect(
      normalizeProgressBarValues(Number.NaN, Number.NaN, Number.NaN),
    ).toEqual({
      min: 0,
      max: 100,
      value: 0,
      percentage: 0,
    });
    expect(normalizeProgressBarValues(5, 10, 5)).toEqual({
      min: 10,
      max: 11,
      value: 10,
      percentage: 0,
    });
  });

  it('builds the semantic class list', () => {
    expect(getProgressBarClassName('danger', 'large', 'custom')).toBe(
      'hans-progress-bar hans-progress-bar-danger hans-progress-bar-large custom',
    );
    expect(getProgressBarClassName('base', 'small', '')).not.toContain('  ');
  });
});
