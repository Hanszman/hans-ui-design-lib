import type { HansThemeSemanticKey } from '../../theme/theme.types';

export type CombinationRow = {
  token: HansThemeSemanticKey;
  strong: string;
  default: string;
  neutral: string;
};

export type CombinationData = {
  background: string;
  text: string;
  rows: CombinationRow[];
};
