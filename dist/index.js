import path from 'path';
import { Joi } from '@docusaurus/utils-validation';
import fs from 'fs/promises';
import __node_cjsUrl from 'node:url';
import __node_cjsPath from 'node:path';

const DEFAULT_WIDTH = 1450;
const DEFAULT_HEIGHT = 1000;
const DEFAULT_RADAR_VERSION = '0.12';
const DEFAULT_OPTIONS = {
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    radarVersion: DEFAULT_RADAR_VERSION,
    colors: {
        background: '#fff',
        grid: '#bbb',
        inactive: '#ddd'
    }
};
const PluginOptionsSchema = Joi.object({
    radarFile: Joi.string().required(),
    width: Joi.number().integer().min(400).max(3000).default(DEFAULT_WIDTH),
    height: Joi.number().integer().min(400).max(3000).default(DEFAULT_HEIGHT),
    radarVersion: Joi.string().default(DEFAULT_RADAR_VERSION),
    colors: Joi.object({
        background: Joi.string().optional(),
        grid: Joi.string().optional(),
        inactive: Joi.string().optional()
    }).optional().default(DEFAULT_OPTIONS.colors)
});
const RadarDataSchema = Joi.object({
    title: Joi.string().optional(),
    quadrants: Joi.array().items(Joi.object({
        name: Joi.string().required()
    })).length(4).required(),
    rings: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).required()
    })).min(1).max(4).required(),
    entries: Joi.array().items(Joi.object({
        label: Joi.string().required(),
        quadrant: Joi.number().integer().min(0).max(3).required(),
        ring: Joi.number().integer().min(0).required(),
        moved: Joi.number().valid(-1, 0, 1, 2).required(),
        link: Joi.string().optional()
    })).required()
});
function validatePluginOptions(options) {
    const { error, value } = PluginOptionsSchema.validate(options, {
        abortEarly: false
    });
    if (error) {
        throw new Error(`[docusaurus-techradar-plugin] Invalid plugin options:\n${error.message}`);
    }
    return value;
}
function validateRadarData(data, source) {
    const { error } = RadarDataSchema.validate(data, {
        abortEarly: false
    });
    if (error) {
        const details = error.details.map((d)=>`  - ${d.message}`).join('\n');
        throw new Error(`[docusaurus-techradar-plugin] Invalid radar data in ${source}:\n${details}`);
    }
}

async function loadRadarData(filePath, siteDir) {
    const absolutePath = path.resolve(siteDir, filePath);
    let fileContent;
    try {
        fileContent = await fs.readFile(absolutePath, 'utf-8');
    } catch (error) {
        throw new Error(`[docusaurus-techradar-plugin] Failed to read radar file at ${absolutePath}:\n` + `${error instanceof Error ? error.message : String(error)}`);
    }
    let data;
    try {
        if (filePath.endsWith('.json')) {
            data = JSON.parse(fileContent);
        } else if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
            // For YAML support, we'd need to add a yaml parser
            // For now, only JSON is supported
            throw new Error('YAML support not yet implemented');
        } else {
            throw new Error('Unsupported file format. Use .json file.');
        }
    } catch (error) {
        throw new Error(`[docusaurus-techradar-plugin] Failed to parse ${filePath}:\n` + `${error instanceof Error ? error.message : String(error)}`);
    }
    validateRadarData(data, filePath);
    return data;
}

const __filename$1 = __node_cjsUrl.fileURLToPath(import.meta.url);
const __dirname$1 = __node_cjsPath.dirname(__filename$1);

function pluginTechRadar(context, options) {
    const validatedOptions = validatePluginOptions({
        ...DEFAULT_OPTIONS,
        ...options
    });
    return {
        name: 'docusaurus-techradar-plugin',
        async loadContent () {
            const radarData = await loadRadarData(validatedOptions.radarFile, context.siteDir);
            return {
                radarData,
                radarVersion: validatedOptions.radarVersion || '0.12'
            };
        },
        async contentLoaded ({ content, actions }) {
            const { setGlobalData } = actions;
            setGlobalData({
                radarData: content.radarData,
                options: validatedOptions
            });
        },
        getThemePath () {
            // Return path to theme folder
            return path.join(__dirname$1, 'theme');
        }
    };
}

export { pluginTechRadar as default };
