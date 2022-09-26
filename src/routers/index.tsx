import { Navigate, Route, Routes } from 'react-router-dom';

import { ProtectedLayout } from './protected-router';

import { LoginPage } from '@/pages/login';
import { NotFoundError } from '@/pages/404';

import { EzvizPage } from '@/pages/ezviz';
import { CameraPlayer } from '@/pages/ezviz/camera-player';

import { useToken } from '@/hooks/use-token';

import { AuthFailed } from '@/components/auth-failed';

export const Routers = () => {
  const isLogin = useToken()[0];

  return (
    <Routes>
      <Route path="/" element={isLogin ? <Navigate to="/ezviz" /> : <AuthFailed />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/ezviz" element={<EzvizPage />} />
        <Route path="/ezviz/live/:deviceSerial" element={<CameraPlayer />} />
      </Route>
      <Route path="login" element={isLogin ? <Navigate to="/ezviz" /> : <LoginPage />} />
      <Route path="*" element={<NotFoundError title="This page could not be found." />} />
    </Routes>
  );
};
