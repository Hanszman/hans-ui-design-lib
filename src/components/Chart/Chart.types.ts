import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../types/Schema.types';
import type { Color } from '../../types/Common.types';

export type HansChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'mixed';

export type HansChartSeriesType = 'line' | 'bar' | 'pie' | 'doughnut';

export type HansChartLabelPosition =
  | 'horizontal'
  | 'vertical'
  | 'diagonal'
  | 'inside'
  | 'none';

export type HansChartColor = Color | string;

export type HansChartDataPoint = number | { name: string; value: number };

export type HansChartSeriesLabel = {
  position?: HansChartLabelPosition;
  formatter?: string;
};

export type HansChartSeries = {
  name: string;
  data: HansChartDataPoint[];
  type?: HansChartSeriesType;
  smooth?: boolean;
  label?: HansChartSeriesLabel;
};

export type HansChartPointEvent = {
  name?: string;
  value?: unknown;
  seriesName?: string;
};

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
