import { Button, Loading, useTheme } from '@geist-ui/core';

import { useParams, useSearchParams } from 'react-router-dom';

import ReactPlayer from 'react-player';

import { NotFoundError } from '../404';

import { Layout } from '@/components/layout';
import { Breadcrumbs } from '@/components/bread-crumbs';

import { useCameraLive } from '@/hooks/use-camera-live';

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
          <Button type="secondary-light" auto>解密视频</Button>
          <Button type="secondary-light" auto>加密视频</Button>
          <Button type="secondary-light" auto>开始录像</Button>
          <Button type="secondary-light" auto>查看回放</Button>
        </div>
      </div>
    </Layout>
  );
};
