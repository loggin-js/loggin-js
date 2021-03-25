import { Severity } from './severity';
import { Notifier } from './notifier';
import { Log, LogOptions } from './log';
import { getOsUsername, getFileBasename, isFunction } from './util';
import { EmptyRegistry } from './registry/empty-registry';

export interface LoggerOptions {
  user: any;
  channel: any;
  color: boolean;
  ignore: any;
  preNotify: any;
  level: Severity;
  formatter: string;
  enabled: boolean;
  lineNumbers: boolean;
  notifiers: Notifier[];
}

export class Logger {
  [name: string]: any;

  static registry = new EmptyRegistry<Logger>();
  public options: {
    user: any;
    channel: any;
    color: boolean;
    ignore: any;
    preNotify: any;
    level: Severity;
    formatter: string;
    enabled: boolean;
    lineNumbers: boolean;
    notifiers: Notifier[];
  };
  private notifiers: any[];

  constructor(options = {}) {
    this.options = {
      user: getOsUsername(),
      channel: getFileBasename(),
      color: true,
      ignore: null,
      preNotify: null,
      level: Severity.registry.get('default'),
      formatter: 'default',
      enabled: true,
      lineNumbers: false,
      notifiers: [],
      ...options,
    };

    if (this.options.notifiers && this.options.notifiers.length > 0) {
      this.setNotifiers(this.options.notifiers);
    } else {
      this.setNotifiers([Notifier.registry.get('default')]);
    }

    this.level(this.options.level);
    this.user(this.options.user);
    this.channel(this.options.channel);
    this.enabled(this.options.enabled);
    this.color(this.options.color);
    this.formatter(this.options.formatter);
    this.lineNumbers(this.options.lineNumbers);
  }

  clone(options = {}) {
    return new Logger({ ...this.options, ...options });
  }

  fork(options = {}) {
    return this.clone(options);
  }

  // Notifier stuff
  notifier(...notifiers) {
    this.notifiers = [...this.notifiers, ...notifiers];
    return this;
  }

  setNotifiers(notifiers) {
    this.notifiers = notifiers;
    return this;
  }

  hasNotifier(name) {
    return this.notifiers.some((notif) => notif.name === name);
  }

  getNotifier(name) {
    if (this.hasNotifier(name)) {
      return this.notifiers.filter((notif) => notif.name === name).pop();
    }

    return null;
  }

  log(message, data, overrideOptions: Partial<LogOptions> = {}) {
    if (!this.options.enabled) return;

    const logOptions: LogOptions = {
      level: overrideOptions.level || this.options.level,
      channel: overrideOptions.channel || this.options.channel,
      user: overrideOptions.user || this.options.user,
      time: overrideOptions.time || new Date(),
      data,
      message,
    };

    let log = message;
    if (!(message instanceof Log)) {
      log = Log.fromObject(logOptions);
    }

    this.notifiers.forEach((notifier) => this.logToNotifier(notifier, log));

    return this;
  }

  private logToNotifier(notifier: Notifier, log: Log) {
    if (!notifier.canOutput(log)) return;
    if (!notifier.options.enabled) return;

    if (isFunction(this.options.preNotify)) {
      this.options.preNotify(log, notifier);
    }

    // Ignore done after 'preNotify', in case someone wants to modify log or notifier in 'preNotify'
    if (isFunction(this.options.ignore) && this.options.ignore(log, notifier)) return;

    notifier.notify(log);
  }

  // Options
  channel(channel) {
    this.options.channel = channel;
    return this;
  }

  enabled(enabled) {
    this.options.enabled = enabled;
    return this;
  }

  user(user) {
    this.options.user = user;
    return this;
  }

  level(level) {
    this.options.level = Severity.registry.get(level);

    this.notifiers.forEach((notif) => notif.level(this.options.level));

    return this;
  }

  formatter(formatter) {
    this.options.formatter = formatter;
    this.notifiers.forEach((notif) => notif.formatter(this.options.formatter));

    return this;
  }

  strict(strict = true) {
    if (this.options.level) {
      this.options.level.strict = strict;
    }

    return this;
  }

  color(color = true) {
    this.options.color = color;
    this.notifiers.forEach((notif) => notif.color(this.options.color));

    return this;
  }

  lineNumbers(show) {
    this.options.lineNumbers = show;
    this.notifiers.forEach((notif) => notif.lineNumbers(this.options.lineNumbers));

    return this;
  }

  canLog(severity) {
    return this.options.level.canLog(severity);
  }
}
