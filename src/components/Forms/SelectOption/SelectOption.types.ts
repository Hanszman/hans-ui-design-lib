import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../../types/Schema.types';
import type { Size, Color } from '../../../types/Common.types';
import type { PopupOptionItem } from '../../Popup/Popup.types';

export type SelectOptionItem = PopupOptionItem;

export type SelectOptionSelectionType = 'single' | 'multi';

export type SelectOptionValue = string | string[];

const HansSelectOptionSchema = {
  label: 'string',
  labelColor: { type: 'custom', ref: {} as Color },
  placeholder: 'string',
  inputId: 'string',
  inputColor: { type: 'custom', ref: {} as Color },
  inputSize: { type: 'custom', ref: {} as Size },
  message: 'string',
  messageColor: { type: 'custom', ref: {} as Color },
  customClasses: 'string',
  disabled: 'boolean',
  options: {
    type: 'custom',
    ref: {} as PopupOptionItem[],
    webComponentType: 'property',
  },
  selectionType: { type: 'custom', ref: {} as SelectOptionSelectionType },
  enableAutocomplete: 'boolean',
  value: {
    type: 'custom',
    ref: {} as SelectOptionValue,
    webComponentType: 'property',
  },
  defaultValue: {
    type: 'custom',
    ref: {} as SelectOptionValue,
    webComponentType: 'property',
  },
  noOptionsText: 'string',
  dropdownBackgroundColor: 'string',
  dropdownHoverColor: 'string',
  isLoadingOptions: 'boolean',
  loadingOptionsText: 'string',
} as const;

export type HansSelectOptionProps = InferPropsFromSchema<
  typeof HansSelectOptionSchema
> &
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'size' | 'type'
  > & {
    onSearch?: (query: string) => void;
    onChange?: (value: SelectOptionValue) => void;
    onInputChange?: React.ChangeEventHandler<HTMLInputElement>;
  };

export const HansSelectOptionPropsList = createPropsList(
  HansSelectOptionSchema,
);

