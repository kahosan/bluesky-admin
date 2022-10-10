import { Button, Loading, Pagination, Tag, useTheme } from '@geist-ui/core';
import { ChevronLeftCircleFill, ChevronRightCircleFill, Edit } from '@geist-ui/icons';

import { useCallback, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

import { EzvizTable } from './components/ezviz-table';
import { EzvizTools } from './components/ezviz-tools';

import { Breadcrumbs } from '@/components/bread-crumbs';
import { Layout } from '@/components/layout';

import { useEzvizList } from '@/hooks/use-ezviz-list';

import { NotFoundError } from '@/pages/404';
import { NVRTables } from '@/pages/ezviz/components/nvr-table';

import type { TableColumns } from '@/components/data-tables/types';
import type { EzvizDeviceListResp, EzvizTableData } from '@/types/ezviz';

const EzvizTableColumns: TableColumns = [
  {
    prop: 'deviceSerial',
    label: '设备序列号',
    width: 120
  },
  {
    prop: 'deviceName',
    label: '设备名称',
    width: 230
  },
  {
    prop: 'addTime',
    label: '添加时间',
    width: 150
  },
  {
    prop: 'status',
    label: '在线状态'
  },
  {
    prop: 'play',
    label: '视频播放方式'
  }
];

const OnlineStatus = (props: { status: number }) => {
  return props.status
    ? <><span className="bg-#52c41a rounded-50% p-0.75 mr-2" />在线</>
    : <><span className="bg-#d9d9d9 rounded-50% p-0.75 mr-2" />离线</>;
};

export const EzvizPage = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);

  const { data, error, mutate } = useEzvizList<EzvizDeviceListResp>(`/api/camera/ezviz/list?pageStart=${page}`);

  const [nvrProps, setNVRProps] = useState<{ deviceSerial: string; status: JSX.Element; addTime: string }[]>([]);
  const isCreateChildTable = useRef<Record<string, boolean>>({});
  const tdRef = useRef<Record<string, HTMLDivElement>>({});

  // 为了给嵌套的表格加动画
  const channelView = useCallback((deviceSerial: string, status: JSX.Element, addTime: string) => {
    isCreateChildTable.current[deviceSerial] = isCreateChildTable.current[deviceSerial] ?? false;
    tdRef.current[deviceSerial] = tdRef.current[deviceSerial] ?? document.createElement('td');

    const handleClick = () => {
      setNVRProps([
        ...nvrProps.filter(item => item.deviceSerial !== deviceSerial),
        { deviceSerial, status, addTime }
      ]);

      if (isCreateChildTable.current[deviceSerial]) {
        const targetElement = document.querySelector(`#nvr-${deviceSerial}`);

        if (targetElement) {
          targetElement.className = 'max-h-0 transition-max-height-500';
          setTimeout(() => {
            document.querySelector(`#child-tr-${deviceSerial}`)!.remove();
            isCreateChildTable.current[deviceSerial] = false;
          }, 500);
        }

        return;
      }

      const targetElement = document.querySelector(`.${deviceSerial}`);
      const nvrTables = document.createElement('tr');
      nvrTables.id = `child-tr-${deviceSerial}`;

      tdRef.current[deviceSerial].className = 'overflow-hidden';
      tdRef.current[deviceSerial].setAttribute('colspan', EzvizTableColumns.length.toString());
      nvrTables.appendChild(tdRef.current[deviceSerial]);

      if (targetElement) {
        const parentNode = targetElement.parentNode!;
        parentNode.insertBefore(nvrTables, targetElement.nextSibling);
      }

      if (!isCreateChildTable.current[deviceSerial]) { isCreateChildTable.current[deviceSerial] = true; }

      setTimeout(() => {
        const nvrTableEle = document.querySelector(`#nvr-${deviceSerial}`);

        if (nvrTableEle) {
          nvrTableEle.className = 'max-h-100 transition-max-height-500';
        }
      }, 0);
    };

    return <Button scale={0.6} auto onClick={handleClick}>查看通道</Button>;
  }, [isCreateChildTable, tdRef, setNVRProps, nvrProps]);

  const serializationData = useCallback((
    ezvizList: EzvizTableData[],
    setShowModal: (showModal: boolean) => void,
    setCurrentDeviceSerial: (deviceSerial: string) => void
  ): EzvizTableData[] => {
    return ezvizList.map(item => ({
      ...item,
      deviceSerial: (
        <span className="my-2 flex flex-col items-start">
          {item.deviceSerial}
          <Tag type="secondary" scale={0.1}>
            {item.parentCategory}
          </Tag>
        </span>
      ),
      deviceName: (
        <>
          {item.deviceName}
          <Edit
            size={12}
            className="ml-2 cursor-pointer"
            onClick={() => {
              setShowModal(true);
              setCurrentDeviceSerial(item.deviceSerial.toString());
            }}
          />
        </>
      ),
      addTime: new Date(item.addTime).toISOString().split('T')[0],
      status: <OnlineStatus status={item.status as number} />,
      play:
        item.parentCategory === 'XVR'
          ? channelView(
            item.deviceSerial.toString(),
            <OnlineStatus status={item.status as number} />,
            new Date(item.addTime).toISOString().split('T')[0]
          )
          : (
            <Link to={`/ezviz/live/${item.deviceSerial}?${new URLSearchParams({ deviceName: item.deviceName as string })}`}>
              <Button scale={0.6} auto>点击播放</Button>
            </Link>
          ),
      className: item.deviceSerial.toString()
    }));
  }, [channelView]);

  return (
    <Layout name="aya">
      <a href="asd" />
      <div>
        <Breadcrumbs
          items={[
            { text: 'Home', id: 'home', href: '/' },
            { text: 'Ezviz', id: 'ezviz' }
          ]}
        />
        <h3 className="mt-5">设备列表</h3>
      </div>
      <div style={{
        padding: theme.layout.gapHalf,
        background: theme.palette.accents_1,
        borderRadius: '5px',
        minHeight: '20rem'
      }}>
        <EzvizTools
          update={(newData) => {
            setNVRProps([]);
            return data ? mutate(newData, false) : undefined;
          }}
        />
        {
          error || (data ? data.code !== '200' : undefined)
            ? <NotFoundError title="请求错误" height="h-20rem" />
            : data
              ? (
                <EzvizTable
                  serializationFn={serializationData}
                  data={data.data}
                  columns={EzvizTableColumns}
                  update={newData => mutate({ ...data, data: newData }, false)}
                  TableRowClassNameHandler={(rowData: EzvizTableData) => rowData.className ?? ''}
                />
              )
              : <div className="mt-30"><Loading /></div>
        }
        <div className="mt-5 mr-5 text-right">
          <Pagination count={data ? Math.floor(data.page.total / data.page.size) + 1 : 20} initialPage={page + 1} onChange={p => setPage(p - 1)}>
            <Pagination.Next><ChevronRightCircleFill /></Pagination.Next>
            <Pagination.Previous><ChevronLeftCircleFill /></Pagination.Previous>
          </Pagination>
        </div>
        {
          nvrProps.map((item) => {
            return ReactDOM.createPortal(
              <NVRTables
                deviceSerial={item.deviceSerial}
                status={item.status}
                addTime={item.addTime}
              />,
              tdRef.current[item.deviceSerial],
              item.deviceSerial
            );
          })
        }
      </div>
    </Layout>
  );
};
