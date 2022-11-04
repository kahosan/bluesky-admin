import { atom, useAtom } from 'jotai';

import { isBrowser } from '@/lib/util';
import { JWT_TOKEN } from '@/lib/constant';

const baseKeyAtom = atom(isBrowser ? localStorage.getItem(JWT_TOKEN) : null);

const tokenAtom = atom(
  get => get(baseKeyAtom),
  (get, set, token: string | null) => {
    set(baseKeyAtom, token);
    if (isBrowser) {
      Promise.resolve().then(() => {
        if (token) {
          localStorage.setItem(JWT_TOKEN, token);
        } else {
          localStorage.removeItem(JWT_TOKEN);
        }
      });
    }
  }
);

export const useToken = () => useAtom(tokenAtom);
