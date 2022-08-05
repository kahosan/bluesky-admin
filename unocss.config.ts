import { defineConfig } from 'unocss';
import presetUno from '@unocss/preset-uno';
import { Themes } from '@geist-ui/core';

const themeColors: string[] = Object.values(Themes.getPresets()[0].palette);

function generatorChildrenHover(colors: string[]) {
  return colors.map(color => `children:hover:bg-${color}`);
}

export default defineConfig({
  presets: [presetUno()],
  safelist: [...generatorChildrenHover(themeColors)],
});
