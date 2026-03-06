import React from 'react';
import { HansAvatar } from '../../../Avatar/Avatar';
import { HansIcon } from '../../../Icon/Icon';
import { HansLoading } from '../../../Loading/Loading';
import { HansPopupItemList } from '../../../Popup/PopupItemList/PopupItemList';
import { getOptionId } from '../helpers/SelectOption.helper';
import type { HansSelectOptionItemListProps } from './SelectOptionItemList.types';

export const HansSelectOptionItemList = React.memo(
  (props: HansSelectOptionItemListProps) => {
    const {
      options,
      selectedValues,
      isMulti,
      openDirection,
      dropdownHoverColor,
      noOptionsText,
      isLoadingOptions,
      loadingOptionsText,
      onSelectOption,
      listId,
    } = props;

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
        {isLoadingOptions ? (
          <li className="hans-select-option-loading">
            <HansLoading
              loadingType="spinner"
              loadingSize="small"
              customClasses="hans-select-option-loading-spinner"
              ariaLabel={loadingOptionsText}
            />
            <span>{loadingOptionsText}</span>
          </li>
        ) : (
          <HansPopupItemList
            as="none"
            hasItems={options.length > 0}
            emptyText={noOptionsText}
            emptyAs="li"
            emptyClassName="hans-select-option-empty"
          >
            {options.map((option) => {
              const optionId = getOptionId(option);
              const isSelected = selectedValues.includes(optionId);
              return (
                <li
                  key={optionId}
                  role="option"
                  aria-selected={isSelected}
                  className={`
                    hans-select-option-option
                    ${isSelected ? 'hans-select-option-option-selected' : ''}
                    ${option.disabled ? 'hans-select-option-option-disabled' : ''}
                  `}
                  onClick={() => onSelectOption(option)}
                >
                  {option.imageSrc ? (
                    <HansAvatar
                      src={option.imageSrc}
                      alt={option.imageAlt ?? option.label}
                      avatarSize="small"
                    />
                  ) : null}
                  {option.iconName ? (
                    <HansIcon name={option.iconName} iconSize="small" />
                  ) : null}
                  <span className="hans-select-option-option-label">
                    {option.label}
                  </span>
                </li>
              );
            })}
          </HansPopupItemList>
        )}
      </ul>
    );
  },
);

HansSelectOptionItemList.displayName = 'HansSelectOptionItemList';
