import React from 'react';
import { HansIcon } from '../Icon/Icon';
import { HansLoading } from '../Loading/Loading';
import type { HansTabsProps } from './Tabs.types';
import {
  getInitialActiveTabId,
  getNextActiveTabIdAfterClose,
  getResolvedActiveTabId,
  getTabsColorClass,
} from './helpers/Tabs.helper';

export const HansTabs = React.memo((props: HansTabsProps) => {
  const {
    tabs = [],
    activeTabId,
    defaultActiveTabId = '',
    tabsColor = 'primary',
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
  const headerLoadingHeightBySize = {
    small: '28px',
    medium: '34px',
    large: '34px',
  } as const;
  const headerLoadingHeight = headerLoadingHeightBySize[tabsSize];

  const handleTabClick = (tabId: string) => {
    if (typeof activeTabId === 'undefined') setInternalActiveTabId(tabId);
    if (onTabChange) onTabChange(tabId);
  };

  const handleCloseTab = (
    event: React.MouseEvent<HTMLElement>,
    tabId: string,
  ) => {
    event.stopPropagation();
    const remainingTabs = internalTabs.filter((tab) => tab.id !== tabId);
    const nextActiveTabId = getNextActiveTabIdAfterClose(
      tabId,
      resolvedActiveTabId,
      remainingTabs,
    );

    setInternalTabs(remainingTabs);
    if (typeof activeTabId === 'undefined')
      setInternalActiveTabId(nextActiveTabId);
    if (onTabsChange) onTabsChange(remainingTabs);
    if (onTabClose) onTabClose(tabId);
    if (nextActiveTabId && onTabChange) onTabChange(nextActiveTabId);
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
                  hans-tab-${normalizedColor}
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
                      <HansIcon name="IoIosCloseCircle" iconSize="small" />
                    </span>
                  </span>
                ) : null}
              </button>
            );
          })
        )}
      </div>

      <div className="hans-tabs-content" role="tabpanel">
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
