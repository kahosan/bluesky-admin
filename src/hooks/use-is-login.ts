import { useFlexApiToken } from './use-flex-api-token';
import { useIsCompany } from './use-is-company';

export const useIsLogin = () => {
  const [ct] = useIsCompany();
  const [ft] = useFlexApiToken();
  const isLogin = ct || ft;

  return isLogin;
};
