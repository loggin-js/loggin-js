// Type definitions for loggin-js
import strif = require('strif');

export type SupportedLoggers = 'console' | 'file' | 'remote' | 'memory' | 'default';
export type SupportedSeverities = 'DEBUG' | 'INFO' | 'NOTICE' | 'WARNING' | 'ERROR' | 'CRITICAL' | 'ALERT' | 'EMERGENCY';
export type SupportedFormatters = 'short' | 'medium' | 'long' | 'detailed' | 'minimal' | 'json' | 'default';


export class Log {
  message: string;
  data: any;
  level: Severity;
  channel: string;
  levelStr: string;
  time: number | Date;
  user: string;

  constructor(message: string, data: any, level: Severity, channel: string, time: Date | number, user: string);
}

export class Formatter {
  constructor(template: strif.StrifTemplate);

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
  static format(log: Log, formatter: Formatter, color: boolean): string;

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

  enabled(enabled?: boolean): this;
  user(user?: string): this;
  channel(channel?: boolean): this;
  level(level?: number | string | Severity): this;
  formatter(name?: SupportedFormatters): this;
  color(enable: boolean): this;
  lineNumbers(show: boolean): this;

  canLog(severity: Severity): boolean;

  notifier(...notifier: Notifier[]): this;
  hasNotifier(name: string): boolean;
  getNotifier(name: string): Notifier;
  setNotifiers(notifiers: Notifier[]): this;

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

  static get(opts: string, args: any): Logger;
  static merge(loggers, opts: any): Logger;

  /**
   * Searches and tries to find a formatter
   */
  static search(value: any): Logger;

  /**
   * Register a new Logger, with a default Notifier attached, can then be used as any other Logger
   * 
   * @example
   * Logger.register('console', 'Console');
   * ...
   * 
   * logger.logger('console');
   */
  static register(name: string, notifier: string);
}

export class LogOptions {
  level?: number | string | Severity;
  user?: string;
  channel?: string;
  time?: number | Date;
}

export class LoggerOptions {
  color?: boolean;
  channel?: string;
  formatter?: SupportedFormatters;
  lineNumbers?: boolean;
  level?: number | string | Severity;
  user?: string;
  notifiers?: Notifier[];

  /**
   * Runs for each notifier
   * check wether to ignore the log
   */
  ignore?(log: Log, notifier: Notifier): boolean;

  /**
   * Runs for each notifier
   * you can modify the log inside and it will affect the log outputed
   */
  preNotify?(log: Log, notifier: Notifier): void;
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

export class Notifier {
  constructor(options: Options);

  canOutput(level: Severity): boolean;
  level(level?: number | string | Severity): this;
  formatter(str?: string): this;
  enabled(enabled?: boolean): this;
  color(enable?: boolean): this;

  lineNumbers(show?: boolean): this;
  notify(log: Log): this;
  output(message: string, log: Log): this;
  pipe?(severity: Severity, filepath: string): this;

  options: Options;

  /**
   * Alias for search
   */
  static get(opts?: Options): Notifier;
  static get(value?: string, opts?: Options): Notifier;

  /**
   * Searches and tries to find a formatter
   */
  static search(value: any): Notifier;

  /**
   * Register a new Notifier, can then be used as any other Notifier
   * 
   * @example
   * Notifier.register('CUSTOM', class {});
   * ...
   * 
   * logger.notifier('CUSTOM');
   * logger.notifier(notifier.CUSTOM);
   * logger.notifier(notifier.get('CUSTOM'));
   */
  static register(name: string, ctor: Function);
}


interface Options extends LoggerOptions {
  filepath?: string;
  pipes?: Pipe;
  level?: Severity;

  /**
   * check wether to ignore the log
   */
  ignore?(log: Log): boolean;

  /**
   * Allows to modify the log
   */
  preNotify?(log: Log): void;
}

export interface Pipe {
  severity: Severity;
  filepath: string;
}
export class Pipe implements Pipe {
  constructor(severity: Severity, filepath: string);
}

export function logger(name?: SupportedLoggers, opts?: LoggerOptions): Logger;
export function logger(opts?: LoggerOptions, ...args: Notifier[]): Logger;

export function notifier(opt?: Options): Notifier;
export function notifier(name?: SupportedLoggers, opts?: Options): Notifier;

export function severity(level?: SupportedSeverities): Severity;
export function severity(level?: number): Severity;
export function severity(level?: Severity): Severity;
export function severity(): Severity;

export function formatter(name?: SupportedFormatters): Formatter;
export function formatter(template?: strif.StrifTemplate): Formatter;

export function pipe(level: string, filepath: string): Pipe;
export function use(plugin: (loggin: any) => void): void;

export default interface LogginJS {
  logger(name?: SupportedLoggers, opts?: LoggerOptions): Logger;
  logger(opts?: LoggerOptions, ...args: Notifier[]): Logger;

  notifier(opt?: Options): Notifier;
  notifier(name?: SupportedLoggers, opts?: Options): Notifier;

  severity(level?: SupportedSeverities): Severity;
  severity(level?: number): Severity;
  severity(level?: Severity): Severity;
  severity(): Severity;

  formatter(name?: SupportedFormatters): Formatter;
  formatter(template?: strif.StrifTemplate): Formatter;

  pipe(level: string, filepath: string): Pipe;
  use(plugin: (loggin: any) => void): void;
}