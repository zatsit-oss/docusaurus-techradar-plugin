import { describe, it, expect } from 'vitest';
import { validatePluginOptions, validateRadarData } from '../src/validateConfig';

describe('Plugin Options Validation', () => {
  it('validates valid plugin options', () => {
    const options = {
      radarFile: './data/radar.json',
      width: 1450,
      height: 1000,
    };

    const result = validatePluginOptions(options);
    expect(result).toBeDefined();
    expect(result.radarFile).toBe('./data/radar.json');
    expect(result.width).toBe(1450);
    expect(result.height).toBe(1000);
  });

  it('applies default values for missing options', () => {
    const options = {
      radarFile: './data/radar.json',
    };

    const result = validatePluginOptions(options);
    expect(result.width).toBe(1450);
    expect(result.height).toBe(1000);
    expect(result.colors).toBeDefined();
  });

  it('throws error for missing radarFile', () => {
    expect(() => validatePluginOptions({})).toThrow();
  });

  it('throws error for invalid width', () => {
    const options = {
      radarFile: './data/radar.json',
      width: 5000, // Too large
    };

    expect(() => validatePluginOptions(options)).toThrow();
  });
});

describe('Radar Data Validation', () => {
  it('validates valid radar data', () => {
    const data = {
      title: 'Tech Radar 2026',
      quadrants: [
        { name: 'Languages' },
        { name: 'Tools' },
        { name: 'Platforms' },
        { name: 'Techniques' },
      ],
      rings: [
        { name: 'ADOPT', color: '#5ba300' },
        { name: 'TRIAL', color: '#009eb0' },
      ],
      entries: [
        {
          label: 'React',
          quadrant: 0,
          ring: 0,
          moved: 0,
          link: '/docs/react',
        },
      ],
    };

    expect(() => validateRadarData(data, 'test.json')).not.toThrow();
  });

  it('throws error for invalid quadrants count', () => {
    const data = {
      quadrants: [
        { name: 'Languages' },
        { name: 'Tools' },
      ], // Only 2, should be 4
      rings: [{ name: 'ADOPT', color: '#5ba300' }],
      entries: [],
    };

    expect(() => validateRadarData(data, 'test.json')).toThrow();
  });

  it('throws error for invalid ring color', () => {
    const data = {
      quadrants: [
        { name: 'Q1' },
        { name: 'Q2' },
        { name: 'Q3' },
        { name: 'Q4' },
      ],
      rings: [
        { name: 'ADOPT', color: 'invalid-color' }, // Invalid hex color
      ],
      entries: [],
    };

    expect(() => validateRadarData(data, 'test.json')).toThrow();
  });

  it('throws error for invalid entry quadrant', () => {
    const data = {
      quadrants: [
        { name: 'Q1' },
        { name: 'Q2' },
        { name: 'Q3' },
        { name: 'Q4' },
      ],
      rings: [{ name: 'ADOPT', color: '#5ba300' }],
      entries: [
        {
          label: 'Test',
          quadrant: 5, // Invalid, should be 0-3
          ring: 0,
          moved: 0,
        },
      ],
    };

    expect(() => validateRadarData(data, 'test.json')).toThrow();
  });

  it('throws error for invalid moved value', () => {
    const data = {
      quadrants: [
        { name: 'Q1' },
        { name: 'Q2' },
        { name: 'Q3' },
        { name: 'Q4' },
      ],
      rings: [{ name: 'ADOPT', color: '#5ba300' }],
      entries: [
        {
          label: 'Test',
          quadrant: 0,
          ring: 0,
          moved: 5, // Invalid, should be -1, 0, 1, or 2
        },
      ],
    };

    expect(() => validateRadarData(data, 'test.json')).toThrow();
  });
});
