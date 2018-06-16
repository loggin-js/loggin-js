'use strict';

const Severity = require('./severity');
const { debugFN, debugAction } = require('./utils');
const { Formater } = require('./formaters');

class Notifier {
  constructor(options) {
    if (options.severity && !(options.severity instanceof Severity.Severity)) {
      throw new Error(`ERROR: "options.severity" should be an instance of Severity. at: options.severity = ${options.severity}`);
    }

    this.options = options;
    this.options.severity = this.options.severity || Severity.DEBUG;
    this.options.color = options.color || false;
    this.options.lineNumbers = this.options.lineNumbers || false;
    this.pipes = [];
    this.lineIndex = 0;

    if (!this.options.formater) {
      this.options.formater = new Formater('[{time.toLocaleString}] - {channel} - {user} - {severityStr} - {message} - {JSON.stringify(message)}');
    } else if (typeof this.options.formater === 'string') {
      this.options.formater = new Formater(this.options.formater);
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
   * @arg {Formater} formater
   */
  setFormater(formater) {
    this._formater = formater;

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
    return '(' + this.lineIndex + ') ' + log;
    this.lineIndex++;
  }

  /**
   * @param log {Log}
   */
  notify(log) {
    let output = '';
    output = log.format(this.options.formater);
    if (this.options.color) output = log.colored(this.options.formater);
    this.output(output, log.severity, log);

    return this;
  }
}


class ConsoleNotifier extends Notifier {

  constructor(options) {
    super(options);

    if (!options.formater) {
      this.options.formater = new Formater('[{time.toLocaleString}] - <%m{channel}> - {user} - {severityStr} - {message} - {JSON.stringify(message)}');
    }

    this.lineIndex = 0;
  }

  /**
   * @param log {Log}
   */
  output(log) {
    let logOut = log;
    if (this.options.lineNumbers) {
      logOut = this.getLineWithNumber(log);
    }

    // Dont remove
    process.stdout.write(logOut + '\n');

    return this;
  }
}

class FileNotifier extends Notifier {
  constructor(options) {
    super(options);
    this.fs = require('fs');

    // Set formatter if not passed in options 
    if (!options.formater) {
      this.options.formater = new Formater('[{time.toLocaleString}] - <%m{channel}> - {user} - {severityStr} - {message} - {JSON.stringify(message)}');
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
    let path = filepath.substring(0, filepath.lastIndexOf('/'));
    if (!this.fs.existsSync(path)) {
      this.fs.mkdirSync(path);
    }

    debugFN('INFO: Logging to: %s with severity: %s', [filepath, severity]);

    // Add line numbers is set
    if (this.options.lineNumbers) {
      const lines = this.fs.readFileSync(filepath).toString()
        .split('\n').length;
      this.lineIndex = lines;
      logOut = this.getLineWithNumber(logOut);
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

class RemoteNotifier extends Notifier {
  constructor(options) {
    super(options);
    this.host = options.host || '127.0.0.1';
    this.port = options.port || '8080';
    this.request = require('request');
    this.url = `${this.host}:${this.port}/logs`;
    console.log(this.url);
  }

  output(logmsg, severity, log) {
    this.request(
      {
        url: `http://${this.url}`,
        method: 'POST',
        json: true,
        body: {
          logMsg: logmsg,
          log: log
        }
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


class Pipe {
  constructor(severity, filepath) {
    this.severity = severity;
    this.filepath = filepath;
  }


  /**
   * Does this pipe englobe said severity
   * @argument severity {Severity}
   */
  englobes(severity) {
    debugFN('englobes@Pipe', severity);

    if (severity === this.severity) {
      return true;
    }

    if (!this.severity.englobes || !this.severity.englobes.length) {
      return false;
    }

    /*
     * NOTE: The below code is for englobing multiple severities into one.
     * For example the debug Severity should englobe any other severity.
     */
    debugAction('checkEnglobes', severity);
    for (let index = 0; index < this.severity.englobes.length; index++) {
      const sev = this.severity.englobes[index];
      if (severity === sev) {
        return true;
      }
    }

    return false;
  }
}

module.exports = {
  ConsoleNotifier,
  FileNotifier,
  RemoteNotifier,
  Pipe
};
