import { useToasts as useGeistToasts } from '@geist-ui/core';

export const useToasts = () => {
  const { setToast: origSetToast, removeAll: origClearToasts } = useGeistToasts();

  return {
    setToast: origSetToast,
    clearToasts: origClearToasts,
  };
};
