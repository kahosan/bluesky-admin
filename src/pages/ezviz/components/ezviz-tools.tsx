import { Button, Input } from '@geist-ui/core';
import { Search } from '@geist-ui/icons';

import { useState } from 'react';

import type { EzvizCameraSearchResp, EzvizDeviceListResp } from '@/types/ezviz';
import { useTrigger } from '@/hooks/use-trigger';
import { useToasts } from '@/hooks/use-toasts';

interface EzvizToolsProps {
  update: (newData: EzvizDeviceListResp) => void
}

export const EzvizTools = ({ update }: EzvizToolsProps) => {
  const { setToast } = useToasts();
  const [keyword, setKeyword] = useState('');

  const { trigger } = useTrigger<EzvizCameraSearchResp>('/api/camera/ezviz/search?');

  const handleSearch = async () => {
    const data = await trigger({ key: keyword });

    if (data) {
      if (data.code !== '200') {
        setToast({
          text: data.msg,
          type: 'error',
          delay: 5000
        });
      }

      update({
        ...data,
        page: {
          total: 1,
          size: 1,
          page: 1
        }
      });
    }
  };

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
      <Button h={0.88}>添加设备</Button>
    </div>
  );
};
