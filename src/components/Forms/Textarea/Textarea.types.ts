import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../../types/Schema.types';
import type { Color, Size } from '../../../types/Common.types';

export type TextareaFormattingAction = 'bold' | 'italic' | 'underline' | 'list';

export type TextareaValueChangeHandler = (value: string) => void;

const HansTextareaSchema = {
  label: 'string',
  labelColor: { type: 'custom', ref: {} as Color },
  placeholder: 'string',
  value: {
    type: 'custom',
    ref: {} as string,
    webComponentType: 'property',
  },
  textareaId: 'string',
  textareaColor: { type: 'custom', ref: {} as Color },
  textareaSize: { type: 'custom', ref: {} as Size },
  rows: 'number',
  message: 'string',
  messageColor: { type: 'custom', ref: {} as Color },
  customClasses: 'string',
  disabled: 'boolean',
  required: 'boolean',
  formattingToolbar: 'boolean',
  formattingToolbarAriaLabel: 'string',
  boldButtonAriaLabel: 'string',
  italicButtonAriaLabel: 'string',
  underlineButtonAriaLabel: 'string',
  listButtonAriaLabel: 'string',
  onValueChange: {
    type: 'custom',
    ref: {} as TextareaValueChangeHandler,
    webComponentType: 'function',
  },
} as const;

type HansTextareaSchemaProps = InferPropsFromSchema<typeof HansTextareaSchema>;

type NativeTextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'defaultValue' | 'rows' | 'onChange' | 'onInput'
>;

export type HansTextareaProps = Omit<
  HansTextareaSchemaProps,
  'value' | 'onValueChange'
> &
  NativeTextareaProps & {
    value?: string;
    defaultValue?: string;
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
    onInput?: React.InputEventHandler<HTMLTextAreaElement>;
    onValueChange?: TextareaValueChangeHandler;
  };

export const HansTextareaPropsList = createPropsList(HansTextareaSchema);
