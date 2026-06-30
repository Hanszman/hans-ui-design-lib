import * as echarts from 'echarts';
import {
  COLOR_TOKEN_MAP,
  DEFAULT_COMBINATION_COLORS,
  type HansChartColor,
  type HansChartDataPoint,
  type HansChartLabelPosition,
  type HansChartSeries,
  type HansChartSeriesLabelOption,
  type HansChartSeriesType,
  type HansChartThemeColor,
  type HansChartType,
} from '../Chart.types';

export const readCssVar = (cssVar: string, fallback: string): string => {
  const value = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(cssVar)
    .trim();
  return value || fallback;
};

export const resolveTokenColor = (colorKey: HansChartThemeColor): string => {
  const token = COLOR_TOKEN_MAP[colorKey];
  return readCssVar(token.cssVar, token.fallback);
};

export const isChartColorKey = (
  value: HansChartColor,
): value is HansChartThemeColor => value in COLOR_TOKEN_MAP;

export const resolveColor = (color: HansChartColor): string => {
  if (isChartColorKey(color)) return resolveTokenColor(color);
  const cssVarMatch = color.match(/^var\((--[a-zA-Z0-9-]+)\)$/);
  if (!cssVarMatch) return color;
  return readCssVar(cssVarMatch[1], '#3d8bff');
};

export const buildRandomPalette = (): string[] =>
  [...DEFAULT_COMBINATION_COLORS].sort(() => Math.random() - 0.5);

export const normalizePieData = (
  data: HansChartDataPoint[],
  categories: string[],
): { name: string; value: number }[] =>
  data.map((item, index) =>
    typeof item === 'number'
      ? { name: categories[index] ?? `Item ${index + 1}`, value: item }
      : { name: item.name, value: item.value },
  );

export const getLabelRotation = (position: HansChartLabelPosition): number => {
  if (position === 'vertical') return 90;
  if (position === 'diagonal') return 45;
  return 0;
};

export const buildCartesianLabel = (
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

export const buildPieLabel = (
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

export const buildCommonSeriesStyle = (): Pick<
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

export const resolveChartTitle = (
  title: string,
): echarts.EChartsOption['title'] =>
  title
    ? {
        text: title,
        left: 'center',
        top: 8,
        padding: [0, 0, 12, 0],
        textStyle: {
          fontSize: 16,
          fontWeight: 600,
        },
      }
    : undefined;

export const resolveChartLegend = (
  showLegend: boolean,
): echarts.EChartsOption['legend'] =>
  showLegend
    ? {
        bottom: 0,
        left: 'center',
        type: 'plain',
        width: '90%',
        itemGap: 16,
        padding: [0, 8, 0, 8],
      }
    : undefined;

export const resolveChartGrid = (
  pieLike: boolean,
  showLegend: boolean,
): echarts.EChartsOption['grid'] =>
  pieLike
    ? undefined
    : {
        left: 8,
        right: 8,
        top: 16,
        bottom: showLegend ? 56 : 16,
        containLabel: true,
      };

export const resolvePieCenter = (
  showLegend: boolean,
  hasTitle: boolean,
): [string, string] => {
  if (showLegend && hasTitle) return ['50%', '46%'];
  if (showLegend) return ['50%', '42%'];
  if (hasTitle) return ['50%', '46%'];
  return ['50%', '50%'];
};

export const applyPieCenterToSeries = (
  series: echarts.SeriesOption[],
  pieCenter: [string, string],
): echarts.SeriesOption[] =>
  series.map((item) =>
    item.type === 'pie'
      ? {
          ...item,
          center: (item as echarts.PieSeriesOption).center ?? pieCenter,
        }
      : item,
  );

export const resolveCartesianType = (
  chartType: HansChartType,
  seriesType: HansChartSeriesType | undefined,
): 'line' | 'bar' => {
  if (chartType === 'mixed') {
    return seriesType === 'bar' ? 'bar' : 'line';
  }
  return chartType === 'bar' ? 'bar' : 'line';
};

export const buildCartesianSeries = (
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

export const resolvePieRadius = (
  chartType: HansChartType,
  seriesType: HansChartSeriesType | undefined,
): string | [string, string] => {
  const isDoughnut = chartType === 'doughnut' || seriesType === 'doughnut';
  return isDoughnut ? ['45%', '70%'] : '70%';
};

export const buildPieSeries = (
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

export const isPieLikeType = (
  chartType: HansChartType,
  series: HansChartSeries[],
): boolean => {
  if (chartType === 'pie' || chartType === 'doughnut') return true;
  return series.some(
    (item) => item.type === 'pie' || item.type === 'doughnut',
  );
};

export const hasPieSeries = (
  chartType: HansChartType,
  series: HansChartSeries[],
): boolean => {
  if (chartType === 'pie' || chartType === 'doughnut') return true;
  return series.some(
    (item) => item.type === 'pie' || item.type === 'doughnut',
  );
};

export const buildChartOption = (
  chartType: HansChartType,
  categories: string[],
  series: HansChartSeries[],
  palette: readonly string[],
  showLegend: boolean,
  title: string,
  optionOverrides: Record<string, unknown>,
): echarts.EChartsOption => {
  const pieLike = isPieLikeType(chartType, series);
  const pieSeries = hasPieSeries(chartType, series);
  const allSeries: echarts.SeriesOption[] = pieSeries
    ? buildPieSeries(chartType, series, categories)
    : buildCartesianSeries(chartType, series);
  const chartSeries = pieLike
    ? applyPieCenterToSeries(
        allSeries,
        resolvePieCenter(showLegend, Boolean(title)),
      )
    : allSeries;

  return {
    animation: false,
    title: resolveChartTitle(title),
    tooltip: {
      trigger: pieLike ? 'item' : 'axis',
      axisPointer: pieLike ? undefined : { type: 'line' },
    },
    legend: resolveChartLegend(showLegend),
    color: [...palette],
    grid: resolveChartGrid(pieLike, showLegend),
    xAxis: pieLike ? undefined : { type: 'category', data: categories },
    yAxis: pieLike ? undefined : { type: 'value' },
    series: chartSeries,
    ...(optionOverrides as echarts.EChartsOption),
  };
};
