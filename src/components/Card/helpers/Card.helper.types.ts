import type React from 'react';
import type { Color, Size, Variant } from '../../../types/Common.types';

export type HansCardLayout = 'profile' | 'image';

export type HansCardClassNameArgs = {
  cardLayout: HansCardLayout;
  cardSize: Size;
  customClasses: string;
};

export type HansCardStyleArgs = {
  cardColor: Color;
  cardVariant: Variant;
  imageSrc: string;
};

export type HansCardStyleVars = React.CSSProperties & {
  '--hans-card-bg': string;
  '--hans-card-border': string;
  '--hans-card-text': string;
  '--hans-card-muted': string;
  '--hans-card-image': string;
};
