import { useEffect, useState } from 'react';

import { useStatusCodeHandler } from './use-status-code-handler';

import { fetcherWithAuthorization } from '@/lib/fetcher';

import type { EzvizLiveResp } from '@/types/ezviz';

export const useCameraLive = (key: string) => {
  const { handleError, handleSuccess } = useStatusCodeHandler();
  const [data, setData] = useState<EzvizLiveResp>();

  const fetchLive = () => {
    fetcherWithAuthorization<EzvizLiveResp>(key)
      .then((res) => {
        handleSuccess(res);
        setData(res);
      }).catch((err) => {
        handleError(err);
      });
  };

  useEffect(() => {
    fetchLive();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { error: !data, data };
};
