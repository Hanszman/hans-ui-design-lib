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

export type InputIcon = React.ReactNode | string;
export type InputValueChangeHandler = (value: string) => void;

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
  leftIcon: { type: 'custom', ref: {} as InputIcon },
  rightIcon: { type: 'custom', ref: {} as InputIcon },
  onValueChange: {
    type: 'custom',
    ref: {} as InputValueChangeHandler,
    webComponentType: 'function',
  },
} as const;

export type HansInputProps = InferPropsFromSchema<typeof HansInputSchema> &
  React.InputHTMLAttributes<HTMLInputElement>;

export const HansInputPropsList = createPropsList(HansInputSchema);
