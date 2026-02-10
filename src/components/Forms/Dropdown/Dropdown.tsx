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

const getOptionId = (option: DropdownOption): string =>
  option.id ?? option.value;

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
    () => {
      if (typeof value !== 'undefined') return value;
      if (typeof defaultValue !== 'undefined') return defaultValue;
      return isMulti ? [] : '';
    },
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

  const selectedLabel = isMulti
    ? selectedOptions.map((option) => option.label).join(', ')
    : (selectedOptions[0]?.label ?? '');

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

  React.useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => {
      if (!containerRef.current || !listRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const listRect = listRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - containerRect.bottom;
      const spaceAbove = containerRect.top;
      if (spaceBelow < listRect.height && spaceAbove > listRect.height) {
        setOpenDirection('up');
      } else {
        setOpenDirection('down');
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [isOpen, filteredOptions.length]);

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
    const optionId = getOptionId(option);

    if (isMulti) {
      const nextValues = selectedValues.includes(optionId)
        ? selectedValues.filter((valueItem) => valueItem !== optionId)
        : [...selectedValues, optionId];

      if (typeof value === 'undefined') setInternalValue(nextValues);
      if (onChange) onChange(nextValues);
      if (enableAutocomplete) setSearchTerm('');
      return;
    }

    if (typeof value === 'undefined') setInternalValue(optionId);
    if (onChange) onChange(optionId);
    if (enableAutocomplete) setSearchTerm(option.label);
    setIsOpen(false);
  };

  const setDropdownOpen = (nextOpen: boolean, source: 'focus' | 'toggle') => {
    if (disabled) return;
    if (source === 'focus' && ignoreFocusRef.current) {
      ignoreFocusRef.current = false;
      return;
    }
    if (source === 'toggle' && !nextOpen) {
      ignoreFocusRef.current = true;
    }
    setIsOpen(nextOpen);
  };

  const handleOpen = () => {
    setDropdownOpen(true, 'focus');
  };

  const handleToggle = () => {
    setDropdownOpen(!isOpen, 'toggle');
  };

  const inputValue = enableAutocomplete ? searchTerm : selectedLabel;

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
                      <img
                        className="hans-dropdown-option-image"
                        src={option.imageSrc}
                        alt={option.imageAlt ?? option.label}
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
            <span
              key={getOptionId(option)}
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
