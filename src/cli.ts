import { Command } from 'commander';
import { parseOptions } from '@/config/read-cli';
import { runAction } from '@/actions';

export function run(): void {
  const program = new Command();
  program
    .name('kestrel')
    .description('a tiny blog compiler')
    .version('1.0.0')

  program.command('build')
    .description('build blog, compiling posts')
    .argument('[PATH]', 'input folder')
    .option('-d, --destination <PATH>', 'destination folder')
    .option('-p, --posts <PATH>', 'destination folder for posts')
    .option('-i, --images <PATH>', 'destination folder for images')
    .option('-r, --image-root <PATH>', 'how to resolve image path alias "@kestrel"')
    .option('-q, --quiet', 'silence log messages')
    .option('--never-infer-date', 'never infer post date from file')
    .option('--optimize-images', 'optimize post images when building')
    .option('--image-extensions <EXTS>', 'image extensions to look for, comma-separated')
    .action((folder, options) => {
      const config = parseOptions(options);
      return runAction('build', folder, config);
    });

  program.command('list')
    .description('list all posts with their IDs')
    .alias('ls')
    .argument('[PATH]', 'input folder')
    .action((folder, options) => {
      const config = parseOptions(options);
      return runAction('list', folder, config);
    });

  program.command('status')
    .description('show kestrel status')
    .alias('stat')
    .argument('[PATH]', 'input folder')
    .action((folder, options) => {
      const config = parseOptions(options);
      return runAction('status', folder, config);
    });

  program.parse();
}
