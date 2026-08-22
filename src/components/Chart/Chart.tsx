import React from 'react';
import * as echarts from 'echarts';
import { type HansChartPointEvent, type HansChartProps } from './Chart.types';
import { HansLoading } from '../Loading/Loading';
import {
  buildLegendItems,
  buildRandomPalette,
  buildChartOption,
  observeThemeChanges,
  resolveColor,
  CHART_LEGEND_ROW_HEIGHT,
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
    legendScrollable = false,
    isLoading = false,
    loadingType = 'skeleton',
    backgroundColor = 'transparent',
    customClasses = '',
    emptyText = 'No data available',
    optionOverrides = {},
    radarIndicators = [],
    radarValueFormatter,
    onPointClick,
    ...rest
  } = props;

  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const instanceRef = React.useRef<echarts.ECharts | null>(null);
  const onPointClickRef = React.useRef<typeof onPointClick>(onPointClick);
  const randomPaletteRef = React.useRef<string[] | null>(null);
  const [isChartReady, setIsChartReady] = React.useState(false);
  const [themeTick, setThemeTick] = React.useState(0);

  onPointClickRef.current = onPointClick;

  React.useEffect(
    () => observeThemeChanges(() => setThemeTick((tick) => tick + 1)),
    [],
  );

  const palette = React.useMemo(() => {
    void themeTick;
    if (colors && colors.length > 0) return colors.map(resolveColor);
    randomPaletteRef.current ??= buildRandomPalette();
    return randomPaletteRef.current;
  }, [colors, themeTick]);

  const showScrollableLegend = showLegend && legendScrollable;

  const legendItems = React.useMemo(
    () =>
      showScrollableLegend
        ? buildLegendItems(chartType, categories, series, palette)
        : [],
    [categories, chartType, palette, series, showScrollableLegend],
  );

  const chartOption = React.useMemo(() => {
    void themeTick;
    return buildChartOption(
      chartType,
      categories,
      series,
      palette,
      showLegend && !legendScrollable,
      backgroundColor,
      optionOverrides,
      radarIndicators,
      radarValueFormatter,
    );
  }, [
    backgroundColor,
    categories,
    chartType,
    legendScrollable,
    optionOverrides,
    palette,
    radarIndicators,
    radarValueFormatter,
    series,
    showLegend,
    themeTick,
  ]);

  React.useEffect(() => {
    if (isLoading || !wrapperRef.current || series.length === 0) return;

    setIsChartReady(false);
    const instance = echarts.init(wrapperRef.current);
    instanceRef.current = instance;

    const handleResize = () => {
      instance.resize();
    };
    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(handleResize);
    const handleFinished = () => setIsChartReady(true);

    window.addEventListener('resize', handleResize);
    resizeObserver?.observe(wrapperRef.current);
    instance.on('finished', handleFinished);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver?.disconnect();
      instance.off('finished', handleFinished);
      instance.dispose();
      instanceRef.current = null;
    };
  }, [isLoading, series.length]);

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

  const legendRowHeight = showScrollableLegend ? CHART_LEGEND_ROW_HEIGHT : 0;

  return (
    <div
      className={`hans-chart ${customClasses}`}
      style={{ height, backgroundColor }}
      {...rest}
    >
      {title ? <span className="hans-chart-title">{title}</span> : null}
      <div className="hans-chart-stage">
        <div
          className="hans-chart-canvas"
          ref={wrapperRef}
          style={{
            height: Math.max(220, height - (title ? 60 : 24) - legendRowHeight),
          }}
        />
        {!isChartReady ? (
          <HansLoading
            customClasses="hans-chart-initializing"
            loadingType="skeleton"
            loadingSize="large"
            skeletonWidth="100%"
            skeletonHeight="100%"
            ariaLabel="Loading chart"
          />
        ) : null}
      </div>
      {showScrollableLegend ? (
        <div
          className="hans-chart-legend"
          part="legend"
          style={{ height: CHART_LEGEND_ROW_HEIGHT }}
        >
          {legendItems.map((item) => (
            <span className="hans-chart-legend-item" key={item.name}>
              <span
                className="hans-chart-legend-swatch"
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
});

HansChart.displayName = 'HansChart';
