import { Button, Loading, Modal, useModal, useTheme } from '@geist-ui/core';

import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import ReactPlayer from 'react-player';

import { Helmet } from 'react-helmet-async';
import { NotFoundError } from '../404';

import { Layout } from '@/components/layout';
import { Breadcrumbs } from '@/components/bread-crumbs';

import { useCameraLive } from '@/hooks/use-camera-live';
import { useToasts } from '@/hooks/use-toasts';
import { useTrigger } from '@/hooks/use-trigger';

import type { HTTPError } from '@/lib/fetcher';
import type { DefaultResp } from '@/types/ezviz';

const ControlMenu = (props: { deviceSerial: string }) => {
  const { setToast } = useToasts();

  const { setVisible, bindings } = useModal();
  const [encrypt, setEncrypt] = useState(false);

  const { trigger: onEncryptTrigger } = useTrigger<DefaultResp, HTTPError>('/api/camera/ezviz/encrypt/on?');
  const { trigger: offEncryptTrigger } = useTrigger<DefaultResp, HTTPError>('/api/camera/ezviz/encrypt/off?');

  const onEncryptHandler = async () => {
    setVisible(false);
    const data = await onEncryptTrigger({ deviceSerial: props.deviceSerial });

    if (data?.code === '200') {
      setToast({
        text: data?.msg || '加密成功',
        type: 'success',
        delay: 3000
      });
    } else {
      setToast({
        text: data?.msg || '加密失败',
        type: 'error',
        delay: 3000
      });
    }
  };

  const offEncryptHandler = async () => {
    setVisible(false);
    const data = await offEncryptTrigger({ deviceSerial: props.deviceSerial });

    if (data?.code === '200') {
      setToast({
        text: `${data?.msg || '解密成功'} 请刷新网页`,
        type: 'success',
        delay: 3000
      });
    } else {
      setToast({
        text: data?.msg || '解密失败',
        type: 'error',
        delay: 3000
      });
    }
  };

  const modalType = (type: 'encrypt' | 'decrypt') => {
    setEncrypt(type === 'encrypt');
    setVisible(true);
  };

  return (
    <>
      <Button type="secondary-light" auto onClick={() => { modalType('decrypt'); }}>解密视频</Button>
      <Button type="secondary-light" auto onClick={() => { modalType('encrypt'); }}>加密视频</Button>
      <Button type="secondary-light" auto>开始录像</Button>
      <Button type="secondary-light" auto>查看回放</Button>
      <Modal {...bindings}>
        <Modal.Title>提示</Modal.Title>
        <Modal.Content>
          <p>确定要{encrypt ? '开启' : '关闭'}加密吗？</p>
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>取消</Modal.Action>
        <Modal.Action onClick={encrypt ? onEncryptHandler : offEncryptHandler}>确定</Modal.Action>
      </Modal>
    </>
  );
};

export const CameraPlayer = () => {
  const theme = useTheme();

  const { deviceSerial } = useParams<{ deviceSerial: string }>();
  const [searchParams] = useSearchParams();
  const deviceName = searchParams.get('deviceName');
  const channelNo = searchParams.get('channelNo');

  const { data, error } = useCameraLive(
    `/api/camera/ezviz/live?deviceSerial=${deviceSerial}&protocol=${4}&quality=${1}&channelNo=${channelNo || '1'}`
  );

  return (
    <>
      <Helmet>
        <title>{deviceName || '摄像头'}</title>
      </Helmet>
      <Layout name="cameraPlay">
        <div className="mb-4 flex justify-between">
          <Breadcrumbs
            items={[
              { text: 'Home', id: 'home', href: '/' },
              { text: 'Ezviz', id: 'ezviz', href: '/ezviz' },
              { text: deviceSerial, id: 'ezviz-camera-play' }
            ]}
          />
          <h3 className="my-auto mr-5">{deviceName}</h3>
        </div>
        <div
          style={{
            padding: '1.25rem',
            background: theme.palette.accents_1,
            borderRadius: '10px'
          }}
          className="flex flex-col md:flex-row"
        >
          <div className="w-100% relative">
            {
              error || (data ? data.code !== '200' : undefined)
                ? <NotFoundError title="加载错误" height="h-70" />
                : data
                  ? (
                    <ReactPlayer
                      url={data.data.url}
                      controls
                      playing
                      width="100%"
                      height="auto"
                      playsinline
                    />
                  )
                  : <Loading className="h-70" />
            }
          </div>
          <div
            style={{
              background: theme.palette.accents_2,
              borderRadius: '10px'
            }}
            className="md:ml-6 flex flex-wrap justify-around md:flex-col lt-md:mt-2 lt-md:!children:m-1 px-5 py-2"
          >
            <ControlMenu deviceSerial={deviceSerial || ''} />
          </div>
        </div>
      </Layout>
    </>
  );
};
