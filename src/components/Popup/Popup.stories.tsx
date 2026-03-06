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

const PopupList = ({
  label,
  color,
  variant,
}: {
  label: string;
  color: 'base' | 'primary' | 'secondary';
  variant: 'outline' | 'default' | 'strong';
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <HansPopup
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      renderTrigger={({ toggle }) => (
        <HansButton
          label={label}
          buttonColor={color}
          buttonVariant={variant}
          onClick={toggle}
        />
      )}
    >
      <ul className="p-4 flex flex-col gap-2">
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
    </HansPopup>
  );
};

export const Primary: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <PopupList label="Open popup 1" color="base" variant="outline" />
      <PopupList label="Open popup 2" color="primary" variant="default" />
      <PopupList label="Open popup 3" color="secondary" variant="strong" />
    </div>
  ),
};

export const CustomContent: Story = {
  render: () => <CustomContentExample />,
};

const CustomContentExample = () => {
  const [isOpenA, setIsOpenA] = useState(false);
  const [isOpenB, setIsOpenB] = useState(false);
  const [isOpenC, setIsOpenC] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <HansPopup
        isOpen={isOpenA}
        onOpenChange={setIsOpenA}
        popupBackgroundColor="var(--base-neutral-color)"
        renderTrigger={({ toggle }) => (
          <HansButton
            label="Custom content 1"
            buttonColor="primary"
            buttonVariant="outline"
            onClick={toggle}
          />
        )}
      >
        <div className="p-4 flex flex-col gap-2">
          <strong>Custom area</strong>
          <p>You can render any content here.</p>
        </div>
      </HansPopup>
      <HansPopup
        isOpen={isOpenB}
        onOpenChange={setIsOpenB}
        popupBackgroundColor="var(--white)"
        renderTrigger={({ toggle }) => (
          <HansButton
            label="Custom content 2"
            buttonColor="secondary"
            buttonVariant="default"
            onClick={toggle}
          />
        )}
      >
        <div className="p-4 flex flex-col gap-3">
          <strong>Quick actions</strong>
          <button type="button" className="text-left">
            Edit profile
          </button>
          <button type="button" className="text-left">
            Invite team
          </button>
        </div>
      </HansPopup>
      <HansPopup
        isOpen={isOpenC}
        onOpenChange={setIsOpenC}
        renderTrigger={({ toggle }) => (
          <HansButton
            label="Custom content 3"
            buttonColor="success"
            buttonVariant="strong"
            onClick={toggle}
          />
        )}
      >
        <div className="p-4 flex flex-col gap-2">
          <strong>Status</strong>
          <span>All systems operational.</span>
        </div>
      </HansPopup>
    </div>
  );
};

export const NoContent: Story = {
  render: () => <NoContentExample />,
};

const NoContentExample = () => {
  const [openA, setOpenA] = useState(false);
  const [openB, setOpenB] = useState(false);
  const [openC, setOpenC] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <HansPopup
        isOpen={openA}
        onOpenChange={setOpenA}
        renderTrigger={({ toggle }) => (
          <HansButton label="No content 1" onClick={toggle} />
        )}
      >
        {null}
      </HansPopup>
      <HansPopup
        isOpen={openB}
        onOpenChange={setOpenB}
        renderTrigger={({ toggle }) => (
          <HansButton
            label="No content 2"
            buttonColor="primary"
            buttonVariant="default"
            onClick={toggle}
          />
        )}
      >
        {null}
      </HansPopup>
      <HansPopup
        isOpen={openC}
        onOpenChange={setOpenC}
        renderTrigger={({ toggle }) => (
          <HansButton
            label="No content 3"
            buttonColor="secondary"
            buttonVariant="strong"
            onClick={toggle}
          />
        )}
      >
        {null}
      </HansPopup>
    </div>
  );
};
