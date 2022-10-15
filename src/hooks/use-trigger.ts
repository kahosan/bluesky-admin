import useSWRMutation from 'swr/mutation';
import { useToasts } from './use-toasts';
import { HTTPError, fetcherWithSWRMutation } from '@/lib/fetcher';

export const useTrigger = <R, E>(key: string) => {
  const { setToast } = useToasts();

  return useSWRMutation<R, E>(key, fetcherWithSWRMutation, {
    onError(error) {
      if (error instanceof HTTPError) {
        const err = error.info as { message: string };
        if (error.status === 401) {
          setToast({
            text: err.message,
            type: 'error',
            delay: 5000
          });
        } else {
          setToast({
            text: `请求服务器错误 ${err.message}`,
            type: 'error',
            delay: 5000
          });
        }
      }
    }
  });
};
