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

export const getTabsColorClass = (tabsColor: string): string =>
  tabsColor === 'base' ? 'primary' : tabsColor;
