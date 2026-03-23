import React from 'react';
import { HansIcon } from '../Icon/Icon';
import { HansLoading } from '../Loading/Loading';
import type { HansAccordionProps } from './Accordion.types';
import {
  createHandleAccordionToggle,
  createSyncAccordionOpenItemIds,
  getAccordionClassName,
  getAccordionIconName,
  getAccordionItemClassName,
  getAccordionPanelId,
  getAccordionSkeletonItems,
  getAccordionSurfaceStyleVars,
  getAccordionTriggerId,
  getInitialAccordionOpenItemIds,
  getResolvedAccordionOpenItemIds,
  normalizeAccordionItems,
} from './helpers/Accordion.helper';

export const HansAccordion = React.memo((props: HansAccordionProps) => {
  const {
    items = [],
    openItemIds,
    defaultOpenItemIds = [],
    allowMultipleOpen = true,
    titleColor = 'base',
    titleVariant = 'transparent',
    descriptionColor = 'base',
    descriptionVariant = 'transparent',
    loading = false,
    loadingColor = 'base',
    loadingAriaLabel = 'Loading accordion',
    skeletonItemsCount = 3,
    emptyText = 'No accordion items available',
    customClasses = '',
    accordionId = 'hans-accordion',
    onOpenItemIdsChange,
    ...rest
  } = props;

  const normalizedItems = React.useMemo(
    () => normalizeAccordionItems(items),
    [items],
  );
  const [internalOpenItemIds, setInternalOpenItemIds] = React.useState<
    string[]
  >(() =>
    getInitialAccordionOpenItemIds(
      openItemIds,
      defaultOpenItemIds,
      normalizedItems,
      allowMultipleOpen,
    ),
  );

  React.useEffect(() => {
    createSyncAccordionOpenItemIds({
      openItemIds,
      normalizedItems,
      allowMultipleOpen,
      setInternalOpenItemIds,
    })();
  }, [allowMultipleOpen, normalizedItems, openItemIds]);

  const resolvedOpenItemIds = React.useMemo(
    () =>
      getResolvedAccordionOpenItemIds(
        openItemIds,
        internalOpenItemIds,
        normalizedItems,
        allowMultipleOpen,
      ),
    [allowMultipleOpen, internalOpenItemIds, normalizedItems, openItemIds],
  );
  const className = getAccordionClassName(customClasses);
  const skeletonItems = React.useMemo(
    () => getAccordionSkeletonItems(skeletonItemsCount),
    [skeletonItemsCount],
  );
  const titleStyleVars = React.useMemo(
    () =>
      getAccordionSurfaceStyleVars({
        color: titleColor,
        variant: titleVariant,
        surface: 'title',
      }),
    [titleColor, titleVariant],
  );
  const descriptionStyleVars = React.useMemo(
    () =>
      getAccordionSurfaceStyleVars({
        color: descriptionColor,
        variant: descriptionVariant,
        surface: 'description',
      }),
    [descriptionColor, descriptionVariant],
  );

  if (loading) {
    return (
      <div className={className} aria-busy="true" {...rest}>
        {skeletonItems.map((itemIndex) => (
          <div
            key={`accordion-skeleton-${itemIndex}`}
            className="hans-accordion-item hans-accordion-skeleton-item"
          >
            <div className="hans-accordion-trigger">
              <HansLoading
                loadingType="skeleton"
                loadingColor={loadingColor}
                skeletonWidth="60%"
                skeletonHeight={20}
                ariaLabel={`${loadingAriaLabel} title ${itemIndex + 1}`}
              />
              <HansLoading
                loadingType="skeleton"
                loadingColor={loadingColor}
                skeletonWidth={20}
                skeletonHeight={20}
                ariaLabel={`${loadingAriaLabel} icon ${itemIndex + 1}`}
              />
            </div>
            <div className="hans-accordion-panel">
              <HansLoading
                loadingType="skeleton"
                loadingColor={loadingColor}
                skeletonWidth="100%"
                skeletonHeight={16}
                ariaLabel={`${loadingAriaLabel} description ${itemIndex + 1}`}
              />
              <HansLoading
                loadingType="skeleton"
                loadingColor={loadingColor}
                skeletonWidth="82%"
                skeletonHeight={16}
                ariaLabel={`${loadingAriaLabel} description extra ${itemIndex + 1}`}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!normalizedItems.length) {
    return (
      <div className={className} {...rest}>
        <p className="hans-accordion-empty">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className={className} {...rest}>
      {normalizedItems.map((item) => {
        const isOpen = resolvedOpenItemIds.includes(item.resolvedId);
        const disabled = Boolean(item.disabled);
        const panelId = getAccordionPanelId(accordionId, item.resolvedId);
        const triggerId = getAccordionTriggerId(accordionId, item.resolvedId);
        const handleToggle = createHandleAccordionToggle({
          itemId: item.resolvedId,
          disabled,
          allowMultipleOpen,
          resolvedOpenItemIds,
          openItemIds,
          setInternalOpenItemIds,
          onOpenItemIdsChange,
        });

        return (
          <div key={item.resolvedId} className={getAccordionItemClassName(disabled)}>
            <button
              id={triggerId}
              type="button"
              className="hans-accordion-trigger"
              aria-controls={panelId}
              aria-expanded={isOpen}
              onClick={handleToggle}
              disabled={disabled}
              style={titleStyleVars}
            >
              <span className="hans-accordion-title">{item.title}</span>
              <HansIcon
                name={getAccordionIconName(isOpen)}
                iconSize="small"
                customClasses="hans-accordion-icon"
              />
            </button>

            {isOpen ? (
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className="hans-accordion-panel"
                style={descriptionStyleVars}
              >
                <div className="hans-accordion-description">
                  {item.description}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
});

HansAccordion.displayName = 'HansAccordion';
