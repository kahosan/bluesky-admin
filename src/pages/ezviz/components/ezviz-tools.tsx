import { Button, Input, Modal, useModal } from '@geist-ui/core';
import { Search } from '@geist-ui/icons';

import { useState } from 'react';

import { useToolActions } from '../hooks/use-tool-actions';

import { Menu, MenuItem } from '@/components/menu';

import type { EzvizDeviceListResp } from '@/types/ezviz';

interface EzvizToolsProps {
  update: (newData: EzvizDeviceListResp) => void
}

export const EzvizTools = ({ update }: EzvizToolsProps) => {
  const [keyword, setKeyword] = useState('');
  const { bindings, setVisible } = useModal();

  const [deviceSerial, setDeviceSerial] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const { handleSearch, handleRefresh, handleAddDevice } = useToolActions(keyword, update);

  return (
    <div className="my-2 mb-4 flex items-center justify-between">
      <Input
        label="搜索设备"
        placeholder="请输入序列号"
        iconRight={
          <Search
            size={15}
            className="cursor-pointer pointer-events-auto"
            onClick={() => handleSearch()}
          />
        }
        onChange={e => setKeyword(e.target.value)}
        className="mr-3"
      />
      <div className="flex justify-center lt-md:hidden">
        <Button auto onClick={() => handleRefresh()}>刷新设备</Button>
        <span className="mx-2" />
        <Button auto onClick={() => setVisible(true)}>添加设备</Button>
      </div>
      <div className="md:hidden">
        <Menu
          itemWidth={100}
          content={
            <>
              <MenuItem>
                <Button auto onClick={() => handleRefresh()}>刷新设备</Button>
              </MenuItem>
              <MenuItem>
                <Button auto onClick={() => setVisible(true)}>添加设备</Button>
              </MenuItem>
            </>
          }
        >
          <Button auto>操作</Button>
        </Menu>
      </div>
      <Modal {...bindings}>
        <Modal.Title>添加设备</Modal.Title>
        <Modal.Content>
          <div className="mx-auto w-85%">
            <Input w="100%" label="设备序列号" placeholder="请输入设备序列号" onChange={e => setDeviceSerial(e.target.value)} />
            <div className="h-7" />
            <Input w="100%" label="设备验证码" placeholder="请输入设备验证码" onChange={e => setVerificationCode(e.target.value)} />
          </div>
        </Modal.Content>
        <Modal.Action onClick={() => handleAddDevice(deviceSerial, verificationCode)}>确定</Modal.Action>
        <Modal.Action passive onClick={() => setVisible(false)}>取消</Modal.Action>
      </Modal>
    </div>
  );
};
