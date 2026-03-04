import {
  getInitialActiveTabId,
  getNextActiveTabIdAfterClose,
  getResolvedActiveTabId,
  getTabsColorClass,
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
    expect(getTabsColorClass('base')).toBe('primary');
    expect(getTabsColorClass('info')).toBe('info');
  });
});
