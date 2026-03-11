import React from 'react';
import type { HansPopupProps, PopupDirection } from './Popup.types';
import {
  createPopupDirectionFrameHandler,
  createPopupOpenSetter,
  createPopupOutsideMouseDownHandler,
  createPopupStateHandlers,
  getPopupPanelStyle,
  hasPopupRenderableContent,
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
  const { open, close, toggle } = React.useMemo(
    () => createPopupStateHandlers({ isOpen, setOpen }),
    [isOpen, setOpen],
  );
  const handleClickOutside = React.useMemo(
    () => createPopupOutsideMouseDownHandler({ containerRef, close }),
    [close],
  );
  const resolveDirection = React.useMemo(
    () =>
      createPopupDirectionFrameHandler({
        containerRef,
        panelRef,
        setDirection,
        onDirectionChange,
      }),
    [onDirectionChange],
  );

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  React.useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(resolveDirection);

    return () => cancelAnimationFrame(frame);
  }, [children, isOpen, resolveDirection]);

  return (
    <div className={`hans-popup ${customClasses}`} ref={containerRef} {...rest}>
      {renderTrigger({ isOpen, open, close, toggle })}

      {isOpen && !disabled ? (
        <div
          ref={panelRef}
          className={`hans-popup-panel ${popupClassName}`}
          data-direction={direction}
          style={getPopupPanelStyle({ popupBackgroundColor })}
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
