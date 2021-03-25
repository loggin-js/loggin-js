export function throwIfNotString(prop, name) {
  if (typeof prop !== 'string') {
    throw new Error(`"${name}" must be a string got: ${typeof prop}`);
  }
}

export function throwIfNotNumber(prop, name) {
  if (typeof prop !== 'number') {
    throw new Error(`"${name}" must be a number got: ${typeof prop}`);
  }
}

export function throwIfNotConstructor(ctor, name) {
  if (typeof ctor !== 'function') {
    throw new Error(`"${name}" must be a constructor function got: ${typeof ctor}`);
  }
}

export function throwIfNotInstanceof(prop, type, propName, typeName) {
  if (!(prop instanceof type)) {
    throw new Error(`"${propName}" must be an instance of: ${typeName}`);
  }
}

export function throwIfNull(prop, name) {
  if (prop == null) {
    throw new Error(`"${name}" must not be null`);
  }
}

export function throwIfNotIn(prop, obj, name, { additionalMessage = '' } = {}) {
  if (!(prop in obj)) {
    throw new Error(`${name} with name "${prop}" not found ${additionalMessage}`);
  }
}

export const throwIf = {
  not: {
    string: throwIfNotString,
    number: throwIfNotNumber,
    in: throwIfNotIn,
    constructor: throwIfNotConstructor,
    instanceof: throwIfNotInstanceof,
  },
  null: throwIfNull,
};
