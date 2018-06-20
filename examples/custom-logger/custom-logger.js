'use strict';

// Let's import the Logger class that we will need shortly
const { Loggers } = require('../../index');

// Custom notifier see file for more info
const MyCustomNotifier = require('./custom-notifier');


/**
 * First of all we want to create a class that extends from Logger
 * This class will be the interface for logging, like the premade loggers: ConsoleLogger, RemoteLogger, etc...
 * 
 * Logger expects a Notifier instance to be passed
 */
class MyCustomLogger extends Loggers.Logger {
  constructor(options = {}) {

    /** 
     * Now we need to create a Notifier wich is the important part, 
     * the notifier is in charge of managing the output, here we can send the log to any service, an API...
     * Check the custom-notifier-file.js for more info about this.
     */
    const notifier = new MyCustomNotifier(options); // Propagate the options to the notifier

    /**
     * Now we call super with the notifier we just created and the options.
     * We are set here!
     */
    super(notifier, options);
  }
}

module.exports = MyCustomLogger;
