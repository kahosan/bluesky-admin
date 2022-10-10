import { Button, Divider, Loading, Tooltip } from '@geist-ui/core';
import { Edit } from '@geist-ui/icons';

import { useCallback } from 'react';
import { Link } from 'react-router-dom';

import { useEzvizList } from '@/hooks/use-ezviz-list';

import { EzvizTable } from '@/pages/ezviz/components/ezviz-table';

import type { EzvizNVRCameraListResp, EzvizTableData } from '@/types/ezviz';

const NVRTableColumns = [
  {
    prop: 'deviceSerial',
    label: '设备序列号',
    width: 120
  },
  {
    prop: 'channelName',
    label: '通道名称',
    width: 230
  },
  {
    prop: 'addTime',
    label: '添加时间',
    width: 150
  },
  {
    prop: 'status',
    label: '在线状态',
    width: 180
  },
  {
    prop: 'play',
    label: '视频播放方式'
  }
];

export const NVRTables = (props: { deviceSerial: string; status: JSX.Element; addTime: string }) => {
  const { data, error, mutate } = useEzvizList<EzvizNVRCameraListResp>(`/api/camera/ezviz/list/channel?deviceSerial=${props.deviceSerial}`);

  // 序列化 data 数据
  const serializationData = useCallback((
    ezvizList: EzvizTableData[]
  ): EzvizTableData[] => {
    return ezvizList?.map(item => ({
      ...item,
      deviceSerial: (
        <span className="my-2 flex flex-col items-start">
          {item.deviceSerial}
        </span>
      ),
      channelName: (
        <>
          {item.channelName}
          <Tooltip text="暂不支持更改通道名" font="13px"><Edit
            size={12}
            className="ml-2 cursor-pointer"
          /></Tooltip>
        </>
      ),
      addTime: props.addTime,
      status: props.status,
      play: (
        <Link to={`/ezviz/live/${item.deviceSerial}?${new URLSearchParams({ deviceName: item.deviceName as string, channelNo: item.channelNo ?? '1' })}`}>
          <Button scale={0.6} auto>点击播放</Button>
        </Link>
      )
    }));
  }, [props.addTime, props.status]);

  return (
    <div
      className="max-h-0"
      id={`nvr-${props.deviceSerial}`}
    >
      {
        error || (data ? data.code !== '200' : undefined)
          ? <div className="h-4rem flex justify-center items-center">加载错误，请联系管理员</div>
          : data
            ? (
              <div className="w-95% mx-auto">
                <EzvizTable
                  serializationFn={serializationData}
                  data={data.data}
                  columns={NVRTableColumns}
                  update={newData => mutate({ ...data, data: newData }, false)}
                  TableRowClassNameHandler={(rowData: EzvizTableData) => rowData.className ?? ''}
                />
                <Divider />
              </div>
            )
            : <div className="h-5rem"><Loading /></div>
      }
    </div>
  );
};
