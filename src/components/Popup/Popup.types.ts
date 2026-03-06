import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../types/Schema.types';

export type PopupDirection = 'up' | 'down';

export type PopupOptionItem = {
  id?: string;
  label: string;
  value: string;
  disabled?: boolean;
  iconName?: string;
  imageSrc?: string;
  imageAlt?: string;
  action?: (item: PopupOptionItem) => void;
  children?: PopupOptionItem[];
};

const HansPopupSchema = {
  isOpen: 'boolean',
  disabled: 'boolean',
  popupBackgroundColor: 'string',
  noContentText: 'string',
  popupClassName: 'string',
  panelClassName: 'string',
  customClasses: 'string',
} as const;

export type HansPopupProps = InferPropsFromSchema<typeof HansPopupSchema> &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
    children: React.ReactNode;
    onOpenChange?: (open: boolean) => void;
    renderTrigger: (params: {
      isOpen: boolean;
      open: () => void;
      close: () => void;
      toggle: () => void;
    }) => React.ReactNode;
    onDirectionChange?: (direction: PopupDirection) => void;
  };

export const HansPopupPropsList = createPropsList(HansPopupSchema);
