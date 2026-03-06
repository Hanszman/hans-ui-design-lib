import React from 'react';
import { HansButton } from '../Button/Button';
import { HansIcon } from '../../Icon/Icon';
import { HansLoading } from '../../Loading/Loading';
import { HansPopup } from '../../Popup/Popup';
import { HansDropdownOptionList } from './DropdownOptionList/DropdownOptionList';
import type { HansDropdownProps } from './Dropdown.types';
import {
  createDropdownOpenSetter,
  createHandleDropdownItemEnter,
  createHandleDropdownSelect,
  getHoveredPathOnListLeave,
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
    popupBackgroundColor = 'var(--white)',
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
  const setSubmenuDirection = React.useCallback(
    (path: string, direction: 'left' | 'right') => {
      setSubmenuDirections((prev) => {
        return getNextDropdownSubmenuDirections(prev, path, direction);
      });
    },
    [],
  );
  const handleListLeave = React.useCallback((parentPath: string) => {
    setHoveredPath(getHoveredPathOnListLeave(parentPath));
  }, []);

  React.useEffect(() => {
    if (!isOpen) {
      setHoveredPath(null);
      setSubmenuDirections({});
    }
  }, [isOpen]);
  
  const handleDropdownItemEnter = React.useMemo(
    () => createHandleDropdownItemEnter({
      setHoveredPath,
      setSubmenuDirection,
      submenuWidth: 240,
    }),
    [setSubmenuDirection],
  );

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
          <HansDropdownOptionList
            popupId={popupId}
            items={options}
            noOptionsText={noOptionsText}
            hoveredPath={hoveredPath}
            submenuDirections={submenuDirections}
            onItemEnter={handleDropdownItemEnter}
            onListLeave={handleListLeave}
            onSelect={handleSelect}
          />
        )}
      </HansPopup>
    </div>
  );
});

HansDropdown.displayName = 'HansDropdown';
