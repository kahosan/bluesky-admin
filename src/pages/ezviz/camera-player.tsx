import { Button, Loading, Modal, Tooltip, useModal, useTheme } from '@geist-ui/core';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import ReactPlayer from 'react-player';

import { Helmet } from 'react-helmet-async';
import { NotFoundError } from '../404';

import { Layout } from '@/components/layout';
import { Breadcrumbs } from '@/components/bread-crumbs';

import { useCameraLive } from '@/pages/ezviz/hooks/use-camera-live';
import { useToasts } from '@/hooks/use-toasts';
import { useTrigger } from '@/hooks/use-trigger';

import type { DefaultResp } from '@/types/ezviz';

// 不是所有浏览器都支持 captureStream
type IHTMLVideoElement = HTMLVideoElement & { captureStream(): MediaStream };

const ControlMenu = (props: { deviceSerial: string; reactPlayer: ReactPlayer | null }) => {
  const { setToast } = useToasts();

  const { setVisible, bindings } = useModal();
  const [encrypt, setEncrypt] = useState(false);

  const [recording, setRecording] = useState(false);
  const recordChunksRef = useRef<Blob[]>([]);
  const recorderRef = useRef<MediaRecorder>();

  const { trigger: onEncryptTrigger } = useTrigger<DefaultResp>('/api/camera/ezviz/encrypt/on?');
  const { trigger: offEncryptTrigger } = useTrigger<DefaultResp>('/api/camera/ezviz/encrypt/off?');

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

  const download = (name: string, url: string) => {
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', name);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(() => {
    if (props.reactPlayer && !recorderRef.current && props.reactPlayer.getInternalPlayer()) {
      const videoInstance = props.reactPlayer.getInternalPlayer() as IHTMLVideoElement;
      const stream = videoInstance.captureStream();
      recorderRef.current = new MediaRecorder(stream);
    }

    if (recorderRef.current) {
      recorderRef.current.onstop = () => {
        const blob = new Blob(recordChunksRef.current);
        const url = URL.createObjectURL(blob);
        download(`${props.deviceSerial}.mp4`, url);

        URL.revokeObjectURL(url);
        recordChunksRef.current = [];
        recorderRef.current = undefined;
      };

      recorderRef.current.onerror = () => {
        setToast({
          text: '录像不可用，请联系管理员',
          type: 'error',
          delay: 4000
        });

        recordChunksRef.current = [];
        recorderRef.current = undefined;
      };
    }
  }, [props.deviceSerial, props.reactPlayer, recorderRef, setToast]);

  const handleRecord = useCallback(() => {
    if (!props.reactPlayer || !recorderRef.current) {
      setToast({
        type: 'error',
        text: '录像不可用，请联系管理员',
        delay: 4000
      });

      return;
    }

    const videoInstance = props.reactPlayer.getInternalPlayer() as IHTMLVideoElement;

    if (recording) {
      setRecording(false);

      videoInstance.captureStream().getTracks().forEach(track => track.stop());
      recorderRef.current.stop();
      videoInstance.pause();

      setToast({
        text: '录制完成，请点击下载按钮',
        type: 'success',
        delay: 3000
      });
      return;
    }

    try {
      if (!videoInstance.paused) {
        setToast({
          type: 'error',
          text: '请先暂停视频',
          delay: 3000
        });
        return;
      }

      setRecording(true);
      setToast({
        text: '开始录制',
        type: 'success',
        delay: 3000
      });

      recorderRef.current.ondataavailable = (e) => {
        recordChunksRef.current.push(e.data);
      };

      videoInstance.play();
      recorderRef.current.start();
    } catch (e) {
      setRecording(false);
      setToast({
        type: 'error',
        text: '录制失败 请联系管理员',
        delay: 3000
      });
    }
  }, [props.reactPlayer, recording, setToast, recorderRef]);

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
