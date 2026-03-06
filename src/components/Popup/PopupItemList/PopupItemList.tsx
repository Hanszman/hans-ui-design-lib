import React from 'react';
import { HansAvatar } from '../../Avatar/Avatar';
import { HansIcon } from '../../Icon/Icon';
import {
  resolvePopupItemClassName,
  resolvePopupItemPath,
} from '../helpers/Popup.helper';
import type {
  HansPopupItemListItemState,
  HansPopupItemListProps,
} from './PopupItemList.types';

export const HansPopupItemList = React.memo((props: HansPopupItemListProps) => {
  const {
    items,
    id,
    className = '',
    role = 'listbox',
    itemRole = 'option',
    style,
    dataDirection,
    ariaMultiselectable,
    parentPath = '',
    nested = false,
    emptyText,
    emptyClassName = 'hans-popup-item-list-empty',
    itemClassName = '',
    itemLabelClassName = '',
    selectedItemIds = [],
    resolveItemId,
    onItemClick,
    onItemEnter,
    onListMouseEnter,
    onListMouseLeave,
    renderLeading,
    renderTrailing,
    renderChildren,
  } = props;

  return (
    <ul
      id={id}
      className={className}
      role={role}
      style={style}
      data-direction={dataDirection}
      aria-multiselectable={ariaMultiselectable}
      onMouseEnter={(event) => onListMouseEnter?.(parentPath, event)}
      onMouseLeave={(event) => onListMouseLeave?.(parentPath, event)}
    >
      {items.length === 0 ? (
        <li className={emptyClassName}>{emptyText}</li>
      ) : (
        items.map((item, index) => {
          const itemPath = resolvePopupItemPath(parentPath, index);
          const itemId = resolveItemId
            ? resolveItemId(item, itemPath)
            : (item.id ?? `${item.value}-${itemPath}`);
          const isSelected = selectedItemIds.includes(itemId);
          const isDisabled = Boolean(item.disabled);
          const hasChildren =
            Array.isArray(item.children) && item.children.length > 0;
          const state: HansPopupItemListItemState = {
            item,
            itemPath,
            itemId,
            index,
            nested,
            isSelected,
            isDisabled,
            hasChildren,
          };

          return (
            <li
              key={itemId}
              role={itemRole}
              aria-selected={itemRole === 'option' ? isSelected : undefined}
              aria-disabled={isDisabled}
              className={resolvePopupItemClassName(itemClassName, state)}
              onMouseEnter={(event) =>
                onItemEnter?.(state, event.currentTarget as HTMLElement)
              }
              onClick={() => onItemClick?.(item, state)}
            >
              {item.imageSrc ? (
                <HansAvatar
                  src={item.imageSrc}
                  alt={item.imageAlt ?? item.label}
                  avatarSize="small"
                />
              ) : null}
              {item.iconName ? (
                <HansIcon name={item.iconName} iconSize="small" />
              ) : null}
              {renderLeading?.(state)}
              <span className={itemLabelClassName}>{item.label}</span>
              {renderTrailing?.(state)}
              {renderChildren?.(state)}
            </li>
          );
        })
      )}
    </ul>
  );
});

HansPopupItemList.displayName = 'HansPopupItemList';
