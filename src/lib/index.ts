import { Logger, LoggerOptions } from './logger';
import { Notifier } from './notifier';
import { Formatter } from './formatter';
import { Severity } from './severity';
import { Log } from './log';

import { FormatterRegistry } from './registry/formatter-registry';
import { SeverityRegistry } from './registry/severity-registry';
import { NotifierRegistry } from './registry/notifier-registry';
import { LoggerRegistry } from './registry/logger-registry';

const formatterRegistry = new FormatterRegistry();
const severityRegistry = new SeverityRegistry();
const notifierRegistry = new NotifierRegistry();
const loggerRegistry = new LoggerRegistry(notifierRegistry);

// Inject Registries
Formatter.registry = formatterRegistry;
Severity.registry = severityRegistry;
Notifier.registry = notifierRegistry;
Logger.registry = loggerRegistry;

export class LogginJS {
  public Severity = Severity;
  public Log = Log;
  public Notifier = Notifier;
  public Formatter = Formatter;
  public Logger = Logger;

  public loggerRegistry = loggerRegistry;
  public severityRegistry = severityRegistry;
  public notifierRegistry = notifierRegistry;
  public formatterRegistry = formatterRegistry;

  public logger(opts: string | Partial<LoggerOptions> = 'default', args: Partial<LoggerOptions> = {}): Logger {
    return Logger.registry.get(opts, args);
  }

  public notifier(opts = 'default', args = {}): Notifier {
    return Notifier.registry.get(opts, args);
  }

  public formatter(template = 'default'): Formatter {
    return Formatter.registry.get(template);
  }

  public severity(level, { strict = false } = {}): Severity {
    const severity = Severity.registry.get(level);
    severity.strict = strict;

    return severity;
  }

  public use(plugin: (loggin: LogginJS) => void): void {
    if (typeof plugin !== 'function') {
      throw new Error('"plugin" must be a function');
    }

    // "this" will resolve to LogginJS
    plugin(this);
  }
}

export const loggin = new LogginJS();
