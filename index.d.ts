// Type definitions for loggin-js
const strif = require('strif');


export interface Log {
  message: string;
  data: string;
  severity: Severity;
  channel: string;
  severityStr: string;
  time: string;
  user: string;

  /**
   * This is kinda weird, need to refactor, PR's welcome
   */
  replaceables: [{ regexp: RegExp, fn: (str: string) => string }];

  /**
   * Colors logs, predefined segments will be colored as well as anything matching `<%gTEXT>`
   * Check the wiki for more info on formating
   * @param str 
   */
  colored(str): string;
  format(formatter: Formatter): string;
}

export interface Formatter {
  constructor(template: strif.StrifTemplate): Formatter;
  static format(log, formatter: Formatter, color: boolean = false): string;
}

export namespace Loggers {
  class Console extends Loggers.Logger {
    constructor(options: Loggers.Options);
  }

  class File extends Loggers.Logger {
    constructor(options: Loggers.Options);
  }

  class Remote extends Loggers.Logger {
    constructor(options: Loggers.Options);
  }

  class Memory extends Loggers.Logger {
    constructor(options: Loggers.Options);
  }

  class Logger extends Loggers.Logger {
    constructor(options: Loggers.Options);
  }

  class Logger {
    constructor(options: Loggers.Options, ...notifier: Notifiers.Notifier);

    enabled(enabled?: boolean): this;
    user(user?: string): this;
    channel(channel?: boolean): this;
    level(level?: number | string | Severity): this;
    formatter(str?: string): this;
    color(enable: boolean): this;
    lineNumbers(show: boolean): this;
    canLog(severity: Severity): boolean;

    /**
     * Log a message to set notifier
     * @param message - message to be logged
     * @param data - some data to log
     * @param channel - overwrite channel
     * @param level - level of the log
     * @param time - timestamp of the log
     * @param user - user who dispatched the log
     */
    log(
      message: string,
      data: any,
      level?: int | Severity,
      channel?: string,
      time?: date | number,
      user?: string
    ): this;

    /**
     * @description Logs with severity set to DEBUG
     * @param message - message to be logged
     * @param data - some data to log
     * @param channel - overwrite channel
     */
    debug(
      message: string,
      data?: any,
      channel?: any
    ): this;

    /**
     * @description Logs with severity set to WARNING
     * @param message - message to be logged
     * @param data - some data to log
     * @param channel - overwrite channel
     */
    warning(
      message: string,
      data?: any,
      channel?: any
    ): this;

    /**
     * @description Logs with severity set to EMERGENCY
     * @param message - message to be logged
     * @param data - some data to log
     * @param channel - overwrite channel
     */
    emergency(
      message: string,
      data?: any,
      channel?: any
    ): this;

    /**
     * @description Logs with severity set to CRITICAL
     * @param message - message to be logged
     * @param data - some data to log
     * @param channel - overwrite channel
     */
    critical(
      message: string,
      data?: any,
      channel?: any
    ): this;

    /**
     * @description Logs with severity set to ERROR
     * @param message - message to be logged
     * @param data - some data to log
     * @param channel - overwrite channel
     */
    error(
      message: string,
      data?: any,
      channel?: any
    ): this;

    /**
     * @description Logs with severity set to NOTICE
     * @param message - message to be logged
     * @param data - some data to log
     * @param channel - overwrite channel
     */
    notice(
      message: string,
      data?: any,
      channel?: any
    ): this;


    /**
     * @description Logs with severity set to INFO
     * @param message - message to be logged
     * @param data - some data to log
     * @param channel - overwrite channel
     */
    info(
      message: string,
      data?: any,
      channel?: any
    ): this;
  }

  interface Options {
    color?: boolean = false;
    lineNumbers?: boolean = false;
    level?: number | string | Severity;
    user?: string;
    channel?: string;
    formatter?: string;
    notifiers?: Notifiers.Notifier[]
  }
}

/**
 * 
 */
export class Severity {
  constructor(level: number, name: string, englobes: Severity[], fileLogginLevel: Severity);

  static EMERGENCY: Severity;
  static ALERT: Severity;
  static CRITICAL: Severity;
  static ERROR: Severity;
  static WARNING: Severity;
  static NOTICE: Severity;
  static INFO: Severity;
  static DEBUG: Severity;
}

export namespace Notifiers {
  class Console extends loggin.Notifiers.Notifier { }
  class File extends loggin.Notifiers.Notifier { }
  class Remote extends loggin.Notifiers.Notifier { }
  class Memory extends loggin.Notifiers.Notifier { }
  class Notifier {
    constructor(options): Notifier;

    canOutput(level: Severity): boolean;
    level(level?: number | string | Severity): this;
    formatter(str?: string): this;
    color(enable?: boolean): this;

    lineNumbers(show?: boolean): this;
    notify(log: Log): this;
    pipe?(severity: Severity, filepath: string): this;
  }

  class Pipe { }

  interface Options extends Loggers.Options {
    filepath?: string;
    pipes?: Notifiers.Pipe
  }
}


export type SuportedLoggers = 'console' | 'file' | 'remote' | 'memory' | 'default';
export type SuportedSeverities = 'DEBUG' | 'INFO' | 'NOTICE' | 'WARNING' | 'ERROR' | 'CRITICAL' | 'ALERT' | 'EMERGENCY';
export type SuportedFormatters = 'short' | 'medium' | 'long' | 'detailed' | 'minimal' | 'default';


export function logger(name: SuportedLoggers, opts: Loggers.Options): Loggers.Logger;
export function logger(opts: Loggers.Options, ...args: Notifiers.Notifier): Loggers.Logger;

export function notifier(opts: Notifiers.Options): Notifiers.Notifier;
export function notifier(name: SuportedLoggers, opts: Notifiers.Options): Notifiers.Notifier;

export function severity(level: SuportedSeverities): Severity<level>;
export function severity(level: number): Severity<level>;
export function severity(level: Severity): Severity<level>;
export function severity(): Severity<'DEBUG'>;

export function formatter(name: SuportedFormatters): Formatter;
export function formatter(template: strif.StrifTemplate): Formatter;