import { atom, useAtom } from 'jotai';

import { isBrowser } from '@/lib/util';
import { IS_COMPANY_KEY } from '@/lib/constant';

const baseKeyAtom = atom(isBrowser ? localStorage.getItem(IS_COMPANY_KEY) : null);

const isCompanyAtom = atom(
  get => get(baseKeyAtom),
  (get, set, isCompany: string | null) => {
    set(baseKeyAtom, isCompany);
    if (isBrowser) {
      Promise.resolve().then(() => {
        if (isCompany) {
          localStorage.setItem(IS_COMPANY_KEY, isCompany);
        } else {
          localStorage.removeItem(IS_COMPANY_KEY);
        }
      });
    }
  }
);

export const useIsCompany = () => useAtom(isCompanyAtom);
