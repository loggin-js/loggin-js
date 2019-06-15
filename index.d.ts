// Type definitions for loggin-js
const strif = require('strif');

export type SupportedLoggers = 'console' | 'file' | 'remote' | 'memory' | 'default';
export type SupportedSeverities = 'DEBUG' | 'INFO' | 'NOTICE' | 'WARNING' | 'ERROR' | 'CRITICAL' | 'ALERT' | 'EMERGENCY';
export type SupportedFormatters = 'short' | 'medium' | 'long' | 'detailed' | 'minimal' | 'default';


export class Log {
  message: string;
  data: any;
  level: Severity;
  channel: string;
  levelStr: string;
  time: number | Date;
  user: string;
}

export class Formatter {
  constructor(template: strif.StrifTemplate): Formatter;

  /**
   * Format a log
   */
  public formatLog(log: Log, opts: any): string;

  /**
   * Process log and color specific segments
   */
  public color(str: string): string;

  /**
   * Format a log through any formatter
   */
  static format(log: Log, formatter: Formatter, color: boolean = false): string;

  /**
   * Alias for search
   */
  static get(value: any): Formatter;

  /**
   * Searches and tries to find a formatter
   */
  static search(value: any): Formatter;

  /**
   * Register a new Formatter, can then be used as any other Formatter
   * 
   * @example
   * Formatter.register(
   *   'CUSTOM',
   *   '{prop}', {
   *     props: { }
   *   }
   * );
   * 
   * logger.formatter('CUSTOM');
   * logger.formatter(Formatter.CUSTOM);
   * logger.formatter(Formatter.get('CUSTOM'));
   */
  static register(val: any): Formatter;


  /**
   * This is kinda weird, need to refactor, PR's welcome
   */
  static replaceables: [{ regexp: RegExp, fn: (str: string) => string }];
}

export class Logger {
  constructor(options: LoggerOptions);

  static get(opts = 'default', args = {}): Logger;
  static merge(loggers, opts = {}): Logger;

  enabled(enabled?: boolean): this;
  user(user?: string): this;
  channel(channel?: boolean): this;
  level(level?: number | string | Severity): this;
  formatter(name?: SupportedFormatters): this;
  color(enable: boolean): this;
  lineNumbers(show: boolean): this;

  canLog(severity: Severity): boolean;

  notifier(...notifier: Notifiers.Notifier): this;
  hasNotifier(name: string): boolean;
  getNotifier(name: string): Notifiers.Notifier;
  setNotifiers(notifiers: Notifiers.Notifier[]): this;

  options: LoggerOptions;

  /**
   * Clone the logger
   */
  clone(options: LoggerOptions): Logger;

  /**
   * Alias for clone
   */
  fork(options: LoggerOptions): Logger;

  /**
   * Log a message to set notifier
   * @param message - message to be logged
   * @param data - some data to log
   * @param options - overwrite options for that specific log
   */
  log(
    message: string,
    data?: any,
    options?: LogOptions
  ): this;

  /**
   * @description Logs with severity set to DEBUG
   * @param message - message to be logged
   * @param data - some data to log
   * @param options - overwrite options for that specific log
   */
  debug(
    message: string,
    data?: any,
    options?: LogOptions
  ): this;

  /**
   * @description Logs with severity set to WARNING
   * @param message - message to be logged
   * @param data - some data to log
   * @param options - overwrite options for that specific log
   */
  warning(
    message: string,
    data?: any,
    options?: LogOptions
  ): this;

  /**
   * @description Logs with severity set to EMERGENCY
   * @param message - message to be logged
   * @param data - some data to log
   * @param options - overwrite options for that specific log
   */
  emergency(
    message: string,
    data?: any,
    options?: LogOptions
  ): this;

  /**
   * @description Logs with severity set to CRITICAL
   * @param message - message to be logged
   * @param data - some data to log
   * @param options - overwrite options for that specific log
   */
  critical(
    message: string,
    data?: any,
    options?: LogOptions
  ): this;

  /**
   * @description Logs with severity set to ERROR
   * @param message - message to be logged
   * @param data - some data to log
   * @param options - overwrite options for that specific log
   */
  error(
    message: string,
    data?: any,
    options?: LogOptions
  ): this;

  /**
   * @description Logs with severity set to NOTICE
   * @param message - message to be logged
   * @param data - some data to log
   * @param options - overwrite options for that specific log
   */
  notice(
    message: string,
    data?: any,
    options?: LogOptions
  ): this;


  /**
   * @description Logs with severity set to INFO
   * @param message - message to be logged
   * @param data - some data to log
   * @param options - overwrite options for that specific log
   */
  info(
    message: string,
    data?: any,
    options?: LogOptions
  ): this;

  /**
   * @description Logs with severity set to SILLY
   * @param message - message to be logged
   * @param data - some data to log
   * @param options - overwrite options for that specific log
   */
  silly(
    message: string,
    data?: any,
    options?: LogOptions
  ): this;
}

export class LogOptions {
  level?: number | string | Severity;
  user?: string;
  channel?: string;
  time?: number | Date;
}

export class LoggerOptions {
  color?: boolean = false;
  lineNumbers?: boolean = false;
  level?: number | string | Severity;
  user?: string;
  channel?: string;
  formatter?: SupportedFormatters;
  notifiers?: Notifiers.Notifier[];

  /**
   * Runs for each notifier
   * check wether to ignore loggin to that notifier
   */
  ignore?(log: Log, notifier: Notifiers.Notifier): boolean;

  /**
   * Runs for each notifier
   * you can modify the log inside and it will affect the log outputed
   */
  preNotify?(log: Log, notifier: Notifiers.Notifier): void;
}

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

  /**
   * Alias for search
   */
  static get(level: number | string | Severity): Severity;

  /**
   * Searches and tries to find a severity maching level
   */
  static search(level: number | string): Severity;

  /**
   * Register a new Severity, can then be used as any other Severity
   * 
   * @example
   * Severity.register(10, 'CUSTOM');
   * ...
   * 
   * logger.level('CUSTOM');
   * logger.level(Severity.CUSTOM);
   * logger.level(Severity.get(10));
   */
  static register(level: number, name: string);

  level: number;
  name: string;
  englobes: Severity[];
  fileLogginLevel: string;

  /**
   * Check wether this severity englobes another `severity`.
   * 
   * Following standard rfc3164 Severity levels go from 0-7, a level will log itself and any level below  
   * i.e: A level of `7` _DEBUG_ will log all logs as its the higher value 
   */
  canLog(severity: Severity): boolean;

  /**
   * Returns string representation of this severity
   */
  toString(): string;

  /**
   * Returns int representation of this severity
   */
  toInt(): number;
}

export namespace Notifiers {
  class Console extends loggin.Notifiers.Notifier { }
  class File extends loggin.Notifiers.Notifier { }
  class Remote extends loggin.Notifiers.Notifier { }
  class Memory extends loggin.Notifiers.Notifier { }
  class Notifier {
    constructor(options: Notifiers.Options): Notifier;

    canOutput(level: Severity): boolean;
    level(level?: number | string | Severity): this;
    formatter(str?: string): this;
    color(enable?: boolean): this;

    lineNumbers(show?: boolean): this;
    notify(log: Log): this;
    pipe?(severity: Severity, filepath: string): this;

    options: Notifiers.Options;
  }

  export function get(opts: Notifiers.Options): Notifiers.Notifier;
  export function get(name: SupportedLoggers, opts: Notifiers.Options): Notifiers.Notifier;

  interface Options extends LoggerOptions {
    filepath?: string;
    pipes?: Pipe;
    level?: Severity;
  }
}

export interface Pipe {
  severity: Severity;
  filepath: string;
}
export class Pipe implements Pipe {
  constructor(severity: Severity, filepath: string);
}

export function logger(name: SupportedLoggers, opts: LoggerOptions): Logger;
export function logger(opts: LoggerOptions, ...args: Notifiers.Notifier): Logger;

export function notifier(opts: Notifiers.Options): Notifiers.Notifier;
export function notifier(name: SupportedLoggers, opts: Notifiers.Options): Notifiers.Notifier;

export function severity(level: SupportedSeverities): Severity<level>;
export function severity(level: number): Severity<level>;
export function severity(level: Severity): Severity<level>;
export function severity(): Severity<'DEBUG'>;

export function formatter(name: SupportedFormatters): Formatter;
export function formatter(template: strif.StrifTemplate): Formatter;

export function pipe(level: string, filepath: string): Pipe;
