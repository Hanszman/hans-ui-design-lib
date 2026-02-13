import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../types/Schema.types';
import type { Color, Size } from '../../types/Common.types';

const HansTagSchema = {
  label: 'string',
  tagSize: { type: 'custom', ref: {} as Size },
  tagColor: { type: 'custom', ref: {} as Color },
  actionIcon: 'string',
  customClasses: 'string',
  disabled: 'boolean',
} as const;

export type HansTagProps = InferPropsFromSchema<typeof HansTagSchema> &
  Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> & {
    onAction?: () => void;
  };

export const HansTagPropsList = createPropsList(HansTagSchema);
