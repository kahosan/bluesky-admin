import { Outlet } from 'react-router-dom';

import { useFlexApiToken } from '@/hooks/use-flex-api-token';
import { useIsCompany } from '@/hooks/use-is-company';

import { AuthFailed } from '@/components/auth-failed';

export const ProtectedLayoutForFlex = () => {
  const token = useFlexApiToken()[0];

  if (token) {
    return <Outlet />;
  }

  return <AuthFailed />;
};

export const ProtectedLayoutForCo = () => {
  const token = useIsCompany()[0];

  if (token) {
    return <Outlet />;
  }

  return <AuthFailed />;
};
