import type React from 'react';
import type { Color, Variant } from '../../../types/Common.types';
import type { ModalCloseReason, ModalPlacement } from '../Modal.types';

export type ResolveModalToneParams = {
  modalColor: Color;
  modalVariant: Variant;
};

export type ModalTone = {
  background: string;
  border: string;
  text: string;
  mutedText: string;
  overlay: string;
  shadow: string;
};

export type GetModalInlineStyleParams = ResolveModalToneParams & {
  style?: React.CSSProperties;
};

export type CreateModalCloseHandlerParams = {
  isControlled: boolean;
  setInternalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenChange?: (open: boolean) => void;
  onClose?: (reason: ModalCloseReason) => void;
};

export type CreateModalActionHandlerParams = {
  onAction?: () => void;
  close: (reason: ModalCloseReason) => void;
  reason: ModalCloseReason;
};

export type CreateModalBackdropClickHandlerParams = {
  closeOnBackdropClick: boolean;
  close: (reason: ModalCloseReason) => void;
};

export type CreateModalEscapeKeyEffectParams = {
  isOpen: boolean;
  closeOnEscape: boolean;
  close: (reason: ModalCloseReason) => void;
};

export type CreateModalBodyScrollLockEffectParams = {
  isOpen: boolean;
  lockBodyScroll: boolean;
};

export type GetModalClassNameParams = {
  modalSize: 'small' | 'medium' | 'large';
  placement: ModalPlacement;
  customClasses: string;
  dialogClassName: string;
};
