import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../types/Schema.types';
import type { Size } from '../../types/Common.types';

const HansAvatarSchema = {
  src: 'string',
  alt: 'string',
  avatarSize: { type: 'custom', ref: {} as Size },
  customClasses: 'string',
  fallbackIconName: 'string',
} as const;

export type HansAvatarProps = InferPropsFromSchema<typeof HansAvatarSchema> &
  Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'size'>;

export const HansAvatarPropsList = createPropsList(HansAvatarSchema);
