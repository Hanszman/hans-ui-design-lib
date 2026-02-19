import React from 'react';
import * as echarts from 'echarts';
import {
  type HansChartType,
  type HansChartSeriesType,
  type HansChartColor,
  type HansChartThemeColor,
  type HansChartDataPoint,
  type HansChartPointEvent,
  type HansChartLabelPosition,
  type HansChartSeriesLabelOption,
  type HansChartSeries,
  type HansChartProps,
  COLOR_TOKEN_MAP,
  DEFAULT_COMBINATION_COLORS,
} from './Chart.types';

const readCssVar = (cssVar: string, fallback: string): string => {
  const value = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(cssVar)
    .trim();
  return value || fallback;
};

const resolveTokenColor = (colorKey: HansChartThemeColor): string => {
  const token = COLOR_TOKEN_MAP[colorKey];
  return readCssVar(token.cssVar, token.fallback);
};

const isChartColorKey = (value: HansChartColor): value is HansChartThemeColor =>
  value in COLOR_TOKEN_MAP;

const resolveColor = (color: HansChartColor): string => {
  if (isChartColorKey(color)) return resolveTokenColor(color);
  const cssVarMatch = color.match(/^var\((--[a-zA-Z0-9-]+)\)$/);
  if (!cssVarMatch) return color;
  return readCssVar(cssVarMatch[1], '#3d8bff');
};

const buildRandomPalette = (): string[] =>
  [...DEFAULT_COMBINATION_COLORS].sort(() => Math.random() - 0.5);

const normalizePieData = (
  data: HansChartDataPoint[],
  categories: string[],
): { name: string; value: number }[] =>
  data.map((item, index) =>
    typeof item === 'number'
      ? { name: categories[index] ?? `Item ${index + 1}`, value: item }
      : { name: item.name, value: item.value },
  );

const getLabelRotation = (position: HansChartLabelPosition): number => {
  if (position === 'vertical') return 90;
  if (position === 'diagonal') return 45;
  return 0;
};

const buildCartesianLabel = (
  position: HansChartLabelPosition | undefined,
  formatter?: string,
): HansChartSeriesLabelOption | undefined => {
  if (!position || position === 'none') return { show: false };
  if (position === 'inside') {
    return { show: true, position: 'inside', formatter };
  }
  return {
    show: true,
    position: 'top',
    rotate: getLabelRotation(position),
    formatter,
  };
};

const buildPieLabel = (
  position: HansChartLabelPosition | undefined,
  formatter?: string,
): HansChartSeriesLabelOption | undefined => {
  if (!position || position === 'none') return { show: false };
  if (position === 'inside') {
    return { show: true, position: 'inside', formatter };
  }
  return {
    show: true,
    position: 'outside',
    rotate: getLabelRotation(position),
    formatter,
  };
};

const buildCommonSeriesStyle = (): Pick<
  echarts.SeriesOption,
  'emphasis' | 'select' | 'blur'
> => ({
  emphasis: {
    focus: 'none',
    scale: false,
    itemStyle: { opacity: 1 },
    lineStyle: { opacity: 1 },
  },
  select: {
    disabled: true,
  },
  blur: {
    itemStyle: { opacity: 1 },
    lineStyle: { opacity: 1 },
  },
});

const resolveCartesianType = (
  chartType: HansChartType,
  seriesType: HansChartSeriesType | undefined,
): 'line' | 'bar' => {
  if (chartType === 'mixed') {
    return seriesType === 'bar' ? 'bar' : 'line';
  }
  return chartType === 'bar' ? 'bar' : 'line';
};

const buildCartesianSeries = (
  chartType: HansChartType,
  series: HansChartSeries[],
): echarts.SeriesOption[] =>
  series.map((item): echarts.SeriesOption => {
    const seriesType = resolveCartesianType(chartType, item.type);
    const numericData = item.data.map((point) =>
      typeof point === 'number' ? point : point.value,
    );
    const label = buildCartesianLabel(
      item.label?.position,
      item.label?.formatter,
    );
    const commonStyle = buildCommonSeriesStyle();

    if (seriesType === 'bar') {
      return {
        type: 'bar',
        name: item.name,
        data: numericData,
        label,
        ...commonStyle,
      } as echarts.BarSeriesOption;
    }

    return {
      type: 'line',
      name: item.name,
      data: numericData,
      smooth: Boolean(item.smooth),
      label,
      ...commonStyle,
    } as echarts.LineSeriesOption;
  });

const resolvePieRadius = (
  chartType: HansChartType,
  seriesType: HansChartSeriesType | undefined,
): string | [string, string] => {
  const isDoughnut = chartType === 'doughnut' || seriesType === 'doughnut';
  return isDoughnut ? ['45%', '70%'] : '70%';
};

const buildPieSeries = (
  chartType: HansChartType,
  series: HansChartSeries[],
  categories: string[],
): echarts.SeriesOption[] =>
  series.map((item): echarts.SeriesOption => {
    const label = buildPieLabel(item.label?.position, item.label?.formatter);
    return {
      type: 'pie',
      name: item.name,
      radius: resolvePieRadius(chartType, item.type),
      avoidLabelOverlap: true,
      data: normalizePieData(item.data, categories),
      label,
      ...buildCommonSeriesStyle(),
    } as echarts.PieSeriesOption;
  });

const isPieLikeType = (
  chartType: HansChartType,
  series: HansChartSeries[],
): boolean => {
  if (chartType === 'pie' || chartType === 'doughnut') return true;
  return series.some((item) => item.type === 'pie' || item.type === 'doughnut');
};

const hasPieSeries = (
  chartType: HansChartType,
  series: HansChartSeries[],
): boolean => {
  if (chartType === 'pie' || chartType === 'doughnut') return true;
  return series.some((item) => item.type === 'pie' || item.type === 'doughnut');
};

export const HansChart = React.memo((props: HansChartProps) => {
  const {
    title = '',
    chartType = 'line',
    categories = [],
    series = [],
    colors,
    height = 320,
    showLegend = true,
    customClasses = '',
    emptyText = 'No data available',
    optionOverrides = {},
    onPointClick,
    ...rest
  } = props;

  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const instanceRef = React.useRef<echarts.ECharts | null>(null);
  const onPointClickRef = React.useRef<typeof onPointClick>(onPointClick);

  onPointClickRef.current = onPointClick;

  const palette = React.useMemo(() => {
    if (!colors || colors.length === 0) return buildRandomPalette();
    return colors.map(resolveColor);
  }, [colors]);

  const chartOption = React.useMemo(() => {
    const pieLike = isPieLikeType(chartType, series);
    const pieSeries = hasPieSeries(chartType, series);
    const allSeries: echarts.SeriesOption[] = pieSeries
      ? buildPieSeries(chartType, series, categories)
      : buildCartesianSeries(chartType, series);

    const baseOption: echarts.EChartsOption = {
      animation: false,
      title: title ? { text: title } : undefined,
      tooltip: {
        trigger: pieLike ? 'item' : 'axis',
        axisPointer: pieLike ? undefined : { type: 'line' },
      },
      legend: showLegend ? {} : undefined,
      color: palette,
      xAxis: pieLike ? undefined : { type: 'category', data: categories },
      yAxis: pieLike ? undefined : { type: 'value' },
      series: allSeries,
    };

    return {
      ...baseOption,
      ...(optionOverrides as echarts.EChartsOption),
    };
  }, [
    categories,
    chartType,
    optionOverrides,
    palette,
    series,
    showLegend,
    title,
  ]);

  React.useEffect(() => {
    if (!wrapperRef.current || series.length === 0) return;

    const instance = echarts.init(wrapperRef.current);
    instanceRef.current = instance;

    const handleResize = () => {
      instance.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      instance.dispose();
      instanceRef.current = null;
    };
  }, [series.length]);

  React.useEffect(() => {
    const instance = instanceRef.current;
    if (!instance) return;
    instance.setOption(chartOption, true);
  }, [chartOption]);

  React.useEffect(() => {
    const instance = instanceRef.current;
    if (!instance) return;

    const handleClick = (event: HansChartPointEvent) => {
      if (!onPointClickRef.current) return;
      onPointClickRef.current(event);
    };

    instance.off('click');
    instance.on('click', handleClick);

    return () => {
      instance.off('click');
    };
  }, [onPointClick]);

  if (series.length === 0) {
    return (
      <div
        className={`hans-chart hans-chart-empty ${customClasses}`}
        style={{ height }}
        {...rest}
      >
        <span className="hans-chart-empty-text">{emptyText}</span>
      </div>
    );
  }

  return (
    <div className={`hans-chart ${customClasses}`} style={{ height }} {...rest}>
      <div className="hans-chart-canvas" ref={wrapperRef} />
    </div>
  );
});

HansChart.displayName = 'HansChart';
