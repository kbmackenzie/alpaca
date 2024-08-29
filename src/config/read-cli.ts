import { AlpacaConfig, } from '@/config/alpaca-config';
import { forgiveJoin } from '@/utils/array';

export type OptionMap = Partial<{
  'quiet': boolean;
  'log-file': boolean;
  'never-infer-date': boolean;
  'preserve-images': boolean;
  'image-alias': string;
  'image-extensions': string[];
  'ignore': string[];
}>;

/* Parse options received from a Commander options object. */
export function parseOptions(options: OptionMap): Partial<AlpacaConfig> {
  return {
    quiet: options['quiet'],
    logFile: options['log-file'],
    neverInferDate: options['never-infer-date'],
    preserveImages: options['preserve-images'],
    imageAlias: options['image-alias'],
    imageExtensions: options['image-extensions'],
    ignore: options['ignore'],
  };
}

export function joinConfig(main: AlpacaConfig, extra: Partial<AlpacaConfig>): AlpacaConfig {
  return {
    quiet:           extra.quiet ?? main.quiet,
    logFile:         extra.logFile ?? main.logFile,
    neverInferDate:  extra.neverInferDate ?? main.neverInferDate,
    preserveImages:  extra.preserveImages ?? main.preserveImages,
    imageAlias:      extra.imageAlias ?? main.imageAlias,
    imageExtensions: forgiveJoin(extra.imageExtensions, main.imageExtensions),
    ignore:          forgiveJoin(extra.ignore, main.ignore),
  };
}
