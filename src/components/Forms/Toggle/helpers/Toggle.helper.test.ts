import {
  getToggleColorClass,
  normalizeToggleColor,
} from './Toggle.helper';

describe('Toggle.helper', () => {
  it('Should fallback base color to primary', () => {
    expect(normalizeToggleColor('base')).toBe('primary');
    expect(normalizeToggleColor('success')).toBe('success');
  });

  it('Should return off class for unchecked toggle', () => {
    expect(getToggleColorClass(false, false, 'primary')).toBe('hans-toggle-off');
  });

  it('Should return off disabled class when unchecked and disabled', () => {
    expect(getToggleColorClass(false, true, 'primary')).toBe(
      'hans-toggle-off-disabled',
    );
  });

  it('Should return on disabled class when checked and disabled', () => {
    expect(getToggleColorClass(true, true, 'danger')).toBe(
      'hans-toggle-on-disabled',
    );
  });

  it('Should return color class when checked and enabled', () => {
    expect(getToggleColorClass(true, false, 'warning')).toBe(
      'hans-toggle-on-warning',
    );
  });
});
