import type { LoadContext, Plugin } from '@docusaurus/types';
import path from 'path';
import type { PluginOptions, PluginContent } from './types';
import { validatePluginOptions, DEFAULT_OPTIONS } from './validateConfig';
import { loadRadarData } from './loadRadarData';

export default function pluginTechRadar(
  context: LoadContext,
  options: Partial<PluginOptions>
): Plugin<PluginContent> {
  const validatedOptions = validatePluginOptions({
    ...DEFAULT_OPTIONS,
    ...options,
  });

  return {
    name: 'docusaurus-techradar-plugin',

    async loadContent() {
      const radarData = await loadRadarData(
        validatedOptions.radarFile,
        context.siteDir
      );
      return { radarData };
    },

    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions;
      setGlobalData({
        radarData: content.radarData,
        options: validatedOptions,
      });
    },

    getThemePath() {
      // Return path to theme folder
      return path.join(__dirname, 'theme');
    },
  };
}

export type { PluginOptions, RadarData, TechRadarProps } from './types';
