import type React from 'react';
import type { Color, Variant } from '../../../types/Common.types';
import type { ToastCloseReason, ToastPosition } from '../Toast.types';

export type ToastStackItem = {
  id: string;
  height: number;
};

export type ToastStackRegistry = Record<ToastPosition, ToastStackItem[]>;

export type ToastTone = {
  background: string;
  border: string;
  text: string;
  accent: string;
  shadow: string;
};

export type ResolveToastToneParams = {
  toastColor: Color;
  toastVariant: Variant;
};

export type GetToastInlineStyleParams = ResolveToastToneParams & {
  position: ToastPosition;
  offset: number;
  stackOffset: number;
  zIndex: number;
  style?: React.CSSProperties;
};

export type CreateToastCloseHandlerParams = {
  isControlled: boolean;
  setInternalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onVisibilityChange?: (visible: boolean) => void;
  onClose?: (reason: ToastCloseReason) => void;
};
