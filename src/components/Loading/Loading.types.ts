import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../types/Schema.types';
import type { Color, Size } from '../../types/Common.types';

export type LoadingType = 'spinner' | 'skeleton';

const HansLoadingSchema = {
  loadingType: { type: 'custom', ref: {} as LoadingType },
  loadingSize: { type: 'custom', ref: {} as Size },
  loadingColor: { type: 'custom', ref: {} as Color },
  skeletonWidth: { type: 'custom', ref: {} as string | number },
  skeletonHeight: { type: 'custom', ref: {} as string | number },
  rounded: 'boolean',
  customClasses: 'string',
  ariaLabel: 'string',
} as const;

export type HansLoadingProps = InferPropsFromSchema<typeof HansLoadingSchema> &
  Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>;

export const HansLoadingPropsList = createPropsList(HansLoadingSchema);
