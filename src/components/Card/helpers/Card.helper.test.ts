import { describe, expect, it } from 'vitest';
import {
  getHansCardClassName,
  getHansCardStyleVars,
  resolveHansCardLayout,
} from './Card.helper';

describe('Card.helper', () => {
  it('Should resolve image layout automatically when image is provided', () => {
    expect(resolveHansCardLayout(undefined, 'https://image.test/demo.png')).toBe(
      'image',
    );
    expect(resolveHansCardLayout(undefined, '')).toBe('profile');
    expect(resolveHansCardLayout('profile', 'https://image.test/demo.png')).toBe(
      'profile',
    );
  });

  it('Should compose card class names', () => {
    expect(
      getHansCardClassName({
        cardLayout: 'profile',
        cardSize: 'medium',
        customClasses: 'custom-card',
      }),
    ).toContain('hans-card-profile');
  });

  it('Should create style vars for base default cards and image background', () => {
    const styleVars = getHansCardStyleVars({
      cardColor: 'base',
      cardVariant: 'default',
      imageSrc: 'https://image.test/demo.png',
    });

    expect(styleVars['--hans-card-bg']).toBe('var(--base-default-color)');
    expect(styleVars['--hans-card-text']).toBe('var(--text-color)');
    expect(styleVars['--hans-card-image']).toBe(
      'url("https://image.test/demo.png")',
    );
  });

  it('Should create style vars for non-base outline cards', () => {
    const styleVars = getHansCardStyleVars({
      cardColor: 'primary',
      cardVariant: 'outline',
      imageSrc: '',
    });

    expect(styleVars['--hans-card-bg']).toBe('var(--white)');
    expect(styleVars['--hans-card-border']).toBe('var(--primary-default-color)');
    expect(styleVars['--hans-card-text']).toBe('var(--primary-strong-color)');
  });
});
