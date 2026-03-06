import { getPopupDirection } from './Popup.helper';

describe('Popup.helper', () => {
  it('Should return down by default', () => {
    expect(
      getPopupDirection({ spaceBelow: 300, spaceAbove: 100, panelHeight: 200 }),
    ).toBe('down');
  });

  it('Should return up when there is no space below and enough above', () => {
    expect(
      getPopupDirection({ spaceBelow: 80, spaceAbove: 220, panelHeight: 120 }),
    ).toBe('up');
  });
});
