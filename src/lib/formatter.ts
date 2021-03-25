import * as colors from 'colors';
import * as strif from 'strif';
import defaultTransformers from './transformers';
import { EmptyRegistry } from './registry/empty-registry';
import { Log } from './log';

const strifFormatter = strif.create({ transformers: defaultTransformers });

export class Formatter {
  static registry = new EmptyRegistry();
  static colors: any = colors;

  template: any;

  constructor(template) {
    this.template = template;
  }

  formatLog(log, { color = false } = {}) {
    return Formatter.format(log, this, color);
  }

  static format(log: Log, formatter: Formatter, color = false) {
    if (!log || !formatter) {
      throw Error('"log" and "formatter" parameters are required');
    }
    if (!(formatter instanceof Formatter)) {
      throw Error('"formatter" must be a Formatter instance');
    }
    if (!(formatter.template instanceof strif.Template)) {
      throw Error(`"formatter" should be type: "StrifTemplate", not: ${typeof formatter.template}`);
    }

    if (color) {
      colors.enable();
    } else {
      colors.disable();
    }

    return formatter.template.compile(log);
  }

  static create(template, options = {}) {
    if (typeof template !== 'string') {
      throw new Error(`"template" must be a string got: ${typeof template}`);
    }

    return new Formatter(strifFormatter.template(template, options));
  }
}
