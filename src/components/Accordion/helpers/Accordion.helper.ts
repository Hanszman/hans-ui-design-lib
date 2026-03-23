import type React from 'react';
import type { Variant } from '../../../types/Common.types';
import type { HansAccordionItem } from '../Accordion.types';
import type {
  AccordionSurfaceStyleArgs,
  CreateHandleAccordionToggleParams,
  CreateSyncAccordionOpenItemIdsParams,
  NormalizedAccordionItem,
} from './Accordion.helper.types';

export const getAccordionItemId = (
  item: HansAccordionItem,
  index: number,
): string => {
  if (typeof item.id === 'string' && item.id.trim().length > 0) {
    return item.id;
  }

  return `accordion-item-${index}`;
};

export const normalizeAccordionItems = (
  items: HansAccordionItem[],
): NormalizedAccordionItem[] =>
  items.map((item, index) => ({
    ...item,
    resolvedId: getAccordionItemId(item, index),
  }));

export const getValidAccordionItemIds = (
  normalizedItems: NormalizedAccordionItem[],
): string[] => normalizedItems.map((item) => item.resolvedId);

export const normalizeAccordionOpenItemIds = (
  openItemIds: string[],
  validItemIds: string[],
  allowMultipleOpen: boolean,
): string[] => {
  const validItemIdSet = new Set(validItemIds);
  const uniqueIds = Array.from(
    new Set(openItemIds.filter((itemId) => validItemIdSet.has(itemId))),
  );

  return allowMultipleOpen ? uniqueIds : uniqueIds.slice(0, 1);
};

export const getInitialAccordionOpenItemIds = (
  openItemIds: string[] | undefined,
  defaultOpenItemIds: string[],
  normalizedItems: NormalizedAccordionItem[],
  allowMultipleOpen: boolean,
): string[] => {
  const validItemIds = getValidAccordionItemIds(normalizedItems);

  if (typeof openItemIds !== 'undefined') {
    return normalizeAccordionOpenItemIds(
      openItemIds,
      validItemIds,
      allowMultipleOpen,
    );
  }

  return normalizeAccordionOpenItemIds(
    defaultOpenItemIds,
    validItemIds,
    allowMultipleOpen,
  );
};

export const getResolvedAccordionOpenItemIds = (
  openItemIds: string[] | undefined,
  internalOpenItemIds: string[],
  normalizedItems: NormalizedAccordionItem[],
  allowMultipleOpen: boolean,
): string[] => {
  const validItemIds = getValidAccordionItemIds(normalizedItems);
  const source =
    typeof openItemIds !== 'undefined' ? openItemIds : internalOpenItemIds;

  return normalizeAccordionOpenItemIds(
    source,
    validItemIds,
    allowMultipleOpen,
  );
};

export const toggleAccordionItem = (
  openItemIds: string[],
  itemId: string,
  allowMultipleOpen: boolean,
): string[] => {
  if (openItemIds.includes(itemId)) {
    return openItemIds.filter((openItemId) => openItemId !== itemId);
  }

  if (!allowMultipleOpen) return [itemId];

  return [...openItemIds, itemId];
};

export const getAccordionIconName = (
  isOpen: boolean,
): 'IoIosArrowUp' | 'IoIosArrowDown' =>
  isOpen ? 'IoIosArrowUp' : 'IoIosArrowDown';

export const getAccordionSkeletonItems = (count: number): number[] => {
  const normalizedCount = Number.isFinite(count)
    ? Math.max(1, Math.floor(count))
    : 1;

  return Array.from({ length: normalizedCount }, (_, index) => index);
};

export const getAccordionClassName = (customClasses: string): string =>
  `hans-accordion ${customClasses}`;

export const getAccordionItemClassName = (
  disabled: boolean,
): string =>
  `
    hans-accordion-item
    ${disabled ? 'hans-accordion-item-disabled' : ''}
  `;

export const getAccordionSurfaceStyleVars = ({
  color,
  variant,
  surface,
}: AccordionSurfaceStyleArgs): React.CSSProperties => {
  const tokenPrefix = `--${color}`;
  const surfacePrefix = `--hans-accordion-${surface}`;
  const isBase = color === 'base';

  const variantMap: Record<
    Variant,
    { bg: string; text: string; border: string }
  > = {
    strong: {
      bg: `var(${tokenPrefix}-strong-color)`,
      text: `var(${tokenPrefix}-neutral-color)`,
      border: `var(${tokenPrefix}-strong-color)`,
    },
    default: {
      bg: `var(${tokenPrefix}-default-color)`,
      text: 'var(--white)',
      border: `var(${tokenPrefix}-default-color)`,
    },
    neutral: {
      bg: `var(${tokenPrefix}-neutral-color)`,
      text: isBase ? 'var(--base-strong-color)' : `var(${tokenPrefix}-strong-color)`,
      border: `var(${tokenPrefix}-neutral-color)`,
    },
    outline: {
      bg: 'transparent',
      text: isBase ? 'var(--text-color)' : `var(${tokenPrefix}-strong-color)`,
      border: `var(${tokenPrefix}-default-color)`,
    },
    transparent: {
      bg: 'transparent',
      text: isBase ? 'var(--text-color)' : `var(${tokenPrefix}-default-color)`,
      border: 'transparent',
    },
  };

  const resolvedVariant = variantMap[variant];

  return {
    [`${surfacePrefix}-bg`]: resolvedVariant.bg,
    [`${surfacePrefix}-text`]: resolvedVariant.text,
    [`${surfacePrefix}-border`]: resolvedVariant.border,
  } as React.CSSProperties;
};

export const getAccordionPanelId = (
  accordionId: string,
  itemId: string,
): string => `${accordionId}-panel-${itemId}`;

export const getAccordionTriggerId = (
  accordionId: string,
  itemId: string,
): string => `${accordionId}-trigger-${itemId}`;

export const areArraysEqual = (
  currentValues: string[],
  nextValues: string[],
): boolean =>
  currentValues.length === nextValues.length &&
  currentValues.every((value, index) => value === nextValues[index]);

export const createSyncAccordionOpenItemIds =
  ({
    openItemIds,
    normalizedItems,
    allowMultipleOpen,
    setInternalOpenItemIds,
  }: CreateSyncAccordionOpenItemIdsParams) =>
  (): void => {
    const validItemIds = getValidAccordionItemIds(normalizedItems);

    if (typeof openItemIds !== 'undefined') {
      setInternalOpenItemIds(
        normalizeAccordionOpenItemIds(
          openItemIds,
          validItemIds,
          allowMultipleOpen,
        ),
      );
      return;
    }

    setInternalOpenItemIds((previousValues) => {
      const nextValues = normalizeAccordionOpenItemIds(
        previousValues,
        validItemIds,
        allowMultipleOpen,
      );

      return areArraysEqual(previousValues, nextValues)
        ? previousValues
        : nextValues;
    });
  };

export const createHandleAccordionToggle =
  ({
    itemId,
    disabled,
    allowMultipleOpen,
    resolvedOpenItemIds,
    openItemIds,
    setInternalOpenItemIds,
    onOpenItemIdsChange,
  }: CreateHandleAccordionToggleParams) =>
  (): void => {
    if (disabled) return;

    const nextOpenItemIds = toggleAccordionItem(
      resolvedOpenItemIds,
      itemId,
      allowMultipleOpen,
    );

    if (typeof openItemIds === 'undefined') {
      setInternalOpenItemIds(nextOpenItemIds);
    }

    if (onOpenItemIdsChange) {
      onOpenItemIdsChange(nextOpenItemIds);
    }
  };
