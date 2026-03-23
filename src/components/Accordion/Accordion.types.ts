import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../types/Schema.types';
import type { Color } from '../../types/Common.types';

export type HansAccordionItem = {
  id?: string;
  title: string;
  description: React.ReactNode;
  disabled?: boolean;
};

const HansAccordionSchema = {
  items: { type: 'custom', ref: {} as HansAccordionItem[] },
  openItemIds: { type: 'custom', ref: {} as string[] },
  defaultOpenItemIds: { type: 'custom', ref: {} as string[] },
  allowMultipleOpen: 'boolean',
  loading: 'boolean',
  loadingColor: { type: 'custom', ref: {} as Color },
  loadingAriaLabel: 'string',
  skeletonItemsCount: 'number',
  emptyText: 'string',
  customClasses: 'string',
  accordionId: 'string',
} as const;

export type HansAccordionProps = InferPropsFromSchema<
  typeof HansAccordionSchema
> &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> & {
    onOpenItemIdsChange?: (openItemIds: string[]) => void;
  };

export const HansAccordionPropsList = createPropsList(HansAccordionSchema);
