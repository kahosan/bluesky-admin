import { useEffect, useMemo } from 'react';

import { CssBaseline, GeistProvider } from '@geist-ui/core';

import { atom, useAtom } from 'jotai';

import { useMediaQuery } from '@/hooks/use-media-query';

import { isBrowser } from '@/lib/util';
import { Routers } from '@/routers';

export type Theme = 'light' | 'dark' | 'system';

const baseThemeAtom = atom<Theme>('system');
export const themeAtom = atom(
  get => get(baseThemeAtom),
  (_get, set, value: Theme) => {
    set(baseThemeAtom, value);
    if (isBrowser) {
      Promise.resolve().then(() => {
        if (value === 'system') {
          localStorage.removeItem('theme');
        } else {
          localStorage.setItem('theme', value);
        }
      });
    }
  }
);

const App = () => {
  const isSystemThemeDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [theme, setTheme] = useAtom(themeAtom);

  useEffect(() => {
    if (isBrowser) {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'light' || storedTheme === 'dark') {
        setTheme(storedTheme);
      } else {
        setTheme('system');
        if (storedTheme) {
          localStorage.removeItem('theme');
        }
      }
    }
  }, [setTheme]);

  const geistThemeType = useMemo(() => {
    if (theme === 'system') {
      return isSystemThemeDark ? 'dark' : 'light';
    }
    return theme;
  }, [isSystemThemeDark, theme]);

  return (
    <GeistProvider themeType={geistThemeType}>
      <CssBaseline />
      <Routers />
    </GeistProvider>
  );
};

export default App;
