import { useToasts } from './use-toasts';
import type { HTTPError } from '@/lib/fetcher';

export const useStatusCodeHandler = <T extends HTTPError>() => {
  const { setToast } = useToasts();

  return {
    handleError: (error: T) => {
      const err = error.info as { message: string };
      setToast({
        text: `${err.message}`,
        type: 'error',
        delay: 5000
      });
    },
    handleSuccess: (data: { code: string; msg: string }) => {
      if (data.code !== '200') {
        setToast({
          text: data.msg,
          type: 'error',
          delay: 5000
        });
      }
    }
  };
};
