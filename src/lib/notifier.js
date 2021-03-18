'use strict';

const Severity = require('./severity');
const Formatter = require('./formatter');
const Pipe = require('./pipe');
const { isFunction } = require('./util');

class Notifier {
  constructor(options = {}, name) {
    options = {
      color: false,
      enabled: true,
      level: 'DEBUG',
      ...options
    };
    this.options = options;
    this.name = this.options.name || name || 'notifier';
    this.options.level = this.options.level;
    this.options.color = this.options.color;
    this.options.lineNumbers = this.options.lineNumbers;
    this.options.enabled = this.options.enabled;

    this.pipes = [];
    this.lineIndex = 0;

    if (options.pipes instanceof Array) {
      options.pipes.forEach((pipe, i) => {
        /* istanbul ignore else */
        if (!(pipe instanceof Pipe)) {
          throw new Error(`ERROR: "options.pipes" should be an array of Pipes, got ${pipe} instead at index ${i}`);
        }
      });
    }

    if (typeof (this.options.formatter) === 'string') {
      this.formatter(this.options.formatter);
    } else {
      this.formatter('detailed');
    }
  }

  canOutput(log) {
    const { level, ignore } = this.options;
    const canLogLevel = level.canLog(log.level);
    const isIgnored = (ignore && typeof ignore === 'function' && ignore(log));

    return [
      canLogLevel,
      !isIgnored,
    ].reduce((prev, curr) => prev && curr);
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
    let lineNum = this.lineIndex++;
    return '(' + lineNum + ') ' + log;
  }

  notify(log) {
    let { formatter, color, preNotify } = this.options;
    let output = formatter.formatLog(log, { color });

    if (isFunction(preNotify)) {
      preNotify(log);
    }

    this.output(output, log);

    return this;
  }

  output() {
    return;
  }

  pipe() {
    console.warn('WARN - Pipe has not been configured in this notifier');
  }
}

module.exports = Notifier;