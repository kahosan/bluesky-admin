import { atom, useAtom } from 'jotai';

import { isBrowser } from '@/lib/util';
import { FLEX_API_TOKEN_KEY } from '@/lib/constant';

const baseTokenAtom = atom(isBrowser ? localStorage.getItem(FLEX_API_TOKEN_KEY) : null);

const tokenAtom = atom(
  get => get(baseTokenAtom),
  (get, set, token: string | null) => {
    set(baseTokenAtom, token);
    if (isBrowser) {
      Promise.resolve().then(() => {
        if (token) {
          localStorage.setItem(FLEX_API_TOKEN_KEY, token);
        } else {
          localStorage.removeItem(FLEX_API_TOKEN_KEY);
        }
      });
    }
  }
);

export const useFlexApiToken = () => useAtom(tokenAtom);
