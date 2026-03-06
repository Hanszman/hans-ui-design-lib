import React from 'react';
import type { HansPopupProps, PopupDirection } from './Popup.types';
import {
  createPopupOpenSetter,
  hasPopupRenderableContent,
  handlePopupOutsideClick,
  resolvePopupDirection,
} from './helpers/Popup.helper';

export const HansPopup = React.memo((props: HansPopupProps) => {
  const {
    isOpen = false,
    disabled = false,
    popupBackgroundColor = 'var(--white)',
    noContentText = 'No content',
    popupClassName = '',
    panelClassName = '',
    customClasses = '',
    onOpenChange,
    onDirectionChange,
    renderTrigger,
    children,
    ...rest
  } = props;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const [direction, setDirection] = React.useState<PopupDirection>('down');
  const hasContent = hasPopupRenderableContent(children);

  const setOpen = createPopupOpenSetter({ disabled, onOpenChange });
  const open = React.useCallback(() => setOpen(true), [setOpen]);
  const close = React.useCallback(() => setOpen(false), [setOpen]);
  const toggle = React.useCallback(() => setOpen(!isOpen), [isOpen, setOpen]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      handlePopupOutsideClick({
        container: containerRef.current,
        target: event.target as Node | null,
        close,
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [close]);

  React.useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => {
      const nextDirection = resolvePopupDirection({
        container: containerRef.current,
        panel: panelRef.current,
        viewportHeight: window.innerHeight,
      });
      if (!nextDirection) return;
      setDirection(nextDirection);
      if (onDirectionChange) onDirectionChange(nextDirection);
    });

    return () => cancelAnimationFrame(frame);
  }, [isOpen, children, onDirectionChange]);

  return (
    <div className={`hans-popup ${customClasses}`} ref={containerRef} {...rest}>
      {renderTrigger({ isOpen, open, close, toggle })}

      {isOpen && !disabled ? (
        <div
          ref={panelRef}
          className={`hans-popup-panel ${popupClassName}`}
          data-direction={direction}
          style={
            {
              '--hans-popup-bg': popupBackgroundColor,
            } as React.CSSProperties
          }
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
      ) : null}
    </div>
  );
});

HansPopup.displayName = 'HansPopup';
