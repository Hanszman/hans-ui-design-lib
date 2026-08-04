import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../types/Schema.types';
import type { Color, Size, Variant } from '../../types/Common.types';

const HansMessageSchema = {
  title: 'node',
  message: 'node',
  isVisible: 'boolean',
  defaultVisible: 'boolean',
  messageColor: { type: 'custom', ref: {} as Color },
  messageVariant: { type: 'custom', ref: {} as Variant },
  messageSize: { type: 'custom', ref: {} as Size },
  iconName: 'string',
  dismissible: 'boolean',
  closeButtonLabel: 'string',
  customClasses: 'string',
} as const;

export type HansMessageProps = InferPropsFromSchema<typeof HansMessageSchema> &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'color' | 'title'> & {
    onClose?: () => void;
    onVisibilityChange?: (visible: boolean) => void;
  };

export const HansMessagePropsList = createPropsList(HansMessageSchema);
