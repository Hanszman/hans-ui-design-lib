import type { Meta, StoryObj } from '@storybook/react-vite';
import { HansTextarea } from './Textarea';

const meta = {
  title: 'Components/Forms/Textarea',
  component: HansTextarea,
  args: {
    label: 'Description',
    placeholder: 'Write a detailed description',
    rows: 5,
  },
} satisfies Meta<typeof HansTextarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Required: Story = { args: { required: true } };

export const RichFormatting: Story = {
  args: {
    formattingToolbar: true,
    defaultValue:
      '**Bold text**\n*Italic text*\n__Underlined text__\n- First item\n- Second item',
    rows: 7,
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Read only' },
};

export const Error: Story = {
  args: {
    textareaColor: 'danger',
    messageColor: 'danger',
    message: 'Review this value.',
  },
};
