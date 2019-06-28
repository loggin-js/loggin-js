
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

    Notifier.register('Console', ConsoleNotifier);
};

module.exports = plugin;