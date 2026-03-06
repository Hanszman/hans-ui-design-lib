import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../../types/Schema.types';
import type { Color, Size, Variant } from '../../../types/Common.types';

export type DropdownItem = {
  id?: string;
  label: string;
  value: string;
  disabled?: boolean;
  iconName?: string;
};

const HansDropdownSchema = {
  triggerLabel: 'string',
  triggerColor: { type: 'custom', ref: {} as Color },
  triggerVariant: { type: 'custom', ref: {} as Variant },
  triggerSize: { type: 'custom', ref: {} as Size },
  popupId: 'string',
  popupBackgroundColor: 'string',
  closeOnSelect: 'boolean',
  disabled: 'boolean',
  loading: 'boolean',
  loadingColor: { type: 'custom', ref: {} as Color },
  options: { type: 'custom', ref: {} as DropdownItem[] },
  customClasses: 'string',
  noOptionsText: 'string',
} as const;

export type HansDropdownProps = InferPropsFromSchema<typeof HansDropdownSchema> &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> & {
    children?: React.ReactNode;
    onSelect?: (item: DropdownItem) => void;
    onOpenChange?: (open: boolean) => void;
  };

export const HansDropdownPropsList = createPropsList(HansDropdownSchema);
