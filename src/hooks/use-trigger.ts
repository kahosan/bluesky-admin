import useSWRMutation from 'swr/mutation';
import { useStatusCodeHandler } from './use-status-code-handler';
import type { HTTPError } from '@/lib/fetcher';
import { fetcherWithSWRMutation } from '@/lib/fetcher';

export const useTrigger = <R, E extends HTTPError = HTTPError>(key: string) => {
  const { handleError } = useStatusCodeHandler();

  return useSWRMutation<R, E>(key, fetcherWithSWRMutation, {
    onError(error) {
      handleError(error);
    }
  });
};
