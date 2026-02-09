import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../../types/Schema.types';
import type { Size, Color } from '../../../types/Common.types';

export type DropdownOption = {
  id?: string;
  label: string;
  value: string;
  imageSrc?: string;
  imageAlt?: string;
  disabled?: boolean;
};

export type DropdownSelectionType = 'single' | 'multi';

export type DropdownValue = string | string[];

const HansDropdownSchema = {
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
  options: { type: 'custom', ref: {} as DropdownOption[] },
  selectionType: { type: 'custom', ref: {} as DropdownSelectionType },
  enableAutocomplete: 'boolean',
  value: { type: 'custom', ref: {} as DropdownValue },
  defaultValue: { type: 'custom', ref: {} as DropdownValue },
  noOptionsText: 'string',
  dropdownBackgroundColor: 'string',
  dropdownHoverColor: 'string',
} as const;

export type HansDropdownProps = InferPropsFromSchema<
  typeof HansDropdownSchema
> &
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'size' | 'type'
  > & {
    onChange?: (value: DropdownValue) => void;
    onSearch?: (query: string) => void;
    onInputChange?: React.ChangeEventHandler<HTMLInputElement>;
  };

export const HansDropdownPropsList = createPropsList(HansDropdownSchema);
