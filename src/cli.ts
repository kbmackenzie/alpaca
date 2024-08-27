import { Command } from 'commander';
import { version } from '@/constants';
import { parseOptions } from '@/config/read-cli';
import { runAction } from '@/actions';

export function run(): void {
  const program = new Command();
  program
    .name('alpaca')
    .description('a little blog utility')
    .version(version)

  program.command('build')
    .description('compile all posts, build blog')
    .argument('[PATH]', 'input folder', '.')
    .option('-d, --destination <PATH>', 'destination folder')
    .option('-p, --posts <PATH>', 'destination folder for posts')
    .option('-m, --images <PATH>', 'destination folder for images')
    .option('-a, --image-alias <PATH>', 'how to resolve image path alias')
    .option('-q, --quiet', 'silence log messages')
    .option('-i, --ignore <PATTERN...>', 'ignore paths matching pattern(s)')
    .option('--never-infer-date', 'never infer post date from file')
    .option('--optimize-images', 'optimize post images when building')
    .option('--extensions <EXTENSION...>', 'image extensions to look for, comma-separated')
    .action((folder, options) => {
      const config = parseOptions(options);
      return runAction('build', folder, config);
    });

  program.command('list')
    .description('list all posts with their IDs')
    .alias('ls')
    .argument('[PATH]', 'input folder', '.')
    .option('-i, --ignore <PATTERN...>', 'ignore paths matching pattern(s)')
    .action((folder, options) => {
      const config = parseOptions(options);
      return runAction('list', folder, config);
    });

  program.command('status')
    .description('show alpaca status')
    .alias('stat')
    .argument('[PATH]', 'input folder', '.')
    .option('-i, --ignore <PATTERN...>', 'ignore paths matching pattern(s)')
    .action((folder, options) => {
      const config = parseOptions(options);
      return runAction('status', folder, config);
    });

  program.parse();
}
