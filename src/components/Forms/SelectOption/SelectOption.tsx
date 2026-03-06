import React from 'react';
import type {
  HansSelectOptionProps,
  SelectOptionValue,
} from './SelectOption.types';
import { HansInput } from '../Input/Input';
import { HansIcon } from '../../Icon/Icon';
import { HansAvatar } from '../../Avatar/Avatar';
import { HansTag } from '../../Tag/Tag';
import { HansLoading } from '../../Loading/Loading';
import { HansPopup } from '../../Popup/Popup';
import {
  createHandleInputChange,
  createHandleOpen,
  createHandleRemoveSelected,
  createHandleSelectOption,
  createHandleToggle,
  createSetSelectOptionOpen,
  filterSelectOptionItens,
  getSelectOptionPopupOffsets,
  getInitialSelectOptionValue,
  getOptionId,
  getSelectedLabel,
  normalizeToArray,
} from './helpers/SelectOption.helper';

export const HansSelectOption = React.memo((props: HansSelectOptionProps) => {
  const {
    label = '',
    labelColor = 'base',
    placeholder = 'Select an option',
    inputId = 'hans-select-option',
    inputColor = 'base',
    inputSize = 'medium',
    message = '',
    messageColor = 'base',
    customClasses = '',
    disabled = false,
    options = [],
    selectionType = 'single',
    enableAutocomplete = true,
    value,
    defaultValue,
    noOptionsText = 'No options',
    dropdownBackgroundColor = 'var(--white)',
    dropdownHoverColor = 'var(--gray-100)',
    isLoadingOptions = false,
    loadingOptionsText = 'Loading options...',
    onSearch,
    onChange,
    onInputChange,
    ...rest
  } = props;

  const isMulti = selectionType === 'multi';
  const [isOpen, setIsOpen] = React.useState(false);
  const [openDirection, setOpenDirection] = React.useState<'down' | 'up'>(
    'down',
  );
  const [popupOffsets, setPopupOffsets] = React.useState({ up: 0, down: 0 });
  const [searchTerm, setSearchTerm] = React.useState('');
  const [internalValue, setInternalValue] = React.useState<SelectOptionValue>(
    () => getInitialSelectOptionValue(value, defaultValue, isMulti),
  );
  const ignoreFocusRef = React.useRef(false);
  const selectOptionRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof value !== 'undefined') setInternalValue(value);
  }, [value]);

  const selectedValues = normalizeToArray(
    typeof value !== 'undefined' ? value : internalValue,
  );
  const selectedOptions = React.useMemo(
    () =>
      options.filter((option) => selectedValues.includes(getOptionId(option))),
    [options, selectedValues],
  );
  const selectedLabel = getSelectedLabel(isMulti, selectedOptions);

  React.useEffect(() => {
    if (!enableAutocomplete || isMulti) return;
    setSearchTerm(selectedLabel);
  }, [enableAutocomplete, isMulti, selectedLabel]);

  const filteredOptions = React.useMemo(
    () => filterSelectOptionItens(options, enableAutocomplete, searchTerm),
    [enableAutocomplete, options, searchTerm],
  );

  const handleInputChange = createHandleInputChange({
    enableAutocomplete,
    isOpen,
    setSearchTerm,
    setIsOpen,
    onSearch,
    onInputChange,
  });
  const handleSelectOption = createHandleSelectOption({
    disabled,
    isMulti,
    selectedValues,
    value,
    enableAutocomplete,
    setInternalValue,
    onChange,
    setSearchTerm,
    setIsOpen,
  });
  const handleRemoveSelected = createHandleRemoveSelected({
    selectedValues,
    value,
    setInternalValue,
    onChange,
  });
  const setSelectOptionOpen = createSetSelectOptionOpen({
    disabled,
    ignoreFocusRef,
    setIsOpen,
  });
  const handleOpen = createHandleOpen(setSelectOptionOpen);
  const handleToggle = createHandleToggle(setSelectOptionOpen, () => isOpen);
  const inputValue = enableAutocomplete ? searchTerm : selectedLabel;

  React.useEffect(() => {
    setPopupOffsets(getSelectOptionPopupOffsets(selectOptionRef.current));
  }, [label, message, inputSize, labelColor, messageColor]);

  const popupFieldStyle = React.useMemo(() => {
    return {
      '--hans-select-option-up-offset': `${popupOffsets.up}px`,
      '--hans-select-option-down-offset': `${popupOffsets.down}px`,
    } as React.CSSProperties;
  }, [popupOffsets.down, popupOffsets.up]);

  return (
    <div className="hans-select-option" ref={selectOptionRef}>
      <HansPopup
        isOpen={isOpen}
        disabled={disabled}
        onOpenChange={setIsOpen}
        popupBackgroundColor={dropdownBackgroundColor}
        customClasses="hans-select-option-field"
        popupClassName="hans-select-option-popup"
        panelClassName="hans-select-option-popup-content"
        style={popupFieldStyle}
        onDirectionChange={setOpenDirection}
        renderTrigger={() => (
          <HansInput
            label={label}
            labelColor={labelColor}
            message={message}
            messageColor={messageColor}
            inputId={inputId}
            inputColor={inputColor}
            inputSize={inputSize}
            placeholder={placeholder}
            customClasses={`hans-select-option-input ${customClasses}`}
            disabled={disabled}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleOpen}
            onMouseDown={handleToggle}
            readOnly={!enableAutocomplete}
            leftIcon={
              enableAutocomplete ? (
                <HansIcon name="FaSearch" iconSize="small" />
              ) : undefined
            }
            rightIcon={
              isLoadingOptions ? (
                <HansLoading
                  loadingType="spinner"
                  loadingSize="small"
                  customClasses="hans-select-option-loading-icon"
                  ariaLabel="Loading select options"
                />
              ) : (
                <HansIcon
                  name={isOpen ? 'IoIosArrowUp' : 'IoIosArrowDown'}
                  iconSize="small"
                />
              )
            }
            {...rest}
          />
        )}
      >
        <ul
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
          ) : filteredOptions.length === 0 ? (
            <li className="hans-select-option-empty">{noOptionsText}</li>
          ) : (
            filteredOptions.map((option) => {
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
                  onClick={() => handleSelectOption(option)}
                >
                  {option.imageSrc ? (
                    <HansAvatar
                      src={option.imageSrc}
                      alt={option.imageAlt ?? option.label}
                      avatarSize="small"
                    />
                  ) : null}
                  <span className="hans-select-option-option-label">
                    {option.label}
                  </span>
                </li>
              );
            })
          )}
        </ul>
      </HansPopup>

      {isMulti && selectedOptions.length > 0 ? (
        <div className="hans-select-option-selected">
          {selectedOptions.map((option) => (
            <HansTag
              key={getOptionId(option)}
              label={option.label}
              tagSize="small"
              tagColor="base"
              actionIcon="IoIosCloseCircle"
              onAction={() => handleRemoveSelected(getOptionId(option))}
              disabled={disabled}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
});

HansSelectOption.displayName = 'HansSelectOption';
