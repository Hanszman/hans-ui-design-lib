import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ComponentProps } from 'react';
import { expect, userEvent, within } from 'storybook/test';
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
    dateFormat: 'DD/MM/YYYY',
    locale: 'en-us',
    inputColor: 'primary',
    inputSize: 'medium',
    calendarColor: 'primary',
    calendarVariant: 'default',
    timePrecision: 'minute',
    allowInputTyping: false,
    panelBackgroundColor: 'var(--background-color, var(--white))',
    disabled: false,
    required: false,
  },
  argTypes: {
    pickerType: { control: 'select', options: ['date', 'datetime', 'time'] },
    dateFormat: { control: 'select', options: ['DD/MM/YYYY', 'MM/DD/YYYY'] },
    locale: { control: 'select', options: ['en-us', 'pt-br', 'es-es'] },
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
    panelBackgroundColor: { control: 'text' },
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

export const Required: Story = {
  args: {
    label: 'Start date',
    pickerType: 'date',
    required: true,
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

export const MonthDayYear: Story = {
  args: {
    label: 'US date',
    pickerType: 'date',
    dateFormat: 'MM/DD/YYYY',
    defaultValue: '2026-03-13',
    allowInputTyping: true,
  },
};

export const LocalizedCalendars: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <HansDatePicker
        {...args}
        label="Data em português"
        locale="pt-br"
        defaultValue="2026-03-13"
      />
      <HansDatePicker
        {...args}
        label="Fecha en español"
        locale="es-es"
        defaultValue="2026-03-13"
      />
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

export const QuickMonthYearPicker: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <HansDatePicker
        {...args}
        label="Pick a far-away date"
        pickerType="date"
        defaultValue="2026-03-13"
      />
      <p className="text-xs text-[var(--gray-700)]">
        Open the picker, then click the month name (for example
        &quot;March&quot;) or the year (for example &quot;2026&quot;) in the
        calendar header instead of pressing the arrow buttons repeatedly. The
        month page lets you jump to any month of the shown year and move to the
        previous/next year with the small arrows. The year page shows a 12-year
        window with its own previous/next page arrows. Picking a month or year
        returns to the day grid immediately, and the back arrow on the left
        always returns to the day grid without picking anything.
      </p>
    </div>
  ),
};

export const QuickMonthYearPickerRoundTrip: Story = {
  args: {
    label: 'Pick a far-away date',
    pickerType: 'date',
    defaultValue: '2026-03-13',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.click(canvas.getByDisplayValue('13/03/2026'));

    // Open the month picker from the header and pick a month.
    await userEvent.click(body.getByLabelText('Open month picker'));
    await expect(body.queryByText('Apply')).not.toBeInTheDocument();
    await userEvent.click(body.getByRole('button', { name: 'June' }));
    await expect(body.getByText('June')).toBeInTheDocument();
    await expect(body.getByText('2026')).toBeInTheDocument();

    // Open the year picker, paginate the year window, then pick a year.
    await userEvent.click(body.getByLabelText('Open year picker'));
    await expect(body.getByText('2016 - 2027')).toBeInTheDocument();
    await userEvent.click(body.getByLabelText('Next years'));
    await expect(body.getByText('2028 - 2039')).toBeInTheDocument();
    await userEvent.click(body.getByLabelText('Previous years'));
    await expect(body.getByText('2016 - 2027')).toBeInTheDocument();
    await userEvent.click(body.getByRole('button', { name: '2020' }));

    // Round trip: the day grid now shows the picked year and kept month.
    await expect(body.getByText('June')).toBeInTheDocument();
    await expect(body.getByText('2020')).toBeInTheDocument();

    // The back button on the month page returns without picking anything.
    await userEvent.click(body.getByLabelText('Open month picker'));
    await userEvent.click(body.getByLabelText('Back to calendar'));
    await expect(body.getByText('June')).toBeInTheDocument();
    await expect(body.getByText('2020')).toBeInTheDocument();
  },
};

export const SurfaceOverrides: Story = {
  render: () => (
    <div
      className="flex max-w-md flex-col gap-4 p-4"
      style={
        {
          '--storybook-date-picker-dark-surface': '#1f2937',
          '--storybook-date-picker-muted-surface': '#e6e8f2',
        } as React.CSSProperties
      }
    >
      <HansDatePicker
        label="Dark surface"
        pickerType="date"
        defaultValue="2026-03-13"
        inputColor="base"
        popupBackgroundColor="transparent"
        panelBackgroundColor="var(--storybook-date-picker-dark-surface)"
      />
      <HansDatePicker
        label="Muted panel"
        pickerType="datetime"
        defaultValue="2026-03-13T16:20"
        popupBackgroundColor="transparent"
        panelBackgroundColor="var(--storybook-date-picker-muted-surface)"
      />
    </div>
  ),
};
