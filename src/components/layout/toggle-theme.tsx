import { Select, Spacer, Text, useTheme } from '@geist-ui/core';
import SunIcon from '@geist-ui/icons/sun';
import MoonIcon from '@geist-ui/icons/moon';
import DisplayIcon from '@geist-ui/icons/display';

import { useCallback } from 'react';

import { useAtom } from 'jotai';
import { themeAtom } from '@/App';

export const ThemeToggle = () => {
  const theme = useTheme();
  const [themeType, setTheme] = useAtom(themeAtom);

  const handleChange = useCallback((value: string | string[]) => {
    if (value === 'dark' || value === 'light' || value === 'system') {
      setTheme(value);
    }
  }, [setTheme]);

  return (
    <div className={`flex p-3 m-0 items-center justify-items-start color-${theme.palette.accents_5} text-3.4`}>
      <Text span>
        Theme
      </Text>
      <Spacer inline w={1 / 2} />
      <Select
        h="36px"
        disableMatchWidth
        value={themeType}
        onChange={handleChange}
        title="Switch Themes"
        className='!w-120px !min-w-120px'
      >
        <Select.Option value="light">
          <span className="w-auto h-18px flex content-between items-center svg-mr-10px svg-ml-2px">
            <SunIcon size={16} />
            Light
          </span>
        </Select.Option>
        <Select.Option value="dark">
          <span className="w-auto h-18px flex content-between items-center svg-mr-10px svg-ml-2px">
            <MoonIcon size={16} />
            Dark
          </span>
        </Select.Option>
        <Select.Option value="system">
          <span className="w-auto h-18px flex content-between items-center svg-mr-10px svg-ml-2px">
            <DisplayIcon size={16} />
            System
          </span>
        </Select.Option>
      </Select>
    </div>
  );
};
