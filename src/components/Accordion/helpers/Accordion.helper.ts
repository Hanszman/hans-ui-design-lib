import type { HansAccordionItem } from '../Accordion.types';
import type {
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
  isOpen: boolean,
  disabled: boolean,
): string =>
  `
    hans-accordion-item
    ${isOpen ? 'hans-accordion-item-open' : ''}
    ${disabled ? 'hans-accordion-item-disabled' : ''}
  `;

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
