import { Breadcrumbs as GBreadcrumbs } from '@geist-ui/core';

import type { ReactNode } from 'react';

import { RouteLink } from '../route-link';

interface BreadCrumbsProps {
  text: ReactNode
  href?: string
  id: string
}

export const Breadcrumbs = (props: { items: BreadCrumbsProps[] }) => {
  return (
    <GBreadcrumbs>
      {props.items.map((item) => {
        if (item.href) {
          return (
            <RouteLink key={item.id} to={item.href}>
              <GBreadcrumbs.Item >{item.text}</GBreadcrumbs.Item>
            </RouteLink>
          );
        } else {
          return (
            <GBreadcrumbs.Item key={item.id}>{item.text}</GBreadcrumbs.Item>
          );
        }
      })}
    </GBreadcrumbs>
  );
};
