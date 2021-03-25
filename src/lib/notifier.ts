'use strict';

import { Severity } from './severity';
import { Formatter } from './formatter';
import { isFunction } from './util';
import { Log } from './log';
import { EmptyRegistry } from './registry/empty-registry';

export interface NotifierOptions {
  name: string;
  color: boolean;
  enabled: boolean;
  level: Severity;
  lineNumbers?: boolean;
  formatter?: Formatter;
  ignore?: (log: Log) => boolean;
  preNotify?: (log: Log) => void;

  // From http notifier, should remove from here
  headers?: {};
  url?: any;
  pipes?: any;
  filepath?: any;
}

export class Notifier {
  static registry = new EmptyRegistry<Notifier>();

  public name: any;
  public lineIndex: number;
  public options: NotifierOptions;

  constructor(options: Partial<NotifierOptions> = {}, name: string) {
    this.options = {
      color: false,
      enabled: true,
      name: name || 'notifier',
      level: options.level,
      ...options,
    };
    this.name = this.options.name || name || 'notifier';
    this.options.level = this.options.level;
    this.options.color = this.options.color;
    this.options.lineNumbers = this.options.lineNumbers;
    this.options.enabled = this.options.enabled;
    this.lineIndex = 0;

    if (typeof this.options.formatter === 'string') {
      this.formatter(this.options.formatter);
    } else {
      this.formatter('detailed');
    }
  }

  canOutput(log) {
    if (!log) return false;

    const { level, ignore } = this.options;
    const canLogLevel = level.canLog(log.level);
    const isIgnored = ignore && typeof ignore === 'function' && ignore(log);

    return canLogLevel && !isIgnored;
  }

  enabled(enabled) {
    this.options.enabled = enabled;
    return this;
  }

  level(level) {
    this.options.level = Severity.registry.get(level);
    return this;
  }

  formatter(formatter) {
    this.options.formatter = Formatter.registry.get(formatter);
    return this;
  }

  color(val) {
    this.options.color = val;
    return this;
  }

  lineNumbers(show) {
    this.options.lineNumbers = show;
    return this;
  }

  getLineWithNumber(log) {
    const lineNum = this.lineIndex++;
    return `(${lineNum}) ${log}`;
  }

  notify(log: Log): Notifier {
    const { formatter, color, preNotify } = this.options;
    const output: string = formatter.formatLog(log, { color });

    if (isFunction(preNotify)) preNotify(log);

    this.output(output, log);

    return this;
  }

  /* istanbul ignore next */
  output(output: string, log: Log): void {
    return;
  }
}
