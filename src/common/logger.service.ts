import { LoggerService, Injectable, LogLevel } from '@nestjs/common';

@Injectable()
export class JsonLogger implements LoggerService {
  private logLevels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose'];

  log(message: any, context?: string) {
    this.printMessage('log', message, context);
  }

  error(message: any, trace?: string, context?: string) {
    this.printMessage('error', message, context, trace);
  }

  warn(message: any, context?: string) {
    this.printMessage('warn', message, context);
  }

  debug(message: any, context?: string) {
    this.printMessage('debug', message, context);
  }

  verbose(message: any, context?: string) {
    this.printMessage('verbose', message, context);
  }

  private printMessage(
    level: LogLevel,
    message: any,
    context?: string,
    trace?: string,
  ) {
    if (!this.logLevels.includes(level)) return;

    const log = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      trace,
    };

    console.log(JSON.stringify(log));
  }
}
