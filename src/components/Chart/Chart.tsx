import React from 'react';
import * as echarts from 'echarts';
import {
  type HansChartPointEvent,
  type HansChartProps,
} from './Chart.types';
import {
  buildCartesianSeries,
  buildPieSeries,
  buildRandomPalette,
  hasPieSeries,
  isPieLikeType,
  resolveColor,
} from './helpers/Chart.helper';

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
