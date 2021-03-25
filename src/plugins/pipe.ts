export class Pipe {
  severity: any;
  filepath: any;
  constructor(severity, filepath) {
    this.severity = severity;
    this.filepath = filepath;
  }

  englobes(severity) {
    return this.severity.canLog(severity);
  }
}

module.exports = Pipe;
