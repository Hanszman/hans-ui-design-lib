import React from 'react';
import { HansButton } from '../Button/Button';
import { HansIcon } from '../../Icon/Icon';
import { HansLoading } from '../../Loading/Loading';
import { HansPopup } from '../../Popup/Popup';
import type { DropdownItem, HansDropdownProps } from './Dropdown.types';
import {
  createDropdownItemPath,
  createDropdownOpenSetter,
  createHandleDropdownItemEnter,
  createHandleDropdownSelect,
  hasCustomDropdownContent,
  hasNestedDropdownItems,
  resolveDropdownItemId,
  shouldShowDropdownSubmenu,
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
  const hasCustomContent = hasCustomDropdownContent(children);
  const setOpen = createDropdownOpenSetter({ setIsOpen, onOpenChange });
  const handleSelect = createHandleDropdownSelect({
    closeOnSelect,
    setOpen,
    onSelect,
  });
  const handleItemEnter = createHandleDropdownItemEnter({ setHoveredPath });

  React.useEffect(() => {
    if (!isOpen) setHoveredPath(null);
  }, [isOpen]);

  const renderOptions = (
    items: DropdownItem[],
    parentPath: string = '',
    nested: boolean = false,
  ) => (
    <ul
      id={nested ? undefined : popupId}
      className={`hans-dropdown-list ${nested ? 'hans-dropdown-list-nested' : ''}`}
      role={nested ? 'menu' : 'menu'}
      onMouseLeave={() => setHoveredPath(parentPath || null)}
    >
      {items.length === 0 ? (
        <li className="hans-dropdown-empty">{noOptionsText}</li>
      ) : (
        items.map((item, index) => {
          const itemPath = createDropdownItemPath(parentPath, index);
          const hasChildren = hasNestedDropdownItems(item);
          const itemId = resolveDropdownItemId({ item, itemPath });
          const showSubmenu = shouldShowDropdownSubmenu(hoveredPath, itemPath);

          return (
            <li
              key={itemId}
              role="menuitem"
              aria-disabled={item.disabled}
              className={`
                hans-dropdown-option
                ${item.disabled ? 'hans-dropdown-option-disabled' : ''}
                ${hasChildren ? 'hans-dropdown-option-parent' : ''}
              `}
              onMouseEnter={() => handleItemEnter(itemPath)}
              onClick={() => handleSelect(item)}
            >
              {item.imageSrc ? (
                <img
                  src={item.imageSrc}
                  alt={item.imageAlt ?? item.label}
                  className="hans-dropdown-option-image"
                />
              ) : null}
              {item.iconName ? <HansIcon name={item.iconName} iconSize="small" /> : null}
              <span>{item.label}</span>
              {hasChildren ? (
                <HansIcon
                  name="IoIosArrowForward"
                  iconSize="small"
                  customClasses="hans-dropdown-option-arrow"
                />
              ) : null}
              {hasChildren && showSubmenu
                ? renderOptions(item.children as DropdownItem[], itemPath, true)
                : null}
            </li>
          );
        })
      )}
    </ul>
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
          renderOptions(options)
        )}
      </HansPopup>
    </div>
  );
});

HansDropdown.displayName = 'HansDropdown';
