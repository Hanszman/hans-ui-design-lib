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
  GetPopupHorizontalPositionParams,
  GetPopupPanelStyleParams,
  HandlePopupOutsideClickParams,
  CreatePopupDirectionFrameHandlerParams,
  ResolvePopupDirectionParams,
  ResolvePopupHorizontalPositionParams,
} from './Popup.helper.types';

export const getPopupDirection = ({
  spaceBelow,
  spaceAbove,
  panelHeight,
}: GetPopupDirectionParams): PopupDirection =>
  spaceBelow < panelHeight && spaceAbove > panelHeight ? 'up' : 'down';

export const getPopupHorizontalPosition = ({
  spaceRight,
  spaceLeft,
  panelWidth,
}: GetPopupHorizontalPositionParams): 'start' | 'end' =>
  spaceRight < panelWidth && spaceLeft > panelWidth ? 'end' : 'start';

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
  const root = container.getRootNode();
  const isShadowHostTarget = root instanceof ShadowRoot && root.host === target;
  if (!container.contains(target) && !isShadowHostTarget) close();
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

export const resolvePopupHorizontalPosition = ({
  container,
  panel,
  viewportWidth,
}: ResolvePopupHorizontalPositionParams): 'start' | 'end' | null => {
  if (!container || !panel) return null;
  const containerRect = container.getBoundingClientRect();
  const panelRect = panel.getBoundingClientRect();
  return getPopupHorizontalPosition({
    spaceRight: viewportWidth - containerRect.left,
    spaceLeft: containerRect.right,
    panelWidth: panelRect.width,
  });
};

export const createPopupDirectionFrameHandler = ({
  containerRef,
  panelRef,
  setDirection,
  setHorizontalPosition,
  onDirectionChange,
  onHorizontalPositionChange,
}: CreatePopupDirectionFrameHandlerParams) =>
  (): void => {
    if (typeof window === 'undefined') return;
    const nextDirection = resolvePopupDirection({
      container: containerRef.current,
      panel: panelRef.current,
      viewportHeight: window.innerHeight,
    });
    const nextHorizontalPosition = resolvePopupHorizontalPosition({
      container: containerRef.current,
      panel: panelRef.current,
      viewportWidth: window.innerWidth,
    });
    if (nextDirection) {
      setDirection(nextDirection);
      if (onDirectionChange) onDirectionChange(nextDirection);
    }
    if (nextHorizontalPosition) {
      setHorizontalPosition(nextHorizontalPosition);
      if (onHorizontalPositionChange) {
        onHorizontalPositionChange(nextHorizontalPosition);
      }
    }
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
