import React from 'react';
import { createPropsList } from '../../../types/Schema.types';
import type { InferPropsFromSchema } from '../../../types/Schema.types';
import type { Size, Variant, Color } from '../../../types/Common.types';

type ButtonType = 'button' | 'submit' | 'reset';

const HansButtonSchema = {
  label: 'string',
  size: { type: 'custom', ref: {} as Size },
  color: { type: 'custom', ref: {} as Color },
  variant: { type: 'custom', ref: {} as Variant },
  buttonType: { type: 'custom', ref: {} as ButtonType },
  customClasses: 'string',
  disabled: 'boolean',
} as const;

export type HansButtonProps = InferPropsFromSchema<typeof HansButtonSchema> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const HansButtonPropsList = createPropsList(HansButtonSchema);
