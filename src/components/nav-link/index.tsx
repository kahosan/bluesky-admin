import React from 'react';
import { NavLink as RouteNavLink } from 'react-router-dom';

import { Link } from '@geist-ui/core';

export const NavLink = ({ to, children }: { to: string; children?: React.ReactNode }) => {
  return <Link><RouteNavLink style={{ color: 'inherit' }} to={to}>{children}</RouteNavLink></Link>;
};
