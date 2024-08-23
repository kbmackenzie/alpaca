import { KestrelConfig } from '@/config/kestrel-config';
import winston, { Logger }  from 'winston';
import path from 'node:path';

export function initLogger(config: KestrelConfig): Logger {
  return winston.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
        ),
        level: config.quiet ? 'error' : 'info',
      }),
      new winston.transports.File({
        format: winston.format.json(),
        filename: path.join(config.root, 'kestrel-log.log'),
        level: 'info',
      }),
    ],
  });
}
