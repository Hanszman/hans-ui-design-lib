import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../types/Schema.types';
import type { Color, Size, Variant } from '../../types/Common.types';

export type HansCarouselItem = {
  id?: string;
  imageSrc: string;
  imageAlt: string;
  title?: string;
  description?: string;
};

const HansCarouselSchema = {
  items: { type: 'custom', ref: {} as HansCarouselItem[] },
  activeItemIndex: 'number',
  defaultActiveItemIndex: 'number',
  visibleItemsCount: 'number',
  maxIndicators: 'number',
  carouselSize: { type: 'custom', ref: {} as Size },
  carouselColor: { type: 'custom', ref: {} as Color },
  carouselVariant: { type: 'custom', ref: {} as Variant },
  loading: 'boolean',
  loadingColor: { type: 'custom', ref: {} as Color },
  loadingAriaLabel: 'string',
  emptyText: 'string',
  customClasses: 'string',
  carouselId: 'string',
} as const;

export type HansCarouselProps = InferPropsFromSchema<typeof HansCarouselSchema> &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> & {
    onActiveItemChange?: (activeItemIndex: number) => void;
  };

export const HansCarouselPropsList = createPropsList(HansCarouselSchema);
