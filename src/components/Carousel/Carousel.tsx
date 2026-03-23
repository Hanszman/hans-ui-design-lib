import React from 'react';
import { HansIcon } from '../Icon/Icon';
import { HansLoading } from '../Loading/Loading';
import type { HansCarouselProps } from './Carousel.types';
import {
  clampVisibleItemsCount,
  createHandleCarouselMove,
  createHandleCarouselSelect,
  createSyncCarouselIndex,
  getCanMoveCarouselNext,
  getCanMoveCarouselPrevious,
  getCarouselButtonClassName,
  getCarouselButtonIconName,
  getCarouselClassName,
  getCarouselIndicatorClassName,
  getCarouselIndicatorItems,
  getCarouselSizeHeight,
  getCarouselSlideClassName,
  getCarouselStyleVars,
  getInitialCarouselActiveItemIndex,
  getResolvedCarouselActiveItemIndex,
  getVisibleCarouselItems,
  normalizeCarouselItems,
} from './helpers/Carousel.helper';

export const HansCarousel = React.memo((props: HansCarouselProps) => {
  const {
    items = [],
    activeItemIndex,
    defaultActiveItemIndex = 0,
    visibleItemsCount = 1,
    maxIndicators = 7,
    carouselSize = 'medium',
    carouselColor = 'base',
    carouselVariant = 'outline',
    loading = false,
    loadingColor,
    loadingAriaLabel = 'Loading carousel',
    emptyText = 'No images available',
    customClasses = '',
    carouselId = 'hans-carousel',
    onActiveItemChange,
    ...rest
  } = props;

  const normalizedItems = React.useMemo(() => normalizeCarouselItems(items), [items]);
  const itemsLength = normalizedItems.length;
  const normalizedVisibleItemsCount = clampVisibleItemsCount(visibleItemsCount);
  const [internalActiveItemIndex, setInternalActiveItemIndex] = React.useState(
    () =>
      getInitialCarouselActiveItemIndex(
        activeItemIndex,
        defaultActiveItemIndex,
        itemsLength,
      ),
  );

  React.useEffect(() => {
    createSyncCarouselIndex({
      activeItemIndex,
      itemsLength,
      setInternalActiveItemIndex,
    })();
  }, [activeItemIndex, itemsLength]);

  const resolvedActiveItemIndex = React.useMemo(
    () =>
      getResolvedCarouselActiveItemIndex(
        activeItemIndex,
        internalActiveItemIndex,
        itemsLength,
      ),
    [activeItemIndex, internalActiveItemIndex, itemsLength],
  );
  const visibleItems = React.useMemo(
    () =>
      getVisibleCarouselItems(
        normalizedItems,
        resolvedActiveItemIndex,
        normalizedVisibleItemsCount,
      ),
    [normalizedItems, normalizedVisibleItemsCount, resolvedActiveItemIndex],
  );
  const indicatorItems = React.useMemo(
    () =>
      getCarouselIndicatorItems(
        itemsLength,
        resolvedActiveItemIndex,
        maxIndicators,
      ),
    [itemsLength, maxIndicators, resolvedActiveItemIndex],
  );
  const className = getCarouselClassName({
    carouselSize,
    customClasses,
  });
  const styleVars = React.useMemo(
    () =>
      ({
        ...getCarouselStyleVars({
          carouselColor,
          carouselVariant,
          visibleItemsCount: normalizedVisibleItemsCount,
        }),
        '--hans-carousel-height': getCarouselSizeHeight(carouselSize),
      }) as React.CSSProperties,
    [
      carouselColor,
      carouselSize,
      carouselVariant,
      normalizedVisibleItemsCount,
    ],
  );
  const canMovePrevious = getCanMoveCarouselPrevious(resolvedActiveItemIndex);
  const canMoveNext = getCanMoveCarouselNext(resolvedActiveItemIndex, itemsLength);
  const handlePrevious = createHandleCarouselMove({
    direction: 'previous',
    resolvedActiveItemIndex,
    itemsLength,
    activeItemIndex,
    setInternalActiveItemIndex,
    onActiveItemChange,
  });
  const handleNext = createHandleCarouselMove({
    direction: 'next',
    resolvedActiveItemIndex,
    itemsLength,
    activeItemIndex,
    setInternalActiveItemIndex,
    onActiveItemChange,
  });
  const resolvedLoadingColor = loadingColor ?? carouselColor;

  if (loading) {
    return (
      <div className={className} style={styleVars} aria-busy="true" {...rest}>
        <div className="hans-carousel-frame">
          <div className="hans-carousel-viewport">
            <div className="hans-carousel-track">
              {Array.from(
                { length: normalizedVisibleItemsCount },
                (_, index) => index,
              ).map((itemIndex) => (
                <div
                  key={`carousel-skeleton-${itemIndex}`}
                  className="hans-carousel-slide hans-carousel-slide-loading"
                >
                  <HansLoading
                    loadingType="skeleton"
                    loadingColor={resolvedLoadingColor}
                    skeletonWidth="100%"
                    skeletonHeight="100%"
                    ariaLabel={`${loadingAriaLabel} image ${itemIndex + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="hans-carousel-controls">
            <HansLoading
              loadingType="skeleton"
              loadingColor={resolvedLoadingColor}
              skeletonWidth={40}
              skeletonHeight={40}
              ariaLabel={`${loadingAriaLabel} previous control`}
            />
            <HansLoading
              loadingType="skeleton"
              loadingColor={resolvedLoadingColor}
              skeletonWidth={72}
              skeletonHeight={12}
              ariaLabel={`${loadingAriaLabel} indicators`}
            />
            <HansLoading
              loadingType="skeleton"
              loadingColor={resolvedLoadingColor}
              skeletonWidth={40}
              skeletonHeight={40}
              ariaLabel={`${loadingAriaLabel} next control`}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!itemsLength) {
    return (
      <div className={className} style={styleVars} {...rest}>
        <div className="hans-carousel-empty">{emptyText}</div>
      </div>
    );
  }

  return (
    <div className={className} style={styleVars} {...rest}>
      <div className="hans-carousel-frame">
        <div className="hans-carousel-viewport">
          <div className="hans-carousel-track">
            {visibleItems.map((item) => (
              <div
                key={item.resolvedId}
                className={getCarouselSlideClassName(
                  item.index === resolvedActiveItemIndex,
                )}
              >
                <div
                  className="hans-carousel-image"
                  role="img"
                  aria-label={item.imageAlt}
                  style={
                    {
                      '--hans-carousel-slide-image': `url("${item.imageSrc}")`,
                    } as React.CSSProperties
                  }
                >
                  {item.title || item.description ? (
                    <div className="hans-carousel-copy">
                      {item.title ? (
                        <strong className="hans-carousel-title">
                          {item.title}
                        </strong>
                      ) : null}
                      {item.description ? (
                        <span className="hans-carousel-description">
                          {item.description}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className={getCarouselButtonClassName('previous')}
            aria-label={`Previous image ${carouselId}`}
            onClick={handlePrevious}
            disabled={!canMovePrevious}
          >
            <HansIcon
              name={getCarouselButtonIconName('previous')}
              iconSize={carouselSize}
            />
          </button>

          <button
            type="button"
            className={getCarouselButtonClassName('next')}
            aria-label={`Next image ${carouselId}`}
            onClick={handleNext}
            disabled={!canMoveNext}
          >
            <HansIcon
              name={getCarouselButtonIconName('next')}
              iconSize={carouselSize}
            />
          </button>
        </div>

        <div className="hans-carousel-controls">
          <div className="hans-carousel-indicators" role="tablist">
            {indicatorItems.map((indicatorItem) => {
              const handleSelect = createHandleCarouselSelect({
                targetIndex: indicatorItem.index,
                itemsLength,
                activeItemIndex,
                setInternalActiveItemIndex,
                onActiveItemChange,
              });

              return (
                <button
                  key={`carousel-indicator-${indicatorItem.index}`}
                  type="button"
                  role="tab"
                  aria-selected={indicatorItem.isActive}
                  aria-label={`Go to image ${indicatorItem.index + 1}`}
                  className={getCarouselIndicatorClassName(
                    indicatorItem.isActive,
                    indicatorItem.isFaded,
                  )}
                  onClick={handleSelect}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

HansCarousel.displayName = 'HansCarousel';
