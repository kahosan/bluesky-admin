import { Button, Input } from '@geist-ui/core';
import { Search } from '@geist-ui/icons';

export const EzvizTools = () => {
  return (
    <div className="my-2 mb-4 flex items-center justify-between">
      <Input label="搜索设备" placeholder="请输入序列号" iconRight={<Search size={15} className="cursor-pointer" />} className="mr-3" />
      <Button h={0.88}>添加设备</Button>
    </div>
  );
};
