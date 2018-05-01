class Severity {
  // TODO: change covers to a more apropiate name
  constructor(level, name, englobes = [], fileLogginLevel) {
    this.level = level;
    this.name = name;
    this.fileLogginLevel = fileLogginLevel || this.level;
    this.englobes = englobes;

    for (let i = 0; i < this.englobes.length; i++) {
      this.englobes[i].fileLogginLevel = this.level;
    }
  }

  canLogSeverity(severity) {
    if (severity.level === this.level) return true;
    else {
      for (let i = 0; i < this.englobes.length; i++) {
        if (this.englobes[i].level === severity.level) return true;
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

const EMERGENCY = new Severity(0, 'EMERGENCY');
const ALERT = new Severity(1, 'ALERT');
const CRITICAL = new Severity(2, 'CRITICAL');
const ERROR = new Severity(3, 'ERROR');
const WARNING = new Severity(4, 'WARNING');
const NOTICE = new Severity(5, 'NOTICE');
const INFO = new Severity(6, 'INFO');
const DEBUG = new Severity(7, 'DEBUG', [INFO, NOTICE, WARNING, ERROR, CRITICAL, ALERT, EMERGENCY]);

Severity.EMERGENCY = EMERGENCY;
Severity.ALERT = ALERT;
Severity.CRITICAL = CRITICAL;
Severity.ERROR = ERROR;
Severity.WARNING = WARNING;
Severity.NOTICE = NOTICE;
Severity.INFO = INFO;
Severity.DEBUG = DEBUG;

const severities = {
  EMERGENCY,
  ALERT,
  CRITICAL,
  ERROR,
  WARNING,
  NOTICE,
  INFO,
  DEBUG,
}

module.exports = Severity;
