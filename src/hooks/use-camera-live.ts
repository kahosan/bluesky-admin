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
        if (error.status === 401) {
          const err = error.info as { message: string };
          setToast({
            text: err.message,
            type: 'error',
            delay: 5000
          });
        } else {
          setToast({
            text: `${error.message}: ${error.status} ${error.info}`,
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
