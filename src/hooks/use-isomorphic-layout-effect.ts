import { useEffect, useLayoutEffect } from 'react';
import { isBrowser } from '@/lib/util';

export const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;
