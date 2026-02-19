import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../../types/Schema.types';
import type { Size, Color } from '../../../types/Common.types';

export type InputType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'hidden';

const HansInputSchema = {
  label: 'string',
  labelColor: { type: 'custom', ref: {} as Color },
  placeholder: 'string',
  value: 'string',
  inputId: 'string',
  inputColor: { type: 'custom', ref: {} as Color },
  inputSize: { type: 'custom', ref: {} as Size },
  inputType: { type: 'custom', ref: {} as InputType },
  message: 'string',
  messageColor: { type: 'custom', ref: {} as Color },
  customClasses: 'string',
  disabled: 'boolean',
  leftIcon: 'node',
  rightIcon: 'node',
} as const;

export type HansInputProps = InferPropsFromSchema<typeof HansInputSchema> &
  React.InputHTMLAttributes<HTMLInputElement>;

export const HansInputPropsList = createPropsList(HansInputSchema);
