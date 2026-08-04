import type { Meta, StoryObj } from '@storybook/react';
import { HansMessage } from './Message';
import DocsPage from './Message.mdx';

const meta: Meta<typeof HansMessage> = {
  title: 'Components/Message',
  component: HansMessage,
  args: {
    message: 'This is a contextual message for the user.',
    messageColor: 'info',
    messageVariant: 'neutral',
    messageSize: 'medium',
    iconName: 'IoIosInformationCircle',
    dismissible: false,
  },
  argTypes: {
    messageColor: {
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
    messageVariant: {
      control: 'select',
      options: [
        'strong',
        'default',
        'neutral',
        'inverse',
        'outline',
        'transparent',
      ],
    },
    messageSize: { control: 'select', options: ['small', 'medium', 'large'] },
    dismissible: { control: 'boolean' },
  },
  parameters: { docs: { page: DocsPage } },
};

export default meta;
type Story = StoryObj<typeof HansMessage>;

export const Primary: Story = {};

export const SemanticMessages: Story = {
  render: () => (
    <div className="flex w-full max-w-[720px] flex-col gap-3">
      <HansMessage
        message="This is a neutral informational message."
        iconName="IoIosInformationCircle"
      />
      <HansMessage
        message="Your changes were saved successfully."
        messageColor="success"
        iconName="IoIosCheckmarkCircle"
      />
      <HansMessage
        message="The requested action could not be completed."
        messageColor="danger"
        iconName="IoIosAlert"
      />
      <HansMessage
        message="Review this information before continuing."
        messageColor="warning"
        iconName="IoIosWarning"
      />
      <HansMessage
        message="A new update is available."
        messageColor="info"
        iconName="IoIosInformationCircle"
      />
    </div>
  ),
};

export const Dismissible: Story = {
  args: {
    title: 'Optional title',
    message: 'Close this message to verify the dismissal behavior.',
    messageColor: 'base',
    dismissible: true,
    closeButtonLabel: 'Close message',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex w-full max-w-[720px] flex-col gap-3">
      {(
        [
          'strong',
          'default',
          'neutral',
          'inverse',
          'outline',
          'transparent',
        ] as const
      ).map((variant) => (
        <HansMessage
          key={variant}
          message={`${variant} message variant`}
          messageColor="info"
          messageVariant={variant}
          iconName="IoIosInformationCircle"
        />
      ))}
    </div>
  ),
};
