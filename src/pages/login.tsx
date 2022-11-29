import { Button, Input, Note, Spacer, Tabs, Text } from '@geist-ui/core';

import { Helmet } from 'react-helmet-async';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { UserResponse } from '@/types/user';

import { useToasts } from '@/hooks/use-toasts';
import { useToken } from '@/hooks/use-token';

import { Container } from '@/components/container';

const CompanyForm = () => {
  const [, setToken] = useToken();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [isLodding, setIslodding] = useState(false);

  const navigate = useNavigate();
  const { setToast } = useToasts();

  const trimmedData = useMemo(
    () => ({
      username: username.trim(),
      password: password.trim()
    }),
    [username, password]
  );

  const login = useCallback(
    async ({ username, password }: { username: string; password: string }) => {
      const handleLoginError = (errMessage?: string) => {
        setIslodding(false);

        setToast({
          type: 'error',
          text: errMessage || '登入错误 请检查输入的用户名和密码',
          delay: 5000
        });
      };

      let errMessage = '';
      try {
        const resp = await fetch('/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password }),
          credentials: 'same-origin'
        });
        const data = await resp.json() as UserResponse;

        if (!resp.ok) {
          errMessage = data.message;
          throw new Error(errMessage);
        }

        setIslodding(true);
        if (data.message) {
          setToken('success login');

          setToast({
            type: 'success',
            text: '登入成功',
            delay: 2000
          });

          navigate('/', { replace: true });
        } else {
          handleLoginError();
        }
      } catch (e) {
        handleLoginError(errMessage);
      }
    },
    [navigate, setToken, setToast]
  );

  const handleClick = useCallback(() => {
    login({ ...trimmedData });
  }, [login, trimmedData]);

  return (
    <div>
      <Input
        width="100%"
        placeholder="请输入用户名"
        onChange={e => setUsername(e.target.value)}
        type="default"
      />
      <Spacer />
      <Input.Password
        width="100%"
        placeholder="请输入密码"
        onChange={e => setPassword(e.target.value)}
        type="default"
        onKeyDown={e => e.key === 'Enter' && handleClick()}
      />
      <Spacer />
      <Button
        width="100%"
        type="secondary-light"
        loading={isLodding}
        disabled={trimmedData.username + trimmedData.password === ''}
        onClick={handleClick}
      >
        登入
      </Button>
    </div>
  );
};

const LoginForm = () => {
  return (
    <div>
      <CompanyForm />
      <Spacer />
      <Note type="default" w="100%">
        <Text p>可在线查看萤石云摄像头画面以及查看/修改物联网关监控点</Text>
      </Note>
    </div>
  );
};

export const LoginPage = () => {
  return (
    <>
      <Helmet>
        <title>登入</title>
      </Helmet>
      <Container maxWidth="37rem">
        <div className="h-[calc(100vh-200px)] flex justify-center  flex-col">
          <Helmet>
            <title>Log in</title>
          </Helmet>
          <Text h2 className="mx-auto">
            Bluesky Tools
          </Text>
          <Tabs initialValue="1" hideDivider>
            <Tabs.Item
              label="用户名登入"
              value="1"
            >
              <LoginForm />
            </Tabs.Item>
          </Tabs>
        </div>
      </Container>
    </>
  );
};
