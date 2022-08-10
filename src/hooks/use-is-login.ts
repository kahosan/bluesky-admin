import { FLEX_API_TOKEN_KEY, IS_COMPANY_KEY } from '@/lib/constant';

export const useIsLogin = () => {
  const isLogin = localStorage.getItem(IS_COMPANY_KEY) || localStorage.getItem(FLEX_API_TOKEN_KEY);

  return isLogin;
};
