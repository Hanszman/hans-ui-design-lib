import type React from 'react';
import type { PopupDirection } from '../Popup.types';

export type GetPopupDirectionParams = {
  spaceBelow: number;
  spaceAbove: number;
  panelHeight: number;
};

export type CreatePopupOpenSetterParams = {
  disabled: boolean;
  onOpenChange?: (open: boolean) => void;
};

export type HandlePopupOutsideClickParams = {
  container: HTMLDivElement | null;
  target: Node | null;
  close: () => void;
};

export type ResolvePopupDirectionParams = {
  container: HTMLDivElement | null;
  panel: HTMLDivElement | null;
  viewportHeight: number;
};

export type CreatePopupStateHandlersParams = {
  isOpen: boolean;
  setOpen: (nextOpen: boolean) => void;
};

export type CreatePopupOutsideMouseDownHandlerParams = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  close: () => void;
};

export type CreatePopupDirectionFrameHandlerParams = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  panelRef: React.RefObject<HTMLDivElement | null>;
  setDirection: (direction: PopupDirection) => void;
  onDirectionChange?: (direction: PopupDirection) => void;
};

export type GetPopupPanelStyleParams = {
  popupBackgroundColor: string;
};
