import { Navigate, Route, Routes } from 'react-router-dom';

import { ProtectedLayoutForCo, ProtectedLayoutForFlex } from './protected-router';

import { LoginPage } from '@/pages/login';
import { NotFoundError } from '@/pages/404';

// Flex Page
import { FlexIndex } from '@/pages/flex';

// Company Page
import { CompanyIndex } from '@/pages/company';

import { useIsCompany } from '@/hooks/use-is-company';
import { useIsLogin } from '@/hooks/use-is-login';

import { AuthFailed } from '@/components/auth-failed';

const Redirect = () => {
  const isCompany = useIsCompany()[0];

  if (isCompany) {
    return <Navigate to="/company/index" />;
  } else {
    return <Navigate to="/flex/index" />;
  }
};

export const Routers = () => {
  const isLogin = useIsLogin();

  return (
    <Routes>
      <Route path="/" element={isLogin ? <Redirect /> : <AuthFailed />} />
      <Route element={<ProtectedLayoutForFlex />}>
        <Route path="/flex/index" element={<FlexIndex />} />
      </Route>
      <Route element={<ProtectedLayoutForCo />}>
        <Route path="/company/index" element={<CompanyIndex />} />
      </Route>

      <Route path="/login" element={isLogin ? <Redirect /> : <LoginPage />} />

      <Route path="*" element={<NotFoundError title="This page could not be found." />} />
    </Routes>
  );
};
