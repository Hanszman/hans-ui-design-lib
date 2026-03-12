import type { HansToggleProps } from '../Toggle.types';

export type HansToggleSwitchProps = Omit<
  HansToggleProps,
  'toggleMode' | 'value' | 'defaultValue' | 'options' | 'onValueChange'
>;
