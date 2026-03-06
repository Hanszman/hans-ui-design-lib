import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import { HansButton } from '../Forms/Button/Button';
import { HansInput } from '../Forms/Input/Input';
import { HansIcon } from '../Icon/Icon';
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
const popupContentStyle: CSSProperties = { padding: '8px' };

const shouldToggleForKeyboard = (
  event: KeyboardEvent<HTMLElement>,
  toggle: () => void,
) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggle();
  }
};

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
      <ul
        style={popupContentStyle}
        className="m-0 list-none flex flex-col gap-2"
      >
        <li className="px-2 py-1">Item 1</li>
        <li className="px-2 py-1">Item 2</li>
        <li className="px-2 py-1">Item 3</li>
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
        <div style={popupContentStyle} className="flex flex-col gap-2">
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
        <div style={popupContentStyle} className="flex flex-col gap-3">
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
        <div style={popupContentStyle} className="flex flex-col gap-2">
          <strong>Status</strong>
          <span>All systems operational.</span>
        </div>
      </HansPopup>
    </div>
  );
};

export const TriggerElements: Story = {
  render: () => <TriggerElementsExample />,
};

const TriggerElementsExample = () => {
  const [inputOpen, setInputOpen] = useState(false);
  const [iconOpen, setIconOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <HansPopup
        isOpen={inputOpen}
        onOpenChange={setInputOpen}
        renderTrigger={({ toggle }) => (
          <div
            role="button"
            tabIndex={0}
            className="w-[260px]"
            onClick={toggle}
            onKeyDown={(event) => shouldToggleForKeyboard(event, toggle)}
          >
            <HansInput
              placeholder="Input trigger"
              inputColor="primary"
              readOnly
              value="Click to open popup"
            />
          </div>
        )}
      >
        <div style={popupContentStyle} className="flex flex-col gap-2">
          <strong>Input trigger content</strong>
          <span>Popup opened from an input trigger.</span>
        </div>
      </HansPopup>

      <HansPopup
        isOpen={iconOpen}
        onOpenChange={setIconOpen}
        renderTrigger={({ toggle }) => (
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--base-default-color)]"
            onClick={toggle}
          >
            <HansIcon name="IoMdSettings" iconSize="small" />
            <span>Icon trigger</span>
          </button>
        )}
      >
        <div style={popupContentStyle} className="flex flex-col gap-2">
          <strong>Icon trigger content</strong>
          <span>Popup opened from a custom button.</span>
        </div>
      </HansPopup>

      <HansPopup
        isOpen={customOpen}
        onOpenChange={setCustomOpen}
        renderTrigger={({ toggle }) => (
          <span
            role="button"
            tabIndex={0}
            className="underline cursor-pointer text-[var(--secondary-default-color)]"
            onClick={toggle}
            onKeyDown={(event) => shouldToggleForKeyboard(event, toggle)}
          >
            Text link trigger
          </span>
        )}
      >
        <div style={popupContentStyle} className="flex flex-col gap-2">
          <strong>Link trigger content</strong>
          <span>Popup opened from plain text trigger.</span>
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
