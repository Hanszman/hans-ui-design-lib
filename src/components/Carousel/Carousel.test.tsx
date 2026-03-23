import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HansCarousel } from './Carousel';
import type { HansCarouselItem } from './Carousel.types';

const items: HansCarouselItem[] = [
  {
    id: 'campaign',
    title: 'Visual campaign',
    description: 'A full-cover image with content layered on top.',
    imageSrc: '/campaign.jpg',
    imageAlt: 'Campaign image',
  },
  {
    id: 'workspace',
    title: 'Minimal cover',
    description: 'A clean image slide for engineering and documentation pages.',
    imageSrc: '/workspace.jpg',
    imageAlt: 'Workspace image',
  },
  {
    id: 'studio',
    title: 'Creative studio',
    description: 'Use 2 or 3 visible images to create richer galleries.',
    imageSrc: '/studio.jpg',
    imageAlt: 'Studio image',
  },
  {
    id: 'meeting',
    title: 'Product meeting',
    description: 'Indicators can navigate directly to a target image.',
    imageSrc: '/meeting.jpg',
    imageAlt: 'Meeting image',
  },
  {
    id: 'plain',
    imageSrc: '/plain.jpg',
    imageAlt: 'Plain image',
  },
];

describe('HansCarousel', () => {
  it('Should render empty state when there are no images', () => {
    render(<HansCarousel items={[]} emptyText="Nothing here" />);

    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('Should render loading skeletons based on visible item count', () => {
    const { container } = render(
      <HansCarousel
        items={items}
        loading
        visibleItemsCount={3}
        loadingColor="primary"
        loadingAriaLabel="Loading gallery"
      />,
    );

    expect(container.querySelectorAll('.hans-carousel-slide-loading')).toHaveLength(
      3,
    );
    expect(screen.getByLabelText('Loading gallery image 1')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Loading gallery next control'),
    ).toBeInTheDocument();
  });

  it('Should render the requested number of visible images', () => {
    render(<HansCarousel items={items} visibleItemsCount={2} />);

    expect(screen.getByRole('img', { name: 'Campaign image' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Workspace image' })).toBeInTheDocument();
    expect(
      screen.queryByRole('img', { name: 'Studio image' }),
    ).not.toBeInTheDocument();
  });

  it('Should navigate with previous and next buttons', () => {
    render(<HansCarousel items={items} visibleItemsCount={2} />);

    const previousButton = screen.getByRole('button', {
      name: 'Previous image hans-carousel',
    });
    const nextButton = screen.getByRole('button', {
      name: 'Next image hans-carousel',
    });

    expect(previousButton).toBeDisabled();
    fireEvent.click(nextButton);

    expect(previousButton).not.toBeDisabled();
    expect(screen.getByRole('tab', { name: 'Go to image 2' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    fireEvent.click(nextButton);

    expect(screen.getByRole('img', { name: 'Studio image' })).toBeInTheDocument();

    fireEvent.click(previousButton);
    expect(screen.getByRole('tab', { name: 'Go to image 2' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('Should select an image when clicking an indicator', () => {
    render(
      <HansCarousel
        items={items}
        visibleItemsCount={1}
        maxIndicators={4}
      />,
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Go to image 4' }));

    expect(screen.getByRole('img', { name: 'Meeting image' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Go to image 4' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('Should support controlled mode and emit active item changes', () => {
    const onActiveItemChange = vi.fn();
    const { rerender } = render(
      <HansCarousel
        items={items}
        visibleItemsCount={2}
        activeItemIndex={1}
        onActiveItemChange={onActiveItemChange}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Next image hans-carousel' }),
    );

    expect(onActiveItemChange).toHaveBeenCalledWith(2);
    expect(
      screen.queryByRole('img', { name: 'Meeting image' }),
    ).not.toBeInTheDocument();

    rerender(
      <HansCarousel
        items={items}
        visibleItemsCount={2}
        activeItemIndex={3}
        onActiveItemChange={onActiveItemChange}
      />,
    );

    expect(screen.getByRole('img', { name: 'Meeting image' })).toBeInTheDocument();
  });

  it('Should apply size and color style variables', () => {
    const { container } = render(
      <HansCarousel
        items={items}
        carouselSize="large"
        carouselColor="secondary"
        carouselVariant="strong"
      />,
    );

    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper.style.getPropertyValue('--hans-carousel-height')).toBe('320px');
    expect(wrapper.style.getPropertyValue('--hans-carousel-accent-bg')).toBe(
      'var(--secondary-strong-color)',
    );
  });

  it('Should render slides without copy when title and description are not provided', () => {
    render(
      <HansCarousel
        items={items}
        visibleItemsCount={1}
        defaultActiveItemIndex={4}
      />,
    );

    expect(screen.getByRole('img', { name: 'Plain image' })).toBeInTheDocument();
    expect(screen.queryByText('Visual campaign')).not.toBeInTheDocument();
  });

  it('Should render slides with title-only and description-only copy', () => {
    render(
      <HansCarousel
        items={[
          {
            imageSrc: '/title-only.jpg',
            imageAlt: 'Title only image',
            title: 'Title only',
          },
          {
            imageSrc: '/description-only.jpg',
            imageAlt: 'Description only image',
            description: 'Description only',
          },
        ]}
        visibleItemsCount={2}
      />,
    );

    expect(screen.getByText('Title only')).toBeInTheDocument();
    expect(screen.getByText('Description only')).toBeInTheDocument();
  });

  it('Should disable next navigation on the last image', () => {
    render(
      <HansCarousel
        items={items}
        visibleItemsCount={1}
        defaultActiveItemIndex={4}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Next image hans-carousel' }),
    ).toBeDisabled();
  });
});
