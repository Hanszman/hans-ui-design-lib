import React from 'react';
import type { HansPopupOptionListProps } from './PopupOptionList.types';

export const HansPopupOptionList = React.memo((props: HansPopupOptionListProps) => {
  const {
    as = 'ul',
    id,
    className = '',
    role = 'listbox',
    hasItems,
    emptyText,
    emptyClassName = 'hans-popup-option-list-empty',
    emptyAs = 'li',
    onMouseLeave,
    children,
  } = props;

  const emptyNode =
    emptyAs === 'div' ? (
      <div className={emptyClassName}>{emptyText}</div>
    ) : (
      <li className={emptyClassName}>{emptyText}</li>
    );

  if (as === 'none') {
    return <>{hasItems ? children : emptyNode}</>;
  }

  if (as === 'div') {
    return (
      <div id={id} className={className} role={role} onMouseLeave={onMouseLeave}>
        {hasItems ? children : emptyNode}
      </div>
    );
  }

  return (
    <ul id={id} className={className} role={role} onMouseLeave={onMouseLeave}>
      {hasItems ? children : emptyNode}
    </ul>
  );
});

HansPopupOptionList.displayName = 'HansPopupOptionList';
