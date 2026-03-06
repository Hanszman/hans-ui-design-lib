import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { HansButton } from '../Forms/Button/Button';
import { HansPopup } from './Popup';
import DocsPage from './Popup.mdx';

const meta: Meta<typeof HansPopup> = {
  title: 'Components/Popup',
  component: HansPopup,
  parameters: {
    docs: { page: DocsPage },
  },
};

export default meta;
type Story = StoryObj<typeof HansPopup>;

const PopupDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <HansPopup
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      renderTrigger={({ toggle }) => (
        <HansButton
          label="Open popup"
          buttonColor="primary"
          buttonVariant="outline"
          onClick={toggle}
        />
      )}
    >
      <ul className="p-2">
        <li className="px-3 py-2">Item 1</li>
        <li className="px-3 py-2">Item 2</li>
        <li className="px-3 py-2">Item 3</li>
      </ul>
    </HansPopup>
  );
};

export const Primary: Story = {
  render: () => <PopupDemo />,
};

export const CustomContent: Story = {
  render: () => <CustomContentExample />,
};

const CustomContentExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <HansPopup
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      popupBackgroundColor="var(--base-neutral-color)"
      renderTrigger={({ toggle }) => (
        <HansButton
          label="Custom content"
          buttonColor="secondary"
          buttonVariant="outline"
          onClick={toggle}
        />
      )}
    >
      <div className="p-3 flex flex-col gap-2">
        <strong>Custom area</strong>
        <p>You can render any content here.</p>
      </div>
    </HansPopup>
  );
};
