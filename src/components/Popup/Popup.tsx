import React from 'react';
import type { HansPopupProps, PopupDirection } from './Popup.types';
import { getPopupDirection } from './helpers/Popup.helper';

export const HansPopup = React.memo((props: HansPopupProps) => {
  const {
    isOpen = false,
    disabled = false,
    popupBackgroundColor = 'var(--white)',
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

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (disabled) return;
      if (onOpenChange) onOpenChange(nextOpen);
    },
    [disabled, onOpenChange],
  );
  const open = React.useCallback(() => setOpen(true), [setOpen]);
  const close = React.useCallback(() => setOpen(false), [setOpen]);
  const toggle = React.useCallback(() => setOpen(!isOpen), [isOpen, setOpen]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!containerRef.current || !target) return;
      if (!containerRef.current.contains(target)) close();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [close]);

  React.useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => {
      if (!containerRef.current || !panelRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const panelRect = panelRef.current.getBoundingClientRect();
      const nextDirection = getPopupDirection({
        spaceBelow: window.innerHeight - containerRect.bottom,
        spaceAbove: containerRect.top,
        panelHeight: panelRect.height,
      });
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
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
});

HansPopup.displayName = 'HansPopup';
