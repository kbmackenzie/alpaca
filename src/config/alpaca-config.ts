import fg from 'fast-glob';
import { version, buildFolder } from '@/constants';
import { forgiveJoin } from '@/utils/array';

export type AlpacaConfig = Readonly<{
  quiet?: boolean;
  ['log-file']?: boolean;
  ['never-infer-date']?: boolean;
  ['preserve-images']?: boolean;
  ['image-alias']?: string;
  ['image-extensions']?: string[];
  ignore?: string[];
}>;

export const defaultImageExtensions = ['png', 'jpg', 'webp', 'gif'];
export const defaultImageAlias = '/';

function yesOrNo(value: any): string {
  return value ? 'yes' : 'no';
}

function prettyArray(
  arr: string[] | undefined,
  def: string[],
  prettify: (xs: string[]) => string,
): string {
  const choice = arr ? arr : def;
  if (choice.length === 0) return '[]';
  return prettify(choice);
}

export function prettyConfig(config: AlpacaConfig): string {
  const extensions = prettyArray(
    config['image-extensions'],
    defaultImageExtensions,
    (xs) => xs.map(parseExtension).join(', ')
  );

  const ignored = prettyArray(
    config.ignore,
    [],
    (xs) => xs.map(x => `"${x}"`).join(', ')
  );

  return [
    `alpaca v${version}`,
    '',
    `quiet: ${config.quiet ? 'yes' : 'no'}`,
    `infer date: ${config['never-infer-date'] ? 'never' : 'as needed'}`,
    `resolve image alias: ${yesOrNo(config['image-alias'])}`,
    `preserve images: ${yesOrNo(config['preserve-images'])}`,
    `image extensions: ${extensions}`,
    `ignore: ${ignored}`,
  ].join('\n');
}

export function getImageAlias(config: AlpacaConfig): string {
  return config['image-alias'] ?? defaultImageAlias;
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
  if (!config['image-extensions']) return defaultImageExtensions;
  return config['image-extensions'].map(parseExtension);
}

export function joinConfig(main: AlpacaConfig, extra: Partial<AlpacaConfig>): AlpacaConfig {
  return {
    quiet:                extra.quiet ?? main.quiet,
    ['log-file']:         extra['log-file'] ?? main['log-file'],
    ['never-infer-date']: extra['never-infer-date'] ?? main['never-infer-date'],
    ['preserve-images']:  extra['preserve-images'] ?? main['preserve-images'],
    ['image-alias']:      extra['image-alias'] ?? main['image-alias'],
    ['image-extensions']: forgiveJoin(extra['image-extensions'], main['image-extensions']),
    ignore:               forgiveJoin(extra.ignore, main.ignore),
  };
}
