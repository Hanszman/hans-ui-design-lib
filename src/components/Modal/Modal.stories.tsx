import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { HansButton } from '../Forms/Button/Button';
import { HansInput } from '../Forms/Input/Input';
import { HansModal } from './Modal';
import DocsPage from './Modal.mdx';

const meta: Meta<typeof HansModal> = {
  title: 'Components/Modal',
  component: HansModal,
  parameters: {
    docs: { page: DocsPage },
  },
  args: {
    modalColor: 'base',
    modalVariant: 'neutral',
    modalSize: 'medium',
    placement: 'center',
    dismissible: true,
    showOverlay: true,
    closeOnBackdropClick: true,
    closeOnEscape: true,
    lockBodyScroll: true,
    showHeaderDivider: true,
    showFooterDivider: true,
    title: 'Modal title',
  },
};

export default meta;
type Story = StoryObj<typeof HansModal>;

const ModalLauncher = ({
  buttonLabel,
  modalProps,
  children,
}: {
  buttonLabel: string;
  modalProps?: Partial<React.ComponentProps<typeof HansModal>>;
  children?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-start">
      <HansButton label={buttonLabel} onClick={() => setOpen(true)} />
      <HansModal isOpen={open} onOpenChange={setOpen} {...modalProps}>
        {children}
      </HansModal>
    </div>
  );
};

const LongContent = () => (
  <div className="flex min-w-[920px] flex-col gap-4">
    <p>
      This example shows a body that can overflow vertically and horizontally
      without clipping the custom children area.
    </p>
    <div className="grid min-w-[880px] grid-cols-3 gap-3">
      {Array.from({ length: 12 }, (_, index) => (
        <div
          key={`info-card-${index + 1}`}
          className="rounded-xl border border-[var(--base-default-color)] p-4"
        >
          <strong className="block mb-2">Card {index + 1}</strong>
          <span>
            Cross-team notes, delivery dates and dependencies can live inside
            the modal body.
          </span>
        </div>
      ))}
    </div>
  </div>
);

const FormContent = () => (
  <div className="flex flex-col gap-4">
    <HansInput label="Name" placeholder="Type the full name" />
    <HansInput label="Email" placeholder="name@company.com" inputType="email" />
    <HansInput label="Role" placeholder="Product Designer" />
  </div>
);

const SummaryContent = () => (
  <div className="flex flex-col gap-3">
    <p className="m-0">
      The modal body accepts any custom structure, including descriptive text,
      grouped actions and embedded design-system components.
    </p>
    <div className="flex flex-wrap gap-3">
      <HansButton label="Primary action" buttonColor="primary" />
      <HansButton
        label="Secondary action"
        buttonColor="secondary"
        buttonVariant="outline"
      />
    </div>
  </div>
);

export const Playground: Story = {
  render: (args) => (
    <ModalLauncher
      buttonLabel="Open playground"
      modalProps={{
        ...args,
        title: args.title ?? 'Modal title',
        confirmLabel: 'Save',
        cancelLabel: 'Cancel',
      }}
    >
      <SummaryContent />
    </ModalLauncher>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <ModalLauncher
        buttonLabel="Small modal"
        modalProps={{
          title: 'Small modal',
          modalSize: 'small',
          confirmLabel: 'Ok',
        }}
      >
        <SummaryContent />
      </ModalLauncher>
      <ModalLauncher
        buttonLabel="Medium modal"
        modalProps={{
          title: 'Medium modal',
          modalSize: 'medium',
          confirmLabel: 'Ok',
        }}
      >
        <SummaryContent />
      </ModalLauncher>
      <ModalLauncher
        buttonLabel="Large modal"
        modalProps={{
          title: 'Large modal',
          modalSize: 'large',
          confirmLabel: 'Ok',
        }}
      >
        <LongContent />
      </ModalLauncher>
    </div>
  ),
};

export const Placements: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <ModalLauncher
        buttonLabel="Centered"
        modalProps={{
          title: 'Centered modal',
          placement: 'center',
          confirmLabel: 'Continue',
        }}
      >
        <SummaryContent />
      </ModalLauncher>
      <ModalLauncher
        buttonLabel="Left side"
        modalProps={{
          title: 'Left side modal',
          placement: 'left',
          modalSize: 'medium',
          confirmLabel: 'Apply',
          cancelLabel: 'Cancel',
        }}
      >
        <FormContent />
      </ModalLauncher>
      <ModalLauncher
        buttonLabel="Right side"
        modalProps={{
          title: 'Right side modal',
          placement: 'right',
          modalSize: 'large',
          confirmLabel: 'Publish',
          cancelLabel: 'Back',
        }}
      >
        <LongContent />
      </ModalLauncher>
    </div>
  ),
};

export const ColorsAndVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <ModalLauncher
        buttonLabel="Base neutral"
        modalProps={{
          title: 'Base neutral',
          modalColor: 'base',
          modalVariant: 'neutral',
          confirmLabel: 'Done',
        }}
      >
        <SummaryContent />
      </ModalLauncher>
      <ModalLauncher
        buttonLabel="Primary outline"
        modalProps={{
          title: 'Primary outline',
          modalColor: 'primary',
          modalVariant: 'outline',
          confirmLabel: 'Continue',
        }}
      >
        <FormContent />
      </ModalLauncher>
      <ModalLauncher
        buttonLabel="Secondary strong"
        modalProps={{
          title: 'Secondary strong',
          modalColor: 'secondary',
          modalVariant: 'strong',
          confirmLabel: 'Confirm',
        }}
      >
        <SummaryContent />
      </ModalLauncher>
      <ModalLauncher
        buttonLabel="Success transparent"
        modalProps={{
          title: 'Success transparent',
          modalColor: 'success',
          modalVariant: 'transparent',
          confirmLabel: 'Approve',
        }}
      >
        <SummaryContent />
      </ModalLauncher>
    </div>
  ),
};

export const SectionOptions: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <ModalLauncher
        buttonLabel="Only body"
        modalProps={{
          title: '',
          dismissible: false,
          showHeaderDivider: false,
          showFooterDivider: false,
        }}
      >
        <SummaryContent />
      </ModalLauncher>
      <ModalLauncher
        buttonLabel="Header and body"
        modalProps={{
          title: 'Header and body',
          dismissible: true,
          showHeaderDivider: true,
        }}
      >
        <FormContent />
      </ModalLauncher>
      <ModalLauncher
        buttonLabel="Body and custom footer"
        modalProps={{
          title: 'Custom footer',
          footer: (
            <div className="flex items-center gap-2">
              <span>Custom footer content</span>
            </div>
          ),
          showFooterDivider: false,
        }}
      >
        <SummaryContent />
      </ModalLauncher>
    </div>
  ),
};

export const ScrollScenarios: Story = {
  render: () => (
    <div className="flex gap-4">
      <ModalLauncher
        buttonLabel="Scrollable content"
        modalProps={{
          title: 'Scroll test',
          modalSize: 'large',
          maxBodyHeight: '320px',
          confirmLabel: 'Done',
        }}
      >
        <LongContent />
      </ModalLauncher>
    </div>
  ),
};
