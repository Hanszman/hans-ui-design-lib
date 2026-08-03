import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../types/Schema.types';
import type { Color, Size } from '../../types/Common.types';

const HansProgressBarSchema = {
  value: 'number',
  min: 'number',
  max: 'number',
  label: 'string',
  valueLabel: 'string',
  progressColor: { type: 'custom', ref: {} as Color },
  progressSize: { type: 'custom', ref: {} as Size },
  showValue: 'boolean',
  customClasses: 'string',
} as const;

export type HansProgressBarProps = InferPropsFromSchema<
  typeof HansProgressBarSchema
> &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>;

export const HansProgressBarPropsList = createPropsList(HansProgressBarSchema);
