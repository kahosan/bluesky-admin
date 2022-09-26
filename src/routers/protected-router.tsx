import { Outlet } from 'react-router-dom';

import { useToken } from '@/hooks/use-token';

import { AuthFailed } from '@/components/auth-failed';

export const ProtectedLayout = () => {
  const token = useToken()[0];

  if (token) { return <Outlet />; }

  return <AuthFailed />;
};
