import useSWRImmutable from 'swr/immutable';
import { fetcherWithAuthorization } from '@/lib/fetcher';
import { useToasts } from '@/hooks/use-toasts';
import type { EzvizLiveResp } from '@/types/ezviz';

export const useCameraLive = (key: string) => {
  const { setToast } = useToasts();
  return useSWRImmutable<EzvizLiveResp>(
    key,
    fetcherWithAuthorization,
    {
      onError(error) {
        const err = error.info as { message: string };
        if (error.status === 401) {
          setToast({
            text: err.message,
            type: 'error',
            delay: 5000
          });
        } else {
          setToast({
            text: `服务器请求错误 ${err.message}`,
            type: 'error',
            delay: 5000
          });
        }
      },
      onSuccess(data) {
        if (data.code !== '200') {
          setToast({
            text: data.msg,
            type: 'error',
            delay: 5000
          });
        }
      }
    }
  );
};
