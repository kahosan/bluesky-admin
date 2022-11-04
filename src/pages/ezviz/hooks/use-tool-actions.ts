import { useRefreshCounter } from './use-refresh-counter';

import { useTrigger } from '@/hooks/use-trigger';
import { useToasts } from '@/hooks/use-toasts';

import type { DefaultResp, EzvizCameraSearchResp, EzvizDeviceListResp } from '@/types/ezviz';

export const useToolActions = (keyword: string, update: (newData: EzvizDeviceListResp) => void) => {
  const { setToast } = useToasts();

  const [refreshCount, setRefreshCount] = useRefreshCounter();

  const { trigger: searchTrigger } = useTrigger<EzvizCameraSearchResp>('/api/camera/ezviz/search?');
  const { trigger: addDeviceTrigger } = useTrigger<DefaultResp>('/api/camera/ezviz/device/add?');
  const { trigger: refreshTrigger } = useTrigger<DefaultResp>('/api/camera/ezviz/refresh');

  const handleSearch = async () => {
    const data = await searchTrigger({ key: keyword });

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

  // 萤石云 API 有限制次数，全设备刷新多次可能会超限制

  const handleRefresh = async () => {
    if (refreshCount && +refreshCount >= 3) {
      setToast({
        text: '刷新次数已达上限',
        type: 'error',
        delay: 5000
      });

      return;
    }

    const data = await refreshTrigger();
    setRefreshCount((+(refreshCount || 0) + 1).toString());

    if (data?.code === '200') {
      setToast({
        text: '刷新成功，每天最多刷新3次',
        type: 'success',
        delay: 5000
      });
    }
  };

  const handleAddDevice = async (deviceSerial: string, verificationCode: string) => {

  };

  return {
    handleSearch,
    handleRefresh,
    handleAddDevice
  };
};
