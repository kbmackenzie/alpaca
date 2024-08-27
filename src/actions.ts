import { AlpacaConfig, prettyConfig } from '@/config/alpaca-config';
import * as either from '@/monad/either';
import { readConfig } from '@/config/read-config';
import { initLogger } from '@/logger';
import { writeAll } from '@/write-all';
import { Logger } from 'winston';
import { findPosts } from '@/post/find-posts';
import { nubBy } from '@/utils/nub';
import { joinConfig } from '@/config/read-cli';

/* All action functions are allowed to throw.
 * They're safely handled. */

export type Action = 'build' | 'list' | 'status';
type ActionFn = (config: AlpacaConfig, pwd: string, logger?: Logger) => Promise<void>;

const actionSet = new Set<Action>(['build', 'list', 'status']);

const actionTable: Record<Action, ActionFn> = {
  'build': async (config, pwd, logger) => {
    await writeAll(config, pwd, logger);
  },
  'list': async (config, pwd) => {
    const posts = await findPosts(config, pwd)
      .then(posts => nubBy(posts, post => post.id));

    const message = posts
      .map(post => `- ${post.id}: "${post.folder.relative}"`)
      .join('\n');
    process.stdout.write(message + '\n');
  },
  'status': async (config, pwd) => {
    const message = prettyConfig(config);
    process.stdout.write(message + '\n');

    const posts = await findPosts(config, pwd)
      .then(posts => nubBy(posts, post => post.id));
    process.stdout.write(`posts found: ${posts.length}\n`);
  },
};

export async function runAction(
  action: Action,
  folder?: string,
  options?: Partial<AlpacaConfig>
): Promise<void> {
  const pwd    = folder ?? process.cwd();
  const config = either.fmap(
    config => joinConfig(config, options ?? {}),
    await readConfig(pwd)
  );
  const quiet  = either.fromEither(config, _ => false, config => config.quiet      );
  const dest   = either.fromEither(config, _ => pwd  , config => config.destination);

  const logger = initLogger(dest, quiet);
  if (config.type === 'left') {
    logger.error(config.value);
    process.exitCode = 1;
    return;
  }
  if (!actionSet.has(action)) {
    logger.error(`Invalid action: ${action}`);
    process.exitCode = 1;
    return;
  }
  try {
    await actionTable[action](config.value, pwd, logger);
  }
  catch (error) {
    logger.error(String(error));
    process.exitCode = 1;
    return;
  }
}
