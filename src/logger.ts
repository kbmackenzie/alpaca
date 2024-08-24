import winston, { Logger }  from 'winston';
import path from 'node:path';

export function initLogger(destination: string, quiet: boolean = false): Logger {
  return winston.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
        ),
        level: quiet ? 'error' : 'info',
      }),
      new winston.transports.File({
        format: winston.format.json(),
        filename: path.join(destination, 'kestrel-log.log'),
        level: 'info',
      }),
    ],
  });
}
