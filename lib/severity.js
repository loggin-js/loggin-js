'use strict';

class Severity {
  constructor(level, name, fileLogginLevel) {
    this.level = level;
    this.name = name;
    this.fileLogginLevel = fileLogginLevel || this.level;
  }

  canLogSeverity(severity) {
    return this.level >= severity.level;
  }

  getFileLoggingLevel() {
    return this.fileLogginLevel;
  }

  toString() {
    return String(this.name).substr(0, 3);
  }

  toInt() {
    return this.level;
  }

  valueOf() {
    return this.toInt();
  }
}

Severity.EMERGENCY = new Severity(0, 'EMERGENCY');
Severity.ALERT = new Severity(1, 'ALERT');
Severity.CRITICAL = new Severity(2, 'CRITICAL');
Severity.ERROR = new Severity(3, 'ERROR');
Severity.WARNING = new Severity(4, 'WARNING');
Severity.NOTICE = new Severity(5, 'NOTICE');
Severity.INFO = new Severity(6, 'INFO');
Severity.SILLY = new Severity(8, 'SILLY');
Severity.DEBUG = new Severity(7, 'DEBUG');

Severity.fromString = (severityString) => {
  switch (severityString.toLowerCase()) {
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
    case 'emergency':
      return Severity.EMERGENCY;
    case 'debug':
    default:
      return Severity.DEBUG;
  }
};

Severity.fromInt = (severityNum) => {
  switch (severityNum) {
    case 7:
      return Severity.DEBUG;
    case 6:
      return Severity.INFO;
    case 5:
      return Severity.ERROR;
    case 4:
      return Severity.WARNING;
    case 3:
      return Severity.ALERT;
    case 2:
      return Severity.NOTICE;
    case 1:
      return Severity.CRITICAL;
    case 0:
      return Severity.EMERGENCY;
    default:
      return Severity.DEBUG;
  }
};

Severity.get = (level) => {
  let severity = Severity.DEBUG;
  if (typeof level === 'string') {
    severity = Severity.fromString(level);
  } else if (typeof level === 'number') {
    severity = Severity.fromInt(level);
  } else if (level && level.constructor.name === 'Severity') {
    severity = level;
  }
  return severity;
}

module.exports = Severity;