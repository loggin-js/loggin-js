'use strict';

const Severity = require('./severity');
const Formatter = require('./formatter');
const Pipe = require('./pipe');

function isConstructor(obj) {
  return !!obj.prototype && !!obj.prototype.constructor.name;
}

class Notifier {
  constructor(options = {}, name) {
    options = {
      ...Notifier.DefaultOptions,
      ...options
    }

    if (options.level && !(options.level instanceof Severity)) {
      throw new Error(`ERROR: "options.level" should be an instance of Severity. at: options.level = ${options.level}`);
    }

    this.name = options.name || name || 'notifier';
    this.options = options;
    this.options.level = Severity.get(this.options.level);
    this.options.color = options.color;
    this.options.lineNumbers = options.lineNumbers;
    this.options.enabled = options.enabled;

    this.pipes = [];
    this.lineIndex = 0;

    if (options.pipes instanceof Array) {
      options.pipes.forEach((pipe, i) => {
        if (!(pipe instanceof Pipe)) {
          throw new Error(`ERROR: "options.pipes" should be an array of Pipes, got ${pipe} instead at index ${i}`);
        }
      });
    }

    if (!this.options.formatter) {
      this.formatter('detailed');
    } else if (typeof this.options.formatter === 'string') {
      this.formatter(this.options.formatter);
    }
  }

  canOutput(level) {
    return this.options.level.canLog(level);
  }

  enabled(enabled) {
    this.options.enabled = enabled;
    return this;
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
    let { formatter, color } = this.options;
    let output = formatter.formatLog(log, { color: color });

    if (color) {
      output = formatter.color(output);
    }

    this.output(output, log);

    return this;
  }

  output(log) {
    return;
  }

  pipe(severity, cb) {
    console.warn('WARN - Pipe has not been configured in this notifier');
  }

  static search(value) {
    for (let key in Notifier._notifiers) {
      let notifier = Notifier._notifiers[key];
      if ((key).toLowerCase() === String(value).toLowerCase()) {
        return notifier;
      }
    }

    return Notifier.Console;
  }

  static get(value, opts = {}) {
    if (value && value.constructor.name === 'Notifier') {
      return value;
    }

    let Ctor = Notifier.search(value);

    if (!isConstructor(Ctor)) {
      throw new Error('Coult not find Notifier with name (' + value + ') | \nIf it\'s a custom made notifier, please register it before using it. I.e: Notifier.register(\'name\', Constructor)');
    }

    return new Ctor(opts);
  }

  static register(name, ctor) {
    if (typeof name !== 'string') {
      throw new Error('"name" must be a string got: ' + typeof name);
    }
    if (typeof ctor !== 'function') {
      throw new Error('"ctor" must be a constructor function got: ' + typeof ctor);
    }

    Notifier[name] = Notifier._notifiers[name] = ctor;

    return Notifier;
  }
}

Notifier._notifiers = {};

Notifier.DefaultOptions = {
  color: false,
  enabled: true
};


module.exports = Notifier;