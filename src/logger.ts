import winston, { Logger }  from 'winston';
import path from 'node:path';

export type LoggerOptions = {
  quiet?:   boolean;
  logFile?: boolean;
};

export function initLogger(destination: string, options?: LoggerOptions): Logger {
  return winston.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
        ),
        level: options?.quiet ? 'error' : 'info',
      }),
      options?.logFile && new winston.transports.File({
        format: winston.format.json(),
        filename: path.join(destination, 'alpaca-log.log'),
        level: 'info',
      }),
    ].filter(x => !!x),
  });
}
