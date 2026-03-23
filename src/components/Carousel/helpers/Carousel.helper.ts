import type React from 'react';
import type { Variant } from '../../../types/Common.types';
import type { HansCarouselItem } from '../Carousel.types';
import type {
  CarouselClassNameArgs,
  CarouselIndicatorItem,
  CarouselStyleArgs,
  CreateHandleCarouselMoveParams,
  CreateHandleCarouselSelectParams,
  CreateSyncCarouselIndexParams,
  NormalizedCarouselItem,
} from './Carousel.helper.types';

export const getCarouselItemId = (
  item: HansCarouselItem,
  index: number,
): string => {
  if (typeof item.id === 'string' && item.id.trim().length > 0) return item.id;

  return `carousel-item-${index}`;
};

export const normalizeCarouselItems = (
  items: HansCarouselItem[],
): NormalizedCarouselItem[] =>
  items.map((item, index) => ({
    ...item,
    resolvedId: getCarouselItemId(item, index),
    index,
  }));

export const clampVisibleItemsCount = (visibleItemsCount: number): number => {
  if (!Number.isFinite(visibleItemsCount)) return 1;

  return Math.min(3, Math.max(1, Math.floor(visibleItemsCount)));
};

export const clampCarouselIndex = (
  activeItemIndex: number,
  itemsLength: number,
): number => {
  if (itemsLength <= 0) return 0;
  if (!Number.isFinite(activeItemIndex)) return 0;

  return Math.min(itemsLength - 1, Math.max(0, Math.floor(activeItemIndex)));
};

export const getInitialCarouselActiveItemIndex = (
  activeItemIndex: number | undefined,
  defaultActiveItemIndex: number,
  itemsLength: number,
): number => {
  if (typeof activeItemIndex !== 'undefined') {
    return clampCarouselIndex(activeItemIndex, itemsLength);
  }

  return clampCarouselIndex(defaultActiveItemIndex, itemsLength);
};

export const getResolvedCarouselActiveItemIndex = (
  activeItemIndex: number | undefined,
  internalActiveItemIndex: number,
  itemsLength: number,
): number =>
  clampCarouselIndex(
    typeof activeItemIndex !== 'undefined'
      ? activeItemIndex
      : internalActiveItemIndex,
    itemsLength,
  );

export const getCarouselWindowStart = (
  activeItemIndex: number,
  itemsLength: number,
  visibleItemsCount: number,
): number => {
  if (itemsLength <= visibleItemsCount) return 0;

  const maxStart = itemsLength - visibleItemsCount;
  const desiredStart = activeItemIndex - Math.floor(visibleItemsCount / 2);

  return Math.min(maxStart, Math.max(0, desiredStart));
};

export const getVisibleCarouselItems = (
  normalizedItems: NormalizedCarouselItem[],
  activeItemIndex: number,
  visibleItemsCount: number,
): NormalizedCarouselItem[] => {
  const windowStart = getCarouselWindowStart(
    activeItemIndex,
    normalizedItems.length,
    visibleItemsCount,
  );

  return normalizedItems.slice(windowStart, windowStart + visibleItemsCount);
};

export const normalizeMaxIndicators = (maxIndicators: number): number => {
  if (!Number.isFinite(maxIndicators)) return 1;

  return Math.max(1, Math.floor(maxIndicators));
};

export const getCarouselIndicatorItems = (
  itemsLength: number,
  activeItemIndex: number,
  maxIndicators: number,
): CarouselIndicatorItem[] => {
  if (itemsLength <= 0) return [];

  const normalizedMaxIndicators = normalizeMaxIndicators(maxIndicators);

  if (itemsLength <= normalizedMaxIndicators) {
    return Array.from({ length: itemsLength }, (_, index) => ({
      index,
      isActive: index === activeItemIndex,
      isFaded: false,
    }));
  }

  const windowOffset = Math.floor(normalizedMaxIndicators / 2);
  const start = Math.min(
    itemsLength - normalizedMaxIndicators,
    Math.max(0, activeItemIndex - windowOffset),
  );
  const end = start + normalizedMaxIndicators;

  return Array.from({ length: normalizedMaxIndicators }, (_, offset) => {
    const index = start + offset;

    return {
      index,
      isActive: index === activeItemIndex,
      isFaded:
        (offset === 0 && start > 0) ||
        (offset === normalizedMaxIndicators - 1 && end < itemsLength),
    };
  });
};

export const getCanMoveCarouselPrevious = (activeItemIndex: number): boolean =>
  activeItemIndex > 0;

export const getCanMoveCarouselNext = (
  activeItemIndex: number,
  itemsLength: number,
): boolean => activeItemIndex < itemsLength - 1;

export const getNextCarouselIndex = (
  direction: 'previous' | 'next',
  activeItemIndex: number,
  itemsLength: number,
): number =>
  clampCarouselIndex(
    direction === 'previous' ? activeItemIndex - 1 : activeItemIndex + 1,
    itemsLength,
  );

export const getCarouselClassName = ({
  carouselSize,
  customClasses,
}: CarouselClassNameArgs): string =>
  `
    hans-carousel
    hans-carousel-${carouselSize}
    ${customClasses}
  `;

export const getCarouselSlideClassName = (isActive: boolean): string =>
  `
    hans-carousel-slide
    ${isActive ? 'hans-carousel-slide-active' : ''}
  `;

export const getCarouselIndicatorClassName = (
  isActive: boolean,
  isFaded: boolean,
): string =>
  `
    hans-carousel-indicator
    ${isActive ? 'hans-carousel-indicator-active' : ''}
    ${isFaded ? 'hans-carousel-indicator-faded' : ''}
  `;

export const getCarouselButtonClassName = (
  direction: 'previous' | 'next',
): string => `hans-carousel-nav hans-carousel-nav-${direction}`;

export const getCarouselButtonIconName = (
  direction: 'previous' | 'next',
): 'IoIosArrowBack' | 'IoIosArrowForward' =>
  direction === 'previous' ? 'IoIosArrowBack' : 'IoIosArrowForward';

export const getCarouselSizeHeight = (carouselSize: 'small' | 'medium' | 'large'): string =>
  ({
    small: '180px',
    medium: '240px',
    large: '320px',
  })[carouselSize];

export const getCarouselStyleVars = ({
  carouselColor,
  carouselVariant,
  visibleItemsCount,
}: CarouselStyleArgs): React.CSSProperties => {
  const tokenPrefix = `--${carouselColor}`;
  const isBase = carouselColor === 'base';

  const variantMap: Record<
    Variant,
    {
      accentBg: string;
      accentText: string;
      accentBorder: string;
      shellBorder: string;
      shellBg: string;
      indicatorInactive: string;
    }
  > = {
    strong: {
      accentBg: `var(${tokenPrefix}-strong-color)`,
      accentText: `var(${tokenPrefix}-neutral-color)`,
      accentBorder: `var(${tokenPrefix}-strong-color)`,
      shellBorder: `var(${tokenPrefix}-strong-color)`,
      shellBg: 'var(--white)',
      indicatorInactive: `color-mix(in srgb, var(${tokenPrefix}-strong-color) 28%, transparent)`,
    },
    default: {
      accentBg: `var(${tokenPrefix}-default-color)`,
      accentText: 'var(--white)',
      accentBorder: `var(${tokenPrefix}-default-color)`,
      shellBorder: `var(${tokenPrefix}-default-color)`,
      shellBg: 'var(--white)',
      indicatorInactive: `color-mix(in srgb, var(${tokenPrefix}-default-color) 28%, transparent)`,
    },
    neutral: {
      accentBg: `var(${tokenPrefix}-neutral-color)`,
      accentText: isBase ? 'var(--base-strong-color)' : `var(${tokenPrefix}-strong-color)`,
      accentBorder: `var(${tokenPrefix}-neutral-color)`,
      shellBorder: `var(${tokenPrefix}-neutral-color)`,
      shellBg: 'var(--white)',
      indicatorInactive: `color-mix(in srgb, var(${tokenPrefix}-strong-color) 22%, transparent)`,
    },
    outline: {
      accentBg: 'var(--white)',
      accentText: isBase ? 'var(--text-color)' : `var(${tokenPrefix}-strong-color)`,
      accentBorder: `var(${tokenPrefix}-default-color)`,
      shellBorder: `var(${tokenPrefix}-default-color)`,
      shellBg: 'var(--white)',
      indicatorInactive: `color-mix(in srgb, var(${tokenPrefix}-default-color) 22%, transparent)`,
    },
    transparent: {
      accentBg: 'transparent',
      accentText: isBase ? 'var(--text-color)' : `var(${tokenPrefix}-default-color)`,
      accentBorder: 'transparent',
      shellBorder: 'transparent',
      shellBg: 'transparent',
      indicatorInactive: `color-mix(in srgb, var(${tokenPrefix}-default-color) 18%, transparent)`,
    },
  };

  const resolvedVariant = variantMap[carouselVariant];

  return {
    '--hans-carousel-columns': String(visibleItemsCount),
    '--hans-carousel-shell-bg': resolvedVariant.shellBg,
    '--hans-carousel-shell-border': resolvedVariant.shellBorder,
    '--hans-carousel-accent-bg': resolvedVariant.accentBg,
    '--hans-carousel-accent-text': resolvedVariant.accentText,
    '--hans-carousel-accent-border': resolvedVariant.accentBorder,
    '--hans-carousel-indicator-active': resolvedVariant.accentBorder,
    '--hans-carousel-indicator-inactive': resolvedVariant.indicatorInactive,
  } as React.CSSProperties;
};

export const createSyncCarouselIndex =
  ({
    activeItemIndex,
    itemsLength,
    setInternalActiveItemIndex,
  }: CreateSyncCarouselIndexParams) =>
  (): void => {
    if (typeof activeItemIndex !== 'undefined') {
      setInternalActiveItemIndex(
        clampCarouselIndex(activeItemIndex, itemsLength),
      );
      return;
    }

    setInternalActiveItemIndex((previousValue) =>
      clampCarouselIndex(previousValue, itemsLength),
    );
  };

export const createHandleCarouselMove =
  ({
    direction,
    resolvedActiveItemIndex,
    itemsLength,
    activeItemIndex,
    setInternalActiveItemIndex,
    onActiveItemChange,
  }: CreateHandleCarouselMoveParams) =>
  (): void => {
    const nextIndex = getNextCarouselIndex(
      direction,
      resolvedActiveItemIndex,
      itemsLength,
    );

    if (nextIndex === resolvedActiveItemIndex) return;

    if (typeof activeItemIndex === 'undefined') {
      setInternalActiveItemIndex(nextIndex);
    }

    if (onActiveItemChange) onActiveItemChange(nextIndex);
  };

export const createHandleCarouselSelect =
  ({
    targetIndex,
    itemsLength,
    activeItemIndex,
    setInternalActiveItemIndex,
    onActiveItemChange,
  }: CreateHandleCarouselSelectParams) =>
  (): void => {
    const nextIndex = clampCarouselIndex(targetIndex, itemsLength);

    if (typeof activeItemIndex === 'undefined') {
      setInternalActiveItemIndex(nextIndex);
    }

    if (onActiveItemChange) onActiveItemChange(nextIndex);
  };
