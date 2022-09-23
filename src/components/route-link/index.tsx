import React from 'react';
import { Link } from 'react-router-dom';

export const RouteLink = ({ to, children }: { to: string; children?: React.ReactNode }) => {
  return <Link className="color-inherit link" to={to}>{children}</Link>;
};
