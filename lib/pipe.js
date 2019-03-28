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
    return this.severity.canLogSeverity(severity)
  }
}

module.exports = Pipe;