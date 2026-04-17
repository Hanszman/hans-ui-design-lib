import React from 'react';
import {
  createPropsList,
  type InferPropsFromSchema,
} from '../../types/Schema.types';
import type { Color, Size, Variant } from '../../types/Common.types';

export type HansTabItem = {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
  closable?: boolean;
  tabColor?: Color;
  tabVariant?: Variant;
};

const HansTabsSchema = {
  tabs: {
    type: 'custom',
    ref: {} as HansTabItem[],
    webComponentType: 'property',
  },
  activeTabId: 'string',
  defaultActiveTabId: 'string',
  tabsColor: { type: 'custom', ref: {} as Color },
  tabsVariant: { type: 'custom', ref: {} as Variant },
  tabsSize: { type: 'custom', ref: {} as Size },
  showCloseButton: 'boolean',
  loading: 'boolean',
  loadingColor: { type: 'custom', ref: {} as Color },
  emptyText: 'string',
  customClasses: 'string',
  inputId: 'string',
} as const;

export type HansTabsProps = InferPropsFromSchema<typeof HansTabsSchema> &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> & {
    onTabChange?: (tabId: string) => void;
    onTabClose?: (tabId: string) => void;
    onTabsChange?: (tabs: HansTabItem[]) => void;
  };

export const HansTabsPropsList = createPropsList(HansTabsSchema);
