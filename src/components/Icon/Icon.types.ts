import React from 'react';
import { createPropsList } from '../../types/Schema.types';
import type { InferPropsFromSchema } from '../../types/Schema.types';
import type { Size } from '../../types/Common.types';

type IconLibrary = Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
>;

const HansIconSchema = {
  name: 'string',
  size: { type: 'custom', ref: {} as Size },
  customClasses: 'string',
} as const;

export type HansIconProps = InferPropsFromSchema<typeof HansIconSchema>;

export const HansIconPropsList = createPropsList(HansIconSchema);

export const DynamicIconImports: Record<string, () => Promise<IconLibrary>> = {
  Fa: () => import('react-icons/fa') as unknown as Promise<IconLibrary>,
  Md: () => import('react-icons/md') as unknown as Promise<IconLibrary>,
  Bi: () => import('react-icons/bi') as unknown as Promise<IconLibrary>,
  Ai: () => import('react-icons/ai') as unknown as Promise<IconLibrary>,
  Bs: () => import('react-icons/bs') as unknown as Promise<IconLibrary>,
  Io: () => import('react-icons/io') as unknown as Promise<IconLibrary>,
  Ri: () => import('react-icons/ri') as unknown as Promise<IconLibrary>,
  Hi: () => import('react-icons/hi') as unknown as Promise<IconLibrary>,
  Pi: () => import('react-icons/pi') as unknown as Promise<IconLibrary>,
  Tb: () => import('react-icons/tb') as unknown as Promise<IconLibrary>,
  Lu: () => import('react-icons/lu') as unknown as Promise<IconLibrary>,
};
