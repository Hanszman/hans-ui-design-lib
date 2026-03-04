import type React from 'react';
import type { HansTabItem } from '../Tabs.types';

export type HandleTabClickParams = {
  tabId: string;
  isControlled: boolean;
  setInternalActiveTabId: React.Dispatch<React.SetStateAction<string>>;
  onTabChange?: (tabId: string) => void;
};

export type HandleCloseTabParams = {
  event: React.MouseEvent<HTMLElement>;
  tabId: string;
  internalTabs: HansTabItem[];
  resolvedActiveTabId: string;
  isControlled: boolean;
  setInternalTabs: React.Dispatch<React.SetStateAction<HansTabItem[]>>;
  setInternalActiveTabId: React.Dispatch<React.SetStateAction<string>>;
  onTabsChange?: (tabs: HansTabItem[]) => void;
  onTabClose?: (tabId: string) => void;
  onTabChange?: (tabId: string) => void;
};
