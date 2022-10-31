import useSWRImmutable from 'swr/immutable';

import { useStatusCodeHandler } from './use-status-code-handler';

import { fetcherWithAuthorization } from '@/lib/fetcher';

import type { EzvizLiveResp } from '@/types/ezviz';

export const useCameraLive = (key: string) => {
  const { handleError, handleSuccess } = useStatusCodeHandler();

  return useSWRImmutable<EzvizLiveResp>(
    key,
    fetcherWithAuthorization,
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
