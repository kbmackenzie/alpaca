import { defaultImageExtensions, KestrelConfig } from '@/config/kestrel-config';

export type OptionMap = Partial<{
  'append-date': boolean;
  'never-infer-date': boolean;
  'optimize-images': boolean;
  'image-root': string;
  'image-extensions': string;
}>;

/* Assumes argument array option like: 'a,b,c,d'.
 * - Allows space(s) after commas.
 * - Forgives trailing comma at the end. */
function parseArray(arg: string): string[] {
  return arg.split(/,\s*/).filter(x => x.length > 0);
}

/* Parse options received from a Commander options object. */
export function parseOptions(options: OptionMap): KestrelConfig {
  return {
    appendDate: options['append-date'],
    neverInferDate: options['never-infer-date'],
    optimizeImages: options['optimize-images'],
    images: options['image-root'] ? {
      resolveAlias: !!options['image-root'],
      imageRoot: options['image-root']
    } : undefined,
    imageExtensions: options['image-extensions']
      ? parseArray(options['image-extensions'])
      : defaultImageExtensions,
  };
}
