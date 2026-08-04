import type React from 'react';
import type { Color, Variant } from '../../../types/Common.types';

export type MessageTone = {
  background: string;
  border: string;
  text: string;
  accent: string;
};

export type GetMessageInlineStyleParams = {
  messageColor: Color;
  messageVariant: Variant;
  style?: React.CSSProperties;
};
