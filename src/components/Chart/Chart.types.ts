import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../types/Schema.types';
import type { Color } from '../../types/Common.types';

export type HansChartType = HansChartSeriesType | 'mixed';

export type HansChartSeriesType = 'line' | 'bar' | 'pie' | 'doughnut';

export type HansChartColor = Color | string;

export type HansChartThemeColor = Color;

export type HansChartDataPoint = number | { name: string; value: number };

export type HansChartPointEvent = {
  name?: string;
  value?: unknown;
  seriesName?: string;
};

export type HansChartLabelPosition =
  | 'horizontal'
  | 'vertical'
  | 'diagonal'
  | 'inside'
  | 'none';

export type HansChartSeriesLabel = {
  position?: HansChartLabelPosition;
  formatter?: string;
};

export type HansChartSeriesLabelOption = {
  show?: boolean;
  position?: 'inside' | 'outside' | 'top';
  rotate?: number;
  formatter?: string;
};

export type HansChartSeries = {
  name: string;
  data: HansChartDataPoint[];
  type?: HansChartSeriesType;
  smooth?: boolean;
  label?: HansChartSeriesLabel;
};

export const COLOR_TOKEN_MAP: Record<
  HansChartThemeColor,
  { cssVar: string; fallback: string }
> = {
  base: { cssVar: '--text-color', fallback: '#0e0e10' },
  primary: { cssVar: '--primary-default-color', fallback: '#8257e5' },
  secondary: { cssVar: '--secondary-default-color', fallback: '#3d8bff' },
  success: { cssVar: '--success-default-color', fallback: '#04d361' },
  danger: { cssVar: '--danger-default-color', fallback: '#e83f5b' },
  warning: { cssVar: '--warning-default-color', fallback: '#f7b500' },
  info: { cssVar: '--info-default-color', fallback: '#3d8bff' },
};

export const DEFAULT_COMBINATION_COLORS = Object.values(COLOR_TOKEN_MAP).map(
  (token: { cssVar: string; fallback: string }) => token.fallback,
);

const HansChartSchema = {
  title: 'string',
  chartType: { type: 'custom', ref: {} as HansChartType },
  categories: { type: 'custom', ref: [] as string[] },
  series: { type: 'custom', ref: [] as HansChartSeries[] },
  colors: { type: 'custom', ref: [] as HansChartColor[] },
  height: 'number',
  showLegend: 'boolean',
  customClasses: 'string',
  emptyText: 'string',
  optionOverrides: 'json',
} as const;

export type HansChartProps = InferPropsFromSchema<typeof HansChartSchema> &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'color' | 'onClick'> & {
    onPointClick?: (event: HansChartPointEvent) => void;
  };

export const HansChartPropsList = createPropsList(HansChartSchema);
