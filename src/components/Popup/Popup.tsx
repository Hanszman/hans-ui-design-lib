import React from 'react';
import { createPortal } from 'react-dom';
import type {
  HansPopupProps,
  PopupDirection,
  PopupHorizontalPosition,
} from './Popup.types';
import {
  createPopupDirectionFrameHandler,
  createPopupOpenSetter,
  createPopupOutsideMouseDownHandler,
  createPopupStateHandlers,
  getPopupPanelStyle,
  getPopupPortalStyle,
  getPopupTriggerRect,
  hasPopupRenderableContent,
} from './helpers/Popup.helper';

export const HansPopup = React.memo((props: HansPopupProps) => {
  const {
    isOpen = false,
    disabled = false,
    popupBackgroundColor = 'var(--background-color, var(--white))',
    noContentText = 'No content',
    popupClassName = '',
    panelClassName = '',
    customClasses = '',
    portal = true,
    portalMatchTriggerWidth = true,
    portalHorizontalPosition,
    onOpenChange,
    onDirectionChange,
    onHorizontalPositionChange,
    renderTrigger,
    children,
    ...rest
  } = props;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const [direction, setDirection] = React.useState<PopupDirection>('down');
  const [horizontalPosition, setHorizontalPosition] =
    React.useState<PopupHorizontalPosition>('start');
  const [portalStyle, setPortalStyle] = React.useState<React.CSSProperties>({});
  const hasContent = hasPopupRenderableContent(children);

  const setOpen = createPopupOpenSetter({ disabled, onOpenChange });
  const { open, close, toggle } = React.useMemo(
    () => createPopupStateHandlers({ isOpen, setOpen }),
    [isOpen, setOpen],
  );
  const handleClickOutside = React.useMemo(
    () =>
      createPopupOutsideMouseDownHandler({ containerRef, panelRef, close }),
    [close],
  );
  const resolveDirection = React.useMemo(
    () =>
      createPopupDirectionFrameHandler({
        containerRef,
        panelRef,
        setDirection,
        setHorizontalPosition,
        onDirectionChange,
        onHorizontalPositionChange,
      }),
    [onDirectionChange, onHorizontalPositionChange],
  );

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  React.useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => {
      resolveDirection();
      requestAnimationFrame(resolveDirection);
    });

    return () => cancelAnimationFrame(frame);
  }, [children, isOpen, resolveDirection]);

  const updatePortalPosition = React.useCallback(() => {
    const triggerRect = getPopupTriggerRect(containerRef.current);
    if (!triggerRect) return;

    setPortalStyle(
      getPopupPortalStyle({
        triggerRect,
        direction,
        horizontalPosition: portalHorizontalPosition ?? horizontalPosition,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        matchTriggerWidth: portalMatchTriggerWidth,
      }),
    );
  }, [direction, horizontalPosition, portalHorizontalPosition, portalMatchTriggerWidth]);

  React.useEffect(() => {
    if (!portal || !isOpen || typeof window === 'undefined') return;
    const update = (): void => {
      requestAnimationFrame(updatePortalPosition);
    };

    update();
    window.addEventListener('resize', update);
    document.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      document.removeEventListener('scroll', update, true);
    };
  }, [isOpen, portal, updatePortalPosition]);

  const popupPanel = isOpen && !disabled ? (
    <div
      ref={panelRef}
      className={`hans-popup-panel ${portal ? 'hans-popup-panel-portal' : ''} ${popupClassName}`}
      data-direction={direction}
      data-horizontal-position={portalHorizontalPosition ?? horizontalPosition}
      style={{ ...getPopupPanelStyle({ popupBackgroundColor }), ...portalStyle }}
    >
      <div className={`hans-popup-panel-content ${panelClassName}`}>
        {hasContent ? (
          children
        ) : (
          <div className="hans-popup-empty">
            <span>{noContentText}</span>
          </div>
        )}
      </div>
    </div>
  ) : null;

  return (
    <div className={`hans-popup ${customClasses}`} ref={containerRef} {...rest}>
      {renderTrigger({ isOpen, open, close, toggle })}

      {portal && typeof document !== 'undefined'
        ? createPortal(popupPanel, document.body)
        : popupPanel}
    </div>
  );
});

HansPopup.displayName = 'HansPopup';
