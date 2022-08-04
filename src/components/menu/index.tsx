import { Popover, useTheme } from '@geist-ui/core';
import React from 'react';

interface MenuProps {
  children?: React.ReactNode;
  content?: React.ReactNode;
  itemWidth?: number;
  style?: React.CSSProperties;
}

export const Menu = (props: MenuProps) => {
  const theme = useTheme();

  return (
    <Popover
      style={{ display: 'flex', ...props.style }}
      placement="bottomEnd"
      content={
        <div
          style={{ '--menu-item-hover-color': theme.palette.accents_1 }}
          className={`min-w-[150px] child-hover:bg-menu-item-hover-color child-hover:!cursor-pointer`}
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
