'use strict';

const Severity = require('./severity');
const { debugFN, debugAction } = require('./utils');
const { Formatter } = require('./formatters');
const Pipe = require('./pipe');
const path = require('path');
const fs = require('fs-extra');

/**
 * "Abstract" notifier
 */
class Notifier {

  /**
   * @param {object} options 
   * @param {boolean} options.color 
   * @param {boolean} options.lineNumbers 
   * @param {number} options.severity 
   * @param {string} options.formatter 
   */
  constructor(options) {
    if (options.severity && !(options.severity instanceof Severity.Severity)) {
      throw new Error(`ERROR: "options.severity" should be an instance of Severity. at: options.severity = ${options.severity}`);
    }

    this.options = options;
    this.options.severity = this.options.severity || Severity.DEBUG;

    // If level is a string set level to correct severity object
    if (typeof this.options.severity === 'string') {
      this.options.severity = Severity.fromString(this.options.severity);
    } else {
      this.options.severity = this.options.severity || Severity.DEBUG;
    }


    this.options.color = options.color || false;
    this.options.lineNumbers = this.options.lineNumbers || false;
    this.pipes = [];
    this.lineIndex = 0;

    if (!this.options.formatter) {
      this.options.formatter = new Formatter('[{time.toLocaleString}] - {channel} - {user} - {severityStr} - {message} - {data}');
    } else if (typeof this.options.formatter === 'string') {
      switch (this.options.formatter) {
        case 'short':
          this.options.formatter = new Formatter(Formatter.short);
          break;
        case 'medium':
          this.options.formatter = new Formatter(Formatter.medium);
          break;
        case 'long':
          this.options.formatter = new Formatter(Formatter.long);
          break;
        default:
          this.options.formatter = new Formatter(this.options.formatter);
      }
    }
  }

  /**
   * @param severity {Severity}
   */
  setLevel(severity) {
    this.options.severity = severity;

    return this;
  }

  /**
   * @arg {Formatter} formatter
   */
  setFormatter(formatter) {
    this._formatter = formatter;

    return this;
  }

  /**
   * @param val {Boolean}
   */
  setColor(val) {
    this.options.color = val;

    return this;
  }

  /**
   * @param show {boolean}
   */
  showLineNumbers(show) {
    this.options.lineNumbers = show;

    return this;
  }

  getLineWithNumber(log) {
    let lineNum = this.lineIndex++;

    return '(' + lineNum + ') ' + log;
  }

  /**
   * @param log {Log}
   */
  notify(log) {
    let output = log.format(this.options.formatter);
    if (this.options.color) output = log.colored(this.options.formatter);
    this.output(output, log.severity, log);

    return this;
  }

  output() {
    let err = new Error('Please dont instance Notifier() by it self, use one of the premade ones or make your own. \ncheck: https://github.com/nombrekeff/loggin-js/wiki/Notifier#available-premade-notifiers');
    throw err;
  }
}

/**
 * Notifies to the console
 * @extends Notifier
 * @param options
 */
class ConsoleNotifier extends Notifier {

  constructor(options) {
    super(options);

    if (!options.formatter) {
      this.options.formatter = new Formatter('[{time.toLocaleString}] - <%m{channel}> - {user} - {severityStr} - {message} - {JSON.stringify(data)}');
    }

    this.lineIndex = 0;
  }

  /**
   * @param log {string}
   */
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


/**
 * Notifies to files based on some configuration
 * @extends Notifier
 * @param options
 */
class FileNotifier extends Notifier {
  constructor(options) {
    super(options);
    this.fs = require('fs');

    // Set formatter if not passed in options 
    if (!options.formatter) {
      this.options.formatter = new Formatter('[{time.toLocaleString}] - <%m{channel}> - {user} - {severityStr} - {message} - {JSON.stringify(message)}');
    }

    // Setup default pipe if filepath is passed for options.severity
    if (this.options.filepath) {
      this.pipes.push(new Pipe(options.severity, this.options.filepath));
    }

    // Setup pipes passed in options
    if (this.options.pipes) {
      this.options.pipes.forEach((pipe, index) => {
        if (!(pipe instanceof Pipe)) throw new Error(`ERROR: "options.pipes" should be an array of Pipe objects (Can be found at: https://github.com/nombrekeff/loggin-js/wiki/Pipe). at: options.pipes[${index}] = ${pipe};`);
      });
      this.pipes = this.options.pipes.concat(this.pipes);
    }
  }


  getPipe(severity) {
    debugFN('getPipe@FileNotifier', severity);
    let returnPipe = null;
    for (let index = 0; index < this.pipes.length; index++) {
      const pipe = this.pipes[index];
      debugAction('findPipe', pipe.severity);

      if (pipe.englobes(severity)) {
        debugAction('validPipe', pipe.severity);
        returnPipe = pipe;
      }
    }

    return returnPipe;
  }

  getFile(severity) {
    debugFN('getFile@FileNotifier', severity);
    let pipe = this.getPipe(severity);
    if (pipe) {
      debugAction('foundPipe', pipe.filepath);

      return pipe.filepath;
    }

    return this.options.filepath;
  }

  output(log, severity) {
    debugFN('output@FileNotifier', [log, severity]);

    let filepath = this.getFile(severity);
    let logOut = log;

    if (!filepath && !this.pipes.length) {
      throw new Error('If no "options.filepath" is passed you need to create a pipe. Check: "examples/piping.md"');
    } else if (!filepath) {
      debugFN('WARN: There are no files to log to for severity: %s', [severity]);

      return;
    }

    // Create path if it does not exist
    let path_ = path.dirname(filepath);
    if (!this.fs.existsSync(path_)) {
      this.fs.mkdirSync(path_);
    }

    debugFN('INFO: Logging to: %s with severity: %s', [filepath, severity]);

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

  /**
   * Pipe a severity log to some filepath
   * @argument severity {Severity}
   * @argument filepath {String}
   */
  pipe(severity, filepath) {
    debugFN('pipe@FileNotifier', [
      severity,
      filepath
    ]);
    this.pipes.push(new Pipe(severity, filepath));
  }
}

/**
 * Notifies to a remote address based on some config
 * @extends Notifier
 * @param options
 */
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

  output(logMsg, severity, log) {
    this.request(
      {
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

/**
 * Saves logs to memory and outputs when requested
 * @inheritdoc
 * @extends Notifier
 * @param options
 */
class MemoryNotifier extends Notifier {
  constructor(options) {
    super(options);
    this._buffer = Buffer.from(`Logging'JS Log Dump for ${options.channel || 'loggin-js'} [${(new Date()).toLocaleString()}]\n\n`);
  }

  _saveToBuffer(str) {
    this._buffer = Buffer.concat([this._buffer, Buffer.from(str + '\n')]);
  }

  /**
   * @returns {{ string: function():string, array: function():string[] }}
   */
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
  ConsoleNotifier,
  FileNotifier,
  RemoteNotifier,
  MemoryNotifier,

  Pipe,
  Notifier
};
