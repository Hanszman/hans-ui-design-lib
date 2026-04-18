import React from 'react';
import { HansButton } from '../Button/Button';
import { HansIcon } from '../../Icon/Icon';
import { HansLoading } from '../../Loading/Loading';
import { HansPopup } from '../../Popup/Popup';
import { HansDropdownItemList } from './DropdownItemList/DropdownItemList';
import type { HansDropdownProps } from './Dropdown.types';
import {
  createClearDropdownLeaveTimeout,
  createDropdownOpenSetter,
  createHandleDropdownItemEnter,
  createHandleDropdownListEnter,
  createHandleDropdownListLeave,
  createHandleDropdownSelect,
  getNextDropdownSubmenuDirections,
  hasCustomDropdownContent,
} from './helpers/Dropdown.helper';

export const HansDropdown = React.memo((props: HansDropdownProps) => {
  const {
    triggerLabel = 'Dropdown',
    triggerColor = 'base',
    triggerVariant = 'outline',
    triggerShape = 'square',
    triggerSize = 'medium',
    popupId = 'hans-dropdown',
    popupBackgroundColor = 'var(--background-color, var(--white))',
    closeOnSelect = true,
    disabled = false,
    loading = false,
    loadingColor = 'base',
    options = [],
    customClasses = '',
    noOptionsText = 'No options',
    children,
    onSelect,
    onOpenChange,
    ...rest
  } = props;

  const [isOpen, setIsOpen] = React.useState(false);
  const [hoveredPath, setHoveredPath] = React.useState<string | null>(null);
  const [submenuDirections, setSubmenuDirections] = React.useState<
    Record<string, 'left' | 'right'>
  >({});
  const hasCustomContent = hasCustomDropdownContent(children);
  const setOpen = createDropdownOpenSetter({ setIsOpen, onOpenChange });
  const handleSelect = createHandleDropdownSelect({
    closeOnSelect,
    setOpen,
    onSelect,
  });
  const listLeaveTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const clearListLeaveTimeout = React.useMemo(
    () => createClearDropdownLeaveTimeout({ listLeaveTimeoutRef }),
    [],
  );

  const setSubmenuDirection = React.useCallback(
    (path: string, direction: 'left' | 'right') => {
      setSubmenuDirections((prev) => {
        return getNextDropdownSubmenuDirections(prev, path, direction);
      });
    },
    [],
  );
  const handleListEnter = React.useMemo(
    () => createHandleDropdownListEnter(clearListLeaveTimeout),
    [clearListLeaveTimeout],
  );
  const handleListLeave = React.useMemo(
    () =>
      createHandleDropdownListLeave({
        clearListLeaveTimeout,
        listLeaveTimeoutRef,
        setHoveredPath,
      }),
    [clearListLeaveTimeout],
  );

  React.useEffect(() => {
    if (!isOpen) {
      clearListLeaveTimeout();
      setHoveredPath(null);
      setSubmenuDirections({});
    }
  }, [clearListLeaveTimeout, isOpen]);
  
  React.useEffect(
    () => () => {
      clearListLeaveTimeout();
    },
    [clearListLeaveTimeout],
  );
  
  const handleDropdownItemEnter = React.useMemo(() => {
    const handleItemEnter = createHandleDropdownItemEnter({
      setHoveredPath,
      setSubmenuDirection,
      submenuWidth: 240,
    });
    return (path: string, target: HTMLElement): void => {
      clearListLeaveTimeout();
      handleItemEnter(path, target);
    };
  }, [clearListLeaveTimeout, setSubmenuDirection]);

  return (
    <div className={`hans-dropdown ${customClasses}`} {...rest}>
      <HansPopup
        isOpen={isOpen}
        onOpenChange={setOpen}
        disabled={disabled}
        popupBackgroundColor={popupBackgroundColor}
        customClasses="hans-dropdown-popup-wrapper"
        popupClassName="hans-dropdown-popup"
        panelClassName="hans-dropdown-popup-content"
        renderTrigger={({ toggle }) => (
          <HansButton
            buttonColor={triggerColor}
            buttonVariant={triggerVariant}
            buttonShape={triggerShape}
            buttonSize={triggerSize}
            disabled={disabled}
            customClasses="hans-dropdown-trigger"
            onClick={toggle}
          >
            <span>{triggerLabel}</span>
            {loading ? (
              <HansLoading
                loadingType="spinner"
                loadingSize="small"
                loadingColor={loadingColor}
                ariaLabel="Loading dropdown"
              />
            ) : (
              <HansIcon
                name={isOpen ? 'IoIosArrowUp' : 'IoIosArrowDown'}
                iconSize="small"
              />
            )}
          </HansButton>
        )}
      >
        {loading ? (
          <div className="hans-dropdown-loading">
            <HansLoading
              loadingType="skeleton"
              loadingColor={loadingColor}
              skeletonWidth="100%"
              skeletonHeight="120px"
              ariaLabel="Loading dropdown content"
            />
          </div>
        ) : hasCustomContent ? (
          <div id={popupId} className="hans-dropdown-custom-content">
            {children}
          </div>
        ) : (
          <HansDropdownItemList
            popupId={popupId}
            items={options}
            noOptionsText={noOptionsText}
            hoveredPath={hoveredPath}
            submenuDirections={submenuDirections}
            onItemEnter={handleDropdownItemEnter}
            onListEnter={handleListEnter}
            onListLeave={handleListLeave}
            onSelect={handleSelect}
          />
        )}
      </HansPopup>
    </div>
  );
});

HansDropdown.displayName = 'HansDropdown';
