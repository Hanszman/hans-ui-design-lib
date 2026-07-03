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
export type InputValue = string | number | readonly string[];
export type InputIconClickHandler = (
  event: React.MouseEvent<HTMLButtonElement>,
) => void;

const HansInputSchema = {
  label: 'string',
  labelColor: { type: 'custom', ref: {} as Color },
  placeholder: 'string',
  value: {
    type: 'custom',
    ref: {} as InputValue,
    webComponentType: 'property',
  },
  inputId: 'string',
  inputColor: { type: 'custom', ref: {} as Color },
  inputSize: { type: 'custom', ref: {} as Size },
  inputType: { type: 'custom', ref: {} as InputType },
  message: 'string',
  messageColor: { type: 'custom', ref: {} as Color },
  customClasses: 'string',
  disabled: 'boolean',
  leftIcon: { type: 'custom', ref: {} as InputIcon },
  leftIconAriaLabel: 'string',
  onLeftIconClick: {
    type: 'custom',
    ref: {} as InputIconClickHandler,
    webComponentType: 'function',
  },
  rightIcon: { type: 'custom', ref: {} as InputIcon },
  rightIconAriaLabel: 'string',
  onRightIconClick: {
    type: 'custom',
    ref: {} as InputIconClickHandler,
    webComponentType: 'function',
  },
  onValueChange: {
    type: 'custom',
    ref: {} as InputValueChangeHandler,
    webComponentType: 'function',
  },
} as const;

type HansInputSchemaProps = InferPropsFromSchema<typeof HansInputSchema>;
type NativeInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue'
>;

export type HansInputProps = Omit<
  HansInputSchemaProps,
  'value' | 'onValueChange'
> &
  NativeInputProps & {
    value?: InputValue;
    defaultValue?: InputValue;
    onValueChange?: InputValueChangeHandler;
  };

export const HansInputPropsList = createPropsList(HansInputSchema);
