import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../types/Schema.types';
import type { Color, Size, Variant } from '../../types/Common.types';

const HansPaginationSchema = {
  currentPage: 'number',
  totalPages: 'number',
  disabled: 'boolean',
  ariaLabel: 'string',
  firstLabel: 'string',
  previousLabel: 'string',
  nextLabel: 'string',
  lastLabel: 'string',
  pageLabel: 'string',
  firstContent: 'node',
  previousContent: 'node',
  nextContent: 'node',
  lastContent: 'node',
  maxVisiblePages: 'number',
  paginationColor: { type: 'custom', ref: {} as Color },
  paginationSize: { type: 'custom', ref: {} as Size },
  activePageVariant: { type: 'custom', ref: {} as Variant },
  inactivePageVariant: { type: 'custom', ref: {} as Variant },
  customClasses: 'string',
} as const;

export type HansPaginationProps = InferPropsFromSchema<
  typeof HansPaginationSchema
> &
  Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'color' | 'onChange'> & {
    onPageChange?: (page: number) => void;
  };

export const HansPaginationPropsList = createPropsList(HansPaginationSchema);
