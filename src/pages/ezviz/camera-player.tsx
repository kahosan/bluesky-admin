import { Button, Loading, Modal, Tooltip, useTheme } from '@geist-ui/core';

import { useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import ReactPlayer from 'react-player';

import { Helmet } from 'react-helmet-async';
import { NotFoundError } from '../404';

import { useRecorder } from './hooks/use-recorder';
import { useControlMenuAction } from './hooks/use-control-menu-action';
import { Layout } from '@/components/layout';
import { Breadcrumbs } from '@/components/bread-crumbs';

import { useCameraLive } from '@/pages/ezviz/hooks/use-camera-live';

const ControlMenu = (props: { deviceSerial: string; reactPlayer: ReactPlayer | null }) => {
  const [encrypt, setEncrypt] = useState(false);

  const { setVisible, bindings, onEncryptHandler, offEncryptHandler } = useControlMenuAction(props.deviceSerial);

  const { recording, handleRecord } = useRecorder(props.reactPlayer, props.deviceSerial);

  const modalType = (type: 'encrypt' | 'decrypt') => {
    setEncrypt(type === 'encrypt');
    setVisible(true);
  };

  const tipText = '录像前，请先停止播放再点击开始录像';

  return (
    <>
      <Button type="secondary-light" auto onClick={() => modalType('decrypt')}>解密视频</Button>
      <Button type="secondary-light" auto onClick={() => modalType('encrypt')}>加密视频</Button>
      <Button type="secondary-light" auto onClick={() => handleRecord()}><Tooltip text={tipText}>{recording ? '停止录像' : '开始录像'}</Tooltip></Button>
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
    `/api/camera/ezviz/live?deviceSerial=${deviceSerial}&protocol=${2}&quality=${1}&channelNo=${channelNo || '1'}`
  );

  const reactPlayerRef = useRef<ReactPlayer>(null);

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
          <div className="w-100% md:min-h-100 relative">
            {
              error || (data ? data.code !== '200' : undefined)
                ? <NotFoundError title="加载错误" height="h-70" />
                : data
                  ? (
                    <ReactPlayer
                      ref={reactPlayerRef}
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
            <ControlMenu deviceSerial={deviceSerial || ''} reactPlayer={reactPlayerRef.current} />
          </div>
        </div>
      </Layout>
    </>
  );
};
