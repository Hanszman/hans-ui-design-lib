import type React from 'react';

export type HansPopupItemListProps = {
  as?: 'ul' | 'div' | 'none';
  id?: string;
  className?: string;
  role?: 'listbox' | 'menu';
  hasItems: boolean;
  emptyText: string;
  emptyClassName?: string;
  emptyAs?: 'li' | 'div';
  onMouseLeave?: () => void;
  children?: React.ReactNode;
};
