import React from 'react';
import { HansIcon } from '../../../Icon/Icon';
import { HansPopupItemList } from '../../../Popup/PopupItemList/PopupItemList';
import type { HansPopupItemListItemState } from '../../../Popup/PopupItemList/PopupItemList.types';
import type { DropdownItem } from '../Dropdown.types';
import {
  getDropdownSubmenuArrowName,
  shouldShowDropdownSubmenu,
} from '../helpers/Dropdown.helper';
import type { HansDropdownItemListProps } from './DropdownItemList.types';

const getDropdownItemClassName = (
  state: HansPopupItemListItemState,
  submenuDirection: 'left' | 'right',
): string => `
  hans-dropdown-option
  ${state.isDisabled ? 'hans-dropdown-option-disabled' : ''}
  ${state.hasChildren ? 'hans-dropdown-option-parent' : ''}
  ${state.hasChildren ? `hans-dropdown-option-parent-${submenuDirection}` : ''}
`;

export const HansDropdownItemList = React.memo(
  (props: HansDropdownItemListProps) => {
    const {
      items,
      noOptionsText,
      hoveredPath,
      submenuDirections,
      parentPath = '',
      nested = false,
      popupId,
      onItemEnter,
      onListEnter,
      onListLeave,
      onSelect,
    } = props;

    return (
      <HansPopupItemList
        id={nested ? undefined : popupId}
        className={`hans-dropdown-list ${nested ? 'hans-dropdown-list-nested' : ''}`}
        role="menu"
        itemRole="menuitem"
        items={items}
        parentPath={parentPath}
        nested={nested}
        emptyText={noOptionsText}
        itemClassName={(state) => {
          const submenuDirection = submenuDirections[state.itemPath] ?? 'right';
          return getDropdownItemClassName(state, submenuDirection);
        }}
        onItemEnter={(state, target) => onItemEnter(state.itemPath, target)}
        onListMouseEnter={onListEnter}
        onListMouseLeave={onListLeave}
        onItemClick={(item) => onSelect(item as DropdownItem)}
        renderTrailing={(state) => {
          if (!state.hasChildren) return null;
          const submenuDirection = submenuDirections[state.itemPath] ?? 'right';
          return (
            <HansIcon
              name={getDropdownSubmenuArrowName(submenuDirection)}
              iconSize="small"
              customClasses="hans-dropdown-option-arrow"
            />
          );
        }}
        renderChildren={(state) => {
          if (!state.hasChildren) return null;
          const showSubmenu = shouldShowDropdownSubmenu(hoveredPath, state.itemPath);
          if (!showSubmenu) return null;

          return (
            <HansDropdownItemList
              items={state.item.children as DropdownItem[]}
              noOptionsText={noOptionsText}
              hoveredPath={hoveredPath}
              submenuDirections={submenuDirections}
              parentPath={state.itemPath}
              nested
              onItemEnter={onItemEnter}
              onListEnter={onListEnter}
              onListLeave={onListLeave}
              onSelect={onSelect}
            />
          );
        }}
      />
    );
  },
);

HansDropdownItemList.displayName = 'HansDropdownItemList';
