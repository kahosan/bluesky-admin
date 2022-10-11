import useSWRMutation from 'swr/mutation';
import { useToasts } from './use-toasts';
import { HTTPError, fetcherWithSWRMutation } from '@/lib/fetcher';

export const useTrigger = <R, E>(key: string) => {
  const { setToast } = useToasts();

  return useSWRMutation<R, E>(key, fetcherWithSWRMutation, {
    onError(error) {
      if (error instanceof HTTPError) {
        if (error.status === 401) {
          const err = error.info as { message: string };
          setToast({
            text: err.message,
            type: 'error',
            delay: 5000
          });
        } else {
          setToast({
            text: '请求服务器错误，修改失败',
            type: 'error',
            delay: 5000
          });
        }
      }
    }
  });
};
