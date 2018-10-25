'use strict';

/**
 * @param {Severity} level
 * @param {string} name 
 * @param {Severity[]} englobes 
 * @param {Severity} fileLogginLevel 
 */
class Severity {
  constructor(level, name, englobes = [], fileLogginLevel) {
    this.level = level;
    this.name = name;
    this.fileLogginLevel = fileLogginLevel || this.level;
    this.englobes = englobes;

    for (let index = 0; index < this.englobes.length; index++) {
      this.englobes[index].fileLogginLevel = this.level;
    }
  }

  canLogSeverity(severity) {
    if (severity.level === this.level) {
      return true;
    }

    for (let index = 0; index < this.englobes.length; index++) {
      const engSev = this.englobes[index];
      const el = engSev.level;
      const sl = severity.level;
      if (el === sl) {
        return true;
      }
    }

    return false;
  }

  getFileLoggingLevel() {
    return this.fileLogginLevel;
  }

  toString() {
    return this.name;
  }

  valueOf() {
    return this.level;
  }
}

/**
 * @const EMERGENCY
 */
const EMERGENCY = new Severity(0, 'EMERGENCY');
/**
 * @const ALERT
 */
const ALERT = new Severity(1, 'ALERT');
/**
 * @const CRITICAL
 */
const CRITICAL = new Severity(2, 'CRITICAL');
/**
 * @const ERROR
 */
const ERROR = new Severity(3, 'ERROR');
/**
 * @const WARNING
 */
const WARNING = new Severity(4, 'WARNING');
/**
 * @const NOTICE
 */
const NOTICE = new Severity(5, 'NOTICE');
/**
 * @const INFO
 */
const INFO = new Severity(6, 'INFO', [WARNING, ERROR]);
/**
 * @const DEBUG
 */
const DEBUG = new Severity(7, 'DEBUG', [INFO, NOTICE, WARNING, ERROR, CRITICAL, ALERT, EMERGENCY]);

Severity.EMERGENCY = EMERGENCY;
Severity.ALERT = ALERT;
Severity.CRITICAL = CRITICAL;
Severity.ERROR = ERROR;
Severity.WARNING = WARNING;
Severity.NOTICE = NOTICE;
Severity.INFO = INFO;
Severity.DEBUG = DEBUG;

Severity.fromString = (severity) => {
  switch (severity.toLowerCase()) {
    case 'debug':
      return Severity.DEBUG;
    case 'info':
      return Severity.INFO;
    case 'error':
      return Severity.ERROR;
    case 'warning':
      return Severity.WARNING;
    case 'alert':
      return Severity.ALERT;
    case 'notice':
      return Severity.NOTICE;
    case 'critital':
      return Severity.CRITICAL;
    default:
      return Severity.DEBUG;
  }
};

module.exports = Severity;
