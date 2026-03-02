import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../../types/Schema.types';
import type { Color, Size } from '../../../types/Common.types';

export type ToggleMode = 'switch' | 'segmented';

export type HansToggleOption = {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
};

const HansToggleSchema = {
  toggleMode: { type: 'custom', ref: {} as ToggleMode },
  label: 'string',
  labelColor: { type: 'custom', ref: {} as Color },
  leftLabel: 'string',
  rightLabel: 'string',
  checked: 'boolean',
  defaultChecked: 'boolean',
  loading: 'boolean',
  disabled: 'boolean',
  toggleColor: { type: 'custom', ref: {} as Color },
  toggleSize: { type: 'custom', ref: {} as Size },
  onContent: 'node',
  offContent: 'node',
  thumbContent: 'node',
  value: 'string',
  defaultValue: 'string',
  options: { type: 'custom', ref: {} as HansToggleOption[] },
  customClasses: 'string',
  inputId: 'string',
} as const;

export type HansToggleProps = InferPropsFromSchema<typeof HansToggleSchema> &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'onChange'> & {
    onChange?: (checked: boolean) => void;
    onValueChange?: (value: string) => void;
  };

export const HansTogglePropsList = createPropsList(HansToggleSchema);
