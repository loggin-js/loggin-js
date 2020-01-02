function plugin(loggin) {
    const { Notifier } = loggin;

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

    class HttpNotifier extends Notifier {
        constructor(options) {
            super(options, 'tttp');
            this.headers = this.options.headers || {};
        }

        async output(logMsg, log) {
            return await fetch(this.options.url, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    message: logMsg,
                    log
                })
            });
        }
    }

    Notifier.register('Console', ConsoleNotifier);
    Notifier.register('Http', HttpNotifier);
};

module.exports = plugin;