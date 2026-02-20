import '@testing-library/jest-dom';
import { vi } from 'vitest';
import {
  buildCartesianLabel,
  buildCartesianSeries,
  buildCommonSeriesStyle,
  buildPieLabel,
  buildPieSeries,
  buildRandomPalette,
  getLabelRotation,
  hasPieSeries,
  isChartColorKey,
  isPieLikeType,
  normalizePieData,
  readCssVar,
  resolveCartesianType,
  resolveColor,
  resolvePieRadius,
  resolveTokenColor,
} from './Chart.helper';

describe('Chart.helper', () => {
  it('Should read css var and fallback', () => {
    const value = readCssVar('--not-exist', 'fallback');
    expect(value).toBe('fallback');
  });

  it('Should identify chart color keys', () => {
    expect(isChartColorKey('primary')).toBe(true);
    expect(isChartColorKey('rgb(1,2,3)')).toBe(false);
  });

  it('Should resolve token and custom colors', () => {
    expect(resolveTokenColor('primary')).toBeTruthy();
    expect(resolveColor('secondary')).toBeTruthy();
    expect(resolveColor('rgb(1,2,3)')).toBe('rgb(1,2,3)');
    expect(resolveColor('var(--unknown-color)')).toBe('#3d8bff');
  });

  it('Should build randomized palette from defaults', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.3);
    expect(buildRandomPalette()).toHaveLength(7);
    randomSpy.mockRestore();
  });

  it('Should normalize pie data', () => {
    expect(normalizePieData([10, { name: 'B', value: 20 }], ['A'])).toEqual([
      { name: 'A', value: 10 },
      { name: 'B', value: 20 },
    ]);
  });

  it('Should return label rotations', () => {
    expect(getLabelRotation('vertical')).toBe(90);
    expect(getLabelRotation('diagonal')).toBe(45);
    expect(getLabelRotation('horizontal')).toBe(0);
  });

  it('Should build cartesian labels', () => {
    expect(buildCartesianLabel('none')).toEqual({ show: false });
    expect(buildCartesianLabel('inside', '{c}')).toEqual({
      show: true,
      position: 'inside',
      formatter: '{c}',
    });
    expect(buildCartesianLabel('diagonal', '{c}')).toEqual({
      show: true,
      position: 'top',
      rotate: 45,
      formatter: '{c}',
    });
  });

  it('Should build pie labels', () => {
    expect(buildPieLabel('none')).toEqual({ show: false });
    expect(buildPieLabel('inside', '{d}%')).toEqual({
      show: true,
      position: 'inside',
      formatter: '{d}%',
    });
    expect(buildPieLabel('vertical', '{d}%')).toEqual({
      show: true,
      position: 'outside',
      rotate: 90,
      formatter: '{d}%',
    });
  });

  it('Should build common series style', () => {
    const style = buildCommonSeriesStyle();
    expect(style.emphasis).toBeTruthy();
    expect(style.select).toEqual({ disabled: true });
    expect(style.blur).toBeTruthy();
  });

  it('Should resolve cartesian type and build cartesian series', () => {
    expect(resolveCartesianType('mixed', 'bar')).toBe('bar');
    expect(resolveCartesianType('mixed', 'line')).toBe('line');
    expect(resolveCartesianType('bar', undefined)).toBe('bar');

    const result = buildCartesianSeries('mixed', [
      { name: 'A', type: 'bar', data: [1, 2], label: { position: 'inside' } },
      { name: 'B', type: 'line', data: [3, 4], smooth: true },
    ]);
    expect(result[0]).toMatchObject({ type: 'bar' });
    expect(result[1]).toMatchObject({ type: 'line', smooth: true });
  });

  it('Should resolve pie radius and build pie series', () => {
    expect(resolvePieRadius('doughnut', undefined)).toEqual(['45%', '70%']);
    expect(resolvePieRadius('pie', 'doughnut')).toEqual(['45%', '70%']);
    expect(resolvePieRadius('pie', 'pie')).toBe('70%');

    const result = buildPieSeries(
      'pie',
      [{ name: 'Traffic', type: 'pie', data: [40, 60] }],
      ['A', 'B'],
    );
    expect(result[0]).toMatchObject({ type: 'pie', radius: '70%' });
  });

  it('Should detect pie-like and pie-series modes', () => {
    const mixedWithPie = [{ name: 'A', type: 'pie', data: [1] }] as const;
    expect(isPieLikeType('pie', [])).toBe(true);
    expect(isPieLikeType('mixed', mixedWithPie as never)).toBe(true);
    expect(hasPieSeries('doughnut', [])).toBe(true);
    expect(hasPieSeries('mixed', mixedWithPie as never)).toBe(true);
    expect(hasPieSeries('line', [{ name: 'L', type: 'line', data: [1] }])).toBe(
      false,
    );
  });
});
