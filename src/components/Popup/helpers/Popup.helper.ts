import React from 'react';
import type { PopupDirection } from '../Popup.types';
import type {
  CreatePopupOpenSetterParams,
  GetPopupDirectionParams,
  HandlePopupOutsideClickParams,
  ResolvePopupDirectionParams,
} from './Popup.helper.types';

export const getPopupDirection = ({
  spaceBelow,
  spaceAbove,
  panelHeight,
}: GetPopupDirectionParams): PopupDirection =>
  spaceBelow < panelHeight && spaceAbove > panelHeight ? 'up' : 'down';

export const createPopupOpenSetter =
  ({ disabled, onOpenChange }: CreatePopupOpenSetterParams) =>
  (nextOpen: boolean): void => {
    if (disabled) return;
    if (onOpenChange) onOpenChange(nextOpen);
  };

export const handlePopupOutsideClick = ({
  container,
  target,
  close,
}: HandlePopupOutsideClickParams): void => {
  if (!container || !target) return;
  if (!container.contains(target)) close();
};

export const resolvePopupDirection = ({
  container,
  panel,
  viewportHeight,
}: ResolvePopupDirectionParams): PopupDirection | null => {
  if (!container || !panel) return null;
  const containerRect = container.getBoundingClientRect();
  const panelRect = panel.getBoundingClientRect();
  return getPopupDirection({
    spaceBelow: viewportHeight - containerRect.bottom,
    spaceAbove: containerRect.top,
    panelHeight: panelRect.height,
  });
};

export const hasPopupRenderableContent = (children: React.ReactNode): boolean =>
  React.Children.toArray(children).some((child) => {
    if (typeof child === 'string') return child.trim().length > 0;
    return true;
  });
