import type React from 'react';
import type { Color, Size, Variant } from '../../../types/Common.types';
import type { HansCarouselItem } from '../Carousel.types';

export type NormalizedCarouselItem = HansCarouselItem & {
  resolvedId: string;
  index: number;
};

export type CarouselIndicatorItem = {
  index: number;
  isActive: boolean;
  isFaded: boolean;
};

export type CarouselClassNameArgs = {
  carouselSize: Size;
  customClasses: string;
};

export type CarouselStyleArgs = {
  carouselColor: Color;
  carouselVariant: Variant;
  visibleItemsCount: number;
};

export type CreateSyncCarouselIndexParams = {
  activeItemIndex: number | undefined;
  itemsLength: number;
  setInternalActiveItemIndex: React.Dispatch<React.SetStateAction<number>>;
};

export type CreateHandleCarouselMoveParams = {
  direction: 'previous' | 'next';
  resolvedActiveItemIndex: number;
  itemsLength: number;
  activeItemIndex: number | undefined;
  setInternalActiveItemIndex: React.Dispatch<React.SetStateAction<number>>;
  onActiveItemChange?: (activeItemIndex: number) => void;
};

export type CreateHandleCarouselSelectParams = {
  targetIndex: number;
  itemsLength: number;
  activeItemIndex: number | undefined;
  setInternalActiveItemIndex: React.Dispatch<React.SetStateAction<number>>;
  onActiveItemChange?: (activeItemIndex: number) => void;
};
