import React from 'react';
import type { PopupDirection } from '../Popup.types';
import type {
  HansPopupItemListItemState,
  HansPopupItemListProps,
} from '../PopupItemList/PopupItemList.types';
import type {
  CreatePopupOpenSetterParams,
  CreatePopupOutsideMouseDownHandlerParams,
  CreatePopupStateHandlersParams,
  GetPopupDirectionParams,
  GetPopupPanelStyleParams,
  HandlePopupOutsideClickParams,
  CreatePopupDirectionFrameHandlerParams,
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

export const createPopupStateHandlers = ({
  isOpen,
  setOpen,
}: CreatePopupStateHandlersParams): {
  open: () => void;
  close: () => void;
  toggle: () => void;
} => ({
  open: () => setOpen(true),
  close: () => setOpen(false),
  toggle: () => setOpen(!isOpen),
});

export const handlePopupOutsideClick = ({
  container,
  target,
  close,
}: HandlePopupOutsideClickParams): void => {
  if (!container || !target) return;
  if (!container.contains(target)) close();
};

export const createPopupOutsideMouseDownHandler = ({
  containerRef,
  close,
}: CreatePopupOutsideMouseDownHandlerParams) =>
  (event: MouseEvent): void => {
    handlePopupOutsideClick({
      container: containerRef.current,
      target: event.target as Node | null,
      close,
    });
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

export const createPopupDirectionFrameHandler = ({
  containerRef,
  panelRef,
  setDirection,
  onDirectionChange,
}: CreatePopupDirectionFrameHandlerParams) =>
  (): void => {
    if (typeof window === 'undefined') return;
    const nextDirection = resolvePopupDirection({
      container: containerRef.current,
      panel: panelRef.current,
      viewportHeight: window.innerHeight,
    });
    if (!nextDirection) return;
    setDirection(nextDirection);
    if (onDirectionChange) onDirectionChange(nextDirection);
  };

export const hasPopupRenderableContent = (children: React.ReactNode): boolean =>
  React.Children.toArray(children).some((child) => {
    if (typeof child === 'string') return child.trim().length > 0;
    return true;
  });

export const getPopupPanelStyle = ({
  popupBackgroundColor,
}: GetPopupPanelStyleParams): React.CSSProperties =>
  ({
    '--hans-popup-bg': popupBackgroundColor,
  }) as React.CSSProperties;

export const resolvePopupItemPath = (parentPath: string, index: number): string =>
  parentPath.length > 0 ? `${parentPath}.${index}` : `${index}`;

export const resolvePopupItemClassName = (
  itemClassName: HansPopupItemListProps['itemClassName'] = '',
  state: HansPopupItemListItemState,
): string =>
  typeof itemClassName === 'function' ? itemClassName(state) : itemClassName;
