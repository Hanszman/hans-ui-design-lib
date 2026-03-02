import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../../types/Schema.types';
import type { Color, Size } from '../../../types/Common.types';

const HansToggleSchema = {
  label: 'string',
  labelColor: { type: 'custom', ref: {} as Color },
  checked: 'boolean',
  defaultChecked: 'boolean',
  disabled: 'boolean',
  toggleColor: { type: 'custom', ref: {} as Color },
  toggleSize: { type: 'custom', ref: {} as Size },
  customClasses: 'string',
  inputId: 'string',
} as const;

export type HansToggleProps = InferPropsFromSchema<typeof HansToggleSchema> &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'onChange'> & {
    onChange?: (checked: boolean) => void;
  };

export const HansTogglePropsList = createPropsList(HansToggleSchema);
