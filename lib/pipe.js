'use strict';
class Pipe {
  constructor(severity, filepath) {
    this.severity = severity;
    this.filepath = filepath;
  }


  /**
   * Does this pipe englobe said severity
   * @argument severity {Severity}
   */
  englobes(severity) {
    return this.severity.level <= severity.level;
  }
}

module.exports = Pipe;