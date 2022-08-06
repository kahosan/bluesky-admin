import { useCallback } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { Modal, Text } from '@geist-ui/core';

import { LoginPage } from '@/pages/login';
import { NotFoundError } from '@/pages/404';

// Flex Page
import { FlexIndex } from '@/pages/flex/index';

// Company Page

import { CompanyIndex } from '@/pages/company';

import { useFlexApiToken } from '@/hooks/use-flex-api-token';
import { useIsCompany } from '@/hooks/use-is-company';

const ProtectedRoute = ({
  children,
  isCompany,
}: {
  children: JSX.Element;
  isCompany: string | null;
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const flexToken = useFlexApiToken()[0];

  const abortJump = useCallback(() => {
    setTimeout(() => navigate('/login'), 3000);
    return (
      <Modal visible={true}>
        <Modal.Title>没有权限</Modal.Title>
        <Modal.Content className="!text-center">
          <Text p>三秒后将跳转到登入页面</Text>
        </Modal.Content>
      </Modal>
    );
  }, [location]);

  // 如果是是 flex 用户，则不允许进入公司页面
  if (!isCompany && /company/.test(location.pathname)) {
    return abortJump();
  } else if (!flexToken && /flex/.test(location.pathname)) {
    return abortJump();
  }

  return children;
};

export const Routers = () => {
  const isCompany = useIsCompany()[0];

  return (
    <Routes>
      <Route
        path="/flex/index"
        element={
          <ProtectedRoute isCompany={isCompany}>
            <FlexIndex />
          </ProtectedRoute>
        }
      />

      <Route
        path="/company/index"
        element={
          <ProtectedRoute isCompany={isCompany}>
            <CompanyIndex />
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundError title="This page could not be found." />} />
    </Routes>
  );
};
