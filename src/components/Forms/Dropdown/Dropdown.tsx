import React from 'react';
import type { DropdownValue, HansDropdownProps } from './Dropdown.types';
import { HansInput } from '../Input/Input';
import { HansIcon } from '../../Icon/Icon';
import { HansAvatar } from '../../Avatar/Avatar';
import { HansTag } from '../../Tag/Tag';
import {
  createHandleInputChange,
  createHandleOpen,
  createHandleRemoveSelected,
  createHandleSelectOption,
  createHandleToggle,
  createSetDropdownOpen,
  filterDropdownOptions,
  getInitialDropdownValue,
  getOpenDirection,
  getOptionId,
  getSelectedLabel,
  normalizeToArray,
} from './helpers/Dropdown.helper';

export const HansDropdown = React.memo((props: HansDropdownProps) => {
  const {
    label = '',
    labelColor = 'base',
    placeholder = 'Select an option',
    inputId = 'hans-dropdown',
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
  const [searchTerm, setSearchTerm] = React.useState('');
  const [internalValue, setInternalValue] = React.useState<DropdownValue>(
    () => getInitialDropdownValue(value, defaultValue, isMulti),
  );

  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const ignoreFocusRef = React.useRef(false);

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

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!containerRef.current || !target) return;
      if (!containerRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredOptions = React.useMemo(
    () => filterDropdownOptions(options, enableAutocomplete, searchTerm),
    [enableAutocomplete, options, searchTerm],
  );

  React.useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => {
      if (!containerRef.current || !listRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const listRect = listRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - containerRect.bottom;
      const spaceAbove = containerRect.top;
      setOpenDirection(getOpenDirection(spaceBelow, spaceAbove, listRect.height));
    });

    return () => cancelAnimationFrame(frame);
  }, [isOpen, filteredOptions.length]);

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

  const setDropdownOpen = createSetDropdownOpen({
    disabled,
    ignoreFocusRef,
    setIsOpen,
  });

  const handleOpen = createHandleOpen(setDropdownOpen);

  const handleToggle = createHandleToggle(setDropdownOpen, () => isOpen);

  const inputValue = enableAutocomplete ? searchTerm : selectedLabel;

  return (
    <div className="hans-dropdown" ref={containerRef}>
      <div className="hans-dropdown-field">
        <HansInput
          label={label}
          labelColor={labelColor}
          message={message}
          messageColor={messageColor}
          inputId={inputId}
          inputColor={inputColor}
          inputSize={inputSize}
          placeholder={placeholder}
          customClasses={`hans-dropdown-input ${customClasses}`}
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
            <HansIcon
              name={isOpen ? 'MdArrowDropUp' : 'MdArrowDropDown'}
              iconSize="small"
            />
          }
          {...rest}
        />

        {isOpen && !disabled ? (
          <ul
            ref={listRef}
            className="hans-dropdown-list"
            role="listbox"
            aria-multiselectable={isMulti}
            data-direction={openDirection}
            style={
              {
                '--hans-dropdown-bg': dropdownBackgroundColor,
                '--hans-dropdown-hover': dropdownHoverColor,
              } as React.CSSProperties
            }
          >
            {filteredOptions.length === 0 ? (
              <li className="hans-dropdown-empty">{noOptionsText}</li>
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
                      hans-dropdown-option
                      ${isSelected ? 'hans-dropdown-option-selected' : ''}
                      ${option.disabled ? 'hans-dropdown-option-disabled' : ''}
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
                    <span className="hans-dropdown-option-label">
                      {option.label}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        ) : null}
      </div>

      {isMulti && selectedOptions.length > 0 ? (
        <div className="hans-dropdown-selected">
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

HansDropdown.displayName = 'HansDropdown';
