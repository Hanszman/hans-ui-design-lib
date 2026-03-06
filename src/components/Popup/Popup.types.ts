import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../types/Schema.types';

export type PopupDirection = 'up' | 'down';

const HansPopupSchema = {
  isOpen: 'boolean',
  disabled: 'boolean',
  popupBackgroundColor: 'string',
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
