import useSWRImmutable from 'swr/immutable';

import { useStatusCodeHandler } from '../../../hooks/use-status-code-handler';
import { fetcherWithAuthorization } from '@/lib/fetcher';

import type { HTTPError } from '@/lib/fetcher';
import type { EzvizDeviceListResp, EzvizNVRCameraListResp } from '@/types/ezviz';

export const useEzvizList = <T extends EzvizDeviceListResp | EzvizNVRCameraListResp>(key: string) => {
  const { handleError, handleSuccess } = useStatusCodeHandler();

  return useSWRImmutable<T, HTTPError>(
    key,
    key => fetcherWithAuthorization(key),
    {
      onError(error) {
        handleError(error);
      },
      onSuccess(data) {
        handleSuccess(data);
      }
    }
  );
};
