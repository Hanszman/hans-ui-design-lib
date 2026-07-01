import React from 'react';
import * as echarts from 'echarts';
import {
  type HansChartPointEvent,
  type HansChartProps,
} from './Chart.types';
import { HansLoading } from '../Loading/Loading';
import {
  buildRandomPalette,
  buildChartOption,
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
    isLoading = false,
    loadingType = 'skeleton',
    backgroundColor = 'transparent',
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

  const chartOption = React.useMemo(
    () =>
      buildChartOption(
        chartType,
        categories,
        series,
        palette,
        showLegend,
        title,
        backgroundColor,
        optionOverrides,
      ),
    [
      backgroundColor,
      categories,
      chartType,
      optionOverrides,
      palette,
      series,
      showLegend,
      title,
    ],
  );

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

  if (isLoading) {
    return (
      <div
        className={`hans-chart hans-chart-loading ${customClasses}`}
        style={{ height, backgroundColor }}
        {...rest}
      >
        {title ? <span className="hans-chart-title">{title}</span> : null}
        <HansLoading
          loadingType={loadingType}
          loadingSize="large"
          skeletonWidth="100%"
          skeletonHeight="100%"
          ariaLabel="Loading chart"
        />
      </div>
    );
  }

  if (series.length === 0) {
    return (
      <div
        className={`hans-chart hans-chart-empty ${customClasses}`}
        style={{ height, backgroundColor }}
        {...rest}
      >
        {title ? <span className="hans-chart-title">{title}</span> : null}
        <span className="hans-chart-empty-text">{emptyText}</span>
      </div>
    );
  }

  return (
    <div
      className={`hans-chart ${customClasses}`}
      style={{ height, backgroundColor }}
      {...rest}
    >
      {title ? <span className="hans-chart-title">{title}</span> : null}
      <div className="hans-chart-canvas" ref={wrapperRef} />
    </div>
  );
});

HansChart.displayName = 'HansChart';
