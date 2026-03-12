import React from 'react';
import type { HansToggleProps } from './Toggle.types';
import { HansToggleSegmented } from './ToggleSegmented/ToggleSegmented';
import { HansToggleSwitch } from './ToggleSwitch/ToggleSwitch';

export const HansToggle = React.memo((props: HansToggleProps) => {
  const { toggleMode = 'switch' } = props;

  if (toggleMode === 'segmented') {
    return <HansToggleSegmented {...props} />;
  }

  return <HansToggleSwitch {...props} />;
});

HansToggle.displayName = 'HansToggle';
