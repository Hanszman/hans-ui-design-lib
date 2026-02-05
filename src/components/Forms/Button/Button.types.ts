import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../../types/Schema.types';
import type { Size, Variant, Color } from '../../../types/Common.types';

const HansButtonSchema = {
  label: 'string',
  buttonId: 'string',
  buttonSize: { type: 'custom', ref: {} as Size },
  buttonColor: { type: 'custom', ref: {} as Color },
  buttonVariant: { type: 'custom', ref: {} as Variant },
  buttonType: { type: 'custom', ref: {} as ButtonType },
  customClasses: 'string',
  disabled: 'boolean',
} as const;

export type ButtonType = 'button' | 'submit' | 'reset';

export type HansButtonProps = InferPropsFromSchema<typeof HansButtonSchema> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const HansButtonPropsList = createPropsList(HansButtonSchema);
