import React from 'react';
import type { Color, Size, Variant } from '../../../types/Common.types';
import type { HansTabItem } from '../Tabs.types';

export const getInitialActiveTabId = (
  tabs: HansTabItem[],
  defaultActiveTabId?: string,
): string => {
  if (!tabs.length) return '';
  if (defaultActiveTabId && tabs.some((tab) => tab.id === defaultActiveTabId)) {
    return defaultActiveTabId;
  }
  const firstEnabled = tabs.find((tab) => !tab.disabled);
  return firstEnabled?.id || tabs[0].id;
};

export const getResolvedActiveTabId = (
  activeTabId: string | undefined,
  internalActiveTabId: string,
  tabs: HansTabItem[],
): string => {
  const fallbackTabId = getInitialActiveTabId(tabs);
  if (!activeTabId) return internalActiveTabId || fallbackTabId;
  if (tabs.some((tab) => tab.id === activeTabId)) return activeTabId;
  return fallbackTabId;
};

export const getNextActiveTabIdAfterClose = (
  closedTabId: string,
  currentActiveTabId: string,
  remainingTabs: HansTabItem[],
): string => {
  if (!remainingTabs.length) return '';
  if (currentActiveTabId !== closedTabId) return currentActiveTabId;
  const firstEnabled = remainingTabs.find((tab) => !tab.disabled);
  return firstEnabled?.id || remainingTabs[0].id;
};

export const getTabsColorClass = (tabsColor: Color): Color => tabsColor;

export const headerLoadingHeightBySize: Record<Size, string> = {
  small: '28px',
  medium: '34px',
  large: '40px',
};

export const getHeaderLoadingHeight = (tabsSize: Size): string =>
  headerLoadingHeightBySize[tabsSize];

export const getResolvedTabAppearance = (
  tab: HansTabItem,
  fallbackColor: Color,
  fallbackVariant: Variant,
): { color: Color; variant: Variant } => ({
  color: tab.tabColor || fallbackColor,
  variant: tab.tabVariant || fallbackVariant,
});

type HandleTabClickParams = {
  tabId: string;
  isControlled: boolean;
  setInternalActiveTabId: React.Dispatch<React.SetStateAction<string>>;
  onTabChange?: (tabId: string) => void;
};

export const handleTabClickAction = ({
  tabId,
  isControlled,
  setInternalActiveTabId,
  onTabChange,
}: HandleTabClickParams): void => {
  if (!isControlled) setInternalActiveTabId(tabId);
  if (onTabChange) onTabChange(tabId);
};

type HandleCloseTabParams = {
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

export const handleCloseTabAction = ({
  event,
  tabId,
  internalTabs,
  resolvedActiveTabId,
  isControlled,
  setInternalTabs,
  setInternalActiveTabId,
  onTabsChange,
  onTabClose,
  onTabChange,
}: HandleCloseTabParams): void => {
  event.stopPropagation();
  const remainingTabs = internalTabs.filter((tab) => tab.id !== tabId);
  const nextActiveTabId = getNextActiveTabIdAfterClose(
    tabId,
    resolvedActiveTabId,
    remainingTabs,
  );

  setInternalTabs(remainingTabs);
  if (!isControlled) setInternalActiveTabId(nextActiveTabId);
  if (onTabsChange) onTabsChange(remainingTabs);
  if (onTabClose) onTabClose(tabId);
  if (nextActiveTabId && onTabChange) onTabChange(nextActiveTabId);
};
