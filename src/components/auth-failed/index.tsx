import { Modal, Text } from '@geist-ui/core';
import { useNavigate } from 'react-router-dom';
export const AuthFailed = () => {
  const navigate = useNavigate();
  setTimeout(() => navigate('/login'), 3000);

  return (
    <Modal visible={true}>
      <Modal.Title>没有权限</Modal.Title>
      <Modal.Content className="!text-center">
        <Text p>三秒后将跳转到登入页面</Text>
      </Modal.Content>
    </Modal>
  );
};
