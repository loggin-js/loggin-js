'use strict';

const { Notifiers, Formatter } = require('../../index');

class MyCustomNotifier extends Notifiers.Notifier {

  constructor(options) {
    super(options);

    if (!options.formater) {
      this.options.formater = new Formatter('[{time.toLocaleString}] - <%m{channel}> - {user} - {severityStr} - {message} - {JSON.stringify(message)}');
    }
  }

  /**
   * This function is required to exist when extending from Notifier
   * Is in charge of outputing, writing, sending... to some service, file, api, etc...
   * 
   * In this case it's just outputing to the console
   * 
   * @function output
   * @param output {string}
   * @param severity {Severity}
   * @param log {Log}
   */
  output(output, severity, log) {
    process.stdout.write(output + '\n');
    return this;
  }

  /**
   * In charge of procesing the log and sending to the output method
   *
   * @overwrites Notifier.notify
   * @function notify
   * @param log {Log}
   */
  notify(log) {

    // Format the log
    let output = log.format(this.options.formater);

    // If options.color is set we format it with color
    if (this.options.color) {
      output = log.colored(this.options.formater);
    }

    // Output the log
    this.output(output, log.severity, log);
    return this;
  }
}

module.exports = MyCustomNotifier;
