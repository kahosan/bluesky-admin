import { Route, Routes } from 'react-router-dom';

import { ProtectedLayoutForCo } from './protected-router';

import { LoginPage } from '@/pages/login';
import { NotFoundError } from '@/pages/404';

import { EzvizPage } from '@/pages/ezviz';

import { useToken } from '@/hooks/use-token';

import { AuthFailed } from '@/components/auth-failed';

export const Routers = () => {
  const isLogin = useToken()[0];

  return (
    <Routes>
      <Route path="/" element={isLogin ? <EzvizPage /> : <AuthFailed />} />
      <Route element={<ProtectedLayoutForCo />}>
        <Route path="/ezviz" element={<EzvizPage />} />
      </Route>

      <Route path="/login" element={isLogin ? <EzvizPage /> : <LoginPage />} />

      <Route path="*" element={<NotFoundError title="This page could not be found." />} />
    </Routes>
  );
};
