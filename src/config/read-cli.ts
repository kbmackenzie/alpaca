import {
  AlpacaConfig,
  defaultImageExtensions,
} from '@/config/alpaca-config';

export type OptionMap = Partial<{
  'destination': string,
  'posts': string,
  'images': string,
  'quiet': boolean;
  'never-infer-date': boolean;
  'optimize-images': boolean;
  'image-alias': string;
  'image-extensions': string;
  'ignore': string;
}>;

/* Assumes argument array option like: 'a,b,c,d'.
 * - Allows space(s) after commas.
 * - Forgives trailing comma at the end. */
function parseArray(arg: string): string[] {
  return arg.split(/,\s*/).filter(x => x.length > 0);
}

/* Parse options received from a Commander options object. */
export function parseOptions(options: OptionMap): Partial<AlpacaConfig> {
  return {
    destination: options['destination'],
    folders: {
      posts:  options['posts'],
      images: options['images'],
    },
    quiet: options['quiet'],
    neverInferDate: options['never-infer-date'],
    optimizeImages: options['optimize-images'],
    imageAlias: options['image-alias'],
    imageExtensions: options['image-extensions']
      ? parseArray(options['image-extensions'])
      : defaultImageExtensions,
  };
}

export function joinConfig(main: AlpacaConfig, extra: Partial<AlpacaConfig>): AlpacaConfig {
  return {
    destination:     extra.destination ?? main.destination,
    folders: {
      posts:  extra.folders?.posts ?? main.folders?.posts,
      images: extra.folders?.images ?? main.folders?.images,
    },
    quiet:           extra.quiet ?? main.quiet,
    neverInferDate:  extra.neverInferDate ?? main.neverInferDate,
    optimizeImages:  extra.optimizeImages ?? main.optimizeImages,
    imageAlias:      extra.imageAlias ?? main.imageAlias,
    imageExtensions: [...(extra.imageExtensions ?? []), ...(main.imageExtensions ?? [])],
    ignore:          [...(extra.ignore ?? []), ...(main.ignore ?? [])],
  };
}
