import { Button, Input, Note, Spacer, Tabs, Text } from '@geist-ui/core';
import Tool from '@geist-ui/icons/tool';

import { Helmet } from 'react-helmet-async';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { HTTPError } from '@/lib/fetcher';

import type { UserResponse } from '@/types/user';

import { useToasts } from '@/hooks/use-toasts';
import { useToken } from '@/hooks/use-token';

import { Container } from '@/components/container';

const CompanyForm = () => {
  const [, setIsCompany] = useToken();

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
      const handleLoginError = () => {
        setIslodding(false);

        setToast({
          type: 'error',
          text: '登入错误 请检查输入的用户名和密码',
          delay: 5000
        });
      };

      async function fetcher<UserResponse>(username: string, password: string): Promise<UserResponse> {
        const res = await fetch(new URL('/login', 'http://localhost:8080'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password }),
          credentials: 'include'
        });
        const data = await res.json();

        if (!res.ok) {
          throw new HTTPError(
            data.message || 'An error occurred while fetching the data',
            data,
            res.status
          );
        }

        return data;
      }

      setIslodding(true);
      setTimeout(async () => {
        try {
          const resp: UserResponse = await fetcher(username, password);
          if (resp.msg) {
            setIsCompany('yes');

            setToast({
              type: 'success',
              text: '登入成功',
              delay: 2000
            });

            navigate('/');
          } else {
            handleLoginError();
          }
        } catch (e) {
          handleLoginError();
        }
      }, 2000);
    },
    [navigate, setIsCompany, setToast]
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
      <Note type="warning" w="100%">
        <Text p>您的 API 令牌只会存储在本地浏览器中</Text>
      </Note>
    </div>
  );
};

export const LoginPage = () => {
  return (
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
            label={
              <>
                <Tool size="15" />
                Company
              </>
            }
            value="1"
          >
            <LoginForm />
          </Tabs.Item>
        </Tabs>
      </div>
    </Container>
  );
};
