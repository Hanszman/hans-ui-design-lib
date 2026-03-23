import { vi } from 'vitest';
import {
  clampCarouselIndex,
  clampVisibleItemsCount,
  createHandleCarouselMove,
  createHandleCarouselSelect,
  createSyncCarouselIndex,
  getCanMoveCarousel,
  getCanMoveCarouselNext,
  getCanMoveCarouselPrevious,
  getCarouselButtonClassName,
  getCarouselButtonIconName,
  getCarouselClassName,
  getCarouselCopyClassName,
  getCarouselIndicatorClassName,
  getCarouselIndicatorItems,
  getCarouselImageClassName,
  getCarouselItemId,
  getCarouselSizeHeight,
  getCarouselSlideClassName,
  getCarouselStyleVars,
  getCarouselTrackClassName,
  getCarouselWindowStart,
  getInitialCarouselActiveItemIndex,
  getNextCarouselIndex,
  getResolvedCarouselActiveItemIndex,
  getVisibleCarouselItems,
  normalizeCarouselItems,
  normalizeMaxIndicators,
} from './Carousel.helper';

const items = [
  {
    id: 'first',
    title: 'First',
    description: 'First description',
    imageSrc: '/first.jpg',
    imageAlt: 'First image',
  },
  {
    title: 'Second',
    imageSrc: '/second.jpg',
    imageAlt: 'Second image',
  },
  {
    title: 'Third',
    imageSrc: '/third.jpg',
    imageAlt: 'Third image',
  },
  {
    title: 'Fourth',
    imageSrc: '/fourth.jpg',
    imageAlt: 'Fourth image',
  },
];

describe('Carousel.helper', () => {
  it('Should normalize carousel items and fallback ids', () => {
    const normalizedItems = normalizeCarouselItems(items);

    expect(getCarouselItemId(items[0], 0)).toBe('first');
    expect(getCarouselItemId({ ...items[1], id: '   ' }, 1)).toBe(
      'carousel-item-1',
    );
    expect(normalizedItems[1].resolvedId).toBe('carousel-item-1');
    expect(normalizedItems[2].index).toBe(2);
  });

  it('Should clamp visible item counts and indicator limits', () => {
    expect(clampVisibleItemsCount(Number.NaN)).toBe(1);
    expect(clampVisibleItemsCount(0)).toBe(1);
    expect(clampVisibleItemsCount(2.9)).toBe(2);
    expect(clampVisibleItemsCount(8)).toBe(3);

    expect(normalizeMaxIndicators(Number.NaN)).toBe(1);
    expect(normalizeMaxIndicators(0)).toBe(1);
    expect(normalizeMaxIndicators(4.8)).toBe(4);
  });

  it('Should clamp and resolve carousel indices', () => {
    expect(clampCarouselIndex(3, 0)).toBe(0);
    expect(clampCarouselIndex(Number.NaN, 5)).toBe(0);
    expect(clampCarouselIndex(10, 5)).toBe(4);
    expect(clampCarouselIndex(-4, 5)).toBe(0);

    expect(getInitialCarouselActiveItemIndex(3, 0, 5)).toBe(3);
    expect(getInitialCarouselActiveItemIndex(undefined, 9, 5)).toBe(4);
    expect(getResolvedCarouselActiveItemIndex(undefined, 2, 5)).toBe(2);
    expect(getResolvedCarouselActiveItemIndex(7, 1, 5)).toBe(4);
  });

  it('Should resolve the visible carousel window', () => {
    const normalizedItems = normalizeCarouselItems(items);

    expect(getCarouselWindowStart(0, 2, 3)).toBe(0);
    expect(getCarouselWindowStart(0, 6, 3)).toBe(0);
    expect(getCarouselWindowStart(3, 6, 3)).toBe(2);
    expect(getCarouselWindowStart(5, 6, 3)).toBe(3);
    expect(
      getVisibleCarouselItems(normalizedItems, 2, 2).map((item) => item.title),
    ).toEqual(['Second', 'Third']);
  });

  it('Should build indicator items with fading when above the limit', () => {
    expect(getCarouselIndicatorItems(0, 0, 5)).toEqual([]);
    expect(getCarouselIndicatorItems(3, 1, 5)).toEqual([
      { index: 0, isActive: false, isFaded: false },
      { index: 1, isActive: true, isFaded: false },
      { index: 2, isActive: false, isFaded: false },
    ]);
    expect(getCarouselIndicatorItems(8, 4, 5)).toEqual([
      { index: 2, isActive: false, isFaded: true },
      { index: 3, isActive: false, isFaded: false },
      { index: 4, isActive: true, isFaded: false },
      { index: 5, isActive: false, isFaded: false },
      { index: 6, isActive: false, isFaded: true },
    ]);
  });

  it('Should resolve navigation states and next indices', () => {
    expect(getCanMoveCarouselPrevious(0)).toBe(false);
    expect(getCanMoveCarouselPrevious(1)).toBe(true);
    expect(getCanMoveCarouselNext(1, 4)).toBe(true);
    expect(getCanMoveCarouselNext(3, 4)).toBe(false);
    expect(getCanMoveCarousel('previous', 0, 4, false)).toBe(false);
    expect(getCanMoveCarousel('next', 3, 4, false)).toBe(false);
    expect(getCanMoveCarousel('previous', 0, 4, true)).toBe(true);
    expect(getCanMoveCarousel('next', 3, 4, true)).toBe(true);
    expect(getCanMoveCarousel('next', 0, 0, true)).toBe(false);
    expect(getNextCarouselIndex('previous', 0, 4)).toBe(0);
    expect(getNextCarouselIndex('next', 1, 4)).toBe(2);
    expect(getNextCarouselIndex('previous', 0, 4, true)).toBe(3);
    expect(getNextCarouselIndex('previous', 2, 4, true)).toBe(1);
    expect(getNextCarouselIndex('next', 3, 4, true)).toBe(0);
    expect(getNextCarouselIndex('next', 0, 0, true)).toBe(0);
  });

  it('Should resolve class names, button icons and size heights', () => {
    expect(
      getCarouselClassName({
        carouselSize: 'medium',
        showBorder: false,
        removeItemGap: true,
        customClasses: 'custom-carousel',
      }),
    ).toContain('custom-carousel');
    expect(
      getCarouselClassName({
        carouselSize: 'medium',
        showBorder: false,
        removeItemGap: true,
        customClasses: '',
      }),
    ).toContain('hans-carousel-borderless');
    expect(
      getCarouselClassName({
        carouselSize: 'medium',
        showBorder: true,
        removeItemGap: true,
        customClasses: '',
      }),
    ).toContain('hans-carousel-without-gap');
    expect(getCarouselSlideClassName(true)).toContain(
      'hans-carousel-slide-active',
    );
    expect(getCarouselImageClassName(true)).toContain(
      'hans-carousel-image-top-copy',
    );
    expect(getCarouselImageClassName(false)).toContain('hans-carousel-image');
    expect(getCarouselCopyClassName(true)).toContain('hans-carousel-copy-top');
    expect(getCarouselCopyClassName(false)).toContain('hans-carousel-copy');
    expect(getCarouselSlideClassName(false)).not.toContain(
      'hans-carousel-slide-active',
    );
    expect(getCarouselIndicatorClassName(true, true)).toContain(
      'hans-carousel-indicator-active',
    );
    expect(getCarouselIndicatorClassName(true, true)).toContain(
      'hans-carousel-indicator-faded',
    );
    expect(getCarouselButtonClassName('previous')).toContain(
      'hans-carousel-nav-previous',
    );
    expect(getCarouselTrackClassName()).toBe('hans-carousel-track');
    expect(getCarouselButtonIconName('previous')).toBe('IoIosArrowBack');
    expect(getCarouselButtonIconName('next')).toBe('IoIosArrowForward');
    expect(getCarouselSizeHeight('small')).toBe('180px');
    expect(getCarouselSizeHeight('medium')).toBe('240px');
    expect(getCarouselSizeHeight('large')).toBe('320px');
  });

  it('Should resolve style vars for base and semantic variants', () => {
    const baseStyleVars = getCarouselStyleVars({
      carouselColor: 'base',
      carouselVariant: 'outline',
      visibleItemsCount: 2,
    });
    const semanticStyleVars = getCarouselStyleVars({
      carouselColor: 'primary',
      carouselVariant: 'strong',
      visibleItemsCount: 3,
    });
    const transparentStyleVars = getCarouselStyleVars({
      carouselColor: 'secondary',
      carouselVariant: 'transparent',
      visibleItemsCount: 1,
    });

    expect(baseStyleVars).toMatchObject({
      '--hans-carousel-columns': '2',
      '--hans-carousel-accent-bg': 'var(--white)',
      '--hans-carousel-accent-text': 'var(--text-color)',
      '--hans-carousel-shell-border': 'var(--base-default-color)',
    });
    expect(semanticStyleVars).toMatchObject({
      '--hans-carousel-columns': '3',
      '--hans-carousel-accent-bg': 'var(--primary-strong-color)',
      '--hans-carousel-accent-text': 'var(--primary-neutral-color)',
    });
    expect(transparentStyleVars).toMatchObject({
      '--hans-carousel-shell-border': 'transparent',
      '--hans-carousel-accent-text': 'var(--secondary-default-color)',
    });
  });

  it('Should sync controlled and uncontrolled active indices', () => {
    const controlledSetter = vi.fn();
    const uncontrolledSetter = vi.fn();

    createSyncCarouselIndex({
      activeItemIndex: 9,
      itemsLength: 4,
      setInternalActiveItemIndex: controlledSetter,
    })();
    createSyncCarouselIndex({
      activeItemIndex: undefined,
      itemsLength: 4,
      setInternalActiveItemIndex: uncontrolledSetter,
    })();

    expect(controlledSetter).toHaveBeenCalledWith(3);
    const updater = uncontrolledSetter.mock.calls[0][0] as (
      value: number,
    ) => number;
    expect(updater(8)).toBe(3);
  });

  it('Should move carousel respecting boundaries and controlled mode', () => {
    const setInternalActiveItemIndex = vi.fn();
    const onActiveItemChange = vi.fn();

    createHandleCarouselMove({
      direction: 'previous',
      resolvedActiveItemIndex: 0,
      itemsLength: 4,
      infiniteLoop: false,
      activeItemIndex: undefined,
      setInternalActiveItemIndex,
      onActiveItemChange,
    })();

    expect(setInternalActiveItemIndex).not.toHaveBeenCalled();
    expect(onActiveItemChange).not.toHaveBeenCalled();

    createHandleCarouselMove({
      direction: 'next',
      resolvedActiveItemIndex: 1,
      itemsLength: 4,
      infiniteLoop: false,
      activeItemIndex: undefined,
      setInternalActiveItemIndex,
      onActiveItemChange,
    })();
    createHandleCarouselMove({
      direction: 'next',
      resolvedActiveItemIndex: 2,
      itemsLength: 4,
      infiniteLoop: true,
      activeItemIndex: 2,
      setInternalActiveItemIndex,
      onActiveItemChange,
    })();
    createHandleCarouselMove({
      direction: 'previous',
      resolvedActiveItemIndex: 0,
      itemsLength: 4,
      infiniteLoop: true,
      activeItemIndex: undefined,
      setInternalActiveItemIndex,
      onActiveItemChange,
    })();

    expect(setInternalActiveItemIndex).toHaveBeenCalledWith(2);
    expect(setInternalActiveItemIndex).toHaveBeenLastCalledWith(3);
    expect(onActiveItemChange).toHaveBeenNthCalledWith(1, 2);
    expect(onActiveItemChange).toHaveBeenNthCalledWith(2, 3);
    expect(onActiveItemChange).toHaveBeenNthCalledWith(3, 3);
  });

  it('Should select carousel items in controlled and uncontrolled modes', () => {
    const setInternalActiveItemIndex = vi.fn();
    const onActiveItemChange = vi.fn();

    createHandleCarouselSelect({
      targetIndex: 7,
      itemsLength: 4,
      activeItemIndex: undefined,
      setInternalActiveItemIndex,
      onActiveItemChange,
    })();
    createHandleCarouselSelect({
      targetIndex: 1,
      itemsLength: 4,
      activeItemIndex: 0,
      setInternalActiveItemIndex,
      onActiveItemChange,
    })();

    expect(setInternalActiveItemIndex).toHaveBeenCalledWith(3);
    expect(onActiveItemChange).toHaveBeenNthCalledWith(1, 3);
    expect(onActiveItemChange).toHaveBeenNthCalledWith(2, 1);
  });
});
