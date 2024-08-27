import {
  AlpacaConfig,
} from '@/config/alpaca-config';

export type OptionMap = Partial<{
  'quiet': boolean;
  'never-infer-date': boolean;
  'optimize-images': boolean;
  'image-alias': string;
  'image-extensions': string[];
  'ignore': string[];
}>;

/* Parse options received from a Commander options object. */
export function parseOptions(options: OptionMap): Partial<AlpacaConfig> {
  return {
    quiet: options['quiet'],
    neverInferDate: options['never-infer-date'],
    optimizeImages: options['optimize-images'],
    imageAlias: options['image-alias'],
    imageExtensions: options['image-extensions'],
    ignore: options['ignore'],
  };
}

export function joinConfig(main: AlpacaConfig, extra: Partial<AlpacaConfig>): AlpacaConfig {
  return {
    quiet:           extra.quiet ?? main.quiet,
    neverInferDate:  extra.neverInferDate ?? main.neverInferDate,
    optimizeImages:  extra.optimizeImages ?? main.optimizeImages,
    imageAlias:      extra.imageAlias ?? main.imageAlias,
    imageExtensions: [...(extra.imageExtensions ?? []), ...(main.imageExtensions ?? [])],
    ignore:          [...(extra.ignore ?? []), ...(main.ignore ?? [])],
  };
}
