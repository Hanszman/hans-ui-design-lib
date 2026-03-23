import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { HansCarousel } from './Carousel';
import DocsPage from './Carousel.mdx';
import type { HansCarouselItem } from './Carousel.types';

const carouselItems: HansCarouselItem[] = [
  {
    id: 'campaign',
    title: 'Visual campaign',
    description: 'A full-cover image with content layered on top.',
    imageSrc:
      'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Team collaborating around a laptop',
  },
  {
    id: 'workspace',
    title: 'Minimal cover',
    description: 'A clean image slide for engineering and documentation pages.',
    imageSrc:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Developer workspace with a laptop',
  },
  {
    id: 'studio',
    title: 'Creative studio',
    description: 'Use 2 or 3 visible images to create richer galleries.',
    imageSrc:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Creative team working in an office',
  },
  {
    id: 'meeting',
    title: 'Product meeting',
    description: 'Indicators can navigate directly to a target image.',
    imageSrc:
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Team in a product meeting',
  },
  {
    id: 'focus',
    title: 'Focused delivery',
    description: 'Loading, empty state and indicators follow the same visual theme.',
    imageSrc:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'People collaborating in an office space',
  },
  {
    id: 'plain-image',
    imageSrc:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Laptop and desk accessories',
  },
];

const meta: Meta<typeof HansCarousel> = {
  title: 'Components/Carousel',
  component: HansCarousel,
  args: {
    items: carouselItems,
    visibleItemsCount: 1,
    maxIndicators: 7,
    carouselSize: 'medium',
    carouselColor: 'base',
    carouselVariant: 'outline',
    loading: false,
    loadingColor: 'base',
    loadingAriaLabel: 'Loading carousel',
    emptyText: 'No images available',
  },
  argTypes: {
    items: { control: 'object' },
    activeItemIndex: { control: 'number' },
    defaultActiveItemIndex: { control: 'number' },
    visibleItemsCount: { control: 'number' },
    maxIndicators: { control: 'number' },
    carouselSize: { control: 'select', options: ['small', 'medium', 'large'] },
    carouselColor: {
      control: 'select',
      options: [
        'base',
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
      ],
    },
    carouselVariant: {
      control: 'select',
      options: ['strong', 'default', 'neutral', 'outline', 'transparent'],
    },
    loadingColor: {
      control: 'select',
      options: [
        'base',
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
      ],
    },
  },
  parameters: {
    docs: {
      page: DocsPage,
    },
  },
};

export default meta;
type Story = StoryObj<typeof HansCarousel>;

export const Playground: Story = {
  args: {
    items: carouselItems,
  },
};

export const OneImagePerView: Story = {
  args: {
    items: carouselItems,
    visibleItemsCount: 1,
  },
};

export const TwoImagesPerView: Story = {
  args: {
    items: carouselItems,
    visibleItemsCount: 2,
  },
};

export const ThreeImagesPerView: Story = {
  args: {
    items: carouselItems,
    visibleItemsCount: 3,
  },
};

export const LimitedIndicators: Story = {
  args: {
    items: carouselItems,
    visibleItemsCount: 1,
    maxIndicators: 4,
    defaultActiveItemIndex: 3,
  },
};

export const ColorsAndVariants: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <HansCarousel
        items={carouselItems}
        visibleItemsCount={1}
        carouselColor="primary"
        carouselVariant="default"
      />
      <HansCarousel
        items={carouselItems}
        visibleItemsCount={2}
        carouselColor="secondary"
        carouselVariant="outline"
      />
      <HansCarousel
        items={carouselItems}
        visibleItemsCount={3}
        carouselColor="success"
        carouselVariant="strong"
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <HansCarousel
        items={carouselItems}
        carouselSize="small"
        visibleItemsCount={1}
      />
      <HansCarousel
        items={carouselItems}
        carouselSize="medium"
        visibleItemsCount={2}
      />
      <HansCarousel
        items={carouselItems}
        carouselSize="large"
        visibleItemsCount={3}
      />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => <ControlledCarouselExample />,
};

export const Loading: Story = {
  args: {
    loading: true,
    visibleItemsCount: 3,
    loadingColor: 'primary',
  },
};

export const Empty: Story = {
  args: {
    items: [],
    emptyText: 'There are no images to show in this carousel right now.',
  },
};

const ControlledCarouselExample = () => {
  const [activeItemIndex, setActiveItemIndex] = useState(1);

  return (
    <div className="flex w-full flex-col gap-3">
      <HansCarousel
        items={carouselItems}
        visibleItemsCount={2}
        activeItemIndex={activeItemIndex}
        onActiveItemChange={setActiveItemIndex}
      />
      <span className="text-sm text-[var(--gray-700)]">
        Active image: {activeItemIndex + 1}
      </span>
    </div>
  );
};
