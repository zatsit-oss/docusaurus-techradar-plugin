Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');
var utilsValidation = require('@docusaurus/utils-validation');
var fs = require('fs/promises');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var path__default = /*#__PURE__*/_interopDefault(path);
var fs__default = /*#__PURE__*/_interopDefault(fs);

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
const PluginOptionsSchema = utilsValidation.Joi.object({
    radarFile: utilsValidation.Joi.string().required(),
    width: utilsValidation.Joi.number().integer().min(400).max(3000).default(DEFAULT_WIDTH),
    height: utilsValidation.Joi.number().integer().min(400).max(3000).default(DEFAULT_HEIGHT),
    radarVersion: utilsValidation.Joi.string().default(DEFAULT_RADAR_VERSION),
    colors: utilsValidation.Joi.object({
        background: utilsValidation.Joi.string().optional(),
        grid: utilsValidation.Joi.string().optional(),
        inactive: utilsValidation.Joi.string().optional()
    }).optional().default(DEFAULT_OPTIONS.colors)
});
const RadarDataSchema = utilsValidation.Joi.object({
    title: utilsValidation.Joi.string().optional(),
    quadrants: utilsValidation.Joi.array().items(utilsValidation.Joi.object({
        name: utilsValidation.Joi.string().required()
    })).length(4).required(),
    rings: utilsValidation.Joi.array().items(utilsValidation.Joi.object({
        name: utilsValidation.Joi.string().required(),
        color: utilsValidation.Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).required()
    })).min(1).max(4).required(),
    entries: utilsValidation.Joi.array().items(utilsValidation.Joi.object({
        label: utilsValidation.Joi.string().required(),
        quadrant: utilsValidation.Joi.number().integer().min(0).max(3).required(),
        ring: utilsValidation.Joi.number().integer().min(0).required(),
        moved: utilsValidation.Joi.number().valid(-1, 0, 1, 2).required(),
        link: utilsValidation.Joi.string().optional()
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
    const absolutePath = path__default.default.resolve(siteDir, filePath);
    let fileContent;
    try {
        fileContent = await fs__default.default.readFile(absolutePath, 'utf-8');
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
            return path__default.default.join(__dirname, 'theme');
        }
    };
}

exports.default = pluginTechRadar;
