'use strict';
const { debugFN, debugAction } = require('./utils');

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
    debugFN('englobes@Pipe', severity);

    if (severity === this.severity) {
      return true;
    }

    if (!this.severity.englobes || !this.severity.englobes.length) {
      return false;
    }

    /*
     * NOTE: The below code is for englobing multiple severities into one.
     * For example the debug Severity should englobe any other severity.
     */
    
    debugAction('checkEnglobes', severity);
    for (let index = 0; index < this.severity.englobes.length; index++) {
      const sev = this.severity.englobes[index];
      if (severity === sev) {
        return true;
      }
    }

    return false;
  }
}

module.exports = Pipe;