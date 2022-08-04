import { atom, useAtom } from 'jotai';

const isCompnayAtom = atom(false);

export const useIsCompany = () => useAtom(isCompnayAtom);
