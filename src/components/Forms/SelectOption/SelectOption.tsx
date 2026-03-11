import React from 'react';
import type {
  HansSelectOptionProps,
  SelectOptionValue,
} from './SelectOption.types';
import { HansInput } from '../Input/Input';
import { HansIcon } from '../../Icon/Icon';
import { HansTag } from '../../Tag/Tag';
import { HansLoading } from '../../Loading/Loading';
import { HansPopup } from '../../Popup/Popup';
import { HansSelectOptionItemList } from './SelectOptionItemList/SelectOptionItemList';
import {
  createHandleInputChange,
  createHandleOpen,
  createHandleRemoveSelected,
  createHandleSelectOption,
  createSyncAutocompleteSearchTerm,
  createSyncPopupOffsets,
  createSyncSelectOptionValue,
  createHandleToggle,
  createSetSelectOptionOpen,
  filterSelectOptionItens,
  getSelectOptionFieldStyle,
  getInitialSelectOptionValue,
  getOptionId,
  getSelectedOptions,
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
    createSyncSelectOptionValue({ value, setInternalValue })();
  }, [value]);

  const selectedValues = normalizeToArray(
    typeof value !== 'undefined' ? value : internalValue,
  );
  const selectedOptions = React.useMemo(
    () => getSelectedOptions(options, selectedValues),
    [options, selectedValues],
  );
  const selectedLabel = getSelectedLabel(isMulti, selectedOptions);

  React.useEffect(() => {
    createSyncAutocompleteSearchTerm({
      enableAutocomplete,
      isMulti,
      selectedLabel,
      setSearchTerm,
    })();
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
    createSyncPopupOffsets({ selectOptionRef, setPopupOffsets })();
  }, [label, message, inputSize, labelColor, messageColor]);

  const popupFieldStyle = React.useMemo(
    () => getSelectOptionFieldStyle(popupOffsets),
    [popupOffsets],
  );

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
        <HansSelectOptionItemList
          listId={`${inputId}-list`}
          items={filteredOptions}
          selectedValues={selectedValues}
          isMulti={isMulti}
          openDirection={openDirection}
          dropdownHoverColor={dropdownHoverColor}
          noOptionsText={noOptionsText}
          isLoadingOptions={isLoadingOptions}
          loadingOptionsText={loadingOptionsText}
          onSelectItem={handleSelectOption}
        />
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
