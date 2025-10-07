export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR"
}

export class Logger {
  static levelOrder = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];

  static currentLevel: LogLevel = LogLevel.DEBUG;

  static shouldLog(level: LogLevel) {
    return this.levelOrder.indexOf(level) >= this.levelOrder.indexOf(this.currentLevel);
  }

  static format(level: LogLevel, msg: string) {
    const now = new Date().toISOString();
    return `[${now}] [${level}] [Solnance] ${msg}`;
  }

  static debug(msg: string) {
    if (this.shouldLog(LogLevel.DEBUG)) console.debug(this.format(LogLevel.DEBUG, msg));
  }

  static info(msg: string) {
    if (this.shouldLog(LogLevel.INFO)) console.info(this.format(LogLevel.INFO, msg));
  }

  static warn(msg: string) {
    if (this.shouldLog(LogLevel.WARN)) console.warn(this.format(LogLevel.WARN, msg));
  }

  static error(msg: string) {
    if (this.shouldLog(LogLevel.ERROR)) console.error(this.format(LogLevel.ERROR, msg));
  }
}
