import { useModal } from '@geist-ui/core';

import { useTrigger } from '@/hooks/use-trigger';
import { useToasts } from '@/hooks/use-toasts';

import type { DefaultResp } from '@/types/ezviz';

export const useControlMenuAction = (deviceSerial: string) => {
  const { setToast } = useToasts();
  const { setVisible, bindings } = useModal();

  const { trigger: onEncryptTrigger } = useTrigger<DefaultResp>('/api/camera/ezviz/encrypt/on?');
  const { trigger: offEncryptTrigger } = useTrigger<DefaultResp>('/api/camera/ezviz/encrypt/off?');

  const onEncryptHandler = async () => {
    setVisible(false);
    const data = await onEncryptTrigger({ deviceSerial });

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
    const data = await offEncryptTrigger({ deviceSerial });

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

  return {
    bindings,
    setVisible,
    onEncryptHandler,
    offEncryptHandler
  };
};
