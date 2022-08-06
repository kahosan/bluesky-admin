import { Button, Input, Link, Note, Spacer, Tabs, Text } from '@geist-ui/core';
import Tool from '@geist-ui/icons/tool';

import { Helmet } from 'react-helmet-async';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { CompanyUserResponse, FlexUserResponse } from '@/types/user';

import { fetcherWithLoginForCompany, fetcherWithLoginForFlex } from '@/lib/fetcher';

import { useFlexApiToken } from '@/hooks/use-flex-api-token';
import { useToasts } from '@/hooks/use-toasts';
import { useIsCompany } from '@/hooks/use-is-company';

import { FlexLogo } from '@/components/flex-brand';
import { Container } from '@/components/container';

const FlexForm = () => {
  const [, setToken] = useFlexApiToken();

  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  const navigate = useNavigate();

  const [isLodding, setIslodding] = useState(false);

  const { setToast } = useToasts();

  const trimmedData = useMemo(() => {
    return {
      client_id: clientId.trim(),
      client_secret: clientSecret.trim(),
    };
  }, [clientId, clientSecret]);

  const login = useCallback(
    async ({ client_id, client_secret }: { client_id: string; client_secret: string }) => {
      const handleLoginError = () => {
        setIslodding(false);
        setToken(null);

        setToast({
          type: 'error',
          text: '登入错误 请检查输入的 client_id 和 client_secret',
          delay: 5000,
        });
      };

      try {
        setIslodding(true);

        const resp = await fetcherWithLoginForFlex<FlexUserResponse>(client_id, client_secret);

        if (resp.access_token) {
          setToken(resp.access_token);

          setToast({
            type: 'success',
            text: '登入成功',
            delay: 3000,
          });

          navigate('/flex/device');
        } else {
          handleLoginError();
        }
      } catch {
        handleLoginError();
      }
    },
    []
  );

  const handleClick = useCallback(() => {
    login({ ...trimmedData });
  }, [login, trimmedData]);

  return (
    <div>
      <Input
        width="100%"
        placeholder="请输入 client_id"
        onChange={e => setClientId(e.target.value)}
        type="default"
      >
        <Text small>
          <Link
            href="https://docs.flexem.net/fbox/zh-cn/tutorials/Login.html"
            target="_blank"
            rel="noopener noreferrer"
            icon
            color
          >
            https://docs.flexem.net/fbox/zh-cn/tutorials/Login.html
          </Link>
        </Text>
      </Input>
      <Spacer />
      <Input
        width="100%"
        placeholder="请输入 client_secret"
        onChange={e => setClientSecret(e.target.value)}
        type="default"
      />
      <Spacer />
      <Button
        width="100%"
        type="secondary-light"
        loading={isLodding}
        disabled={trimmedData.client_id + trimmedData.client_secret === ''}
        onClick={handleClick}
      >
        登入
      </Button>
    </div>
  );
};

const CompanyForm = () => {
  const [, setIsCompany] = useIsCompany();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [isLodding, setIslodding] = useState(false);

  const navigate = useNavigate();
  const { setToast } = useToasts();

  const trimmedData = useMemo(() => {
    return {
      username: username.trim(),
      password: password.trim(),
    };
  }, [username, password]);

  const login = useCallback(
    async ({ username, password }: { username: string; password: string }) => {
      const handleLoginError = () => {
        setIslodding(false);

        setToast({
          type: 'error',
          text: '登入错误 请检查输入的用户名和密码',
          delay: 5000,
        });
      };

      try {
        setIslodding(true);

        const resp = await fetcherWithLoginForCompany<CompanyUserResponse>(username, password);

        if (resp.msg) {
          setIsCompany('yes');

          setToast({
            type: 'success',
            text: '登入成功',
            delay: 3000,
          });

          navigate('/company/index');
        } else {
          handleLoginError();
        }
      } catch {
        handleLoginError();
      }
    },
    []
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

const LoginForm = ({ isCompany }: { isCompany: boolean }) => {
  return (
    <div>
      {isCompany ? <CompanyForm /> : <FlexForm />}
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
                <FlexLogo size="15" />
                Flex
              </>
            }
            value="1"
          >
            <LoginForm isCompany={false} />
          </Tabs.Item>
          <Tabs.Item
            label={
              <>
                <Tool size="15" />
                Company
              </>
            }
            value="2"
          >
            <LoginForm isCompany={true} />
          </Tabs.Item>
        </Tabs>
      </div>
    </Container>
  );
};
