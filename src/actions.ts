import { KestrelConfig } from '@/config/kestrel-config';
import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import { readConfig } from '@/config/read-config';
import { initLogger } from '@/logger';
import { compilePost } from '@/compile/post';
import { Logger } from 'winston';

/* All action functions are allowed to throw.
 * They're safely handled. */

export type Action = 'build' | 'ls' | 'stat';
type ActionFn = (config: KestrelConfig, logger?: Logger) => Promise<void>;

const actionTable: Record<Action, ActionFn> = {
  'build': async (config, logger) => {
  },
  'ls':    async (config, logger) => {
  },
  'stat':  async (config, logger) => {
  },
};

export async function runAction(action: Action): Promise<void> {
  const cwd    = process.cwd();
  const config = await readConfig(cwd);

  const quiet  = either.fromEither(config, false, config => config.quiet);
  const dest   = either.fromEither(config, cwd  , config => config.root );

  const logger = initLogger(dest, quiet);
  if (config.type === 'left') {
    logger.error(config.value);
    process.exit(1); /* Exit with failure code 1. */
  }
  try {
    return actionTable[action](config.value);
  }
  catch (error) {
    logger.error(String(error));
    process.exit(1); /* Exit with failure code 1. */
  }
}
