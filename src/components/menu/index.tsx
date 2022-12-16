import { Popover, useTheme } from '@geist-ui/core';
import type React from 'react';

interface MenuProps {
  children?: React.ReactNode
  content?: React.ReactNode
  itemWidth?: number
  style?: React.CSSProperties
}

export const Menu = (props: MenuProps) => {
  const theme = useTheme();

  return (
    <Popover
      style={{ display: 'flex', ...props.style }}
      placement="bottomEnd"
      disableItemsAutoClose
      content={
        <div
          style={{ minWidth: `${props.itemWidth || 150}px` }}
          className={`hover-children:bg-${theme.palette.accents_1}`}
        >
          {props.content}
        </div>
      }
    >
      <span className="cursor-pointer inline-flex">{props.children}</span>
    </Popover>
  );
};

export const MenuItem = Popover.Item;
