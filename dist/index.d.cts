import { LoadContext, Plugin } from '@docusaurus/types';

interface RadarQuadrant {
    name: string;
}
interface RadarRing {
    name: string;
    color: string;
}
interface RadarEntry {
    label: string;
    quadrant: number;
    ring: number;
    moved: -1 | 0 | 1 | 2;
    link?: string;
}
interface RadarData {
    title?: string;
    quadrants: [RadarQuadrant, RadarQuadrant, RadarQuadrant, RadarQuadrant];
    rings: RadarRing[];
    entries: RadarEntry[];
}
interface PluginOptions {
    radarFile: string;
    width?: number;
    height?: number;
    colors?: {
        background?: string;
        grid?: string;
        inactive?: string;
    };
}
interface TechRadarProps {
    source?: string;
    width?: number;
    height?: number;
    colors?: {
        background?: string;
        grid?: string;
        inactive?: string;
    };
}
interface PluginContent {
    radarData: RadarData;
}

declare function pluginTechRadar(context: LoadContext, options: Partial<PluginOptions>): Plugin<PluginContent>;

export { pluginTechRadar as default };
export type { PluginOptions, RadarData, TechRadarProps };
//# sourceMappingURL=index.d.cts.map
