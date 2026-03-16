import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ComponentProps } from 'react';
import { HansDatePicker } from './DatePicker';
import DocsPage from './DatePicker.mdx';

const ControlledDateStory = (args: ComponentProps<typeof HansDatePicker>) => {
  const [value, setValue] = useState('2026-04-18');
  return (
    <HansDatePicker
      {...args}
      pickerType="date"
      value={value}
      onChange={setValue}
    />
  );
};

const ControlledDateTimeStory = (
  args: ComponentProps<typeof HansDatePicker>,
) => {
  const [value, setValue] = useState('2026-04-18T14:30');
  return (
    <HansDatePicker
      {...args}
      pickerType="datetime"
      value={value}
      onChange={setValue}
      calendarColor="secondary"
    />
  );
};

const ControlledTimeStory = (args: ComponentProps<typeof HansDatePicker>) => {
  const [value, setValue] = useState('09:45:30');
  return (
    <HansDatePicker
      {...args}
      pickerType="time"
      timePrecision="second"
      value={value}
      onChange={setValue}
      inputColor="info"
    />
  );
};

const meta: Meta<typeof HansDatePicker> = {
  title: 'Components/Forms/DatePicker',
  component: HansDatePicker,
  args: {
    label: 'Schedule',
    pickerType: 'date',
    inputColor: 'primary',
    inputSize: 'medium',
    calendarColor: 'primary',
    calendarVariant: 'default',
    timePrecision: 'minute',
    allowInputTyping: false,
    disabled: false,
  },
  argTypes: {
    pickerType: { control: 'select', options: ['date', 'datetime', 'time'] },
    inputColor: {
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
    calendarColor: {
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
    calendarVariant: {
      control: 'select',
      options: ['strong', 'default', 'neutral', 'outline', 'transparent'],
    },
    inputSize: { control: 'select', options: ['small', 'medium', 'large'] },
    timePrecision: { control: 'select', options: ['minute', 'second'] },
    allowInputTyping: { control: 'boolean' },
  },
  parameters: {
    docs: {
      page: DocsPage,
    },
  },
};

export default meta;
type Story = StoryObj<typeof HansDatePicker>;

export const Primary: Story = {
  args: {
    pickerType: 'date',
    defaultValue: '2026-03-13',
  },
};

export const DateOnly: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <ControlledDateStory {...args} label="Start date" />
      <ControlledDateStory {...args} label="Review date" />
      <ControlledDateStory {...args} label="Delivery date" />
    </div>
  ),
};

export const DateTime: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <ControlledDateTimeStory {...args} label="Start datetime" />
      <ControlledDateTimeStory {...args} label="Checkpoint" />
      <ControlledDateTimeStory {...args} label="Publish at" />
    </div>
  ),
};

export const TimeOnly: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <ControlledTimeStory {...args} label="Open at" />
      <ControlledTimeStory {...args} label="Close at" />
      <ControlledTimeStory {...args} label="Reminder" />
    </div>
  ),
};

export const ManualTyping: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <HansDatePicker
        {...args}
        label="Typed date"
        pickerType="date"
        allowInputTyping
        defaultValue="2026-03-13"
      />
      <HansDatePicker
        {...args}
        label="Typed datetime"
        pickerType="datetime"
        allowInputTyping
        defaultValue="2026-03-13T16:20"
      />
    </div>
  ),
};

export const StatesAndColors: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <HansDatePicker
        label="Primary date"
        pickerType="date"
        defaultValue="2026-03-13"
        calendarColor="primary"
      />
      <HansDatePicker
        label="Success datetime"
        pickerType="datetime"
        defaultValue="2026-03-13T16:20"
        calendarColor="success"
        calendarVariant="neutral"
      />
      <HansDatePicker
        label="Disabled time"
        pickerType="time"
        defaultValue="18:30"
        disabled
      />
    </div>
  ),
};
