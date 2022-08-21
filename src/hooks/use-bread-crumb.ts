import { atom, useAtom } from 'jotai';

interface BreadCrumb {
  label: string
  href?: string
  id: string
}

const baseAtom = atom<BreadCrumb[]>([{
  label: 'Dashboard',
  id: 'dashboard',
  href: '/'
}]);

const breadCrumbAtom = atom(
  get => get(baseAtom),
  (get, set, breadCrumb: BreadCrumb[]) => {
    set(baseAtom, [...get(baseAtom), ...breadCrumb]);
  }
);

export const useBreadCrumb = () => useAtom(breadCrumbAtom);
