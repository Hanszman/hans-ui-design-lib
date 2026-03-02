import type { Meta, StoryObj } from '@storybook/react';
import type { Color, Size } from '../../../types/Common.types';
import { HansToggle } from './Toggle';
import { HansIcon } from '../../Icon/Icon';
import DocsPage from './Toggle.mdx';

const meta: Meta<typeof HansToggle> = {
  title: 'Components/Forms/Toggle',
  component: HansToggle,
  args: {
    label: 'Notifications',
    toggleMode: 'switch',
    defaultChecked: false,
    loading: false,
    toggleColor: 'primary',
    toggleSize: 'medium',
    disabled: false,
  },
  argTypes: {
    toggleMode: { control: 'select', options: ['switch', 'segmented'] },
    toggleColor: {
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
    toggleSize: { control: 'select', options: ['small', 'medium', 'large'] },
    labelColor: {
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
type Story = StoryObj<typeof HansToggle>;

export const Primary: Story = {
  args: {
    defaultChecked: true,
    toggleColor: 'primary',
    label: 'Primary toggle',
  },
};

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {[
        'base',
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
      ].map((color) => (
        <div key={color} className="flex items-center gap-3">
          <span className="w-28 text-sm">Color {color}</span>
          <HansToggle defaultChecked toggleColor={color as Color} />
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {['small', 'medium', 'large'].map((size) => (
        <div key={size} className="flex items-center gap-2">
          <span className="text-sm">{size}</span>
          <HansToggle defaultChecked toggleSize={size as Size} />
        </div>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="w-24 text-sm">On</span>
        <HansToggle defaultChecked toggleColor="success" />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-24 text-sm">Off</span>
        <HansToggle defaultChecked={false} />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-24 text-sm">On disabled</span>
        <HansToggle checked disabled />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-24 text-sm">Off disabled</span>
        <HansToggle checked={false} disabled />
      </div>
    </div>
  ),
};

export const WithContentAndIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <HansToggle
        defaultChecked
        toggleColor="success"
        leftLabel="Off"
        rightLabel="On"
        onContent="ON"
        offContent="OFF"
        thumbContent={<HansIcon name="IoMdCheckmark" iconSize="small" />}
      />
      <HansToggle
        defaultChecked={false}
        toggleColor="danger"
        onContent={<HansIcon name="IoMdCheckmark" iconSize="small" />}
        offContent={<HansIcon name="IoMdClose" iconSize="small" />}
        thumbContent={<HansIcon name="IoMdFlash" iconSize="small" />}
      />
    </div>
  ),
};

export const ContentSizing: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <HansToggle
        defaultChecked
        toggleColor="primary"
        onContent="ON"
        offContent="OFF"
      />
      <HansToggle
        defaultChecked
        toggleColor="secondary"
        onContent="Enabled"
        offContent="Disabled"
      />
      <HansToggle
        defaultChecked
        toggleColor="info"
        onContent="Very long text example"
        offContent="Another very long text"
      />
    </div>
  ),
};

export const SideLabels: Story = {
  args: {
    label: 'Mode',
    leftLabel: 'Off',
    rightLabel: 'On',
    defaultChecked: true,
  },
};

export const Segmented: Story = {
  args: {
    label: 'Mode',
    toggleMode: 'segmented',
    options: [
      { label: 'Assistive', value: 'assistive' },
      { label: 'Expert', value: 'expert' },
    ],
    defaultValue: 'assistive',
    toggleColor: 'primary',
  },
};

export const SegmentedWithIcons: Story = {
  args: {
    label: 'Theme',
    toggleMode: 'segmented',
    options: [
      {
        label: 'Day',
        value: 'day',
        icon: <HansIcon name="IoMdSunny" iconSize="small" />,
      },
      {
        label: 'Night',
        value: 'night',
        icon: <HansIcon name="IoMdMoon" iconSize="small" />,
      },
      {
        label: 'Auto',
        value: 'auto',
        icon: <HansIcon name="IoMdDesktop" iconSize="small" />,
      },
    ],
    defaultValue: 'night',
    toggleColor: 'secondary',
  },
};

export const Uncontrolled: Story = {
  args: {
    label: 'Uncontrolled',
    defaultChecked: true,
    toggleColor: 'success',
  },
};

export const LoadingSwitch: Story = {
  args: {
    label: 'Loading switch',
    loading: true,
    toggleMode: 'switch',
    toggleColor: 'primary',
  },
};

export const LoadingSegmented: Story = {
  args: {
    label: 'Loading segmented',
    loading: true,
    toggleMode: 'segmented',
    toggleColor: 'secondary',
    options: [
      { label: 'Assistive', value: 'assistive' },
      { label: 'Expert', value: 'expert' },
    ],
  },
};
