import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../../types/Schema.types';
import type {
  Color,
  Size,
  Variant,
} from '../../../types/Common.types';
import type { PopupOptionItem } from '../../Popup/Popup.types';
import type { ButtonShape } from '../Button/Button.types';

export type DropdownItem = PopupOptionItem;

const HansDropdownSchema = {
  triggerLabel: 'string',
  triggerColor: { type: 'custom', ref: {} as Color },
  triggerVariant: { type: 'custom', ref: {} as Variant },
  triggerHoverColor: { type: 'custom', ref: {} as Color },
  triggerHoverVariant: { type: 'custom', ref: {} as Variant },
  triggerShape: { type: 'custom', ref: {} as ButtonShape },
  triggerSize: { type: 'custom', ref: {} as Size },
  popupId: 'string',
  popupBackgroundColor: 'string',
  closeOnSelect: 'boolean',
  disabled: 'boolean',
  loading: 'boolean',
  loadingColor: { type: 'custom', ref: {} as Color },
  options: {
    type: 'custom',
    ref: {} as PopupOptionItem[],
    webComponentType: 'property',
  },
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
