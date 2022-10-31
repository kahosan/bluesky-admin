import { Divider, Input, Modal } from '@geist-ui/core';

import { useCallback, useState } from 'react';

import { useToasts } from '@/hooks/use-toasts';

import DataTable from '@/components/data-tables';
import type { TableColumns } from '@/components/data-tables/types';
import type { EzvizTableData } from '@/types/ezviz';
import { useTrigger } from '@/hooks/use-trigger';

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

  const onModalClose = () => setShowModal(false);

  const { trigger } = useTrigger<{ code: string; msg: string }>('/api/camera/ezviz/rename?');

  const handleReName = useCallback(async (deviceSerial: string, deviceName: string) => {
    const resp = await trigger({ deviceSerial, deviceName });

    if (resp && resp.code !== '200') {
      setToast({
        text: resp.msg,
        type: 'error',
        delay: 5000
      });

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
