import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../types/Schema.types';
import type { Color, Size, Variant } from '../../types/Common.types';
import type { HansCardLayout } from './helpers/Card.helper.types';

const HansCardSchema = {
  title: 'string',
  description: 'string',
  imageSrc: 'string',
  imageAlt: 'string',
  avatarSrc: 'string',
  avatarAlt: 'string',
  avatarLoading: 'boolean',
  loading: 'boolean',
  loadingColor: { type: 'custom', ref: {} as Color },
  loadingAriaLabel: 'string',
  cardLayout: { type: 'custom', ref: {} as HansCardLayout },
  cardSize: { type: 'custom', ref: {} as Size },
  cardColor: { type: 'custom', ref: {} as Color },
  cardVariant: { type: 'custom', ref: {} as Variant },
  customClasses: 'string',
} as const;

export type HansCardProps = InferPropsFromSchema<typeof HansCardSchema> &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'color' | 'title'> & {
    children?: React.ReactNode;
  };

export const HansCardPropsList = createPropsList(HansCardSchema);
