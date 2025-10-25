import React from 'react';
import { createComponentSchema } from '../../../types/Schema.types';
import type { Size, Variant, Color } from '../../../types/Common.types';

export type ButtonType = 'button' | 'submit' | 'reset';

const { schema: HansButtonSchema, propsList: HansButtonPropsList } =
  createComponentSchema({
    label: 'string',
    size: { type: 'custom', ref: {} as Size },
    color: { type: 'custom', ref: {} as Color },
    variant: { type: 'custom', ref: {} as Variant },
    buttonType: { type: 'custom', ref: {} as ButtonType },
    customClasses: 'string',
    disabled: 'boolean',
    children: 'node',
  });

export type HansButtonProps = {
  [K in keyof typeof HansButtonSchema]: (typeof HansButtonSchema)[K] extends 'string'
    ? string
    : (typeof HansButtonSchema)[K] extends 'boolean'
      ? boolean
      : (typeof HansButtonSchema)[K] extends 'node'
        ? React.ReactNode
        : (typeof HansButtonSchema)[K] extends { type: 'custom'; ref: infer U }
          ? U
          : never;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export { HansButtonSchema, HansButtonPropsList };
