import { Modal, Text } from '@geist-ui/core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthFailed = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => navigate('/login'), 3000);
  });

  return (
    <Modal visible>
      <Modal.Title>没有权限</Modal.Title>
      <Modal.Content className="!text-center">
        <Text p>三秒后将跳转到登入页面</Text>
      </Modal.Content>
    </Modal>
  );
};
