import '@testing-library/jest-dom';
import { vi } from 'vitest';
import {
  applyPieCenterToSeries,
  buildCartesianLabel,
  buildCartesianSeries,
  buildChartOption,
  buildCommonSeriesStyle,
  buildLegendItems,
  buildPieLabel,
  buildPieSeries,
  buildRandomPalette,
  buildRadarSeries,
  buildRadarTooltip,
  CHART_LEGEND_ROW_HEIGHT,
  getLabelRotation,
  hasPieSeries,
  isChartColorKey,
  isPieLikeType,
  isRadarLikeType,
  normalizePieData,
  observeThemeChanges,
  readCssVar,
  resolveCartesianType,
  resolveChartTextColor,
  resolveColor,
  resolvePieRadius,
  resolveChartGrid,
  resolveChartLegend,
  resolvePieCenter,
  resolveTokenColor,
} from './Chart.helper';

const CHART_TEXT_COLOR = resolveChartTextColor();

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
    expect(
      normalizePieData(
        [
          10,
          { name: 'B', value: 20 },
          { name: 'C', value: [30] },
          { name: 'D', value: [] },
        ],
        ['A'],
      ),
    ).toEqual([
      { name: 'A', value: 10 },
      { name: 'B', value: 20 },
      { name: 'C', value: 30 },
      { name: 'D', value: 0 },
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
      color: CHART_TEXT_COLOR,
    });
    expect(buildCartesianLabel('diagonal', '{c}')).toEqual({
      show: true,
      position: 'top',
      rotate: 45,
      formatter: '{c}',
      color: CHART_TEXT_COLOR,
    });
  });

  it('Should build pie labels', () => {
    expect(buildPieLabel('none')).toEqual({ show: false });
    expect(buildPieLabel('inside', '{d}%')).toEqual({
      show: true,
      position: 'inside',
      formatter: '{d}%',
      color: CHART_TEXT_COLOR,
    });
    expect(buildPieLabel('vertical', '{d}%')).toEqual({
      show: true,
      position: 'outside',
      rotate: 90,
      formatter: '{d}%',
      color: CHART_TEXT_COLOR,
    });
  });

  it('Should build common series style', () => {
    const style = buildCommonSeriesStyle();
    expect(style.emphasis).toBeTruthy();
    expect(style.select).toEqual({ disabled: true });
    expect(style.blur).toBeTruthy();
  });

  it('Should resolve chart title, legend, grid and pie center positions', () => {
    expect(resolveChartLegend(true)).toMatchObject({
      bottom: 0,
      left: 'center',
      type: 'plain',
      width: '90%',
      textStyle: {
        color: CHART_TEXT_COLOR,
      },
    });
    expect(resolveChartLegend(false)).toBeUndefined();
    expect(resolveChartGrid(false, true)).toMatchObject({
      left: 8,
      right: 8,
      top: 16,
      bottom: 56,
      containLabel: true,
    });
    expect(resolveChartGrid(true, true)).toBeUndefined();
    expect(resolvePieCenter(true)).toEqual(['50%', '42%']);
    expect(resolvePieCenter(false)).toEqual(['50%', '50%']);
  });

  it('Should resolve cartesian type and build cartesian series', () => {
    expect(resolveCartesianType('mixed', 'bar')).toBe('bar');
    expect(resolveCartesianType('mixed', 'line')).toBe('line');
    expect(resolveCartesianType('bar', undefined)).toBe('bar');

    const result = buildCartesianSeries('mixed', [
      { name: 'A', type: 'bar', data: [1, 2], label: { position: 'inside' } },
      {
        name: 'B',
        type: 'line',
        data: [
          { name: 'first', value: [3] },
          { name: 'second', value: 4 },
        ],
        smooth: true,
      },
      {
        name: 'Empty array',
        type: 'line',
        data: [{ name: 'empty', value: [] }],
      },
    ]);
    expect(result[0]).toMatchObject({ type: 'bar' });
    expect(result[1]).toMatchObject({ type: 'line', smooth: true });
    expect(result[2]).toMatchObject({ data: [0] });
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

  it('Should apply pie centers and build chart options', () => {
    expect(
      applyPieCenterToSeries(
        [
          {
            type: 'pie',
            name: 'Traffic',
            radius: '70%',
            avoidLabelOverlap: true,
            data: [{ name: 'Organic', value: 10 }],
            label: { show: true, position: 'outside' },
            emphasis: {
              focus: 'none',
              scale: false,
              itemStyle: { opacity: 1 },
            },
            select: { disabled: true },
            blur: { itemStyle: { opacity: 1 } },
          },
          {
            type: 'line',
            name: 'Fallback',
            data: [2],
            smooth: false,
            emphasis: {
              focus: 'none',
              scale: false,
              itemStyle: { opacity: 1 },
            },
            select: { disabled: true },
            blur: { itemStyle: { opacity: 1 } },
          },
        ],
        ['50%', '42%'],
      ),
    ).toMatchObject([
      { type: 'pie', center: ['50%', '42%'] },
      { type: 'line', name: 'Fallback' },
    ]);

    expect(
      buildChartOption(
        'pie',
        ['Organic'],
        [{ name: 'Traffic', type: 'pie', data: [10] }],
        ['#8257e5'],
        true,
        'transparent',
        {},
      ),
    ).toMatchObject({
      backgroundColor: 'transparent',
      legend: {
        bottom: 0,
        left: 'center',
        textStyle: {
          color: CHART_TEXT_COLOR,
        },
      },
      series: [{ center: ['50%', '42%'] }],
    });
  });

  it('Should build a cartesian option with themed axis label colors', () => {
    expect(
      buildChartOption(
        'bar',
        ['JavaScript', 'TypeScript'],
        [{ name: 'Usage', type: 'bar', data: [48, 29] }],
        ['#8257e5'],
        false,
        'transparent',
        {},
      ),
    ).toMatchObject({
      xAxis: {
        type: 'category',
        data: ['JavaScript', 'TypeScript'],
        axisLabel: { color: CHART_TEXT_COLOR },
      },
      yAxis: { type: 'value', axisLabel: { color: CHART_TEXT_COLOR } },
    });
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

  it('Should build radar series and localized tooltip values', () => {
    const indicators = [
      { name: 'Professional', max: 48 },
      { name: 'Personal', max: 48 },
    ];
    const radarSeries = buildRadarSeries([
      {
        name: 'Angular',
        type: 'radar',
        data: [
          { name: 'Angular', value: [36, 12] },
          { name: 'Scalar', value: 4 },
          2,
        ],
      },
    ]);

    expect(radarSeries[0]).toMatchObject({
      type: 'radar',
      data: [
        { name: 'Angular', value: [36, 12] },
        { name: 'Scalar', value: [4] },
        { name: 'Angular', value: [2] },
      ],
    });
    expect(isRadarLikeType('radar', [])).toBe(true);
    expect(
      isRadarLikeType('mixed', [{ name: 'A', type: 'radar', data: [1] }]),
    ).toBe(true);
    expect(isRadarLikeType('line', [])).toBe(false);

    const tooltip = buildRadarTooltip(
      indicators,
      (value, _index, indicator) => `${value} months in ${indicator.name}`,
    ) as { formatter: (params: unknown) => string };
    expect(
      tooltip.formatter({ name: 'Angular', value: [36, Number.NaN] }),
    ).toBe(
      'Angular\nProfessional: 36 months in Professional\nPersonal: 0 months in Personal',
    );

    const defaultTooltip = buildRadarTooltip(indicators) as {
      formatter: (params: unknown) => string;
    };
    expect(
      defaultTooltip.formatter([{ seriesName: 'Angular', value: [1] }]),
    ).toBe('Angular\nProfessional: 1\nPersonal: 0');
    expect(defaultTooltip.formatter({ value: 7 })).toBe(
      'Professional: 0\nPersonal: 0',
    );
  });

  it('Should build legend items for pie-like and cartesian charts', () => {
    expect(
      buildLegendItems(
        'pie',
        ['A', 'B'],
        [{ name: 'Traffic', type: 'pie', data: [10, 20] }],
        ['#111111', '#222222'],
      ),
    ).toEqual([
      { name: 'A', color: '#111111' },
      { name: 'B', color: '#222222' },
    ]);

    expect(
      buildLegendItems(
        'bar',
        [],
        [
          { name: 'Front-End', type: 'bar', data: [1] },
          { name: 'Back-End', type: 'bar', data: [2] },
        ],
        ['#333333'],
      ),
    ).toEqual([
      { name: 'Front-End', color: '#333333' },
      { name: 'Back-End', color: '#333333' },
    ]);

    expect(
      buildLegendItems(
        'bar',
        [],
        [{ name: 'Solo', type: 'bar', data: [1] }],
        [],
      ),
    ).toEqual([{ name: 'Solo', color: 'currentColor' }]);
  });

  it('Should expose a fixed legend row height for scrollable legends', () => {
    expect(CHART_LEGEND_ROW_HEIGHT).toBe(40);
  });

  it('Should notify subscribers when the theme attributes mutate and stop on cleanup', async () => {
    const onChange = vi.fn();
    const stopObserving = observeThemeChanges(onChange);

    document.documentElement.style.setProperty('--text-color', '#123456');
    await vi.waitFor(() => expect(onChange).toHaveBeenCalled());

    onChange.mockClear();
    stopObserving();
    document.documentElement.style.setProperty('--text-color', '#654321');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('Should no-op when MutationObserver is unavailable', () => {
    const originalMutationObserver = globalThis.MutationObserver;
    delete (globalThis as { MutationObserver?: typeof MutationObserver }).MutationObserver;

    const stopObserving = observeThemeChanges(vi.fn());
    expect(() => stopObserving()).not.toThrow();

    globalThis.MutationObserver = originalMutationObserver;
  });

  it('Should build a native radar option without cartesian axes', () => {
    expect(
      buildChartOption(
        'radar',
        [],
        [{ name: 'Angular', data: [{ name: 'Angular', value: [24, 6] }] }],
        ['#8257e5'],
        false,
        'transparent',
        {},
        [
          { name: 'Professional', max: 24 },
          { name: 'Personal', max: 24 },
        ],
      ),
    ).toMatchObject({
      radar: {
        indicator: [
          { name: 'Professional', max: 24 },
          { name: 'Personal', max: 24 },
        ],
      },
      grid: undefined,
      xAxis: undefined,
      yAxis: undefined,
      series: [{ type: 'radar' }],
    });
  });
});
