export class EmptyRegistry<T = any, O = any> {
  protected registry: {};

  constructor() {
    this.registry = {};
  }

  clear() {
    this.registry = {};
  }

  add(name: string, instance: T) {
    throw new Error('EmptyRegistry, this should not happen... yaiks!');
  }

  register(name: string, template: any, options?: O) {
    throw new Error('EmptyRegistry, this should not happen... yaiks!');
  }

  get(name: string | O, options?: O): T {
    throw new Error('EmptyRegistry, this should not happen... yaiks!');
  }

  search(name: string): T {
    throw new Error('EmptyRegistry, this should not happen... yaiks!');
  }
}
