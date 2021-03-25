import { EmptyRegistry } from './registry/empty-registry';

export class Severity {
  static registry = new EmptyRegistry<Severity>();

  public level: any;
  public name: any;
  public fileLogginLevel: any;
  public strict: boolean;

  constructor(level, name) {
    this.level = level;
    this.name = name;
    this.fileLogginLevel = this.level;
    this.strict = false;
  }

  canLog(severity) {
    return this.strict ? this.level === severity.level : this.level >= severity.level;
  }

  toString() {
    return String(this.name);
  }

  toInt() {
    return this.level;
  }

  valueOf() {
    return this.toInt();
  }
}
