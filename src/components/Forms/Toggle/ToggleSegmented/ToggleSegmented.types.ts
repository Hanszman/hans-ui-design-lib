import type { HansToggleProps } from '../Toggle.types';

export type HansToggleSegmentedProps = Omit<
  HansToggleProps,
  | 'toggleMode'
  | 'checked'
  | 'defaultChecked'
  | 'leftLabel'
  | 'rightLabel'
  | 'onContent'
  | 'offContent'
  | 'thumbContent'
  | 'onChange'
>;
