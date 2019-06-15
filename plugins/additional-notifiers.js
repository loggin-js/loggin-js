
const path = require('path');
const fs = require('fs-extra');


function plugin(loggin) {
    const { Notifier, Pipe } = loggin;

    class ConsoleNotifier extends Notifier {
        constructor(options) {
            super(options);
            this.name = 'console';
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
            this.name = 'file';
            this.fs = require('fs');

            // Setup default pipe if filepath is passed for options.level
            if (this.options.filepath) {
                this.pipes.push(new Pipe(options.level, this.options.filepath));
            }

            // Setup pipes passed in options
            if (this.options.pipes) {
                this.options.pipes.forEach((pipe, index) => {
                    if (!(pipe instanceof Pipe)) throw new Error(`ERROR: "options.pipes[${index}]" should be a loggin.Pipe instance.`);
                });
                this.pipes = this.options.pipes.concat(this.pipes);
            }
            return this;
        }

        getPipe(level) {
            let closest = 200000;
            let returnPipe = null;
            for (let index = 0; index < this.pipes.length; index++) {
                const pipe = this.pipes[index];
                if (pipe.englobes(level) && (closest != 0 && level.level - pipe.severity.level < closest)) {
                    returnPipe = pipe;
                    closest = level.level - pipe.severity.level;
                    console.log(level.level, pipe.severity.level, closest);
                }
            }

            console.log('closest', closest);
            return returnPipe;
        }

        getFile(level) {
            let pipe = this.getPipe(level);
            if (pipe) {
                return pipe.filepath;
            }

            return this.options.filepath;
        }

        output(message, level, log) {
            let logOut = message;

            if (!this.pipes.length) {
                throw new Error('"options.pipes" cannot be empty and must be an array of pipes');
            }

            for (let index = 0; index < this.pipes.length; index++) {
                const pipe = this.pipes[index];
                if (pipe.englobes(level)) {

                    // Create path if it does not exist
                    let path_ = path.dirname(pipe.filepath);
                    if (!this.fs.existsSync(path_)) {
                        this.fs.mkdirSync(path_);
                    }

                    // Add line numbers is set
                    if (this.options.lineNumbers) {
                        let lines = 0;
                        if (this.fs.existsSync(pipe.filepath)) {
                            lines = this.fs.readFileSync(pipe.filepath).toString()
                                .split('\n').length;
                        }
                        this.lineIndex = lines;
                        logOut = this.getLineWithNumber(logOut);
                    }

                    if (!this.fs.existsSync(pipe.filepath)) {
                        this.fs.writeFileSync(pipe.filepath, '');
                    }

                    // Create path if it does not exist
                    this.fs.appendFileSync(pipe.filepath, `${logOut}\n`);
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

        getLogPaths() {
            return this.pipes;
        }
    }

    class RemoteNotifier extends Notifier {
        constructor(options) {
            super(options);
            this.name = 'remote';
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
            this.name = 'memory';
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

        dumpToFile(filepath) {

            if (!filepath) {
                throw new Error('filepath is required');
            }

            let str = this.getMemoryLogs().string();

            // Create file if it does not exist
            if (!fs.existsSync(filepath)) {
                fs.ensureFileSync(filepath);
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

    Notifier.register('Console', ConsoleNotifier);
    Notifier.register('File', FileNotifier);
    Notifier.register('Remote', RemoteNotifier);
    Notifier.register('Memory', MemoryNotifier);
};

module.exports = plugin;