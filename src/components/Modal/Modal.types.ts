import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../types/Schema.types';
import type { Color, Size, Variant } from '../../types/Common.types';

export type ModalPlacement = 'center' | 'left' | 'right';

export type ModalCloseReason =
  | 'dismiss'
  | 'backdrop'
  | 'escape'
  | 'confirm'
  | 'cancel';

const HansModalSchema = {
  isOpen: 'boolean',
  defaultOpen: 'boolean',
  modalSize: { type: 'custom', ref: {} as Size },
  modalColor: { type: 'custom', ref: {} as Color },
  modalVariant: { type: 'custom', ref: {} as Variant },
  placement: { type: 'custom', ref: {} as ModalPlacement },
  title: 'node',
  header: 'node',
  footer: 'node',
  dismissible: 'boolean',
  showOverlay: 'boolean',
  closeOnBackdropClick: 'boolean',
  closeOnEscape: 'boolean',
  lockBodyScroll: 'boolean',
  showHeaderDivider: 'boolean',
  showFooterDivider: 'boolean',
  loading: 'boolean',
  confirmLabel: 'string',
  cancelLabel: 'string',
  closeButtonLabel: 'string',
  confirmButtonColor: { type: 'custom', ref: {} as Color },
  cancelButtonColor: { type: 'custom', ref: {} as Color },
  dismissButtonColor: { type: 'custom', ref: {} as Color },
  customClasses: 'string',
  overlayClassName: 'string',
  dialogClassName: 'string',
  headerClassName: 'string',
  bodyClassName: 'string',
  footerClassName: 'string',
  contentClassName: 'string',
  maxBodyHeight: 'string',
} as const;

export type HansModalProps = InferPropsFromSchema<typeof HansModalSchema> &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'color' | 'title'> & {
    children?: React.ReactNode;
    onOpenChange?: (open: boolean) => void;
    onClose?: (reason: ModalCloseReason) => void;
    onConfirm?: () => void;
    onCancel?: () => void;
    portalTarget?: HTMLElement | null;
  };

export const HansModalPropsList = createPropsList(HansModalSchema);
