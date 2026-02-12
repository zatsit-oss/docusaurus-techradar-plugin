import { Joi } from '@docusaurus/utils-validation';
import type { PluginOptions } from './types';

const DEFAULT_WIDTH = 1450;
const DEFAULT_HEIGHT = 1000;
const DEFAULT_RADAR_VERSION = '0.12';

export const DEFAULT_OPTIONS: Partial<PluginOptions> = {
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  radarVersion: DEFAULT_RADAR_VERSION,
  colors: {
    background: '#fff',
    grid: '#bbb',
    inactive: '#ddd',
  },
};

const PluginOptionsSchema = Joi.object<PluginOptions>({
  id: Joi.string().optional().default('default'), // Ajoutez cette ligne
  radarFile: Joi.string().required(),
  width: Joi.number().integer().min(400).max(3000).default(DEFAULT_WIDTH),
  height: Joi.number().integer().min(400).max(3000).default(DEFAULT_HEIGHT),
  radarVersion: Joi.string().default(DEFAULT_RADAR_VERSION),
  colors: Joi.object({
    background: Joi.string().optional(),
    grid: Joi.string().optional(),
    inactive: Joi.string().optional(),
  })
    .optional()
    .default(DEFAULT_OPTIONS.colors),
});

export const RadarDataSchema = Joi.object({
  title: Joi.string().optional(),
  quadrants: Joi.array()
    .items(Joi.object({ name: Joi.string().required() }))
    .length(4)
    .required(),
  rings: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        color: Joi.string()
          .pattern(/^#[0-9A-Fa-f]{6}$/)
          .required(),
      })
    )
    .min(1)
    .max(4)
    .required(),
  entries: Joi.array()
    .items(
      Joi.object({
        label: Joi.string().required(),
        quadrant: Joi.number().integer().min(0).max(3).required(),
        ring: Joi.number().integer().min(0).required(),
        moved: Joi.number().valid(-1, 0, 1, 2).required(),
        link: Joi.string().optional(),
      })
    )
    .required(),
});

export function validatePluginOptions(options: unknown): PluginOptions {
  const { error, value } = PluginOptionsSchema.validate(options, {
    abortEarly: false,
  });

  if (error) {
    throw new Error(
      `[docusaurus-techradar-plugin] Invalid plugin options:\n${error.message}`
    );
  }

  return value;
}

export function validateRadarData(data: unknown, source: string): void {
  const { error } = RadarDataSchema.validate(data, { abortEarly: false });

  if (error) {
    const details = error.details.map((d) => `  - ${d.message}`).join('\n');
    throw new Error(
      `[docusaurus-techradar-plugin] Invalid radar data in ${source}:\n${details}`
    );
  }
}
