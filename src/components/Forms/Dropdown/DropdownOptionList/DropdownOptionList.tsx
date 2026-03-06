import React from 'react';
import { HansIcon } from '../../../Icon/Icon';
import type { DropdownItem } from '../Dropdown.types';
import {
  createDropdownItemPath,
  getDropdownSubmenuArrowName,
  hasNestedDropdownItems,
  resolveDropdownItemId,
  shouldShowDropdownSubmenu,
} from '../helpers/Dropdown.helper';
import type { HansDropdownOptionListProps } from './DropdownOptionList.types';
import { HansPopupOptionList } from '../../../Popup/PopupOptionList/PopupOptionList';

export const HansDropdownOptionList = React.memo(
  (props: HansDropdownOptionListProps) => {
    const {
      items,
      noOptionsText,
      hoveredPath,
      submenuDirections,
      parentPath = '',
      nested = false,
      popupId,
      onItemEnter,
      onListLeave,
      onSelect,
    } = props;

    return (
      <HansPopupOptionList
        id={nested ? undefined : popupId}
        className={`hans-dropdown-list ${nested ? 'hans-dropdown-list-nested' : ''}`}
        role="menu"
        emptyText={noOptionsText}
        hasItems={items.length > 0}
        onMouseLeave={() => onListLeave?.(parentPath)}
      >
        {items.map((item, index) => {
          const itemPath = createDropdownItemPath(parentPath, index);
          const hasChildren = hasNestedDropdownItems(item);
          const itemId = resolveDropdownItemId({ item, itemPath });
          const showSubmenu = shouldShowDropdownSubmenu(hoveredPath, itemPath);
          const submenuDirection = submenuDirections[itemPath] ?? 'right';

          return (
            <li
              key={itemId}
              role="menuitem"
              aria-disabled={item.disabled}
              className={`
                  hans-dropdown-option
                  ${item.disabled ? 'hans-dropdown-option-disabled' : ''}
                  ${hasChildren ? 'hans-dropdown-option-parent' : ''}
                  ${hasChildren ? `hans-dropdown-option-parent-${submenuDirection}` : ''}
                `}
              onMouseEnter={(event) =>
                onItemEnter(itemPath, event.currentTarget as HTMLElement)
              }
              onClick={() => onSelect(item)}
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
                  name={getDropdownSubmenuArrowName(submenuDirection)}
                  iconSize="small"
                  customClasses="hans-dropdown-option-arrow"
                />
              ) : null}
              {hasChildren && showSubmenu ? (
                <HansDropdownOptionList
                  items={item.children as DropdownItem[]}
                  noOptionsText={noOptionsText}
                  hoveredPath={hoveredPath}
                  submenuDirections={submenuDirections}
                  parentPath={itemPath}
                  nested
                  onItemEnter={onItemEnter}
                  onListLeave={onListLeave}
                  onSelect={onSelect}
                />
              ) : null}
            </li>
          );
        })}
      </HansPopupOptionList>
    );
  },
);

HansDropdownOptionList.displayName = 'HansDropdownOptionList';
