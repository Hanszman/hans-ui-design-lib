import React from 'react';
import { HansIcon } from '../Icon/Icon';
import { HansLoading } from '../Loading/Loading';
import type { HansTabsProps } from './Tabs.types';
import {
  getHeaderLoadingHeight,
  getInitialActiveTabId,
  getResolvedTabAppearance,
  getResolvedActiveTabId,
  getTabsColorClass,
  handleCloseTabAction,
  handleTabClickAction,
} from './helpers/Tabs.helper';

export const HansTabs = React.memo((props: HansTabsProps) => {
  const {
    tabs = [],
    activeTabId,
    defaultActiveTabId = '',
    tabsColor = 'base',
    tabsVariant = 'outline',
    tabsSize = 'medium',
    showCloseButton = false,
    loading = false,
    loadingColor = 'base',
    emptyText = 'No tabs available',
    customClasses = '',
    inputId = 'hans-tabs',
    onTabChange,
    onTabClose,
    onTabsChange,
    ...rest
  } = props;

  const [internalTabs, setInternalTabs] = React.useState(tabs);
  const [internalActiveTabId, setInternalActiveTabId] = React.useState(
    getInitialActiveTabId(tabs, defaultActiveTabId),
  );

  React.useEffect(() => {
    setInternalTabs(tabs);
  }, [tabs]);

  React.useEffect(() => {
    setInternalActiveTabId((prev) =>
      getResolvedActiveTabId(
        activeTabId,
        prev || defaultActiveTabId,
        internalTabs,
      ),
    );
  }, [activeTabId, defaultActiveTabId, internalTabs]);

  const normalizedColor = getTabsColorClass(tabsColor);
  const resolvedActiveTabId = getResolvedActiveTabId(
    activeTabId,
    internalActiveTabId,
    internalTabs,
  );
  const activeTab = internalTabs.find((tab) => tab.id === resolvedActiveTabId);
  const headerLoadingHeight = getHeaderLoadingHeight(tabsSize);
  const isControlled = typeof activeTabId !== 'undefined';
  const activeTabAppearance = activeTab
    ? getResolvedTabAppearance(activeTab, normalizedColor, tabsVariant)
    : null;

  const handleTabClick = (tabId: string) => {
    handleTabClickAction({
      tabId,
      isControlled,
      setInternalActiveTabId,
      onTabChange,
    });
  };

  const handleCloseTab = (
    event: React.MouseEvent<HTMLElement>,
    tabId: string,
  ) => {
    handleCloseTabAction({
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
    });
  };

  return (
    <div className={`hans-tabs-wrapper ${customClasses}`} {...rest}>
      <div
        id={inputId}
        className={`hans-tabs-header hans-tabs-header-${tabsSize}`}
        role="tablist"
      >
        {loading ? (
          <>
            <HansLoading
              loadingType="skeleton"
              loadingColor={loadingColor}
              skeletonWidth="110px"
              skeletonHeight={headerLoadingHeight}
              customClasses="hans-tabs-header-loading"
              ariaLabel="Loading tab header"
            />
          </>
        ) : (
          internalTabs.map((tab) => {
            const isActive = tab.id === resolvedActiveTabId;
            const { color, variant } = getResolvedTabAppearance(
              tab,
              normalizedColor,
              tabsVariant,
            );
            const canClose = showCloseButton || tab.closable;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                disabled={tab.disabled}
                className={`
                  hans-tab
                  hans-tab-${tabsSize}
                  hans-tab-${color}
                  hans-tab-${variant}
                  ${isActive ? 'hans-tab-active' : ''}
                  ${tab.disabled ? 'hans-tab-disabled' : ''}
                `}
                onClick={() => handleTabClick(tab.id)}
              >
                <span className="hans-tab-title">{tab.title}</span>
                {canClose ? (
                  <span className="hans-tab-close-wrapper">
                    <span
                      role="button"
                      tabIndex={0}
                      className="hans-tab-close"
                      aria-label={`Close ${tab.title}`}
                      onClick={(event) => handleCloseTab(event, tab.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          event.stopPropagation();
                          handleCloseTab(
                            event as unknown as React.MouseEvent<HTMLElement>,
                            tab.id,
                          );
                        }
                      }}
                    >
                      <HansIcon name="IoIosCloseCircle" iconSize="medium" />
                    </span>
                  </span>
                ) : null}
              </button>
            );
          })
        )}
      </div>

      <div
        className={`
          hans-tabs-content
          ${
            activeTabAppearance
              ? `hans-tabs-content-${activeTabAppearance.color} hans-tabs-content-${activeTabAppearance.variant}`
              : ''
          }
        `}
        role="tabpanel"
      >
        {loading ? (
          <HansLoading
            loadingType="skeleton"
            loadingColor={loadingColor}
            skeletonWidth="100%"
            skeletonHeight="160px"
            customClasses="hans-tabs-content-loading"
            ariaLabel="Loading tab content"
          />
        ) : (
          activeTab?.content || <p className="hans-tabs-empty">{emptyText}</p>
        )}
      </div>
    </div>
  );
});

HansTabs.displayName = 'HansTabs';
