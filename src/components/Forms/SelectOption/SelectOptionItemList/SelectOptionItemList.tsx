import React from 'react';
import { HansLoading } from '../../../Loading/Loading';
import { HansPopupItemList } from '../../../Popup/PopupItemList/PopupItemList';
import {
  getOptionId,
  getSelectOptionItemClassName,
} from '../helpers/SelectOption.helper';
import type { SelectOptionItem } from '../SelectOption.types';
import type { HansSelectOptionItemListProps } from './SelectOptionItemList.types';

export const HansSelectOptionItemList = React.memo(
  (props: HansSelectOptionItemListProps) => {
    const {
      items,
      selectedValues,
      isMulti,
      openDirection,
      dropdownHoverColor,
      noOptionsText,
      isLoadingOptions,
      loadingOptionsText,
      onSelectItem,
      listId,
    } = props;

    if (isLoadingOptions) {
      return (
        <ul
          id={listId}
          className="hans-select-option-list"
          role="listbox"
          aria-multiselectable={isMulti}
          data-direction={openDirection}
          style={
            {
              '--hans-select-option-hover': dropdownHoverColor,
            } as React.CSSProperties
          }
        >
          <li className="hans-select-option-loading">
            <HansLoading
              loadingType="spinner"
              loadingSize="small"
              customClasses="hans-select-option-loading-spinner"
              ariaLabel={loadingOptionsText}
            />
            <span>{loadingOptionsText}</span>
          </li>
        </ul>
      );
    }

    return (
      <HansPopupItemList
        id={listId}
        className="hans-select-option-list"
        role="listbox"
        itemRole="option"
        ariaMultiselectable={isMulti}
        dataDirection={openDirection}
        style={
          {
            '--hans-select-option-hover': dropdownHoverColor,
          } as React.CSSProperties
        }
        items={items}
        emptyText={noOptionsText}
        emptyClassName="hans-select-option-empty"
        itemClassName={getSelectOptionItemClassName}
        itemLabelClassName="hans-select-option-option-label"
        selectedItemIds={selectedValues}
        resolveItemId={(item) => getOptionId(item as SelectOptionItem)}
        onItemClick={(item) => onSelectItem(item as SelectOptionItem)}
      />
    );
  },
);

HansSelectOptionItemList.displayName = 'HansSelectOptionItemList';
