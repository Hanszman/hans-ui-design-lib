import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../types/Schema.types';
import type { Color, Size, Variant } from '../../types/Common.types';

export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left';

export type ToastCloseReason = 'timeout' | 'dismiss';

const HansToastSchema = {
  title: 'string',
  message: 'node',
  isVisible: 'boolean',
  defaultVisible: 'boolean',
  duration: 'number',
  toastColor: { type: 'custom', ref: {} as Color },
  toastVariant: { type: 'custom', ref: {} as Variant },
  toastSize: { type: 'custom', ref: {} as Size },
  position: { type: 'custom', ref: {} as ToastPosition },
  dismissible: 'boolean',
  iconName: 'string',
  stackGap: 'number',
  offset: 'number',
  closeButtonLabel: 'string',
  customClasses: 'string',
  titleClassName: 'string',
  messageClassName: 'string',
} as const;

export type HansToastProps = InferPropsFromSchema<typeof HansToastSchema> &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'color' | 'title'> & {
    onClose?: (reason: ToastCloseReason) => void;
    onVisibilityChange?: (visible: boolean) => void;
    portalTarget?: HTMLElement | null;
  };

export const HansToastPropsList = createPropsList(HansToastSchema);
