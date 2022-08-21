import React from 'react';
import { NavLink as RouteNavLink } from 'react-router-dom';

export const NavLink = ({ to, children }: { to: string; children?: React.ReactNode }) => <RouteNavLink to={to} style={{ color: 'inherit' }}>{children}</RouteNavLink>;
