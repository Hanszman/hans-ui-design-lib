import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { Color, Size, Variant } from '../../types/Common.types';
import { HansButton } from '../Forms/Button/Button';
import { HansToast } from './Toast';
import { resetToastStackRegistry } from './helpers/Toast.helper';
import DocsPage from './Toast.mdx';

const positions = [
  'top-right',
  'top-left',
  'bottom-right',
  'bottom-left',
] as const;

const getStorybookPortalTarget = (): HTMLElement | null => {
  if (typeof window === 'undefined') return null;
  return document.body;
};

const meta: Meta<typeof HansToast> = {
  title: 'Components/Toast',
  component: HansToast,
  args: {
    title: 'Changes saved',
    message: 'Everything was stored successfully.',
    toastColor: 'success',
    toastVariant: 'neutral',
    toastSize: 'medium',
    position: 'top-right',
    duration: 4000,
    dismissible: true,
  },
  argTypes: {
    toastColor: {
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
    toastVariant: {
      control: 'select',
      options: ['strong', 'default', 'neutral', 'outline', 'transparent'],
    },
    toastSize: { control: 'select', options: ['small', 'medium', 'large'] },
    position: { control: 'select', options: positions },
    dismissible: { control: 'boolean' },
    duration: { control: 'number' },
  },
  parameters: {
    docs: {
      page: DocsPage,
    },
  },
};

export default meta;
type Story = StoryObj<typeof HansToast>;

type ToastStoryItem = {
  id: string;
  title: string;
  message: string;
  toastColor: Color;
  toastVariant: Variant;
  toastSize: Size;
  position: (typeof positions)[number];
  duration: number;
  dismissible: boolean;
};

const createToastStoryItem = (
  overrides: Partial<ToastStoryItem> = {},
): ToastStoryItem => ({
  id: `${Date.now()}-${Math.random()}`,
  title: 'Changes saved',
  message: 'Everything was stored successfully.',
  toastColor: 'success',
  toastVariant: 'neutral',
  toastSize: 'medium',
  position: 'top-right',
  duration: 4000,
  dismissible: true,
  ...overrides,
});

const StoryViewportToastDemo = ({
  items,
  onCloseItem,
}: {
  items: ToastStoryItem[];
  onCloseItem: (id: string) => void;
}) => {
  const portalTarget = getStorybookPortalTarget();

  return (
    <>
      {items.map((item) => (
        <HansToast
          key={item.id}
          title={item.title}
          message={item.message}
          toastColor={item.toastColor}
          toastVariant={item.toastVariant}
          toastSize={item.toastSize}
          position={item.position}
          duration={item.duration}
          dismissible={item.dismissible}
          portalTarget={portalTarget}
          onVisibilityChange={(visible) => {
            if (!visible) onCloseItem(item.id);
          }}
          onClose={() => onCloseItem(item.id)}
        />
      ))}
    </>
  );
};

const useToastStoryReset = () => {
  React.useEffect(() => {
    resetToastStackRegistry();
    return () => resetToastStackRegistry();
  }, []);
};

const PrimaryDemo = () => {
  useToastStoryReset();
  const [items, setItems] = React.useState<ToastStoryItem[]>([]);

  return (
    <div className="flex min-h-[88px] items-center gap-3 rounded-2xl border border-[var(--gray-300)] p-4">
      <HansButton
        label="Show toast"
        buttonColor="success"
        onClick={() => setItems([createToastStoryItem()])}
      />
      <HansButton
        label="Clear"
        buttonVariant="outline"
        onClick={() => setItems([])}
      />
      <StoryViewportToastDemo
        items={items}
        onCloseItem={(id) =>
          setItems((prev) => prev.filter((item) => item.id !== id))
        }
      />
    </div>
  );
};

export const Primary: Story = {
  render: () => <PrimaryDemo />,
};

export const Sizes: Story = {
  render: () => {
    const SizeDemo = () => {
      useToastStoryReset();
      const [items, setItems] = React.useState<ToastStoryItem[]>([]);

      return (
        <div className="flex gap-3">
          {(['small', 'medium', 'large'] as Size[]).map((size) => (
            <HansButton
              key={size}
              label={size}
              buttonColor="primary"
              buttonVariant="outline"
              onClick={() =>
                setItems([
                  createToastStoryItem({
                    title: `${size} toast`,
                    message: 'Dimension tokens change spacing and card width.',
                    toastSize: size,
                  }),
                ])
              }
            />
          ))}
          <StoryViewportToastDemo
            items={items}
            onCloseItem={(id) =>
              setItems((prev) => prev.filter((item) => item.id !== id))
            }
          />
        </div>
      );
    };

    return <SizeDemo />;
  },
};

export const VariantsAndColors: Story = {
  render: () => {
    const VariantDemo = () => {
      useToastStoryReset();
      const [items, setItems] = React.useState<ToastStoryItem[]>([]);

      return (
        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-[var(--gray-300)] p-4 md:grid-cols-2 xl:grid-cols-3">
          {(
            [
              'strong',
              'default',
              'neutral',
              'outline',
              'transparent',
            ] as Variant[]
          ).map((variant) => (
            <div
              key={variant}
              className="rounded-xl border border-[var(--gray-300)] p-4"
            >
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em]">
                {variant}
              </p>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    'base',
                    'primary',
                    'secondary',
                    'success',
                    'danger',
                    'warning',
                    'info',
                  ] as Color[]
                ).map((color) => (
                  <HansButton
                    key={`${variant}-${color}`}
                    label={color}
                    buttonColor={color}
                    buttonVariant={
                      variant === 'transparent' ? 'outline' : 'default'
                    }
                    onClick={() =>
                      setItems([
                        createToastStoryItem({
                          title: `${color} ${variant}`,
                          message: 'Semantic tone driven by design tokens.',
                          toastColor: color,
                          toastVariant: variant,
                        }),
                      ])
                    }
                  />
                ))}
              </div>
            </div>
          ))}
          <StoryViewportToastDemo
            items={items}
            onCloseItem={(id) =>
              setItems((prev) => prev.filter((item) => item.id !== id))
            }
          />
        </div>
      );
    };

    return <VariantDemo />;
  },
};

export const Positions: Story = {
  render: () => {
    const PositionDemo = () => {
      useToastStoryReset();
      const [items, setItems] = React.useState<ToastStoryItem[]>([]);

      return (
        <div className="flex gap-3">
          {positions.map((position) => (
            <HansButton
              key={position}
              label={position.replace('-', ' / ')}
              buttonColor="primary"
              buttonVariant="outline"
              onClick={() =>
                setItems([
                  createToastStoryItem({
                    title: position,
                    message: 'The stack direction follows the selected corner.',
                    position,
                    duration: 0,
                  }),
                ])
              }
            />
          ))}
          <StoryViewportToastDemo
            items={items}
            onCloseItem={(id) =>
              setItems((prev) => prev.filter((item) => item.id !== id))
            }
          />
        </div>
      );
    };

    return <PositionDemo />;
  },
};

const StackedToastDemo = () => {
  useToastStoryReset();
  const [items, setItems] = React.useState<ToastStoryItem[]>([]);

  const appendToast = () => {
    setItems((prev) => [
      ...prev,
      createToastStoryItem({
        title: `Toast ${prev.length + 1}`,
        message: 'New notifications keep the same corner and stack vertically.',
        position: 'bottom-right',
        duration: 0,
        toastColor: prev.length % 2 === 0 ? 'primary' : 'success',
        toastVariant: prev.length % 2 === 0 ? 'outline' : 'neutral',
      }),
    ]);
  };

  return (
    <div className="rounded-2xl border border-[var(--gray-300)] p-4">
      <div className="flex gap-3">
        <HansButton
          label="Add toast"
          buttonColor="primary"
          onClick={appendToast}
        />
        <HansButton
          label="Reset"
          buttonVariant="outline"
          onClick={() => setItems([])}
        />
      </div>

      <StoryViewportToastDemo
        items={items}
        onCloseItem={(id) =>
          setItems((prev) => prev.filter((item) => item.id !== id))
        }
      />
    </div>
  );
};

export const Stacked: Story = {
  render: () => <StackedToastDemo />,
};

const AutoDismissDemo = () => {
  useToastStoryReset();
  const [items, setItems] = React.useState<ToastStoryItem[]>([]);

  return (
    <div className="rounded-2xl border border-[var(--gray-300)] p-4">
      <HansButton
        label="Trigger toast"
        buttonColor="secondary"
        onClick={() =>
          setItems([
            createToastStoryItem({
              title: 'Scheduled sync',
              message: 'This example closes automatically after 2.5 seconds.',
              duration: 2500,
              toastColor: 'secondary',
              toastVariant: 'default',
            }),
          ])
        }
      />
      <StoryViewportToastDemo
        items={items}
        onCloseItem={(id) =>
          setItems((prev) => prev.filter((item) => item.id !== id))
        }
      />
    </div>
  );
};

export const AutoDismiss: Story = {
  render: () => <AutoDismissDemo />,
};
