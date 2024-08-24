import { KestrelConfig, prettyConfig } from '@/config/kestrel-config';
import * as either from '@/monad/either';
import { readConfig } from '@/config/read-config';
import { initLogger } from '@/logger';
import { writeAll } from '@/writer/write-all';
import { Logger } from 'winston';
import { findPosts } from '@/traverse/find-posts';
import {toPostID} from '@/post/id';

/* All action functions are allowed to throw.
 * They're safely handled. */

export type Action = 'build' | 'list' | 'status';
type ActionFn = (config: KestrelConfig, pwd: string, logger?: Logger) => Promise<void>;

const actionSet = new Set<Action>(['build', 'list', 'status']);

const actionTable: Record<Action, ActionFn> = {
  'build': async (config, pwd, logger) => {
    await writeAll(config, pwd, logger);
  },
  'list': async (_, pwd) => {
    const posts   = await findPosts(pwd);
    const message = posts
      .map(post => {
        const id = toPostID(post.relative);
        return `- ${id}: "${post.relative}"`;
      })
      .join('\n');
    process.stdout.write(message + '\n');
  },
  'status': async (config, pwd) => {
    const message = prettyConfig(config);
    process.stdout.write(message + '\n');

    const posts = await findPosts(pwd);
    process.stdout.write(`posts found: ${posts.length}\n`);
  },
};

export async function runAction(action: Action, options?: Partial<KestrelConfig>): Promise<void> {
  const pwd    = process.cwd();
  const config = either.fmap(
    config => ({ ...config, ...options }),
    await readConfig(pwd)
  );
  const quiet  = either.fromEither(config, false, config => config.quiet      );
  const dest   = either.fromEither(config, pwd  , config => config.destination);

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
