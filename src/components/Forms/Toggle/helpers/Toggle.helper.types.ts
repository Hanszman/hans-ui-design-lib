import type React from 'react';

export type SwitchToggleHandlerParams = {
  disabled: boolean;
  isChecked: boolean;
  isControlled: boolean;
  setInternalChecked: React.Dispatch<React.SetStateAction<boolean>>;
  onChange?: (checked: boolean) => void;
};

export type OptionSelectHandlerParams = {
  disabled: boolean;
  optionDisabled?: boolean;
  nextValue: string;
  isControlled: boolean;
  setInternalValue: React.Dispatch<React.SetStateAction<string>>;
  onValueChange?: (value: string) => void;
};
