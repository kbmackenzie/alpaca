import fg from 'fast-glob';
import { version, buildFolder } from '@/constants';

export type AlpacaConfig = {
  quiet?: boolean;
  logFile?: boolean;
  neverInferDate?: boolean;
  preserveImages?: boolean;
  imageAlias?: string;
  imageExtensions?: string[];
  ignore?: string[];
};

export const defaultImageExtensions = ['png', 'jpg', 'webp', 'gif', 'bmp'];
export const defaultImageAlias = '/';

function yesOrNo(value: any): string {
  return value ? 'yes' : 'no';
}

export function prettyConfig(config: AlpacaConfig): string {
  const imageExtensions = config.imageExtensions ?? defaultImageExtensions;
  const ignored = config.ignore?.map(x => `"${x}"`).join(', ') ?? '[]';
  return [
    `alpaca v${version}`,
    '',
    `quiet: ${config.quiet ? 'yes' : 'no'}`,
    `infer date: ${config.neverInferDate ? 'never' : 'as needed'}`,
    `resolve image alias: ${yesOrNo(config.imageAlias)}`,
    `preserve images: ${yesOrNo(config.preserveImages)}`,
    `image extensions: ${imageExtensions.join(', ')}`,
    `ignore: ${ignored}`,
  ].join('\n');
}

export function getImageAlias(config: AlpacaConfig): string {
  return config.imageAlias ?? defaultImageAlias;
}

export function getIgnorePatterns(config: AlpacaConfig): string[] {
  const dest = fg.convertPathToPattern(buildFolder) + '/**';
  if (!config.ignore) return [dest];
  return [dest, ...config.ignore];
}

const extensionRe = /^\s*\.?([a-z]{3,})\s*$/i;

export function parseExtension(extension: string): string {
  const match = extensionRe.exec(extension);
  return match ? match[1] : extension;
}

export function getExtensions(config: AlpacaConfig): string[] {
  if (!config.imageExtensions) return defaultImageExtensions;
  return config.imageExtensions.map(parseExtension);
}
