import { Divider, Input, Modal } from '@geist-ui/core';

import { useCallback, useState } from 'react';

import useSWRMutation from 'swr/mutation';

import { useToasts } from '@/hooks/use-toasts';

import { HTTPError, fetcherWithSWRMutation } from '@/lib/fetcher';

import DataTable from '@/components/data-tables';

import type { TableColumns } from '@/components/data-tables/types';
import type { EzvizTableData } from '@/types/ezviz';

interface EzvizTableProps {
  data: EzvizTableData[]
  serializationFn: (
    ezvizList: EzvizTableData[],
    setShowModal: (showModal: boolean) => void,
    setCurrentDeviceSerial: (deviceSerial: string) => void
  ) => EzvizTableData[]
  columns: TableColumns
  update: (newData: EzvizTableData[]) => void
  TableRowClassNameHandler?: (rowData: EzvizTableData, rowIndex?: number) => string
}

export const EzvizTable = ({
  data,
  serializationFn,
  columns,
  update,
  TableRowClassNameHandler
}: EzvizTableProps) => {
  const { setToast } = useToasts();

  const [showModal, setShowModal] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [currentDeviceSerial, setCurrentDeviceSerial] = useState('');

  const { trigger } = useSWRMutation<{ code: string; msg: string }>(
    '/api/camera/ezviz/rename?', fetcherWithSWRMutation
  );

  const onModalClose = () => setShowModal(false);
  const handleReName = useCallback(async (deviceSerial: string, deviceName: string) => {
    const errorHandler = (text: string) => {
      setToast({
        text,
        type: 'error',
        delay: 5000
      });
    };

    try {
      const resp = await trigger({ deviceSerial: '123', deviceName });

      if (resp && resp.code !== '200') {
        errorHandler(resp.msg);
        setShowModal(false);
        return;
      }

      setToast({
        text: '修改成功！',
        type: 'success',
        delay: 5000
      });

      // 更新本地数据
      update(data.map((item) => {
        if (item.deviceSerial !== deviceSerial) { return item; }
        return {
          ...item,
          deviceName
        };
      }));
    } catch (error) {
      if (error instanceof HTTPError) {
        if (error.status === 401) {
          const err = error.info as { message: string };
          errorHandler(err.message);
        }
      } else {
        errorHandler('请求服务器错误，修改失败');
      }
    }
    setShowModal(false);
  }, [setToast, trigger, update, data]);

  return (
    <>
      <DataTable
        data={serializationFn(data, setShowModal, setCurrentDeviceSerial)}
        columns={columns}
        TableRowClassNameHandler={TableRowClassNameHandler}
      />
      <Modal visible={showModal} onClose={onModalClose}>
        <Modal.Title>修改设备名称</Modal.Title>
        <Divider />
        <Modal.Content style={{ textAlign: 'center' }}>
          <Input label="设备名称" placeholder="请输入新的设备名称" onChange={e => setNewDeviceName(e.target.value)} />
        </Modal.Content>
        <Modal.Action onClick={() => handleReName(currentDeviceSerial, newDeviceName)}>确定</Modal.Action>
        <Modal.Action passive onClick={onModalClose}>取消</Modal.Action>
      </Modal>
    </>
  );
};
