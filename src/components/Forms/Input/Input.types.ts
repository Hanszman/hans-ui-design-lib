import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../../types/Schema.types';
import type { Size, Color } from '../../../types/Common.types';

const HansInputSchema = {
  label: 'string',
  placeholder: 'string',
  value: 'string',
  inputColor: { type: 'custom', ref: {} as Color },
  inputSize: { type: 'custom', ref: {} as Size },
  inputType: { type: 'custom', ref: {} as InputType },
  customClasses: 'string',
  disabled: 'boolean',
} as const;

export type InputType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'hidden';

export type HansInputProps = InferPropsFromSchema<typeof HansInputSchema> &
  React.InputHTMLAttributes<HTMLInputElement>;

export const HansInputPropsList = createPropsList(HansInputSchema);
