import { Button, Input, Note, Spacer, Tabs, Text } from '@geist-ui/core';

import { Helmet } from 'react-helmet-async';
import { useCallback, useMemo, useState } from 'react';

import type { FlexUserResponse } from '@/types/user';
import { fetcherWithAuthorizationOnFlex } from '@/lib/fetcher';

import { useFlexApiToken } from '@/hooks/use-flex-api-token';
import { useToasts } from '@/hooks/use-toasts';

const FlexForm = () => {
  const [, setToken] = useFlexApiToken();

  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');

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
        const resp = await fetcherWithAuthorizationOnFlex<FlexUserResponse>({
          key: '/idserver/core/connect/token',
          options: {
            scope: 'fbox',
            client_id,
            client_secret,
            grant_type: 'client_credentials',
          },
        });
        if (resp.access_token) {
          setToken(resp.access_token);

          setToast({
            type: 'success',
            text: '登入成功',
            delay: 3000,
          });
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
      />
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

const CompanyForm = () => <div></div>;

const LoginForm = ({ isCompany }: { isCompany: boolean }) => {
  return (
    <div className="">
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
    <section className="mx-auto p-8 max-w-150">
      <div className="h-[calc(100vh-200px)] flex justify-center  flex-col">
        <Helmet>
          <title>Log in</title>
        </Helmet>
        <Text h3 className="mx-auto">
          Bluesky Tools
        </Text>
        <Tabs initialValue="1">
          <Tabs.Item label="Flex" value="1">
            <LoginForm isCompany={false} />
          </Tabs.Item>
          <Tabs.Item label="Company" value="2">
            <LoginForm isCompany={true} />
          </Tabs.Item>
        </Tabs>
      </div>
    </section>
  );
};
