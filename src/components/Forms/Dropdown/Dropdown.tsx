import React from 'react';
import type {
  DropdownOption,
  DropdownValue,
  HansDropdownProps,
} from './Dropdown.types';
import { HansInput } from '../Input/Input';
import { HansIcon } from '../../Icon/Icon';

const normalizeToArray = (value: DropdownValue | undefined): string[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.length > 0) return [value];
  return [];
};

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
    onChange,
    onSearch,
    onInputChange,
    ...rest
  } = props;

  const isMulti = selectionType === 'multi';
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [internalValue, setInternalValue] = React.useState<DropdownValue>(() => {
    if (typeof value !== 'undefined') return value;
    if (typeof defaultValue !== 'undefined') return defaultValue;
    return isMulti ? [] : '';
  });

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof value !== 'undefined') setInternalValue(value);
  }, [value]);

  const selectedValues = normalizeToArray(
    typeof value !== 'undefined' ? value : internalValue,
  );

  const selectedOptions = React.useMemo(
    () =>
      options.filter((option) => selectedValues.includes(option.value ?? '')),
    [options, selectedValues],
  );

  const selectedLabel = isMulti
    ? selectedOptions.map((option) => option.label).join(', ')
    : selectedOptions[0]?.label ?? '';

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

  const filteredOptions = React.useMemo(() => {
    if (!enableAutocomplete || searchTerm.trim().length === 0) return options;
    const search = searchTerm.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(search),
    );
  }, [enableAutocomplete, options, searchTerm]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!enableAutocomplete) return;
    const nextValue = event.target.value;
    setSearchTerm(nextValue);
    if (!isOpen) setIsOpen(true);
    if (onSearch) onSearch(nextValue);
    if (onInputChange) onInputChange(event);
  };

  const handleSelectOption = (option: DropdownOption) => {
    if (option.disabled || disabled) return;

    if (isMulti) {
      const nextValues = selectedValues.includes(option.value)
        ? selectedValues.filter((valueItem) => valueItem !== option.value)
        : [...selectedValues, option.value];

      if (typeof value === 'undefined') setInternalValue(nextValues);
      if (onChange) onChange(nextValues);
      if (enableAutocomplete) setSearchTerm('');
      return;
    }

    if (typeof value === 'undefined') setInternalValue(option.value);
    if (onChange) onChange(option.value);
    if (enableAutocomplete) setSearchTerm(option.label);
    setIsOpen(false);
  };

  const handleOpen = () => {
    if (disabled) return;
    setIsOpen(true);
  };

  const inputValue = enableAutocomplete
    ? searchTerm
    : selectedLabel;

  return (
    <div className="hans-dropdown" ref={containerRef}>
      {label ? (
        <label
          htmlFor={inputId}
          className={`
            hans-input-label
            hans-input-label-${labelColor}
          `}
        >
          {label}
        </label>
      ) : null}

      <div className="hans-dropdown-field">
        <HansInput
          label=""
          message=""
          inputId={inputId}
          inputColor={inputColor}
          inputSize={inputSize}
          placeholder={placeholder}
          customClasses={`hans-dropdown-input ${customClasses}`}
          disabled={disabled}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleOpen}
          onClick={handleOpen}
          readOnly={!enableAutocomplete}
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
            className="hans-dropdown-list"
            role="listbox"
            aria-multiselectable={isMulti}
          >
            {filteredOptions.length === 0 ? (
              <li className="hans-dropdown-empty">{noOptionsText}</li>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    className={`
                      hans-dropdown-option
                      ${isSelected ? 'hans-dropdown-option-selected' : ''}
                      ${option.disabled ? 'hans-dropdown-option-disabled' : ''}
                    `}
                    onClick={() => handleSelectOption(option)}
                  >
                    {option.label}
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
            <span
              key={option.value}
              className={`
                hans-dropdown-chip
                hans-dropdown-chip-${inputColor}
              `}
            >
              {option.label}
            </span>
          ))}
        </div>
      ) : null}

      {message ? (
        <p
          className={`
            hans-input-message
            hans-input-message-${messageColor}
          `}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
});

HansDropdown.displayName = 'HansDropdown';
