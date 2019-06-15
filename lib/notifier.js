'use strict';

const Severity = require('./severity');
const Formatter = require('./formatters');

class Notifier {
  constructor(options = {}) {
    options = {
      ...Notifier.DefaultOptions,
      ...options
    }

    if (options.level && !(options.level instanceof Severity)) {
      throw new Error(`ERROR: "options.level" should be an instance of Severity. at: options.level = ${options.level}`);
    }

    this.name = 'abstract';
    this.options = options;
    this.options.level = Severity.get(this.options.level);
    this.options.color = options.color;
    this.options.lineNumbers = this.options.lineNumbers;

    this.pipes = [];
    this.lineIndex = 0;

    if (!this.options.formatter) {
      this.formatter('detailed');
    } else if (typeof this.options.formatter === 'string') {
      this.formatter(this.options.formatter);
    }
  }

  canOutput(level) {
    return this.options.level.canLog(level);
  }

  level(level) {
    this.options.level = Severity.get(level);
    return this;
  }

  formatter(formatter) {
    this.options.formatter = Formatter.get(formatter);
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
    let output = this.formatter.format(log, {
      color: this.options.color
    });

    if (this.options.color) {
      output = this.formatter.color(output);
    }

    this.output(output, log.level, log);

    return this;
  }

  output(log) {
    return;
  }

  pipe(severity, cb) {
    console.warn('WARN - Pipe has not been configured in this notifier');
  }
}

Notifier.DefaultOptions = {
  color: false
};

module.exports = Notifier;