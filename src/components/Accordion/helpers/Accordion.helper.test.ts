import { vi } from 'vitest';
import {
  areArraysEqual,
  createHandleAccordionToggle,
  createSyncAccordionOpenItemIds,
  getAccordionClassName,
  getAccordionIconName,
  getAccordionItemClassName,
  getAccordionItemId,
  getAccordionPanelId,
  getAccordionSkeletonItems,
  getAccordionSurfaceStyleVars,
  getAccordionTriggerId,
  getInitialAccordionOpenItemIds,
  getResolvedAccordionOpenItemIds,
  getValidAccordionItemIds,
  normalizeAccordionItems,
  normalizeAccordionOpenItemIds,
  toggleAccordionItem,
} from './Accordion.helper';

const items = [
  {
    id: 'faq-1',
    title: 'Question 1',
    description: 'Answer 1',
  },
  {
    title: 'Question 2',
    description: 'Answer 2',
  },
];

describe('Accordion.helper', () => {
  it('Should resolve item id from provided id or fallback index', () => {
    expect(getAccordionItemId(items[0], 0)).toBe('faq-1');
    expect(getAccordionItemId({ ...items[1], id: '   ' }, 1)).toBe(
      'accordion-item-1',
    );
  });

  it('Should normalize accordion items and valid ids', () => {
    const normalizedItems = normalizeAccordionItems(items);

    expect(normalizedItems[0].resolvedId).toBe('faq-1');
    expect(normalizedItems[1].resolvedId).toBe('accordion-item-1');
    expect(getValidAccordionItemIds(normalizedItems)).toEqual([
      'faq-1',
      'accordion-item-1',
    ]);
  });

  it('Should normalize open item ids removing invalid entries and duplicates', () => {
    expect(
      normalizeAccordionOpenItemIds(
        ['faq-1', 'missing', 'faq-1', 'accordion-item-1'],
        ['faq-1', 'accordion-item-1'],
        true,
      ),
    ).toEqual(['faq-1', 'accordion-item-1']);

    expect(
      normalizeAccordionOpenItemIds(
        ['faq-1', 'accordion-item-1'],
        ['faq-1', 'accordion-item-1'],
        false,
      ),
    ).toEqual(['faq-1']);
  });

  it('Should resolve initial and current open item ids', () => {
    const normalizedItems = normalizeAccordionItems(items);

    expect(
      getInitialAccordionOpenItemIds(
        ['accordion-item-1'],
        ['faq-1'],
        normalizedItems,
        true,
      ),
    ).toEqual(['accordion-item-1']);

    expect(
      getInitialAccordionOpenItemIds(
        undefined,
        ['faq-1'],
        normalizedItems,
        true,
      ),
    ).toEqual(['faq-1']);

    expect(
      getResolvedAccordionOpenItemIds(
        undefined,
        ['accordion-item-1'],
        normalizedItems,
        true,
      ),
    ).toEqual(['accordion-item-1']);
  });

  it('Should toggle accordion items for multi and single modes', () => {
    expect(toggleAccordionItem(['faq-1'], 'faq-1', true)).toEqual([]);
    expect(toggleAccordionItem(['faq-1'], 'accordion-item-1', true)).toEqual([
      'faq-1',
      'accordion-item-1',
    ]);
    expect(toggleAccordionItem(['faq-1'], 'accordion-item-1', false)).toEqual([
      'accordion-item-1',
    ]);
  });

  it('Should resolve icon, classes, ids and skeleton items', () => {
    expect(getAccordionIconName(true)).toBe('IoIosArrowUp');
    expect(getAccordionIconName(false)).toBe('IoIosArrowDown');
    expect(getAccordionClassName('custom-class')).toContain('custom-class');
    expect(getAccordionItemClassName(true)).toContain(
      'hans-accordion-item-disabled',
    );
    expect(getAccordionItemClassName(false)).not.toContain(
      'hans-accordion-item-disabled',
    );
    expect(getAccordionPanelId('faq', 'faq-1')).toBe('faq-panel-faq-1');
    expect(getAccordionTriggerId('faq', 'faq-1')).toBe('faq-trigger-faq-1');
    expect(getAccordionSkeletonItems(2)).toEqual([0, 1]);
    expect(getAccordionSkeletonItems(0)).toEqual([0]);
    expect(getAccordionSkeletonItems(Number.NaN)).toEqual([0]);
  });

  it('Should resolve surface style vars for title and description variants', () => {
    const titleStyleVars = getAccordionSurfaceStyleVars({
      color: 'primary',
      variant: 'default',
      surface: 'title',
    });
    const descriptionStyleVars = getAccordionSurfaceStyleVars({
      color: 'base',
      variant: 'outline',
      surface: 'description',
    });
    const transparentStyleVars = getAccordionSurfaceStyleVars({
      color: 'secondary',
      variant: 'transparent',
      surface: 'title',
    });

    expect(titleStyleVars).toMatchObject({
      '--hans-accordion-title-bg': 'var(--primary-default-color)',
      '--hans-accordion-title-text': 'var(--white)',
      '--hans-accordion-title-border': 'var(--primary-default-color)',
    });
    expect(descriptionStyleVars).toMatchObject({
      '--hans-accordion-description-bg': 'transparent',
      '--hans-accordion-description-text': 'var(--text-color)',
      '--hans-accordion-description-border': 'var(--base-default-color)',
    });
    expect(transparentStyleVars).toMatchObject({
      '--hans-accordion-title-bg': 'transparent',
      '--hans-accordion-title-text': 'var(--secondary-default-color)',
      '--hans-accordion-title-border': 'transparent',
    });
  });

  it('Should compare arrays preserving order', () => {
    expect(areArraysEqual(['faq-1'], ['faq-1'])).toBe(true);
    expect(areArraysEqual(['faq-1'], ['accordion-item-1'])).toBe(false);
    expect(areArraysEqual(['faq-1'], ['faq-1', 'accordion-item-1'])).toBe(
      false,
    );
  });

  it('Should sync controlled open item ids into internal state', () => {
    const setInternalOpenItemIds = vi.fn();

    createSyncAccordionOpenItemIds({
      openItemIds: ['faq-1', 'missing'],
      normalizedItems: normalizeAccordionItems(items),
      allowMultipleOpen: true,
      setInternalOpenItemIds,
    })();

    expect(setInternalOpenItemIds).toHaveBeenCalledWith(['faq-1']);
  });

  it('Should prune uncontrolled open item ids from internal state', () => {
    const setInternalOpenItemIds = vi.fn();

    createSyncAccordionOpenItemIds({
      openItemIds: undefined,
      normalizedItems: normalizeAccordionItems(items),
      allowMultipleOpen: false,
      setInternalOpenItemIds,
    })();

    const updater = setInternalOpenItemIds.mock.calls[0][0] as (
      currentValues: string[],
    ) => string[];

    expect(updater(['faq-1', 'accordion-item-1'])).toEqual(['faq-1']);
    const previousValues = ['faq-1'];
    expect(updater(previousValues)).toBe(previousValues);
  });

  it('Should toggle accordion item respecting controlled and disabled states', () => {
    const setInternalOpenItemIds = vi.fn();
    const onOpenItemIdsChange = vi.fn();

    createHandleAccordionToggle({
      itemId: 'faq-1',
      disabled: false,
      allowMultipleOpen: true,
      resolvedOpenItemIds: [],
      openItemIds: undefined,
      setInternalOpenItemIds,
      onOpenItemIdsChange,
    })();

    expect(setInternalOpenItemIds).toHaveBeenCalledWith(['faq-1']);
    expect(onOpenItemIdsChange).toHaveBeenCalledWith(['faq-1']);

    createHandleAccordionToggle({
      itemId: 'faq-1',
      disabled: false,
      allowMultipleOpen: true,
      resolvedOpenItemIds: ['faq-1'],
      openItemIds: ['faq-1'],
      setInternalOpenItemIds,
      onOpenItemIdsChange,
    })();

    expect(setInternalOpenItemIds).toHaveBeenCalledTimes(1);
    expect(onOpenItemIdsChange).toHaveBeenLastCalledWith([]);

    createHandleAccordionToggle({
      itemId: 'faq-1',
      disabled: true,
      allowMultipleOpen: true,
      resolvedOpenItemIds: ['faq-1'],
      openItemIds: undefined,
      setInternalOpenItemIds,
      onOpenItemIdsChange,
    })();

    expect(setInternalOpenItemIds).toHaveBeenCalledTimes(1);
    expect(onOpenItemIdsChange).toHaveBeenCalledTimes(2);
  });
});
