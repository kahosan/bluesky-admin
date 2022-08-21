import { defineConfig, presetUno } from 'unocss';
import { Themes } from '@geist-ui/core';

const themeColors: string[] = Object.values(Themes.getPresets()[0].palette);

function generatorHoverChildren(colors: string[]) {
  return colors.map(color => `hover-children:bg-${color}`);
}

export default defineConfig({
  presets: [presetUno()],
  safelist: [...generatorHoverChildren(themeColors)]
});
