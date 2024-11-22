import { Command } from 'commander';
import { version } from '@/constants';
import { runAction } from '@/actions';
import {AlpacaConfig} from '@/config/alpaca-config';

export function run(): void {
  const program = new Command();
  program
    .name('alpaca')
    .description('a little blog utility')
    .version(version)

  program.command('build')
    .description('compile all posts, build blog')
    .argument('[PATH]', 'input folder', '.')
    .option('-a, --image-alias <PATH>', 'how to resolve image path alias')
    .option('-q, --quiet', 'silence log messages')
    .option('-l, --log-file', 'create a log file')
    .option('-i, --ignore <PATTERN...>', 'ignore paths matching pattern(s)')
    .option('-n, --never-infer-date', 'never infer post date from file')
    .option('-p, --preserve-images', 'do not compress images')
    .option('-e, --extensions <EXTENSION...>', 'image extensions to look for')
    .action((folder, options) => {
      const config = options as Partial<AlpacaConfig>
      return runAction('build', folder, config);
    });

  program.command('list')
    .description('list all posts with their IDs')
    .alias('ls')
    .argument('[PATH]', 'input folder', '.')
    .option('-i, --ignore <PATTERN...>', 'ignore paths matching pattern(s)')
    .action((folder, options) => {
      const config = options as Partial<AlpacaConfig>
      return runAction('list', folder, config);
    });

  program.command('status')
    .description('show alpaca status')
    .alias('stat')
    .argument('[PATH]', 'input folder', '.')
    .option('-i, --ignore <PATTERN...>', 'ignore paths matching pattern(s)')
    .action((folder, options) => {
      const config = options as Partial<AlpacaConfig>
      return runAction('status', folder, config);
    });

  program.parse();
}
