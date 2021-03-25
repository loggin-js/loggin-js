import * as path from 'path';
import * as fs from 'fs';
import * as phin from 'phin';
import { LogginJS } from '../lib';
import { Pipe } from './pipe';

function mkDirByPathSync(targetDir, { isRelativeToScript = false } = {}) {
  const sep = path.sep;
  const initDir = path.isAbsolute(targetDir) ? sep : '';
  const baseDir = isRelativeToScript ? __dirname : '.';

  return targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir);
    try {
      fs.mkdirSync(curDir);
    } catch (err) {
      if (err.code === 'EEXIST') {
        // curDir already exists!
        return curDir;
      }

      // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
      if (err.code === 'ENOENT') {
        // Throw the original parentDir error on curDir `ENOENT` failure.
        throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
      }

      const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
      if (!caughtErr || (caughtErr && curDir === path.resolve(targetDir))) {
        throw err; // Throw if it's just the last created dir.
      }
    }

    return curDir;
  }, initDir);
}

export default function plugin({ Notifier, notifierRegistry }: LogginJS) {
  class ConsoleNotifier extends Notifier {
    constructor(options) {
      super(options, 'console');
      this.lineIndex = 0;
    }

    output(log) {
      let logOut = log;
      if (this.options.lineNumbers) {
        logOut = this.getLineWithNumber(log);
      }

      // Don't remove
      console.log(logOut);
      return this;
    }
  }

  class FileNotifier extends Notifier {
    pipes: any[];
    constructor(options) {
      super(options, 'file');
      this.pipes = [];

      // Setup default pipe if filepath is passed for options.level
      if (this.options.filepath) {
        this.pipes.push(new Pipe(options.level, this.options.filepath));
      }

      // Setup pipes passed in options
      if (this.options.pipes) {
        this.options.pipes.forEach((pipe, index) => {
          if (!(pipe instanceof Pipe))
            throw new Error(`ERROR: "options.pipes[${index}]" should be a loggin.Pipe instance.`);
        });
        this.pipes = this.options.pipes.concat(this.pipes);
      }
    }

    getPipe(level) {
      let closest = 200000;
      let returnPipe = null;
      for (let index = 0; index < this.pipes.length; index++) {
        const pipe = this.pipes[index];
        if (pipe.englobes(level) && closest != 0 && level.level - pipe.severity.level < closest) {
          returnPipe = pipe;
          closest = level.level - pipe.severity.level;
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

    output(message, log) {
      const logOut = message;
      const level = log.level;

      if (!this.pipes.length) {
        throw new Error('"options.pipes" cannot be empty and must be an array of pipes');
      }

      for (let pipe of this.pipes) {
        if (pipe.englobes(level)) {
          this._createPathIfNotExists(pipe.filepath);
          const logMessage = this._addLineNumbersIfSet(pipe.filepath, logOut);

          if (!fs.existsSync(pipe.filepath)) {
            fs.writeFileSync(pipe.filepath, '');
          }

          // Create path if it does not exist
          fs.appendFileSync(pipe.filepath, `${logMessage}\n`);
        }
      }
    }

    canOutput(level) {
      let filepath = this.getFile(level);
      return !!filepath;
    }

    pipe(level, filepath) {
      this.pipes.push(new Pipe(level, filepath));
      return this;
    }

    _createPathIfNotExists(targetPath) {
      const path_ = path.dirname(targetPath);
      if (!fs.existsSync(path_)) {
        mkDirByPathSync(path_);
      }
    }

    _addLineNumbersIfSet(path, logOut) {
      if (this.options.lineNumbers) {
        let lines = 0;
        if (fs.existsSync(path)) {
          lines = fs.readFileSync(path).toString().split('\n').length;
        }
        this.lineIndex = lines;
        return this.getLineWithNumber(logOut);
      }

      return logOut;
    }
  }

  class HttpNotifier extends Notifier {
    headers: any;
    url: any;
    constructor(options) {
      super(options, 'http');
      this.headers = this.options.headers || {};
      this.url = this.options.url;
    }

    async output(logMsg, log) {
      return await phin({
        url: this.url,
        method: 'POST',
        headers: this.headers,
        data: {
          message: logMsg,
          log,
        } as any,
      });
    }
  }

  class RemoteNotifier extends HttpNotifier {
    constructor(options) {
      super(options);
      this.name = 'remote';
      console.warn(
        `[Loggin'JS] RemoteNotifier (remote) is being deprecated, it's renamed to HttpNotifier <http>, it will be removed in v2.0.0`,
      );
    }
  }

  class MemoryNotifier extends Notifier {
    _buffer: Buffer;
    constructor(options) {
      super(options, 'memory');
      this._buffer = Buffer.from(
        `Logging'JS Log Dump for ${options.channel || 'loggin-js'} [${new Date().toLocaleString()}]\n\n`,
      );
    }

    _saveToBuffer(str) {
      this._buffer = Buffer.concat([this._buffer, Buffer.from(str + '\n')]);
    }

    getMemoryLogs() {
      return {
        string: () => this._buffer.toString(),
        array: () => this._buffer.toString().split('\n'),
      };
    }

    output(logMsg) {
      this._saveToBuffer(logMsg);
    }

    dumpToFile(filepath) {
      if (!filepath) {
        throw new Error('filepath is required');
      }

      let str = this.getMemoryLogs().string();

      // Create file if it does not exist
      if (!fs.existsSync(filepath)) {
        mkDirByPathSync(filepath);
      }

      console.log('Log dump file can be found at: ' + filepath);
      fs.writeFileSync(filepath, str);
    }

    dumpToConsole() {
      let logs = this.getMemoryLogs().array();
      for (let log of logs) {
        process.stdout.write(log + '\n');
      }
    }

    dump(filepath = null) {
      this.dumpToConsole();
      this.dumpToFile(filepath);
    }
  }

  notifierRegistry
    .register('Console', ConsoleNotifier)
    .register('Default', ConsoleNotifier)
    .register('File', FileNotifier)
    .register('Http', HttpNotifier)
    .register('Remote', RemoteNotifier)
    .register('Memory', MemoryNotifier);
}
