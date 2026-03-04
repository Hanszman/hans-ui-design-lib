import React from 'react';
import { vi } from 'vitest';
import {
  getHeaderLoadingHeight,
  getInitialActiveTabId,
  getResolvedTabAppearance,
  getNextActiveTabIdAfterClose,
  getResolvedActiveTabId,
  getTabsColorClass,
  handleCloseTabAction,
  handleTabClickAction,
  headerLoadingHeightBySize,
} from './Tabs.helper';

const tabs = [
  { id: 'a', title: 'A', content: 'A' },
  { id: 'b', title: 'B', content: 'B' },
];

describe('Tabs.helper', () => {
  it('Should resolve initial active tab id', () => {
    expect(getInitialActiveTabId([], 'a')).toBe('');
    expect(getInitialActiveTabId(tabs, 'b')).toBe('b');
    expect(getInitialActiveTabId(tabs, 'x')).toBe('a');
    expect(
      getInitialActiveTabId([{ ...tabs[0], disabled: true }], undefined),
    ).toBe('a');
  });

  it('Should resolve active tab id with controlled and fallback scenarios', () => {
    expect(getResolvedActiveTabId(undefined, 'b', tabs)).toBe('b');
    expect(getResolvedActiveTabId(undefined, '', tabs)).toBe('a');
    expect(getResolvedActiveTabId('b', 'a', tabs)).toBe('b');
    expect(getResolvedActiveTabId('x', 'a', tabs)).toBe('a');
  });

  it('Should resolve next active tab after close', () => {
    expect(getNextActiveTabIdAfterClose('a', 'b', [tabs[1]])).toBe('b');
    expect(getNextActiveTabIdAfterClose('a', 'a', [tabs[1]])).toBe('b');
    expect(
      getNextActiveTabIdAfterClose('a', 'a', [{ ...tabs[1], disabled: true }]),
    ).toBe('b');
    expect(getNextActiveTabIdAfterClose('a', 'a', [])).toBe('');
  });

  it('Should normalize base tabs color to primary', () => {
    expect(getTabsColorClass('base')).toBe('base');
    expect(getTabsColorClass('info')).toBe('info');
  });

  it('Should resolve header loading height by size', () => {
    expect(headerLoadingHeightBySize.small).toBe('28px');
    expect(getHeaderLoadingHeight('small')).toBe('28px');
    expect(getHeaderLoadingHeight('medium')).toBe('34px');
    expect(getHeaderLoadingHeight('large')).toBe('40px');
  });

  it('Should resolve tab appearance using tab override and fallback', () => {
    expect(getResolvedTabAppearance(tabs[0], 'base', 'outline')).toEqual({
      color: 'base',
      variant: 'outline',
    });
    expect(
      getResolvedTabAppearance(
        { ...tabs[1], tabColor: 'danger', tabVariant: 'strong' },
        'base',
        'outline',
      ),
    ).toEqual({
      color: 'danger',
      variant: 'strong',
    });
  });

  it('Should handle tab click in controlled and uncontrolled mode', () => {
    const setInternal = vi.fn();
    const onTabChange = vi.fn();

    handleTabClickAction({
      tabId: 'a',
      isControlled: false,
      setInternalActiveTabId: setInternal,
      onTabChange,
    });
    expect(setInternal).toHaveBeenCalledWith('a');
    expect(onTabChange).toHaveBeenCalledWith('a');

    handleTabClickAction({
      tabId: 'b',
      isControlled: true,
      setInternalActiveTabId: setInternal,
      onTabChange,
    });
    expect(setInternal).not.toHaveBeenLastCalledWith('b');
    expect(onTabChange).toHaveBeenLastCalledWith('b');
  });

  it('Should handle close tab action with callbacks and active update', () => {
    const event = { stopPropagation: vi.fn() } as unknown as React.MouseEvent<HTMLElement>;
    const setInternalTabs = vi.fn();
    const setInternalActive = vi.fn();
    const onTabsChange = vi.fn();
    const onTabClose = vi.fn();
    const onTabChange = vi.fn();

    handleCloseTabAction({
      event,
      tabId: 'a',
      internalTabs: tabs,
      resolvedActiveTabId: 'a',
      isControlled: false,
      setInternalTabs,
      setInternalActiveTabId: setInternalActive,
      onTabsChange,
      onTabClose,
      onTabChange,
    });

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(setInternalTabs).toHaveBeenCalledWith([tabs[1]]);
    expect(setInternalActive).toHaveBeenCalledWith('b');
    expect(onTabsChange).toHaveBeenCalledWith([tabs[1]]);
    expect(onTabClose).toHaveBeenCalledWith('a');
    expect(onTabChange).toHaveBeenCalledWith('b');
  });

  it('Should handle close tab action in controlled mode without next active tab', () => {
    const event = { stopPropagation: vi.fn() } as unknown as React.MouseEvent<HTMLElement>;
    const setInternalTabs = vi.fn();
    const setInternalActive = vi.fn();
    const onTabChange = vi.fn();

    handleCloseTabAction({
      event,
      tabId: 'a',
      internalTabs: [tabs[0]],
      resolvedActiveTabId: 'a',
      isControlled: true,
      setInternalTabs,
      setInternalActiveTabId: setInternalActive,
      onTabChange,
    });

    expect(setInternalTabs).toHaveBeenCalledWith([]);
    expect(setInternalActive).not.toHaveBeenCalled();
    expect(onTabChange).not.toHaveBeenCalled();
  });
});
