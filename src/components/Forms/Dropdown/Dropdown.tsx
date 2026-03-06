import React from 'react';
import { HansButton } from '../Button/Button';
import { HansIcon } from '../../Icon/Icon';
import { HansLoading } from '../../Loading/Loading';
import { HansPopup } from '../../Popup/Popup';
import type { DropdownItem, HansDropdownProps } from './Dropdown.types';
import {
  getDropdownSelection,
  hasCustomDropdownContent,
  resolveDropdownItemId,
} from './helpers/Dropdown.helper';

export const HansDropdown = React.memo((props: HansDropdownProps) => {
  const {
    triggerLabel = 'Dropdown',
    triggerColor = 'base',
    triggerVariant = 'outline',
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
  const hasCustomContent = hasCustomDropdownContent(children);

  const setOpen = (nextOpen: boolean) => {
    setIsOpen(nextOpen);
    if (onOpenChange) onOpenChange(nextOpen);
  };
  const handleSelect = (item: DropdownItem) => {
    getDropdownSelection(item, onSelect);
    if (closeOnSelect && !item.disabled) setOpen(false);
  };

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
          <ul id={popupId} className="hans-dropdown-list" role="menu">
            {options.length === 0 ? (
              <li className="hans-dropdown-empty">{noOptionsText}</li>
            ) : (
              options.map((item, index) => (
                <li
                  key={resolveDropdownItemId({ item, index })}
                  role="menuitem"
                  aria-disabled={item.disabled}
                  className={`
                    hans-dropdown-option
                    ${item.disabled ? 'hans-dropdown-option-disabled' : ''}
                  `}
                  onClick={() => handleSelect(item)}
                >
                  {item.iconName ? (
                    <HansIcon name={item.iconName} iconSize="small" />
                  ) : null}
                  <span>{item.label}</span>
                </li>
              ))
            )}
          </ul>
        )}
      </HansPopup>
    </div>
  );
});

HansDropdown.displayName = 'HansDropdown';
