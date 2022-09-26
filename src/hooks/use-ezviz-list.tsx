import useSWRImmutable from 'swr/immutable';

import { fetcherWithAuthorization } from '@/lib/fetcher';

import { useToasts } from '@/hooks/use-toasts';

import type { HTTPError } from '@/lib/fetcher';
import type { EzvizDeviceListResp, EzvizNVRCameraListResp } from '@/types/ezviz';

export const useEzvizList = <T extends EzvizDeviceListResp | EzvizNVRCameraListResp>(key: string) => {
  const { setToast } = useToasts();

  return useSWRImmutable<T, HTTPError>(
    key,
    key => fetcherWithAuthorization(key),
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
            text: `${error.message}: ${error.status} ${error.info as string}`,
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
