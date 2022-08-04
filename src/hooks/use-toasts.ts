import { useToasts as useGeistToasts } from '@geist-ui/core';
import { useCallback } from 'react';

export const useToasts = () => {
  const { setToast: origSetToast, removeAll: origClearToasts } = useGeistToasts();

  return {
    setToast: useCallback(origSetToast, []),
    clearToasts: useCallback(origClearToasts, []),
  };
};
