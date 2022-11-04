import { atom, useAtom } from 'jotai';

import { isBrowser } from '@/lib/util';

const baseCounter = atom(isBrowser ? localStorage.getItem('refreshCounter') : null);

const today = new Date().getDate.toString();
const isToday = today === localStorage.getItem('refreshCounterDate');

const refreshCounterAtom = atom(
  get => get(baseCounter),
  (_get, set, counter: string | null) => {
    if (isBrowser) {
      set(baseCounter, counter);
      Promise.resolve().then(() => {
        if (isToday && counter) {
          localStorage.setItem('refreshCounter', counter);
        } else {
          localStorage.removeItem('refreshCounter');
          localStorage.setItem('refreshCounterDate', today);
        }
      });
    }
  }
);

export const useRefreshCounter = () => useAtom(refreshCounterAtom);
