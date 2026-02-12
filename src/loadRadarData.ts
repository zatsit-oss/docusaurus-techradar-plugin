import fs from 'fs/promises';
import path from 'path';
import type { RadarData } from './types';
import { validateRadarData } from './validateConfig';

export async function loadRadarData(
  filePath: string,
  siteDir: string
): Promise<RadarData> {
  const absolutePath = path.resolve(siteDir, filePath);

  let fileContent: string;
  try {
    fileContent = await fs.readFile(absolutePath, 'utf-8');
  } catch (error) {
    throw new Error(
      `[docusaurus-techradar-plugin] Failed to read radar file at ${absolutePath}:\n` +
        `${error instanceof Error ? error.message : String(error)}`
    );
  }

  let data: unknown;
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
    throw new Error(
      `[docusaurus-techradar-plugin] Failed to parse ${filePath}:\n` +
        `${error instanceof Error ? error.message : String(error)}`
    );
  }

  validateRadarData(data, filePath);

  return data as RadarData;
}
