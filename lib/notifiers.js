'use strict';

const Severity = require('./severity');
const Formatter = require('./formatters');
const Pipe = require('./pipe');
const path = require('path');
const fs = require('fs-extra');

class Notifier {
  constructor(options = {}) {

    options = {
      ...Notifier.DefaultOptions,
      ...options
    }

    if (options.level && !(options.level instanceof Severity)) {
      throw new Error(`ERROR: "options.level" should be an instance of Severity. at: options.level = ${options.level}`);
    }

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
    return this.options.level.canLogSeverity(level);
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
    let output = log.format(this.options.formatter, {
      color: this.options.color
    });

    if (this.options.color) {
      output = log.colored(output)
    }

    this.output(output, log.level, log);
    return this;
  }

  output() {
    let err = new Error('Please dont instance Notifier() by it self, use one of the premade ones or make your own. \ncheck: https://github.com/nombrekeff/loggin-js/wiki/Notifier#available-premade-notifiers');
    throw err;
  }

  pipe() {
    console.warn('WARN - Pipe has not been configured in this notifier');
  }
}

Notifier.DefaultOptions = {
  color: false
};

class ConsoleNotifier extends Notifier {

  constructor(options) {
    super(options);
    this.lineIndex = 0;
  }

  output(log) {
    let logOut = log;
    if (this.options.lineNumbers) {
      logOut = this.getLineWithNumber(log);
    }

    // Dont remove
    console.log(logOut);
    return this;
  }
}

class FileNotifier extends Notifier {
  constructor(options) {
    super(options);
    this.fs = require('fs');

    // Setup default pipe if filepath is passed for options.level
    if (this.options.filepath) {
      this.pipes.push(new Pipe(options.level, this.options.filepath));
    }

    // Setup pipes passed in options
    if (this.options.pipes) {
      this.options.pipes.forEach((pipe, index) => {
        if (!(pipe instanceof Pipe)) throw new Error(`ERROR: "options.pipes" should be an array of Pipe objects (Can be found at: https://github.com/nombrekeff/loggin-js/wiki/Pipe). at: options.pipes[${index}] = ${pipe};`);
      });
      this.pipes = this.options.pipes.concat(this.pipes);
    }
    return this;
  }


  getPipe(level) {
    let returnPipe = null;
    for (let index = 0; index < this.pipes.length; index++) {
      const pipe = this.pipes[index];
      if (pipe.englobes(level)) {
        returnPipe = pipe;
      }
    }

    return returnPipe;
  }

  getFile(level) {
    let pipe = this.getPipe(level);
    if (pipe) {
      return pipe.filepath;
    }

    return this.options.filepath;
  }

  output(log, level) {
    let filepath = this.getFile(level);
    let logOut = log;

    if (!filepath && !this.pipes.length) {
      throw new Error('If no "options.filepath" is passed you need to create a pipe. Check: "examples/piping.md"');
    } else if (!filepath) {
      console.log('WARN: There are no files to log to for level: %s', level);
      return;
    }

    // Create path if it does not exist
    let path_ = path.dirname(filepath);
    if (!this.fs.existsSync(path_)) {
      this.fs.mkdirSync(path_);
    }

    // Add line numbers is set
    if (this.options.lineNumbers) {
      let lines = 0;
      if (this.fs.existsSync(filepath)) {
        lines = this.fs.readFileSync(filepath).toString()
          .split('\n').length;
      }
      this.lineIndex = lines;
      logOut = this.getLineWithNumber(logOut);
    }

    if (!this.fs.existsSync(filepath)) {
      this.fs.writeFileSync(filepath, '');
    }

    // Create path if it does not exist
    this.fs.appendFileSync(filepath, `${logOut}\n`);
  }

  canOutput(level) {
    let filepath = this.getFile(level);
    return !!filepath;
  }

  pipe(level, filepath) {
    this.pipes.push(new Pipe(level, filepath));
    return this;
  }
}

class RemoteNotifier extends Notifier {
  constructor(options) {
    super(options);
    this.host = options.host || '127.0.0.1';
    this.port = options.port || '8080';
    this.headers = options.headers || {};
    this.request = require('request');
    this.url = `${this.host}:${this.port}/logs`;
    console.log(this.url);
  }

  output(logMsg, level, log) {
    this.request({
        url: `http://${this.url}`,
        method: 'POST',
        json: true,
        body: {
          logMsg,
          log
        },
        headers: this.headers
      },
      (error, response, body) => {
        if (!error && response.statusCode === 200) {
          console.log(body);
        } else {
          console.log('Error', error);
        }
      }
    );
  }
}

class MemoryNotifier extends Notifier {
  constructor(options) {
    super(options);
    this._buffer = Buffer.from(`Logging'JS Log Dump for ${options.channel || 'loggin-js'} [${(new Date()).toLocaleString()}]\n\n`);
  }

  _saveToBuffer(str) {
    this._buffer = Buffer.concat([this._buffer, Buffer.from(str + '\n')]);
  }

  getMemoryLogs() {
    return {
      string: () => this._buffer.toString(),
      array: () => this._buffer.toString().split('\n')
    };
  }

  output(logMsg) {
    this._saveToBuffer(logMsg);
  }

  dump(filepath) {
    let str = this.getMemoryLogs().string();

    // Create file if it does not exist
    if (!fs.existsSync(filepath)) {
      fs.ensureFileSync(filepath);
    }

    fs.writeFileSync(filepath, str);
  }
}

module.exports = {
  Console: ConsoleNotifier,
  File: FileNotifier,
  Remote: RemoteNotifier,
  Memory: MemoryNotifier,

  Pipe,
  Notifier,

  get(opts = 'default', args = {}) {
    if (
      typeof opts === 'string' && ['file', 'console', 'remote', 'memory', 'default'].includes(opts)
    ) {
      switch (opts) {
        case 'file':
          return new this.File(args);
        case 'remote':
          return new this.Remote(args);
        case 'memory':
          return new this.Memory(args);
        case 'console':
        case 'default':
        default:
          return new this.Console(args);
      }
    } else if (typeof opts === 'object') {
      return new this.Notifier(opts);
    } else {
      throw new Error('Bad arguments for .notifier, (' + opts + ')');
    }
  }
};