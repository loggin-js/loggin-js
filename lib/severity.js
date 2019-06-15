'use strict';
class Severity {
  constructor(level, name) {
    this.level = level;
    this.name = name;
    this.fileLogginLevel = this.level;
  }

  canLog(severity) {
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

  static search(value) {
    for (let key in Severity._severities) {
      let severity = Severity._severities[key];
      if (severity.level === value || (severity.name).toLowerCase() === String(value).toLowerCase()) {
        return severity;
      }
    }

    return null;
  }

  static get(level) {
    if (level && level.constructor.name === 'Severity') {
      return level;
    }

    return Severity.search(level);
  }

  static register(level, name) {
    if (typeof name !== 'string') {
      throw new Error('"name" must be a string got: ' + typeof name);
    }
    Severity[name] = Severity._severities[name] = new Severity(level, name);

    return Severity;
  }
}

Severity._severities = {};

Severity
  .register(0, 'EMERGENCY')
  .register(1, 'ALERT')
  .register(2, 'CRITICAL')
  .register(3, 'ERROR')
  .register(4, 'WARNING')
  .register(5, 'NOTICE')
  .register(6, 'INFO')
  .register(7, 'DEBUG')
  .register(8, 'SILLY');

module.exports = Severity;